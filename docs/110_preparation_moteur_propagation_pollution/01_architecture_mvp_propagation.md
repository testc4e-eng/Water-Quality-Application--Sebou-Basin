# Architecture MVP propagation pollution

## Contexte

Le chantier hydrologique est clôturé au statut `VALIDE`.

Réseau de référence pour la phase 110 :

- `geo_work.reseau_hydro_edges_final_candidate_20260602`
- `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`
- `geo_work.reseau_hydro_nodes_final_candidate_20260602`

Contrat fonctionnel aval déjà validé :

- cible garde : `legacy_station_id = 52`
- nom : `brg de garde / sebou`
- moteur actuel de routage : `backend/app/services/hydrology/routing_service.py`
- chargeur du graphe : `backend/app/services/hydrology/graph_builder.py`
- contrat runtime : `backend/app/services/hydrology/runtime_config.py`

Objectif du MVP :

- construire un moteur de propagation pollution topologique ;
- sans dépendance SWAT ;
- sans dépendance WASP ;
- sans modifier le code dans cette phase ;
- produire uniquement l’audit et l’architecture cible.

## 1. Audit des tables pollution existantes

### Sources pollution et exposition API existante

Objets SQL et API déjà disponibles :

| Objet | Rôle | Statut |
|---|---|---|
| `api.v_pollution_sites` | référentiel spatial DEV des sites pollution | exploitable MVP |
| `api.v_pollution_latest_results` | derniers résultats par site | exploitable MVP |
| `api.v_source_pollution_prelevement` | points de prélèvement qualité/pollution structurés | exploitable MVP |
| `geo.ref_site_pollution` | référentiel spatial maître DEV | exploitable en support, pas nécessaire en entrée directe |
| `qualite.source_pollution_prelevement` | table métier source des prélèvements pollution | structurante |
| `qualite.source_pollution_mesure_param` | paramètres mesurés liés aux prélèvements | structurante |

Routes backend existantes utiles :

| Endpoint | Usage MVP |
|---|---|
| `GET /api/v1/pollution/sites.geojson` | entrée cartographique des sites pollution |
| `GET /api/v1/pollution/latest-results` | consultation des derniers paramètres |
| `GET /api/v1/map/catalog` | navigation métier frontend |
| `GET /api/v1/map/entities` | récupération d’entités géographiques filtrées |
| `GET /api/v1/routing/downstream-to-garde` | référence de comportement pour le routage existant |

### Volumétries observées

| Objet | Cardinalité observée |
|---|---:|
| `api.v_pollution_sites` | 1951 |
| `api.v_pollution_latest_results` | 517 |
| `api.v_source_pollution_prelevement` | 141 |
| `api.v_station_dimension` | 390 |
| `api.v_barrage_dimension` | 11 |
| Exutoires sur réseau final candidate | 19 |

### Typologie observée des sites pollution

Principales familles dans `api.v_pollution_sites` :

| `source_type_code` | Cardinalité |
|---|---:|
| `HUILERIE` | 585 |
| `IDP_MEASURE_POINT` | 304 |
| `REJET_DOMESTIQUE` | 262 |
| `SOURCE_POLLUTION_PRELEVEMENT` | 141 |
| `DECHARGE_ABANDONNEE` | 132 |
| `REJET_ABATTOIR` | 56 |
| `STEP` | 39 |
| `MINE` | 35 |

Validation spatiale observée :

| `validation_status` | Cardinalité |
|---|---:|
| `VALIDATED` | 1313 |
| `TO_VALIDATE` | 638 |

## 2. Inventaire opérationnel MVP

### Stations

Source retenue :

- `api.v_station_dimension`

Volumétrie utile :

| Indicateur | Valeur |
|---|---:|
| Total stations | 390 |
| Stations hydrologiques | 41 |
| Forages | 30 |
| Puits | 137 |
| Pluvio | 5 |
| Sources | 41 |
| Géométries disponibles | 390 |

Rôle MVP :

- cibles aval touchées ;
- points de contrôle sur le chemin de propagation ;
- focus initial prioritaire sur les stations hydrologiques.

### Barrages

Source retenue :

- `api.v_barrage_dimension`

Volumétrie utile :

| Indicateur | Valeur |
|---|---:|
| Barrages exposés | 11 |
| Géométries disponibles | 11 |

Rôle MVP :

