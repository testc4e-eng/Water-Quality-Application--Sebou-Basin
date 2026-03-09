# SAD Sebou 2026 - Architecture Technique

## 1) Objectif du projet
Cette application web est un SAD (Systeme d'Aide a la Decision) pour la gestion de l'eau du bassin du Sebou.
Le systeme centralise:
- visualisation cartographique
- dashboards climat / hydrologie / qualite
- exploration de donnees brutes
- API metier pour alimenter le frontend

## 2) Structure globale du depot
Le projet est organise en 2 applications principales:

- `backend/`: API FastAPI + acces PostgreSQL
- `frontend/`: application React + Vite + TypeScript

Autres elements utiles:
- `sad_backend.yml`: environnement micromamba backend
- `requirements.txt` et `backend/requirements.txt`: dependances Python
- `package.json` (racine et frontend): dependances Node

## 3) Architecture backend

### 3.1 Point d'entree
- Fichier: `backend/app/main.py`
- Responsabilites:
  - chargement `.env`
  - configuration CORS
  - montage du routeur principal sous `/api/v1`
  - endpoints systeme (`/`, `/health`, `/ui`)

### 3.2 Organisation API
Routeur principal:
- `backend/app/api/api_v1.py`

Principaux groupes de routes:
- Auth: login/register
- Stations / GeoJSON / Measurements / Alerts / Meta / Raw
- Dashboards metier:
  - `/api/v1/climate/*` via `backend/app/routers/climate.py`
  - `/api/v1/hydro/*` via `backend/app/routers/hydro.py`
  - `/api/v1/quality/*` via `backend/app/routers/quality.py`
- SWAT (routes analyse et resultats)

### 3.3 Couche donnees
Deux mecanismes coexistent:
- SQLAlchemy sessions (ex: auth, certaines routes raw)
- psycopg2 + pool de connexions (dans `backend/app/db_raw.py`)

Fichiers DB importants:
- `backend/app/db_raw.py`: pool, connexion, ping DB
- `backend/app/db/climate_database.py`: moteur SQLAlchemy climate
- `backend/app/util_dbmeta.py`: detection tables/colonnes (geom, PK, etc.)

### 3.4 Authentification
Fichiers:
- `backend/app/api/v1/auth.py`
- `backend/app/core/security.py`
- `backend/app/api/deps.py`

Fonctionnement:
- hash mot de passe (bcrypt via passlib)
- creation JWT (HS256)
- recuperation utilisateur courant via token bearer

### 3.5 Migrations et modeles
- Alembic: `backend/alembic/`
- Modeles: `backend/app/models/`
- Schemas Pydantic: `backend/app/schemas/`

## 4) Architecture frontend

### 4.1 Stack
- React 18
- Vite
- TypeScript
- Tailwind + composants UI
- React Query
- Bibliotheques carto/charts (MapLibre, Leaflet, Recharts, etc.)

### 4.2 Point d'entree
- `frontend/src/main.tsx` -> monte `App`
- `frontend/src/App.tsx` -> providers + router principal

### 4.3 Routing applicatif
Routes principales:
- `/` -> Landing page
- `/dashboard` -> redirige vers le contenu Dashboard 2
- `/dashboard-2` -> dashboard principal actuel
- `/dashboard-climate` -> onglets climat/hydrologie/qualite
- `/data` -> donnees brutes
- `/about`, `/contact`, `/login`, `/register`

Note: `Dashboard.tsx` a ete retire du projet. Le chemin `/dashboard` reste expose pour compatibilite utilisateur et charge `Dashboard2`.

### 4.4 Couche API frontend
Fichier central:
- `frontend/src/api/client.ts`

Il contient:
- config axios (base URL via `VITE_API_BASE_URL`)
- types DTO et adaptateurs
- appels API standards (stations, geojson, auth, raw, swat)

APIs specialisees:
- `frontend/src/api/climate.ts`
- `frontend/src/api/hydro.ts`
- `frontend/src/api/quality.ts`

### 4.5 Composants metier
- Layout/navigation: `frontend/src/components/Layout/`
- Dashboard cartographique: `frontend/src/components/Dashboard/`
- Dashboards climat/hydro: `frontend/src/components/Climate/`
- Dashboard qualite: `frontend/src/components/quality/`

## 5) Flux de donnees (vue simple)
1. L'utilisateur ouvre une page dashboard.
2. Le composant frontend appelle une fonction API (`src/api/*`).
3. L'API backend interroge PostgreSQL (vues ou tables metier).
4. Le backend renvoie JSON.
5. Le frontend transforme/affiche (table, KPIs, chart, carte).

## 6) Execution locale (resume)

### Backend
1. Creer/activer env Python ou micromamba
2. Installer dependances
3. Configurer `.env`
4. Lancer:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --port 3001
```

## 7) Conventions de travail recommandees
- Centraliser toutes les URLs API via `VITE_API_BASE_URL`
- Garder un seul contrat API par endpoint (payload + path)
- Limiter `any` en TypeScript (types metier explicites)
- Ajouter des tests minimaux:
  - backend: endpoints critiques
  - frontend: rendu pages et appels API

## 8) Points d'evolution
- Harmoniser completement les routes auth et raw entre frontend/backend
- Brancher totalement le module qualite sur la vraie API si mock encore actif
- Renforcer la qualite TypeScript et lint
- Ajouter documentation API versionnee (OpenAPI + exemples)

