# Snap diagnostic endpoint

## Objectif

Fournir un diagnostic pur de rattachement au réseau hydrographique validé, sans calcul de propagation aval.

Ce endpoint existe pour répondre au risque principal du MVP : le snapping. Avant toute interprétation métier d'un trajet pollution, il faut connaître :

- la distance de la source au réseau
- le noeud de départ retenu
- la composante réseau concernée
- le niveau de confiance du snap

## Endpoint

- `GET /api/v1/propagation/snap-diagnostic`

## Règles d'entrée

Le endpoint accepte exactement un mode d'entrée :

1. `site_id`
2. `prelevement_id`
3. `lng` + `lat`

Erreurs contrôlées :

- aucun mode fourni -> `400`
- plusieurs modes fournis -> `400`
- un seul des deux paramètres `lng` ou `lat` -> `400`

## Réponse JSON

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
    "snap_confidence": "LOW",
    "network_component": 5
  },
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "scientific_mode": false,
    "warning": "Temps indicatif non scientifique"
  }
}
```

## Exemples curl

```bash
curl "http://localhost:8000/api/v1/propagation/snap-diagnostic?lng=-5.0&lat=34.0"
```

```bash
curl "http://localhost:8000/api/v1/propagation/snap-diagnostic?prelevement_id=00b3ba35-2eb5-4596-a4ae-4d228db49e29"
```

## Pourquoi ce diagnostic est obligatoire

- une source peut être loin du réseau validé
- deux sources proches visuellement peuvent snapper sur des composantes ou directions différentes
- un calcul `source-to-garde` ou `source-to-stations` n'est interprétable que si la qualité du snap est connue
- en phase MVP, le temps n'est pas scientifique ; la fiabilité pratique dépend donc d'abord du rattachement topologique

## Limites métier

- le diagnostic ne prouve pas qu'un chemin aval complet existe
- `network_component` décrit le tronçon de snap, pas la totalité du comportement hydraulique
- un `snap_confidence=LOW` ne signifie pas erreur technique, mais risque d'interprétation métier élevé
- le mode `site_id` dépend de `longitude` / `latitude` car `api.v_pollution_sites.geometry` est exposé en `jsonb`
