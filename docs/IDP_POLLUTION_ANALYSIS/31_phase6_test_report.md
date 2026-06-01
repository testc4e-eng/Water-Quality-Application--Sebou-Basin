# Rapport tests Phase 6 - IDP pollution

Date execution : 2026-05-18

## Backend

Tests executes via FastAPI `TestClient` contre la vraie base DEV.

| Endpoint | Statut | Lignes |
|---|---:|---:|
| `/api/v1/pollution/sites.geojson?limit=10` | 200 | 10 |
| `/api/v1/pollution/sites.geojson?parameter_code=DBO5&limit=10` | 200 | 10 |
| `/api/v1/pollution/sites.geojson?parameter_code=NH4&limit=10` | 200 | 10 |
| `/api/v1/pollution/sites.geojson?parameter_code=NO3&limit=10` | 200 | 10 |
| `/api/v1/pollution/latest-results?parameter_code=DBO5&limit=10` | 200 | 10 |

Compilation Python :

```text
python -m py_compile backend/app/api/v1/pollution.py backend/app/api/api_v1.py
```

Statut : OK.

## Frontend

Build execute :

```text
npm run build
```

Statut : OK.

Vite preview :

| Route | Statut HTTP | Taille reponse |
|---|---:|---:|
| `/pollution-idp-dev` | 200 | 1108 bytes |

## Limite du test navigateur local

Le Python systeme courant ne contient pas `uvicorn`; le demarrage serveur HTTP backend local a donc echoue avec `No module named uvicorn`. Les endpoints ont ete valides par `TestClient`, et la route frontend par Vite preview. Pour un test navigateur complet avec carte chargee, lancer le backend avec l'environnement Python projet contenant `uvicorn`.

## Resultat fonctionnel

- route React disponible;
- build production OK;
- endpoints filtres P0 OK;
- filtre `NO3` cote API resolu vers `NO3-`;
- popup et filtres implementes dans le composant MapLibre.
