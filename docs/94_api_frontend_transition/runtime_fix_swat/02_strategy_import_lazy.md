# Stratégie import conditionnel

## Principe

Les modules scientifiques optionnels ne sont plus importés au chargement de `api_v1.py`.

Variables d'activation :

| Variable | Défaut | Effet |
|---|---|---|
| `SAD_ENABLE_SWAT_ANALYSIS` | `false` | Active `/api/v1/swat/analysis/*` |
| `SAD_ENABLE_INGESTION_API` | `false` | Active `/api/v1/ingestion/*` |

## Comportement

- Si la variable est absente ou fausse, le router n'est pas chargé et un warning clair est écrit.
- Si la variable est vraie, l'import est tenté.
- Si l'import échoue par exception Python, le router est désactivé et FastAPI continue.
- Les modules ne sont pas supprimés ; ils restent disponibles pour réactivation dans un environnement scientifique validé.

## Warning attendu

```text
SWAT analysis disabled: optional router not loaded. Set SAD_ENABLE_SWAT_ANALYSIS=true after validating the scientific runtime.
Ingestion API disabled: optional router not loaded. Set SAD_ENABLE_INGESTION_API=true after validating pandas/numpy runtime.
```

## Sécurité runtime

La valeur par défaut protège le backend contre les crashs natifs `numpy` / BLAS au démarrage.
