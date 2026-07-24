# Normalisation appliquée — 2026-06-18

## Portée

- WQDSS / SAD : normalisation effective
- C4E : source Compose localisée via labels Docker, mais workspace WSL non exploitable côté Windows pendant l'intervention

## WQDSS / SAD

- frontend Docker : `5174`
- backend Docker : `8010`
- `frontend/vite.config.ts` :
  - `port: 5174`
  - `strictPort: true`
- clarification des variables :
  - `frontend/.env` = backend Docker `8010`
  - `frontend/.env.local` = backend natif `8011`

## C4E

- labels Docker observés :
  - `com.docker.compose.project = c4e-platform`
  - `com.docker.compose.project.config_files = /home/yassine_c4e/workspace/projects/c4e-platform/docker-compose.yml`
- runtime observé :
  - frontend `5173`
  - db `5433`
  - redis `6380`
  - minio `9002/9003`
- écart :
  - le workspace WSL référencé par Docker n'était pas modifiable de façon fiable depuis l'hôte Windows pendant ce lot

## Validation observée

- `sad-frontend` répond sur `http://localhost:5174`
- `sad-backend` répond sur `8010` via Docker
- `http://localhost:5173` ne répond pas, car `c4e_frontend` n'était pas `running`
- le listener local résiduel sur `5175` a été arrêté
- état final des listeners utiles :
  - `5174` : WQDSS frontend Docker
  - `8010` : WQDSS backend Docker
  - `5175` : libre

## Suite

1. Restaurer l'accès au workspace `c4e-platform`.
2. Appliquer sur C4E :
   - `port: 5173`
   - `strictPort: true`
   - `host: "0.0.0.0"` si absent
3. Supprimer ou arrêter l'instance Node locale qui écoute encore sur `5175`.
