# Implémentation source-to-stations

## Endpoint

- `GET /api/v1/propagation/source-to-stations`

## Paramètres

- `site_id`
- `prelevement_id`
- `lng`
- `lat`
- `vitesse_reference_kmh=10`
- `station_type=None`
- `max_target_snap_distance_m=1000`
- `only_reachable=true`
- `limit=50`

## Règle d'entrée

Le endpoint accepte exactement un seul mode d'entrée :

1. `site_id`
2. `prelevement_id`
3. `lng` + `lat`

Les mêmes validations `400` que `source-to-garde` et `snap-diagnostic` sont réutilisées.

## Règle de snapping source

- résolution source via `api.v_pollution_sites`, `api.v_source_pollution_prelevement` ou coordonnées directes
- projection en `26191`
- recherche du tronçon le plus proche dans `geo_work.reseau_hydro_edges_final_candidate_20260602`
- choix du `start_node` par l’extrémité de ce tronçon la plus proche de la source
- restitution systématique :
  - `edge_id`
  - `start_node`
  - `distance_to_network_m`
  - `snap_confidence`
  - `network_component`

## Règle de snapping stations

- source stations : `api.v_station_dimension`
- champ géométrique retenu : `geom`
- pour chaque station :
  - recherche du tronçon réseau le plus proche
  - calcul de `target_snap_distance_m`
  - choix du `target_node` par l’extrémité du tronçon la plus proche de la station
  - calcul de `target_snap_confidence`

Filtrage MVP :

- si `only_reachable=true`, seules les stations atteignables en aval sont conservées
- les stations avec `target_snap_distance_m > max_target_snap_distance_m` sont exclues du résultat
- tri par `distance_to_source_km` croissante
- `limit` appliqué en fin de pipeline

## Modèle de réponse

```json
{
  "status": "success",
  "source": {},
  "snap": {},
  "propagation": {
    "target_type": "stations",
    "reachable_nodes": 117,
    "reachable_edges": 116,
    "targets_total_considered": 390,
    "targets_returned": 38
  },
  "targets": [
    {
      "station_id": "c71ce70d-5ffa-4b31-9fe7-f78289a00c18",
      "legacy_station_id": 147,
      "station_name": "r1197/15",
      "station_type": null,
      "target_node": 246,
      "target_snap_distance_m": 684.86,
      "target_snap_confidence": "LOW",
      "reachable": true,
      "distance_to_source_km": 0.0,
      "transfer_time_hours": 0.0,
      "transfer_time_label": "+0h00m"
    }
  ],
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "targets_source": "api.v_station_dimension",
    "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
    "scientific_mode": false,
    "warning": "Temps indicatif non scientifique"
  }
}
```

## Exemples curl

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-stations?lng=-5.0&lat=34.0"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-stations?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-stations?lng=-5.0&lat=34.0&only_reachable=false&limit=10"
```

## Tests réalisés

- `python -m pytest backend/tests/test_propagation_mvp.py -q` -> `11 passed`
- validation locale `TestClient` :
  - coordonnées -> `200`
  - `prelevement_id` -> `200`
  - `only_reachable=false&limit=10` -> `200`
- validation Docker :
  - `curl /api/v1/propagation/source-to-stations?lng=-5.0&lat=34.0` -> `200`
  - `curl /api/v1/propagation/source-to-stations?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29` -> `200`
  - `curl /api/v1/propagation/source-to-stations?lng=-5.0&lat=34.0&only_reachable=false&limit=10` -> `200`

## Limites métier

- calcul topologique uniquement
- temps de transfert non scientifique
- pas de SWAT ni WASP
- le snapping station reste le principal facteur de qualité du résultat
- une station peut partager le même `target_node` que la source ; dans ce cas la distance aval peut être `0.0 km`
- un `snap_confidence=LOW` n’interdit pas le calcul, mais impose une prudence métier élevée
