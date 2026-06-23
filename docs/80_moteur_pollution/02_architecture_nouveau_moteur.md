# 02 — Architecture du nouveau moteur de propagation pollution

---

## 1. Vue d'ensemble

Le nouveau moteur s'appuie sur **l'existant backend topologique** et ajoute une **couche de signalisation/simulation interactive** côté frontend, ainsi qu'une **couche d'atténuation et d'alertes** côté backend.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────────┐ │
│  │ PollutionSignal │  │ PollutionSim     │  │ PollutionPropagation    │ │
│  │ Map.tsx         │──│ Panel.tsx        │──│ Results.tsx             │ │
│  │ (clic carte)    │  │ (type, C0, date) │  │ (chemin + stations)     │ │
│  └─────────────────┘  └──────────────────┘  └─────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 usePropagationSimulation.ts                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ POST /api/v1/propagation/simulate
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                        │
│  ┌─────────────────────┐    ┌──────────────────────────────────────┐   │
│  │ propagation.py      │───▶│ propagation_pollution_service.py      │   │
│  │ (router existant)   │    │ (snap + routage NetworkX existant)   │   │
│  └─────────────────────┘    └──────────────────────────────────────┘   │
│                                        │                                │
│                    ┌───────────────────┼───────────────────┐            │
│                    ▼                   ▼                   ▼            │
│  ┌────────────────────────┐ ┌──────────────────┐ ┌──────────────────┐  │
│  │ pollution_attenuation  │ │ impact_detector  │ │ recommendation_  │  │
│  │ _service.py            │ │ _service.py      │ │ engine.py        │  │
│  │ (C(t) = C0 * e^-λt)   │ │ (stations sur    │ │ (règles métier)  │  │
│  │                        │ │  le chemin)      │ │                  │  │
│  └────────────────────────┘ └──────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ lecture seule
┌─────────────────────────────────────────────────────────────────────────┐
│                            BASE                                          │
│  geo_work.reseau_hydro_edges_final_candidate_20260602                   │
│  geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr      │
│  geo_work.reseau_hydro_nodes_final_candidate_20260602                   │
│  api.v_station_dimension                                                │
│  api.v_barrage_dimension                                                │
│  api.v_pollution_sites                                                  │
│  api.v_source_pollution_prelevement                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Structure du graphe hydraulique

### Nœuds

| Type | Règle | Source |
|------|-------|--------|
| Nœud de routage | `id` dans `vertices_pgr` | `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr` |
| Confluence | `ein >= 2` | `geo_work.reseau_hydro_nodes_final_candidate_20260602` |
| Exutoire | `eout = 0 AND ein >= 1` | `geo_work.reseau_hydro_nodes_final_candidate_20260602` |
| Station/barrage | snap sur le nœud/arête le plus proche | `api.v_station_dimension`, `api.v_barrage_dimension` |

### Arêtes

| Propriété | Description |
|-----------|-------------|
| `source` | Nœud amont |
| `target` | Nœud aval |
| `length_m` | Longueur du tronçon |
| `geom_json` | Géométrie GeoJSON (EPSG:4326) |
| `flow_status` | `FLOW_CONFIRMED`, `FLOW_PROBABLE`, `FLOW_UNKNOWN`… |
| `component_id` | Composante connexe |

### Données clés

- **746 arêtes**, **752 nœuds**, **7 composantes**
- **19 exutoires**, **61 confluences**
- **~3 995 km** de réseau

---

## 3. Composants backend

### 3.1 `propagation_pollution_service.py` (existant)

Responsabilités :
- Charger le graphe `geo_work.reseau_hydro_edges_final_candidate_20260602` dans un `networkx.MultiDiGraph`.
- Résoudre la source (`site_id`, `prelevement_id`, `lng/lat`).
- Snapper la source au réseau.
- Calculer les descendants atteignables.
- Retourner les cibles (garde, stations, barrages, exutoires) avec distance et temps.

### 3.2 `pollution_attenuation_service.py` (à créer)

Responsabilités :
- Calculer la concentration le long du chemin aval.
- Formule MVP : `C(t) = C0 * exp(-λ * t)`.
- Fournir un coefficient λ par famille de polluant.
- Retourner `estimated_concentration_mg_l` et `alert_level` pour chaque cible.

### 3.3 `impact_detector_service.py` (à créer)

Responsabilités :
- Identifier les stations situées sur le chemin aval (pas seulement atteignables).
- Retourner les stations impactées dans l'ordre chronologique.

### 3.4 `recommendation_engine.py` (à enrichir)

Responsabilités :
- Appliquer des règles métier simples.
- Exemple : si `Cd > 0.01 mg/L` atteint une station de prise d'eau → fermeture.
- Retourner une liste d'actions priorisées.

---

## 4. Composants frontend

### 4.1 `PollutionSignalMap.tsx`

- Carte MapLibre avec couche réseau hydro.
- Mode "signalisation" : clic sur la carte pour placer un marqueur de pollution.
- Affichage du chemin pollué retourné par l'API.
- Coloration des stations impactées.

### 4.2 `PollutionSimulationPanel.tsx`

- Formulaire :
  - Type de polluant (dropdown)
  - Concentration initiale (mg/L)
  - Date/heure du déversement
  - Durée de simulation (h)
  - Vitesse de référence (km/h)
- Bouton "Lancer la simulation".

### 4.3 `PollutionPropagationResults.tsx`

- Liste des stations/barrages/exutoires impactés.
- Colonnes : nom, heure d'arrivée, concentration estimée, distance, alerte.
- Badge de confiance du snap.
- Bouton "Exporter" (JSON/CSV).

### 4.4 `PollutionRecommendations.tsx`

- Liste d'actions décisionnelles générées par le backend.
- Tri par priorité (CRITICAL, WARNING, INFO).

---

## 5. Flux de données

```text
1. Utilisateur clique sur la carte
   → front stocke (lat, lng)

2. Utilisateur remplit le formulaire
   → type, C0, timestamp, simulation_hours, vitesse

3. Appel POST /api/v1/propagation/simulate

4. Backend :
   a. Résout la source
   b. Snap au réseau
   c. Calcule le sous-graphe aval
   d. Pour chaque tronçon :
      - temps = length_km / vitesse
      - concentration = C0 * exp(-λ * temps_cumulé)
   e. Détecte les stations sur le chemin
   f. Applique les seuils d'alerte
   g. Génère les recommandations

5. Retour JSON :
   - source, snap, path_geojson
   - impacted_stations[] avec concentration/alerte
   - recommendations[]

6. Frontend affiche :
   - point de pollution
   - chemin coloré (gradient selon concentration)
   - tableau des impacts
   - panneau recommandations
```

---

## 6. Précautions

- **Ne pas présenter le modèle comme scientifique** : bandeau "Propagation topologique indicative".
- **Snap distance** : afficher la confiance (HIGH/MEDIUM/LOW) et avertir si LOW.
- **Vitesse constante** : paramètre configurable, valeur par défaut à calibrer avec le métier.
- **WASP** : intégration reportée en phase avancée, après validation externe.
