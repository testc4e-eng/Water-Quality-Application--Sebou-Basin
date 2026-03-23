# Guide de Tests - SAD Sebou 2026

## Priorite haute
- `GET /health`
- `POST /api/v1/auth/login`
- `GET /api/v1/stations`
- `GET /api/v1/barrages`
- `GET /api/v1/layers/barrages_abhs`
- `GET /api/v1/climate/stations`
- `GET /api/v1/hydro/stations`
- `GET /api/v1/quality/stations`

## Priorite moyenne
- lecture `raw/tables`, `raw/.../rows`
- scenarios SWAT
- routage frontend principal

## A ajouter
- tests API FastAPI avec fixtures DB
- tests frontend sur pages dashboard, login, data
- test de non-regression des payloads GeoJSON
- test de securite sur CRUD raw

## Definition minimale de done
- endpoint repond
- shape JSON stable
- aucune erreur CORS
- visualisation frontend non bloquee
