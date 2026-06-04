# Implémentation source-to-barrages

## Endpoint

- `GET /api/v1/propagation/source-to-barrages`

## Paramètres

- `site_id`
- `prelevement_id`
- `lng`
- `lat`
- `vitesse_reference_kmh=10`
- `max_target_snap_distance_m=1000`
- `only_reachable=true`
- `limit=50`

## Règle de snapping source

- même logique que `source-to-garde` et `source-to-stations`
- le diagnostic source est toujours renvoyé :
  - `edge_id`
  - `start_node`
  - `distance_to_network_m`
  - `snap_confidence`
  - `network_component`

## Règle de snapping barrages

- source barrages : `api.v_barrage_dimension`
- champ géométrique retenu : `geom`
- pour chaque barrage :
  - recherche du tronçon réseau le plus proche
  - calcul de `target_snap_distance_m`
  - choix du `target_node` par l’extrémité du tronçon la plus proche du barrage
  - calcul de `target_snap_confidence`

Filtrage MVP :

- si `only_reachable=true`, seuls les barrages atteignables en aval sont conservés
- les barrages avec `target_snap_distance_m > max_target_snap_distance_m` sont exclus du résultat
- tri par `distance_to_source_km` croissante
- `limit` appliqué en fin de pipeline

## Distinction barrage vs garde

Important :

- un barrage géographique provient de `api.v_barrage_dimension`
- la garde fonctionnelle validée reste la station `legacy_station_id = 52` dans `api.v_station_dimension`
- `legacy_barrage_id = 51` est absent de `api.v_barrage_dimension`
- en conséquence, `includes_garde=false` sur les barrages retournés dans l’état actuel des données

## Modèle de réponse

```json
{
  "status": "success",
  "source": {},
  "snap": {},
  "propagation": {
    "target_type": "barrages",
    "reachable_nodes": 117,
    "reachable_edges": 116,
    "targets_total_considered": 11,
    "targets_returned": 2
  },
  "targets": [
    {
      "barrage_id": "52f3504e-f707-4e4b-81c5-a51d4bfac003",
      "legacy_barrage_id": 3,
      "barrage_name": "sidi chahed",
      "target_node": 238,
      "target_snap_distance_m": 11.43,
      "target_snap_confidence": "HIGH",
      "reachable": true,
      "distance_to_source_km": 206.26,
      "transfer_time_hours": 20.63,
      "transfer_time_label": "+20h38m",
      "includes_garde": false
    }
  ],
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "targets_source": "api.v_barrage_dimension",
    "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
    "scientific_mode": false,
    "warning": "Temps indicatif non scientifique"
  }
}
```

## Exemples curl

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-barrages?lng=-5.0&lat=34.0"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-barrages?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-barrages?lng=-5.0&lat=34.0&only_reachable=false&limit=10"
```

## Tests réalisés

- `python -m pytest backend/tests/test_propagation_mvp.py -q` -> `14 passed`
- validation locale `TestClient` :
  - coordonnées -> `200`
  - `prelevement_id` -> `200`
  - `only_reachable=false&limit=10` -> `200`
- non-régression confirmée :
  - `source-to-garde` -> `200`
  - `snap-diagnostic` -> `200`
  - `source-to-stations` -> `200`

## Limites métier

- calcul topologique uniquement
- temps de transfert non scientifique
- pas de SWAT ni WASP
- le snapping barrage reste le principal facteur de qualité du résultat
- `includes_garde` reste `false` tant qu’aucun barrage géographique ne correspond réellement à la cible garde station `52`
