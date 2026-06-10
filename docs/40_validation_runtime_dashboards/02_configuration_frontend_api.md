# Configuration frontend API

## Contraintes documentaires utilisées

Sources consultées avant correction :

- `README.md`
- `docs/README.md`
- `docs/03_ai_knowledge_base/project_structure_for_agents.md`
- `docs/01_project_reference/backend/api_contracts.md`
- `.env`
- `docker-compose.yml`

## État avant correction

### Configuration racine correcte

Le fichier racine `.env` exposait déjà :

```env
BACKEND_PORT=8010
FRONTEND_PORT=5174
VITE_API_BASE_URL=http://localhost:8010/api/v1
VITE_API_BASE=http://localhost:8010/api/v1
VITE_API_PROXY=http://sad-backend:8000
```

### Configuration frontend locale incohérente

Le fichier `frontend/.env` pointait encore vers :

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_API_BASE=http://127.0.0.1:8000/api/v1
VITE_API_PROXY=http://127.0.0.1:8000
```

### Fallbacks incohérents

- `frontend/src/config/api.ts` utilisait encore `http://127.0.0.1:8000/api/v1` en fallback
- `frontend/vite.config.ts` utilisait encore `http://127.0.0.1:8000` en fallback proxy

## Configuration retenue après correction

### Frontend local

```env
VITE_API_BASE_URL=http://localhost:8010/api/v1
VITE_API_BASE=http://localhost:8010/api/v1
VITE_API_PROXY=http://localhost:8010
```

### Fallbacks runtime/frontend

- `frontend/src/config/api.ts` -> fallback `http://127.0.0.1:8010/api/v1`
- `frontend/vite.config.ts` -> fallback proxy `http://127.0.0.1:8010`

## Décision d’alignement

Décision appliquée :

- privilégier la stack Docker SAD locale documentée sur `8010`
- ne plus laisser le frontend local tomber implicitement sur `8000`

Justification :

- `8000` n’est pas fiable sur cette machine
- `8010` est la convention Docker SAD active et documentée
- la correction est purement de configuration, sans développement de module

## Résultat

Le frontend local et la vraie API SAD pointent désormais sur la même cible :

- frontend : `http://127.0.0.1:5174`
- backend : `http://localhost:8010/api/v1`
