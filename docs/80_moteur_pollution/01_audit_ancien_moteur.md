# 01 — Audit de l'ancien moteur de gestion de pollution

> Audit réalisé le 2026-06-16 sur la branche `Dev_refonte`.
> Règle respectée : lecture seule du code et de la base ; aucune modification des tables sources.

---

## 1. Synthèse

La plateforme dispose déjà d'un **moteur de propagation topologique MVP** dans le backend, construit sur le réseau hydrographique validé. Il n'utilise **pas encore WASP** ni de modèle hydrodynamique scientifique, mais il fournit le squelette de propagation aval (snap, routage, stations/barrages/exutoires touchés, temps indicatifs).

Par ailleurs, le frontend contient des **composants legacy de simulation** qui étaient branchés sur des mocks. L'écran `DashboardPollution` actuel consomme déjà les endpoints réels de propagation, mais en mode **consultation** (choix d'un site existant), pas en mode **signalisation interactive** (clic libre + paramètres de pollution).

---

## 2. Fichiers backend trouvés

| Fichier | Rôle | État |
|---------|------|------|
| `backend/app/api/v1/propagation.py` | Router `/api/v1/propagation/*` | **Fonctionnel** |
| `backend/app/services/propagation/propagation_pollution_service.py` | Moteur de propagation topologique | **Fonctionnel MVP** |
| `backend/app/services/recommendations/engine.py` | Moteur de recommandations | **Fonctionnel générique** (pas encore couplé à la propagation) |
| `backend/app/services/hydrology/graph_builder.py` | Chargeur du graphe hydrologique | **Existant** (référencé par doc 110) |
| `backend/app/services/hydrology/routing_service.py` | Service de routage garde | **Existant** (référencé) |

### Endpoints de propagation actuellement exposés

```bash
GET /api/v1/propagation/snap-diagnostic
GET /api/v1/propagation/source-to-garde
GET /api/v1/propagation/source-to-stations
GET /api/v1/propagation/source-to-barrages
GET /api/v1/propagation/source-to-exutoires
```

**Modes d'entrée supportés :**
- `site_id` (depuis `api.v_pollution_sites`)
- `prelevement_id` (depuis `api.v_source_pollution_prelevement`)
- `lng` + `lat` (mode expert)

### Réponse type d'un endpoint

```json
{
  "status": "success",
  "source": { "source_type": "coordinates", "source_id": "-4.9,34.3", "input_mode": "coordinates" },
  "snap": {
    "edge_id": 425,
    "start_node": 41,
    "distance_to_network_m": 4484.88,
    "snap_confidence": "LOW",
    "network_component": 5
  },
  "propagation": {
    "target_type": "stations",
    "reachable_nodes": 100,
    "reachable_edges": 99
  },
  "targets": [ ... ],
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "scientific_mode": false,
    "warning": "Temps indicatif non scientifique"
  }
}
```

---

## 3. Fichiers frontend trouvés

| Fichier | Rôle | État |
|---------|------|------|
| `frontend/src/pages/DashboardPollution.tsx` | Dashboard IDP + propagation | **Fonctionnel** — consomme les vrais endpoints |
| `frontend/src/components/Pollution/PollutionMap.tsx` | Carte de simulation legacy | **Obsolète** — attend un `simulationResults` mock |
| `frontend/src/components/Pollution/PollutionSidebar.tsx` | Sidebar simulation legacy | **Obsolète** — formulaire mock |
| `frontend/src/mocks/pollutionSimulationData.ts` | Données et helper de simulation mock | **Obsolète** — logique simpliste (Est→Ouest) |
| `frontend/src/hooks/usePropagation.ts` | Hooks React Query propagation | **Fonctionnel** — utilisé par `DashboardPollution` |

**Constat :** la **signalisation interactive** (clic sur carte + formulaire pollutant) n'est pas branchée sur le backend réel. Seule la propagation à partir d'un site/prelèvement existant fonctionne.

---

## 4. Topologie hydraulique en base

### Tables du réseau validé

| Table | Rôle |
|-------|------|
| `geo_work.reseau_hydro_edges_final_candidate_20260602` | Arêtes orientées du réseau (source → target) |
| `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr` | Sommets pgRouting |
| `geo_work.reseau_hydro_nodes_final_candidate_20260602` | Nœuds enrichis (confluences, exutoires, etc.) |

### Volumétrie du graphe

