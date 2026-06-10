# Convention de Ports Multi-Stacks

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Perimetre | ports publies Docker de la plateforme SAD |
| Source de verite | Oui |
| Derniere mise a jour | 2026-06-08 |

## Objectif

Cette convention reserve une plage de ports Docker distincte pour la plateforme SAD afin d'eviter les collisions avec d'autres stacks locales.

## Ports publies par defaut

| Service | Port hote | Port conteneur |
|---|---:|---:|
| `sad-backend` | `8010` | `8000` |
| `sad-frontend` | `5174` | `5173` |
| `sad-db` profil `docker-db` | `5434` | `5432` |

## Regles

- les communications internes entre conteneurs restent sur les ports applicatifs standards (`sad-backend:8000`, `sad-db:5432`) ;
- les ports publies sur l'hote sont reserves a la coexistence multi-projets ;
- le mode local natif n'est pas modifie :
  - backend `8000`
  - frontend `3001`
- toute nouvelle documentation Docker doit reutiliser ces valeurs par defaut sauf decision explicite documentee.

## Variables source de verite

- `BACKEND_PORT=8010`
- `FRONTEND_PORT=5174`
- `POSTGRES_PORT=5434`
- `VITE_API_BASE_URL=http://localhost:8010/api/v1`
- `BACKEND_CORS_ORIGINS=http://localhost:5174,http://127.0.0.1:5174`

## Point d'attention

Le mode `host.docker.internal` vers PostgreSQL hote reste supporte, mais depend de la joignabilite reseau du moteur Docker courant. Si ce mode est utilise, la connectivite doit etre validee avant demarrage.
