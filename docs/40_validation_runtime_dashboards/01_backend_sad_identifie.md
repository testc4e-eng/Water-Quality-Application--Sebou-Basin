# Backend SAD identifié

## Constat initial

Les tests historiques sur `127.0.0.1:8000` retournaient :

- `404` sur `/api/v1/dashboard/home`
- `404` sur `/api/v1/quality/regulatory-status`
- `404` sur `/api/v1/pollution/sites.geojson`

Le endpoint `GET http://127.0.0.1:8000/health` répondait :

```json
{"status":"ok","service":"agent-swat-api"}
```

Conclusion : `8000` n'était pas le backend SAD.

## Backend SAD réellement actif

Backend retenu :

- service Docker : `sad-backend`
- publication : `0.0.0.0:8010 -> 8000`
- base API : `http://localhost:8010/api/v1`

Validation :

- `GET http://127.0.0.1:8010/health` -> `200`

Payload :

```json
{"status":"OK","db":"OK"}
```

## Preuves techniques

### Docker

Conteneurs observés :

- `sad-backend` -> `8010->8000`
- `sad-frontend` -> `5174->5173`

### Documentation cohérente

Les fichiers suivants pointent vers la convention Docker SAD correcte :

- `README.md`
- `.env`
- `docker-compose.yml`
- `docs/dockerisation_sad/12_multi_stack_ports.md`

### Cause racine du faux backend

- `frontend/.env` ciblait encore `http://127.0.0.1:8000`
- sur cette machine, `8000` était déjà occupé par `agent-swat-api`
- le frontend local était donc branché sur une API étrangère au SAD

## Incident de démarrage backend SAD

Lors de la première tentative de validation sur `8010`, `sad-backend` ne répondait pas car :

- le conteneur Docker actif n'était pas reconstruit à partir de l'état courant du dépôt
- le boot cassait sur `python-multipart` manquant au runtime du conteneur existant

Après reconstruction Docker :

```text
docker compose up -d --build sad-backend
```

le backend SAD a redémarré correctement sur `8010`.
