# Architecture - SAD Sebou 2026

## Vue d'ensemble

Architecture web en 3 couches au service d’un SAD orienté eau, SIG et restitution décisionnelle.

```text
Utilisateurs métier / administrateurs
            |
            v
Frontend React + dashboards + cartographie + administration
            |
            v
Backend FastAPI /api/v1
  - auth / security
  - analytics / observatory
  - layers / geojson / names
  - raw / admin / ingestion
  - swat / wasp / quality / hydro / climate
            |
            v
PostgreSQL + PostGIS + TimescaleDB
  - schémas métier
  - schémas metadata / security / audit
  - vues `api` et vues matérialisées `analytics`
```

## Composants confirmés
- `frontend/`: UI React, dashboards, login, data viewer, cartographie, administration
- `backend/app/main.py`: entrée FastAPI, CORS, health, montage `/api/v1`
- `backend/app/api/api_v1.py`: routeur principal riche
- `backend/app/routers/*` et `backend/app/api/v1/*`: routes métier et couches historiques
- `backend/sql/2026_04_mv_perf_pack.sql`: industrialisation SQL des MVs

## Lecture Mission IV
- Collecte et intégration: couverte par `raw`, `meta`, `admin/data-scan`, `ingestion`
- Intégration des modèles: couverte par les schémas `swat_*`, `wasp_*` et le module d’ingestion
- Analyse et visualisation: couverte par les dashboards React et les vues `api` / `analytics`
- Reporting: assuré par les exports UI et la restitution structurée
- Déploiement et exploitation: documentés et préparés dans le référentiel actif

## Points de vigilance
- préserver les contrats API déjà consommés par le frontend
- limiter les contournements SQL hors couche `api` quand une vue d’exposition existe
- encadrer strictement les opérations CRUD génériques du module `raw`