```sql
SELECT 
  COUNT(*) AS nb_edges,
  COUNT(DISTINCT source) AS nb_sources,
  COUNT(DISTINCT target) AS nb_targets,
  COUNT(DISTINCT component_id) AS nb_components,
  SUM(length_m)/1000 AS longueur_totale_km
FROM geo_work.reseau_hydro_edges_final_candidate_20260602;
```

| nb_edges | nb_sources | nb_targets | nb_components | longueur_totale_km |
|----------|------------|------------|---------------|--------------------|
| 746 | 733 | 684 | 7 | ~3 995 |

```sql
SELECT 
  COUNT(*) AS nb_nodes,
  COUNT(*) FILTER (WHERE eout = 0 AND ein >= 1) AS nb_exutoires,
  COUNT(*) FILTER (WHERE ein >= 2) AS nb_confluences
FROM geo_work.reseau_hydro_nodes_final_candidate_20260602;
```

| nb_nodes | nb_exutoires | nb_confluences |
|----------|--------------|----------------|
| 752 | 19 | 61 |

### Structure des arêtes

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'geo_work' AND table_name = 'reseau_hydro_edges_final_candidate_20260602'
ORDER BY ordinal_position;
```

Champs utiles :
- `gid` : identifiant de l'arête
- `source`, `target` : nœuds orientés (aval)
- `length_m` : longueur en mètres
- `geom` : géométrie (EPSG:26191)
- `flow_status` : statut de direction hydraulique
- `component_id` : composante connexe
- `qa_status` : qualité

---

## 5. Modèle de calcul actuel

Le moteur actuel est un **modèle topologique constant-speed MVP** :

```text
Temps de transfert (h) = distance_km / vitesse_reference_kmh
```

- `vitesse_reference_kmh` paramétrable (défaut 10 km/h)
- Pas d'atténuation de concentration
- Pas de réaction biochimique
- Pas de débit dynamique

**Avertissement retourné systématiquement :** *Temps indicatif non scientifique*.

---

## 6. WASP — état d'intégration

### Tables WASP existantes

| Schéma / Table | Rôle |
|----------------|------|
| `wasp_sebou.wasp_results` | Résultats bruts WASP Sebou |
| `wasp_sebou.wasp_scenarios` | Scénarios WASP |
| `wasp_sebou.wasp_variables` | Variables WASP |
| `wasp_output.*` | Outputs WASP structurés |
| `modeles.resultat_wasp` | Résultats modèle |
| `api.v_wasp_*` | Vues d'exposition |

### Contrat d'intégration

Le document `docs/113_preproduction_readiness/04_wasp_integration_contract.md` stipule :

- WASP est une **dépendance métier externe** (Anas).
- Le mode d'intégration est **CONTRACT_FIRST_EXTERNAL_DEPENDENCY**.
- Les routes sandbox `swat`/`swat_analysis` existent mais **ne constituent pas un socle officiel de préproduction**.
- Les résultats WASP doivent être validés scientifiquement avant exposition applicative.

**Conclusion :** WASP n'est **pas prêt à être intégré comme moteur de propagation temps réel** sans validation métier externe.

---

## 7. Écarts par rapport à l'ancienne plateforme

| Fonctionnalité ancienne plateforme | État actuel |
|------------------------------------|-------------|
| Signalisation clic sur carte | ❌ Frontend legacy mock obsolète |
| Topologie hydraulique graphe | ✅ Implémentée (`geo_work.*`) |
| WASP | ⚠️ Données existantes mais intégration externe non finalisée |
| Propagation réseau | ✅ MVP topologique constant-speed |
| Stations impactées | ✅ Endpoint `/source-to-stations` |
| Recommandations | ⚠️ Génériques, non couplées à la propagation |
| Affichage du chemin pollué sur carte | ✅ `path_geojson` retourné |

---

## 8. Recommandation de départ

**Ne pas réimplémenter from scratch** : le backend de propagation topologique existe déjà et est fonctionnel. L'effort doit porter sur :

1. **Réintégrer la signalisation interactive** au frontend (clic sur carte + formulaire pollutant).
2. **Brancher les composants legacy** sur les vrais endpoints `/api/v1/propagation/*`.
3. **Ajouter un calcul d'atténuation simple** et des niveaux d'alerte par paramètre.
4. **Préparer le couplage WASP** comme phase ultérieure, après validation externe.
