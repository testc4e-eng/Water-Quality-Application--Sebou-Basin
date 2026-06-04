# Implémentation backend MVP source vers garde

## Contexte

- Réseau de référence MVP : `geo_work.reseau_hydro_edges_final_candidate_20260602`
- Table vertices : `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`
- Table noeuds : `geo_work.reseau_hydro_nodes_final_candidate_20260602`
- Cible fonctionnelle : station `legacy_station_id = 52` / `brg de garde / sebou`
- Périmètre : MVP topologique lecture seule, sans SWAT, sans WASP, sans écriture SQL

## Fichiers créés

- `backend/app/services/propagation/__init__.py`
- `backend/app/services/propagation/propagation_pollution_service.py`
- `backend/app/api/v1/propagation.py`
- `backend/tests/test_propagation_mvp.py`

## Fichiers modifiés

- `backend/app/api/api_v1.py`

## Endpoint exposé

- `GET /api/v1/propagation/source-to-garde`
- `GET /api/v1/propagation/snap-diagnostic`
- `GET /api/v1/propagation/source-to-stations`

Montage réel :

- la demande initiale mentionnait `backend/app/main.py`
- l'architecture effective du projet centralise le montage des routers dans `backend/app/api/api_v1.py`
- le router propagation a donc été enregistré dans `api_v1.py`, puis exposé par `app.main` via `api_router`

## Règles d'entrée

Le endpoint accepte exactement un mode d'entrée :

1. `site_id`
2. `prelevement_id`
3. `lng` + `lat`

Erreurs contrôlées :

- aucun mode fourni -> `400`
- plusieurs modes fournis -> `400`
- un seul des deux paramètres `lng` ou `lat` -> `400`

## Modèle de réponse

```json
{
  "status": "success",
  "source": {
    "source_type": "coordinates",
    "source_id": "-5.0,34.0",
    "input_mode": "coordinates"
  },
  "snap": {
    "edge_id": 481,
    "start_node": 246,
    "distance_to_network_m": 3417.25,
    "snap_confidence": "LOW"
  },
  "propagation": {
    "target_type": "garde",
    "reachable_nodes": 117,
    "reachable_edges": 116,
    "distance_to_garde_km": 377.7,
    "transfer_time_hours": 37.77,
    "transfer_time_label": "+37h46m",
    "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP"
  },
  "path_geojson": {
    "type": "FeatureCollection",
    "features": []
  },
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "scientific_mode": false,
    "warning": "Temps indicatif non scientifique"
  }
}
```

## Diagnostic de snap

Le diagnostic de snap est toujours renvoyé.

Informations exposées :

- `edge_id`
- `start_node`
- `distance_to_network_m`
- `snap_confidence`
- `network_component`

Seuils MVP :

- `HIGH` : distance `<= 50 m`
- `MEDIUM` : distance `> 50 m` et `<= 250 m`
- `LOW` : distance `> 250 m`

## Validation réalisée

Tests automatisés :

- `python -m pytest backend/tests/test_propagation_mvp.py -q`
- résultat : `8 passed`

Cas couverts :

- aucun input -> `400`
- inputs multiples -> `400`
- mode coordonnées -> `200`
- mode `site_id` -> `200`
- mode `prelevement_id` -> `200`
- présence de `snap.snap_confidence`
- présence de `snap.network_component`
- `metadata.scientific_mode = false`

Validation manuelle locale :

- `GET /api/v1/propagation/source-to-garde?lng=-5.0&lat=34.0` -> `200`
- `GET /api/v1/propagation/source-to-garde?site_id=c632a2d3-af7a-4aa6-b0d1-7cdef7b52751` -> `200`
- `GET /api/v1/propagation/source-to-garde?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29` -> `200`

Validation Docker :

- `docker compose up --build -d`
- `GET /health` -> `200`
- `GET /api/v1/propagation/source-to-garde?lng=-5.0&lat=34.0` -> `200`
- `GET /api/v1/propagation/source-to-garde?site_id=c632a2d3-af7a-4aa6-b0d1-7cdef7b52751` -> `200`
- `GET /api/v1/propagation/source-to-garde?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29` -> `200`
- `GET /api/v1/propagation/snap-diagnostic?lng=-5.0&lat=34.0` -> `200`
- `GET /api/v1/propagation/snap-diagnostic?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29` -> `200`

## Exemples curl

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-garde?lng=-5.0&lat=34.0"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-garde?site_id=c632a2d3-af7a-4aa6-b0d1-7cdef7b52751"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-garde?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29"
```

```bash
curl "http://localhost:8000/api/v1/propagation/snap-diagnostic?lng=-5.0&lat=34.0"
```

```bash
curl "http://localhost:8000/api/v1/propagation/snap-diagnostic?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29"
```

## Limites MVP

- calcul topologique uniquement
- aucune modélisation hydraulique scientifique
- aucune vitesse variable par tronçon
- aucun temps de séjour barrage
- aucun couplage SWAT/WASP
- la garde reste une cible station métier, pas un noeud hydraulique scientifique officiel
- la qualité du résultat dépend fortement du snapping initial

## Erreurs connues

- `api.v_pollution_sites.geometry` est exposé en `jsonb`, pas en type PostGIS natif
- le service utilise donc `longitude` et `latitude` de `api.v_pollution_sites` pour le mode `site_id`
- un snap `LOW` ne bloque pas la réponse, mais doit être interprété avec prudence métier
- `network_component` décrit la composante du tronçon le plus proche, pas une validation métier de connectivité aval complète
