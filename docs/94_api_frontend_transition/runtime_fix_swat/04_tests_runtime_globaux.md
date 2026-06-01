# Tests runtime globaux

## Commandes exécutées

```powershell
python -X faulthandler -c "print('before'); import app.main; print('after')"
python -m pytest tests/test_runtime_optional_swat.py -q
python -m pytest tests/test_qualite_specialized_api.py tests/test_runtime_optional_swat.py -q
```

## Résultat pytest final

| Commande | Résultat |
|---|---|
| `python -m pytest tests/test_qualite_specialized_api.py tests/test_runtime_optional_swat.py -q` | `6 passed in 178.07s` |

## Résultats manuels TestClient

| Élément | Résultat |
|---|---|
| Import `app.main` | `OK` |
| `SWAT_ANALYSIS_AVAILABLE` | `False` |
| `INGESTION_API_AVAILABLE` | `False` |
| `/health` | `200` |
| `/docs` | `200` |
| `/openapi.json` | `200` |
| `/api/v1/qualite/metaux` | `200 success`, count `8565` |
| `/api/v1/qualite/chimie-minerale` | `200 success`, count `40933` |
| `/api/v1/qualite/physicochimie` | `200 success`, count `9806` |
| `/api/v1/qualite/pollution-organique` | `200 success`, count `11481` |
| `/api/v1/swat/analysis/status` | absent de l'OpenAPI par défaut |
| `/api/v1/ingestion/upload` | absent de l'OpenAPI par défaut |

## Remarques

La génération OpenAPI remonte des warnings existants sans bloquer `/openapi.json` :

- `operationId` dupliqués dans `app.api.v1.swat`.
- `Config` Pydantic v1 dans `security.schemas`.
- `@app.on_event("startup")` déprécié au profit de lifespan.
