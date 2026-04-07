# API Endpoints - SAD Sebou 2026 (mis à jour)

## Base
- Préfixe: `/api/v1`
- Santé service: `GET /health`
- Docs OpenAPI: `/docs`

## Groupes de routes actifs

### Auth / Security
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `...` routes users/logs/security via `app/security/*`

### Couches cartographiques
- `GET /api/v1/layers/{layer_key}`
- `GET /api/v1/layers/{layer_key}/names`
- `GET /api/v1/layers/{layer_key}/entity/{entity_id}`

### Observatory (navigation métier + analytics carto)
- `GET /api/v1/observatory/popup-rules`
- `POST /api/v1/observatory/popup-rules/upsert`
- `GET /api/v1/observatory/popup-rules/list`
- `GET /api/v1/observatory/popup-rules/{layer_key}`
- `DELETE /api/v1/observatory/popup-rules/{layer_key}`
- `GET /api/v1/observatory/catalog/themes`
- `GET /api/v1/observatory/catalog/parameters`
- `GET /api/v1/observatory/catalog/entities`
- `GET /api/v1/observatory/catalog/coverage`
- `GET /api/v1/observatory/hierarchy/themes`
- `GET /api/v1/observatory/hierarchy/submenus`
- `GET /api/v1/observatory/hierarchy/parameters`
- `GET /api/v1/observatory/hierarchy/entities-with-values`
- `GET /api/v1/observatory/hierarchy/kpi`
- `GET /api/v1/observatory/hierarchy/timeline`
- `GET /api/v1/observatory/parameter/latest`
- `GET /api/v1/observatory/parameter/timeseries`
- `GET /api/v1/observatory/parameter/entities`
- `POST /api/v1/observatory/cache/clear`
- `GET /api/v1/observatory/mviews/status`
- `POST /api/v1/observatory/mviews/refresh`
- Endpoints métier dédiés:
  - `GET /api/v1/observatory/temperature/stations`
  - `GET /api/v1/observatory/temperature/timeseries`
  - `GET /api/v1/observatory/temperature/latest`
  - `GET /api/v1/observatory/barrage/stations`
  - `GET /api/v1/observatory/barrage/timeseries`
  - `GET /api/v1/observatory/barrage/latest`
  - `GET /api/v1/observatory/precipitation/latest`
  - `GET /api/v1/observatory/evaporation/latest`

### Dashboards métier
- Climat: `/api/v1/climate/*`
- Hydro: `/api/v1/hydro/*`
- Qualité: `/api/v1/quality/*`

### Data management / admin
- `GET /api/v1/raw/*` et opérations CRUD sur tables autorisées
- `GET/POST /api/v1/admin/*` (scan, users, password resets, ingestion)

### SWAT / WASP
- Routes SWAT et analyses exposées via `app/api/v1/swat*.py` + `routers/ingestion.py`

## Notes d’exploitation
- Les endpoints carto et observatory lisent en priorité des vues matérialisées si elles existent.
- Pour cohérence des réponses après ingestion/mise à jour: appeler `POST /api/v1/observatory/mviews/refresh`.
- Pour invalider le cache in-memory observatory: `POST /api/v1/observatory/cache/clear`.
