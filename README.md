# SAD Sebou 2026

## Objectif

Plateforme web SIG et décisionnelle pour le bassin du Sebou, structurée autour de :

- un dashboard cartographique ;
- un dashboard analytique climat, hydrologie et pollution ;
- une API FastAPI connectée à PostgreSQL/PostGIS/TimescaleDB ;
- une couche d’administration, d’ingestion et de traçabilité.

## Architecture du dépôt

- `frontend/` : React + Vite + TypeScript pour les dashboards, l’administration et l’authentification
- `backend/` : FastAPI pour les routes métier, la sécurité, l’ingestion et les services analytiques
- `docs/` : référentiel documentaire unifié, séparé entre référence projet, contractuel, mémoire IA, working runs et archives

## Dernières améliorations intégrées

- stabilisation des dashboards analytiques et des filtres ;
- consolidation du dashboard cartographique avec filtrage `bbox` et garde-fous de volumétrie ;
- intégration complète des vues admin `data-scan` et `ingestion` avec workflow QA ;
- ajout et stabilisation des routes `analytics/*` ;
- industrialisation du refresh des vues matérialisées.

Détail de référence : [status_note_merge_dashboards_2026-04-09](docs/04_working_prompts_and_runs/runs/2026-04-09_merge_dashboards/status_note_merge_dashboards_2026-04-09.md)

## Exécution locale

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8011 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

## Variables frontend importantes

`frontend/.env` :

- `VITE_API_BASE_URL=http://127.0.0.1:8011/api/v1`
- `VITE_API_BASE=http://127.0.0.1:8011/api/v1`
- `VITE_API_PROXY=http://127.0.0.1:8011`

## Refresh des materialized views

- manuel API : `POST /api/v1/observatory/mviews/refresh`
- statut : `GET /api/v1/observatory/mviews/status`
- script local : [backend/scripts/refresh_mviews.py](backend/scripts/refresh_mviews.py)
- planification Windows : [backend/scripts/register_mv_refresh_task.ps1](backend/scripts/register_mv_refresh_task.ps1)

## Documentation détaillée

- portail documentaire : [docs/README.md](docs/README.md)
- cartographie documentaire : [docs/01_project_reference/DOCUMENT_MAP.md](docs/01_project_reference/DOCUMENT_MAP.md)
- règles de vérité documentaire : [docs/01_project_reference/SOURCE_OF_TRUTH.md](docs/01_project_reference/SOURCE_OF_TRUTH.md)
- architecture système : [docs/01_project_reference/architecture/system_architecture.md](docs/01_project_reference/architecture/system_architecture.md)
- architecture base de données : [docs/01_project_reference/architecture/database_architecture.md](docs/01_project_reference/architecture/database_architecture.md)
- contrats API : [docs/01_project_reference/backend/api_contracts.md](docs/01_project_reference/backend/api_contracts.md)
- référence frontend : [docs/01_project_reference/frontend/frontend_reference.md](docs/01_project_reference/frontend/frontend_reference.md)
- déploiement et exploitation : [docs/01_project_reference/deployment_operations/deployment_and_operations.md](docs/01_project_reference/deployment_operations/deployment_and_operations.md)
- rapport Mission IV : [docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md](docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md)

## Structure documentaire active

- `docs/01_project_reference` : références durables du projet
- `docs/02_contractual_and_reports` : CPS, rapports, annexes et exports
- `docs/03_ai_knowledge_base` : mémoire projet pour agents IA
- `docs/04_working_prompts_and_runs` : prompts, runs et notes de travail
- `docs/99_legacy_archive` : archives et historiques
