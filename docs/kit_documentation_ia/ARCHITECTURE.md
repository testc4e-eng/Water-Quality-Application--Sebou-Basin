# Architecture - SAD Sebou 2026

## Vue d'ensemble
Architecture web en 3 couches pour centraliser des donnees hydro-climatiques, qualitatives et geospatiales du bassin du Sebou.

```text
Utilisateurs ABHS / Equipe SIG
            |
            v
Frontend React + dashboards + carte
            |
            v
Backend FastAPI /api/v1
  - auth
  - entites SIG
  - couches GeoJSON
  - dashboards climat/hydro/qualite
  - SWAT
  - raw data explorer
            |
            v
PostgreSQL + vues metier + couches geographiques
```

## Composants confirms
- `frontend/`: UI React, pages dashboard, login, data viewer, cartes
- `backend/app/main.py`: entree FastAPI, CORS, health, montage `/api/v1`
- `backend/app/api/api_v1.py`: routeur principal riche
- `backend/app/routers/*`: climat, hydro, qualite, couches, nomenclatures
- `backend/app/api/v1/*`: auth, raw, swat, measurements, alerts, meta

## Lecture mission 4
- Module collecte: deja partiellement couvert par `raw`, `stations`, `measurements`
- Integration modeles: couverte par endpoints climat, hydro, qualite, SWAT
- Analyse/visualisation: couverte par dashboards React
- Reporting: present cote frontend via export et vues, a consolider
- Deploiement/maintenance: non industrialises

## Ecarts a fermer
- Unifier les routeurs et conventions API
- Formaliser le schema de donnees metier
- Ajouter monitoring, tests et pipeline CI/CD
- Encadrer les operations CRUD generiques
