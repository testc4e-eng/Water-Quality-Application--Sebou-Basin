# SAD Sebou 2026 - État Technique (mis à jour)

## Objectif
Plateforme SIG décisionnelle pour le bassin du Sebou:
- dashboard cartographique
- dashboard analytique (climat/hydrologie/qualité/pollution)
- API métier FastAPI sur PostgreSQL/PostGIS

## État actuel (avancement)
- Architecture backend/frontend opérationnelle.
- Migration métier hors `public` largement réalisée (`geo`, `hydro`, `meteo`, `qualite`, `infra`, `metadata`, `api`, `staging`).
- Couche API cartographique consolidée (`/api/v1/layers/*`, `/api/v1/observatory/*`).
- Performances renforcées avec vues matérialisées + refresh planifié.

## Points techniques clés implémentés
- `popup_rules` administrables depuis `/admin/popup-rules` (CRUD + clear cache).
- Hiérarchie métier servie par `/api/v1/observatory/hierarchy/*`.
- Appels carto avec filtre viewport `bbox` côté frontend.
- Priorité de lecture sur materialized views côté backend.

## Base de données (état synthétique)
- Schémas métier actifs: `geo`, `hydro`, `meteo`, `qualite`, `infra`, `metadata`, `api`, `swat_output`, `wasp_output`.
- Vues `api.*`: 49.
- Materialized views (`api` + `metadata`): 26.
- Pack MV perf appliqué: [backend/sql/2026_04_mv_perf_pack.sql](backend/sql/2026_04_mv_perf_pack.sql)
  - inclut index, tracking refresh (`metadata.mv_refresh_status`) et fonction `metadata.refresh_perf_mviews(note)`.

## Exécution locale

### Backend
```bash
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8011
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --port 3001
```

## Variables frontend importantes
`frontend/.env`:
- `VITE_API_BASE_URL=http://127.0.0.1:8011/api/v1`
- `VITE_API_BASE=http://127.0.0.1:8011/api/v1`
- `VITE_API_PROXY=http://127.0.0.1:8011`

## Refresh des materialized views
- Manuel API: `POST /api/v1/observatory/mviews/refresh`
- Statut: `GET /api/v1/observatory/mviews/status`
- Script local: [backend/scripts/refresh_mviews.py](backend/scripts/refresh_mviews.py)
- Tâche Windows 6h: `WQDSS_MV_Refresh_6h` via [backend/scripts/register_mv_refresh_task.ps1](backend/scripts/register_mv_refresh_task.ps1)

## Références docs à jour
- État projet détaillé: [docs/development_status_2026-04-07.md](docs/development_status_2026-04-07.md)
- Endpoints API: [docs/kit_documentation_ia/API_ENDPOINTS.md](docs/kit_documentation_ia/API_ENDPOINTS.md)
- Schéma DB: [docs/kit_documentation_ia/DATABASE_SCHEMA.md](docs/kit_documentation_ia/DATABASE_SCHEMA.md)

