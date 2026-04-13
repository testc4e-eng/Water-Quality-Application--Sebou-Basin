# API Endpoints - SAD Sebou 2026

## Base
- Préfixe: `/api/v1`
- Santé service: `GET /health`
- Docs OpenAPI: `/docs`

## Groupes de routes actifs

### Auth / Security
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- routes comptes, rôles et logs via la couche sécurité

### Couches cartographiques
- `GET /api/v1/layers/{layer_key}`
- `GET /api/v1/layers/{layer_key}/names`
- `GET /api/v1/layers/{layer_key}/entity/{entity_id}`

### Observatory
- popup rules
- catalogues et hiérarchies métier
- KPI, timeline, latest values et timeseries
- cache et refresh des MVs

### Dashboards métier
- Climat: `/api/v1/climate/*`
- Hydro: `/api/v1/hydro/*`
- Qualité: `/api/v1/quality/*`
- Analytics transversal: `/api/v1/analytics/*`

### Data management / admin
- `GET /api/v1/raw/*` et CRUD sur tables autorisées
- `GET|POST /api/v1/admin/*` pour scan, users, password resets, ingestion, audit

### Modèles
- routes SWAT et analyses associées
- ingestion scénarios et contrôles QA

## Référence maître
- `docs/01_project_reference/backend/api_contracts.md`
