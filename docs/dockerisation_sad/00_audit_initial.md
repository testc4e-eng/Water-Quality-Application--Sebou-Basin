# Dockerisation SAD - Audit initial

## Contexte

Objectif de cette phase : préparer une dockerisation locale simple et reproductible du SAD Sebou, limitée au premier périmètre `PostgreSQL/PostGIS + FastAPI + React/Vite`, sans import automatique de dump et sans toucher à la base officielle.

Audit réalisé en lecture seule sur le dépôt `C:\dev\WQDSS\repo_git`, en s'appuyant d'abord sur la documentation autoritaire :

- `docs/README.md`
- `docs/01_project_reference/README.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
- `docs/03_ai_knowledge_base/project_structure_for_agents.md`
- `docs/03_ai_knowledge_base/deployment_for_agents.md`

## Analyse

### 1. Structure du dépôt

Le dépôt est structuré autour de trois blocs principaux :

- `backend/` : API FastAPI, scripts SQL et scripts techniques
- `frontend/` : application React/Vite/TypeScript
- `docs/` : référentiel documentaire maître

Arborescence utile pour la dockerisation simple :

```text
repo_git/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── scripts/
│   ├── sql/
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   └── .env
├── database/
├── docs/
└── README.md
```

### 2. Backend FastAPI

Entrée observée :

- `backend/app/main.py`

Constats :

- application FastAPI avec préfixe principal `/api/v1`
- routes système disponibles : `/`, `/health`, `/docs`
- CORS par défaut compatibles `5173` et `3001`
- `uvicorn` attendu pour le lancement
- la route `/health` vérifie la base via `app.db_raw.ping()`

Points techniques importants pour Docker :

- le backend supporte `DATABASE_URL` dans `backend/app/db_raw.py`
- mais `backend/app/db/session.py` reconstruit sa connexion à partir de `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
- conséquence : Docker Compose doit fournir `DATABASE_URL` et aussi les variables `DB_*`
- les variables `CLIMATE_DB_*` existent et doivent être alignées sur la même base dans la version simple

### 3. Dépendances Python

Fichier observé :

- `backend/requirements.txt`

Dépendances principales :

- API : `fastapi`, `uvicorn`, `pydantic`, `python-dotenv`
- DB : `sqlalchemy`, `psycopg2-binary`
- data science : `numpy`, `pandas`, `scipy`
- géospatial : `pyproj`, `shapely`, `fiona`, `geopandas`, `geojson`

Impact Docker :

- les dépendances géospatiales nécessitent des bibliothèques système GDAL/GEOS/PROJ côté image backend
- une image `python:slim` reste possible si on installe explicitement ces dépendances système

### 4. Frontend React/Vite

Fichiers observés :

- `frontend/package.json`
- `frontend/vite.config.ts`
- `frontend/.env`

Constats :

- stack : React 18 + Vite 7 + TypeScript
- serveur de développement Vite actif
- proxy `/api` configuré dans `vite.config.ts`
- le frontend utilise à la fois des appels proxifiés et des URLs API absolues via variables `VITE_*`

### 5. Dépendances Node

Principales dépendances :

- UI/data : `react`, `react-router-dom`, `@tanstack/react-query`, `axios`
- cartographie : `leaflet`, `maplibre-gl`, `react-map-gl`, `proj4`, `@turf/turf`
- graphiques : `chart.js`, `react-chartjs-2`, `recharts`, `plotly.js`
- build/dev : `vite`, `typescript`, `eslint`, `tailwindcss`

Impact Docker :

- image Node 20 suffisante pour le mode développement
- montage de volume nécessaire pour un workflow pédagogique avec hot reload

### 6. Variables d'environnement observées

#### Backend

Variables clés détectées :

- `DATABASE_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_CONNECT_TIMEOUT`
- `DB_APP_NAME`
- `DB_SSLMODE`
- `DB_POOL_MIN`
- `DB_POOL_MAX`
- `CLIMATE_DB_HOST`
- `CLIMATE_DB_PORT`
- `CLIMATE_DB_NAME`
- `CLIMATE_DB_USER`
- `CLIMATE_DB_PASS`
- `SECRET_KEY`
- `BACKEND_CORS_ORIGINS`
- `SAD_ENABLE_SWAT_ANALYSIS`
- `SAD_ENABLE_INGESTION_API`