- cibles aval critiques ;
- points de contrôle métier ;
- continuation logique du routage vers la garde déjà existant.

### Exutoires

Source retenue :

- `geo_work.reseau_hydro_nodes_final_candidate_20260602`

Règle :

- exutoire = nœud avec `eout = 0` et `ein >= 1`

Volumétrie utile :

| Indicateur | Valeur |
|---|---:|
| Exutoires total réseau | 19 |
| Exutoires composante principale | 7 |

Rôle MVP :

- cibles finales aval du moteur de propagation ;
- synthèse du risque en sortie du réseau.

### Sources pollution

Deux portes d’entrée MVP sont recommandées :

| Famille | Source SQL | Rôle |
|---|---|---|
| Points de prélèvement structurés | `api.v_source_pollution_prelevement` | entrée métier prioritaire |
| Sites pollution cartographiques | `api.v_pollution_sites` | entrée large pour démonstration cartographique |

Volumétrie utile :

| Indicateur | Valeur |
|---|---:|
| `api.v_source_pollution_prelevement` | 141 |
| géométries disponibles | 141 |
| points avec mesures | 141 |
| `api.v_pollution_sites` | 1951 |
| géométries disponibles | 1951 |

## 3. Contrainte clé : snapping au réseau

Le MVP ne doit pas supposer que les sources et cibles sont déjà exactement sur le réseau.

Distances observées au réseau final candidate :

| Famille | N | Distance moyenne au réseau | Médiane | Max | `<= 50 m` |
|---|---:|---:|---:|---:|---:|
| `api.v_source_pollution_prelevement` | 141 | 1901.96 m | 760.26 m | 18265.09 m | 6 |
| `api.v_barrage_dimension` | 11 | 157.97 m | 155.47 m | 347.97 m | 2 |
| stations hydrologiques | 41 | 660.57 m | 254.91 m | 9542.93 m | 1 |

Conclusion :

- le snap est un problème fonctionnel central du MVP ;
- il faut renvoyer un diagnostic de snap systématique ;
- il faut distinguer :
  - source géométriquement proche du réseau
  - source attachée par nearest edge mais éloignée
  - source hors seuil de confiance

## 4. Service cible

Service à concevoir :

- `propagation_pollution_service`

Responsabilités :

1. résoudre la source d’entrée :
   - par `site_id`
   - par `prelevement_id`
   - ou par coordonnées `lng/lat`
2. snapper la source au réseau validé ;
3. déterminer le nœud de départ ;
4. calculer le sous-graphe aval dirigé ;
5. extraire les cibles atteintes :
   - garde
   - stations
   - barrages
   - exutoires
6. calculer :
   - distance aval cumulée
   - temps de transfert simple
   - diagnostics de confiance

### Dépendances réutilisables

Composants existants à réutiliser conceptuellement :

- `HydrologyGraphBuilder`
- `TopologyRuntimeConfig`
- logique de snapping de `routing_service.py`

Extension MVP recommandée :

- ne pas surcharger `routing_service.py`
- créer un service dédié séparé, lecture seule

## 5. Modèle de calcul MVP

### 5.1 Entrée

Entrées supportées :

1. `site_id` issu de `api.v_pollution_sites`
2. `source_pollution_prelevement.id`
3. `lng/lat` libre pour mode expert

### 5.2 Snapping

Étapes :

1. transformer l’objet source en `EPSG:26191`
2. chercher l’arête du réseau la plus proche
3. calculer :
   - `nearest_edge_id`
   - `distance_to_network_m`
   - `start_node`
   - `snap_confidence`

Classes de confiance recommandées :

| Classe | Règle |
|---|---|
| `HIGH` | distance `<= 50 m` |
| `MEDIUM` | distance `> 50 m` et `<= 250 m` |
| `LOW` | distance `> 250 m` |

### 5.3 Parcours aval

Approche MVP :

- graphe dirigé `source -> target`
- calcul des nœuds descendants atteignables depuis `start_node`
- agrégation des chemins utiles par Dijkstra pondéré sur `length_m`

Résultats attendus :

- nœuds atteints
- arêtes atteintes
- longueur cumulée vers chaque cible

### 5.4 Temps de transfert simple

Formule MVP :

- `temps_h = distance_km / vitesse_reference_kmh`

Paramètre global recommandé :

- `vitesse_reference_kmh = 10`

Sortie :

