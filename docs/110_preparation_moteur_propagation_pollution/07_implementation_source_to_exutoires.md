# Implémentation source-to-exutoires

## Endpoint

- `GET /api/v1/propagation/source-to-exutoires`

## Paramètres

- `site_id`
- `prelevement_id`
- `lng`
- `lat`
- `vitesse_reference_kmh=10`
- `only_reachable=true`
- `limit=50`

## Définition d’un exutoire

Définition retenue, déjà validée :

- `eout = 0`
- `ein >= 1`

Source des cibles :

- `geo_work.reseau_hydro_nodes_final_candidate_20260602`

Contrat de sortie :

- les nœuds retenus sont exposés avec `node_type = "exutoire"` dans l’API, même si la colonne source `node_type` contient une autre typologie topologique interne

## Modèle de réponse

```json
{
  "status": "success",
  "source": {},
  "snap": {},
  "propagation": {
    "target_type": "exutoires",
    "reachable_nodes": 117,
    "reachable_edges": 116,
    "targets_total_considered": 19,
    "targets_returned": 7
  },
  "targets": [
    {
      "node_id": 464,
      "node_type": "exutoire",
      "component_id": 5,
      "reachable": true,
      "distance_to_source_km": 377.7,
      "transfer_time_hours": 37.77,
      "transfer_time_label": "+37h46m"
    }
  ],
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "targets_source": "geo_work.reseau_hydro_nodes_final_candidate_20260602",
    "exutoire_rule": "eout=0 AND ein>=1",
    "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
    "scientific_mode": false,
    "warning": "Temps indicatif non scientifique"
  }
}
```

## Exemples curl

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-exutoires?lng=-5.0&lat=34.0"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-exutoires?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29"
```

```bash
curl "http://localhost:8000/api/v1/propagation/source-to-exutoires?lng=-5.0&lat=34.0&only_reachable=false&limit=10"
```

## Limites métier

- calcul topologique uniquement
- temps de transfert non scientifique
- pas de SWAT ni WASP
- plusieurs exutoires peuvent exister dans une même composante
- le moteur MVP ne hiérarchise pas encore les exutoires par importance métier

## Tests réalisés

- `python -m pytest backend/tests/test_propagation_mvp.py -q`
- validation Docker sur les trois appels `source-to-exutoires`
- non-régression vérifiée sur :
  - `source-to-garde`
  - `snap-diagnostic`
  - `source-to-stations`
  - `source-to-barrages`