Observation sensible :

- `backend/.env` contient des identifiants réels ou assimilables à des secrets de travail.
- Ces valeurs ne doivent pas être recopiées dans les fichiers Docker versionnés.
- La dockerisation doit donc reposer sur un fichier d'exemple distinct, sans secret réel.

#### Frontend

Variables clés détectées :

- `VITE_API_BASE_URL`
- `VITE_API_BASE`
- `VITE_API_PROXY`
- `VITE_MAP_STYLE_URL`

### 7. Ports utilisés

Ports observés dans le code et la documentation :

- PostgreSQL : `5432`
- backend documenté : `8011`
- backend effectivement référencé aussi en `8000`
- frontend Vite documenté/configuré : `3001`
- backend CORS autorise aussi `5173`

Incohérences constatées :

- `README.md` et une partie de la doc normalisent le backend en `8011`
- `frontend/.env` pointe vers `8000`
- `frontend/vite.config.ts` fixe le port Vite à `3001`
- `backend/app/main.py` prévoit aussi le cas `5173`

Décision proposée pour Docker simple :

- base : `5432`
- backend : `8000`
- frontend : `5173`

Justification :

- ces ports sont cohérents avec les attentes Docker les plus courantes
- `8000` est déjà utilisé par le frontend local actuel
- `5173` est le port natif Vite et déjà pris en compte dans les CORS backend

### 8. Connexion PostgreSQL

Schéma de connexion backend observé :

- priorité à `DATABASE_URL` dans `backend/app/db_raw.py`
- fallback sur `DB_*`
- `session.py` ne lit pas `DATABASE_URL` et reconstruit la connexion

Implication :

- `docker-compose.yml` doit injecter les deux formes de configuration
- le service DB doit être adressé par nom de service Docker, par exemple `sad-db`

### 9. Commandes actuelles de lancement

Commandes documentées actuellement :

#### Backend

```powershell
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8011 --reload
```

#### Frontend

```powershell
cd frontend
npm run dev -- --port 3001
```

Tests documentés ou implicites :

- `http://127.0.0.1:8011/docs`
- `GET /health`

### 10. Risques et contraintes pour la dockerisation

- ne pas monter `backend/.env` dans le conteneur comme source de vérité
- ne pas importer de dump automatiquement
- ne pas supposer la présence de TimescaleDB dans la première version simple
- ne pas modifier la base officielle ni les scripts de migration métier
- garder les routes critiques `/health` et `/docs` directement testables

## Solution retenue pour la Phase 1

Approche minimale retenue :

1. `sad-db` : service `postgis/postgis`
2. `sad-backend` : image Python avec dépendances géospatiales système et `uvicorn`
3. `sad-frontend` : image Node 20 en mode développement Vite
4. un réseau Docker dédié
5. un volume persistant PostgreSQL
6. un fichier `.env.docker.example` sans secret réel

Décisions d'implémentation :

- pas d'import SQL automatique au démarrage
- pas de conteneur Nginx dans cette première étape
- pas de suppression des données existantes
- variables Docker séparées des `.env` locaux existants

## Incohérences documentaires à signaler

L'audit met en évidence un écart entre documentation et réalité courante :

- documentation locale : backend `8011`, frontend `3001`
- configuration frontend locale : backend `8000`
- backend CORS : `5173` et `3001`

La dockerisation va introduire un troisième cadre, volontairement stabilisé :

- backend Docker : `8000`
- frontend Docker : `5173`

Il faudra conserver cette distinction explicitement dans la documentation pour éviter les confusions entre :

- lancement local historique hors Docker
- lancement Docker Compose pédagogique

## Mises à jour documentaires recommandées après implémentation

- ajouter le dossier `docs/dockerisation_sad/` à la documentation de structure
- compléter `docs/03_ai_knowledge_base/deployment_for_agents.md` avec la chaîne locale Docker
- mentionner dans `docs/03_ai_knowledge_base/project_structure_for_agents.md` les nouveaux fichiers :
  - `backend/Dockerfile`
  - `frontend/Dockerfile`
  - `docker-compose.yml`
  - `.env.docker.example`