- `transfer_time_hours`
- `transfer_time_label`
- `time_model = TOPOLOGICAL_CONSTANT_SPEED_MVP`

Important :

- ce temps est un indicateur topologique simple ;
- il ne doit pas être présenté comme hydraulique scientifique.

## 6. Endpoints MVP proposés

Préfixe recommandé :

- `/api/v1/propagation`

### 6.1 Source -> garde

`GET /api/v1/propagation/source-to-garde`

Entrées :

- `site_id` ou `prelevement_id` ou `lng/lat`

Sortie :

- diagnostic de snap
- chemin aval GeoJSON
- distance vers la garde
- temps de transfert
- contrat runtime

### 6.2 Source -> stations

`GET /api/v1/propagation/source-to-stations`

Sortie :

- stations aval atteintes
- distance à chaque station
- temps de transfert à chaque station
- filtrage optionnel par type de station

### 6.3 Source -> barrages

`GET /api/v1/propagation/source-to-barrages`

Sortie :

- barrages atteints en aval
- distance à chaque barrage
- temps de transfert
- booléen `includes_garde`

### 6.4 Source -> exutoires

`GET /api/v1/propagation/source-to-exutoires`

Sortie :

- exutoires atteints
- distance
- temps de transfert
- composante de l’exutoire

### 6.5 Endpoint d’aide recommandé

`GET /api/v1/propagation/snap-diagnostic`

Sortie :

- source utilisée
- nearest edge
- distance au réseau
- `snap_confidence`
- `network_component`

## 7. Schéma de réponse MVP recommandé

Structure commune :

```json
{
  "status": "success",
  "source": {
    "source_type": "pollution_site",
    "source_id": "…",
    "input_mode": "site_id"
  },
  "snap": {
    "edge_id": 123,
    "start_node": 456,
    "distance_to_network_m": 32.4,
    "snap_confidence": "HIGH"
  },
  "propagation": {
    "target_type": "garde|stations|barrages|exutoires",
    "reachable_nodes": 193,
    "reachable_edges": 210
  },
  "results": [],
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
    "scientific_mode": false
  }
}
```

## 8. Conception frontend cartographique

### Positionnement

Le frontend MVP doit être un écran cartographique isolé, sans casser les dashboards existants.

Nom recommandé :

- `PropagationPollutionMvpPage`

### Parcours utilisateur

1. choisir une source pollution
2. visualiser le point sélectionné
3. afficher le `snap_diagnostic`
4. lancer un des quatre calculs :
   - vers garde
   - vers stations
   - vers barrages
   - vers exutoires
5. afficher :
   - chemin aval
   - cibles touchées
   - distance
   - temps de transfert simple

### Couches frontend recommandées

1. réseau hydro validé en lecture seule
2. source pollution sélectionnée
3. point de snap
4. chemin aval calculé
5. cibles atteintes :
   - stations
   - barrages
   - exutoires

### UX métier minimale

- badge de confiance de snap
- avertissement si `snap_confidence = LOW`
- rappel visible :
  - `Routage topologique`
  - `Temps de transfert non scientifique`

## 9. Décisions d’architecture recommandées

### Recommandé pour le MVP

1. moteur en lecture seule sur `geo_work.reseau_hydro_edges_final_candidate_20260602`
2. réutilisation de `NetworkX` déjà présent côté hydrologie
3. snap unifié et explicitement diagnostiqué
4. endpoints séparés par cible métier
5. temps constant simple et assumé comme non scientifique

### À éviter à ce stade

1. dépendre immédiatement de SWAT
2. dépendre immédiatement de WASP
3. fusionner le service avec le routage garde existant
4. masquer les distances de snap élevées
5. promettre un modèle hydraulique scientifique

## 10. Recommandation finale

Statut d’architecture :

- `OFFICIEL_MVP`

Décision :

- le MVP de propagation pollution peut être construit sur la base du réseau validé ;
- il doit être présenté comme un moteur topologique aval avec temps simplifié ;
- le principal garde-fou n’est pas la topologie réseau, désormais stable, mais la qualité du snapping des sources et cibles métier.

Étape suivante logique après ce document :

1. cadrer le contrat JSON des endpoints ;
2. créer `propagation_pollution_service` en backend ;
3. implémenter un premier endpoint `source-to-garde` ;
4. ajouter ensuite `stations`, `barrages`, `exutoires`.
