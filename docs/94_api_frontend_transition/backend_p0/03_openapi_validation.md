# OpenAPI validation

## Validation router P0 isole

Application de test :

```python
from fastapi import FastAPI
from app.api.v1.qualite_specialized import router

app = FastAPI()
app.include_router(router, prefix="/api/v1")
```

| Path OpenAPI | Expose |
|---|---|
| `/api/v1/qualite/metaux` | `true` |
| `/api/v1/qualite/chimie-minerale` | `true` |
| `/api/v1/qualite/physicochimie` | `true` |
| `/api/v1/qualite/pollution-organique` | `true` |

## Montage application

Le router est monte dans `backend/app/api/api_v1.py` :

```python
api_router.include_router(qualite_specialized_router)
```

Comme le routeur porte le prefixe `/qualite`, les endpoints finaux sous le prefixe global `/api/v1` sont :

- `/api/v1/qualite/metaux`
- `/api/v1/qualite/chimie-minerale`
- `/api/v1/qualite/physicochimie`
- `/api/v1/qualite/pollution-organique`

## Blocage OpenAPI global

La validation OpenAPI globale via `app.main` est bloquee dans l'environnement courant par un crash natif preexistant :

```text
Windows fatal exception: code 0xc06d007f
numpy.__init__.py -> blas_fpe_check
app.api.v1.swat_analysis
```

Ce blocage ne provient pas du router P0 qualite.
