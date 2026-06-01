# Stabilisation runtime FastAPI - SWAT optionnel

## Objet

Empêcher les modules scientifiques optionnels de bloquer le démarrage global FastAPI et restaurer `/docs` / `/openapi.json`.

## Fichiers

| Fichier | Role |
|---|---|
| `01_analyse_blocage_numpy_swat.md` | Analyse du crash natif `numpy` |
| `02_strategy_import_lazy.md` | Stratégie import conditionnel |
| `03_modifications_backend.md` | Modifications backend réalisées |
| `04_tests_runtime_globaux.md` | Tests runtime |
| `05_validation_openapi.md` | Validation OpenAPI |
| `06_recommandation_frontend_pilote.md` | Décision frontend pilote |

## Statut

`BACKEND_RUNTIME_STABILIZED_OPTIONAL_SWAT`
