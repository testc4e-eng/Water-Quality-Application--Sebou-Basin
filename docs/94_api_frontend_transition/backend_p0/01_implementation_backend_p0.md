# Implementation backend P0

## Fichiers backend crees

| Fichier | Role |
|---|---|
| `backend/app/repositories/api_views_repository.py` | Repository generique lecture seule sur vues `api.*` whitelistees |
| `backend/app/repositories/__init__.py` | Package repositories |
| `backend/app/schemas/exposure.py` | Schema de reponse standard |
| `backend/app/schemas/filters.py` | Filtres standards exposes par query params |
| `backend/app/api/v1/qualite_specialized.py` | Router qualite specialise P0 |
| `backend/tests/test_qualite_specialized_api.py` | Tests du router P0 isole |

## Fichier backend modifie

| Fichier | Changement |
|---|---|
| `backend/app/api/api_v1.py` | Montage du router `qualite_specialized_router` sous `/api/v1/qualite/*` |

## Endpoints crees

| Endpoint | Vue source | Statut |
|---|---|---|
| `GET /api/v1/qualite/metaux` | `api.v_qualite_metaux` | `READY` |
| `GET /api/v1/qualite/chimie-minerale` | `api.v_qualite_chimie_minerale` | `READY` |
| `GET /api/v1/qualite/physicochimie` | `api.v_qualite_physicochimie` | `READY` |
| `GET /api/v1/qualite/pollution-organique` | `api.v_qualite_pollution_organique` | `READY` |

## Contraintes respectees

- Aucune route legacy supprimee.
- Ancien router `/quality` conserve.
- Nouveau router ajoute sous `/qualite`.
- Aucune table metier modifiee.
- Aucune vue SQL modifiee.
- Aucun referentiel modifie.
- Aucun frontend modifie.
- Les nouveaux endpoints lisent uniquement les vues whitelistees du schema `api`.

## Repository

Whitelist P0 :

- `api.v_qualite_metaux`
- `api.v_qualite_chimie_minerale`
- `api.v_qualite_physicochimie`
- `api.v_qualite_pollution_organique`

Filtres supportes :

- `date_start`
- `date_end`
- `support_type`
- `support_id`
- `code_parametre`
- `qa_status`
- `geo_status`
- `limit`
- `offset`
- `include_geom`

Pagination :

- `limit` par defaut : 500
- `limit` maximum : 5000
- `offset` par defaut : 0
- tri : `date_mesure DESC NULLS LAST, support_id, code_parametre`
