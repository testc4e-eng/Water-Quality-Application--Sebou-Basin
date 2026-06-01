# Modifications backend

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `backend/app/api/v1/swat_analysis.py` | Suppression de `import numpy as np`; calculs NSE, R2, PBIAS réécrits en Python standard |
| `backend/app/api/api_v1.py` | Ajout des routers optionnels `SWAT analysis` et `Ingestion API` avec activation par variables d'environnement |
| `backend/tests/test_runtime_optional_swat.py` | Tests runtime global avec routers scientifiques désactivés |

## SWAT conservé

Les routes SWAT de base restent montées :

- `app.api.v1.swat`

Le router optionnel suivant est désactivé par défaut :

- `app.api.v1.swat_analysis`

## Ingestion conservée

Le module ingestion n'est pas supprimé. Il est désactivé par défaut au montage FastAPI pour éviter l'import eager de `pandas/numpy`.

## Compatibilité legacy

Aucune route legacy existante n'a été supprimée dans cette phase.

## API P0 préservée

Les endpoints qualité spécialisés restent montés :

- `/api/v1/qualite/metaux`
- `/api/v1/qualite/chimie-minerale`
- `/api/v1/qualite/physicochimie`
- `/api/v1/qualite/pollution-organique`
