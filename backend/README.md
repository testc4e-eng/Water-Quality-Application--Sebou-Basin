# Backend SAD Sebou (FastAPI)

## Prérequis
- Python 3.10+
- PostgreSQL/PostGIS accessible

## Installation
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration
Créer/adapter `backend/.env` avec au minimum :
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `SECRET_KEY`

Optionnel :
- `BACKEND_CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001`

## Lancement
```bash
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8011 --reload
```

Documentation Swagger :
- `http://127.0.0.1:8011/docs`

## Routes principales
Préfixe global : `/api/v1`

- `GET /analytics/*` : options/sites/séries pour climat, hydrologie et pollution
- `GET|POST /observatory/*` : hiérarchie métier, cache, popup-rules, statut/refresh MVs
- `GET /layers/{layer_key}` : couches carto GeoJSON avec filtres `ids`, `bbox`, `max_features`
- `GET|POST /ingestion/*` : upload, validation structure, mapping, doublons, QA, audit
- `GET /admin/*` : modules administration (data-scan, users, password resets)

## Scripts ops utiles
- `scripts/refresh_mviews.py` : refresh manuel des materialized views
- `scripts/register_mv_refresh_task.ps1` : création de la tâche Windows périodique
- `sql/2026_04_mv_perf_pack.sql` : pack SQL de performance MV

## Notes techniques récentes
- Middleware de journalisation d'activité avec masquage des paramètres sensibles.
- Compression GZip activée côté API.
- Priorité des sources matérialisées sur plusieurs endpoints (layers/observatory/analytics).

## Documentation backend associée
- `docs/01_project_reference/backend/backend_overview.md`
- `docs/01_project_reference/backend/api_contracts.md`
- `docs/01_project_reference/backend/traceability_matrix.md`
- `docs/01_project_reference/deployment_operations/deployment_and_operations.md`
