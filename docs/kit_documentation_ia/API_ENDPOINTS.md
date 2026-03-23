# API Endpoints - SAD Sebou 2026

## Base
- Prefixe: `/api/v1`
- Auth: JWT bearer sur endpoints proteges
- Docs: `/docs`

## Endpoints confirmes

### Systeme
- `GET /`
- `GET /health`
- `GET /ui`

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Entites metier
- `GET /api/v1/stations`
- `GET /api/v1/barrages`
- `GET /api/v1/alerts`

### Couches et nomenclatures
- `GET /api/v1/layers/{layer_key}`
- `GET /api/v1/names/{entity}`
- `GET /api/v1/catalog/...` compatibilite legacy

### Donnees brutes
- `GET /api/v1/raw/tables`
- `GET /api/v1/raw/{schema}/{table}/columns`
- `GET /api/v1/raw/{schema}/{table}/rows`
- `GET /api/v1/raw/{schema}/{table}/pk`
- `POST /api/v1/raw/{schema}/{table}`
- `PUT /api/v1/raw/{schema}/{table}/{row_id}`
- `DELETE /api/v1/raw/{schema}/{table}/{row_id}`

### Dashboards climat
- `GET /api/v1/climate/stations`
- `GET /api/v1/climate/station-stats`
- `GET /api/v1/climate/timeseries`
- `GET /api/v1/climate/kpis`

### Dashboards hydro
- `GET /api/v1/hydro/stations`
- `GET /api/v1/hydro/stats`
- `GET /api/v1/hydro/timeseries`
- `GET /api/v1/hydro/kpis`

### Dashboards qualite
- `GET /api/v1/quality/stations`
- `GET /api/v1/quality/kpis`
- `GET /api/v1/quality/table`
- `GET /api/v1/quality/chart`

### SWAT
- routes `swat` et `swat/analysis` actives dans le routeur principal

## Manques vs cible mission 4
- pas de versionning contractuel par domaine
- pas d'endpoint reporting dedie
- pas de monitoring/rate limit
- pas de documentation fonctionnelle de chaque payload
