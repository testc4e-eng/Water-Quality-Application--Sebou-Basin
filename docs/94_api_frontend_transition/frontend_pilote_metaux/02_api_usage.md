# Usage API

## Endpoint utilisé

| Usage | Endpoint | Source SQL backend |
|---|---|---|
| Métaux qualité eau | `GET /api/v1/qualite/metaux` | `api.v_qualite_metaux` |

Le frontend utilise `frontend/src/api/client.ts`, dont la base URL pointe déjà vers `/api/v1`. Le module `frontend/src/api/qualite.ts` appelle donc le chemin relatif `/qualite/metaux`.

## Filtres supportés

| Filtre | Description |
|---|---|
| `date_start` | Date minimale. |
| `date_end` | Date maximale. |
| `support_type` | Type de support spatial. |
| `support_id` | Identifiant support, prévu dans le type mais non exposé en P0. |
| `code_parametre` | Code métal. |
| `qa_status` | Statut QA. |
| `geo_status` | Statut GEO, prévu dans le type. |
| `limit` | Taille de page, défaut `100`. |
| `offset` | Décalage de pagination. |
| `include_geom` | Géométrie optionnelle, prévu pour P1. |

## Format réponse

Le pilote consomme le format standard :

```json
{
  "status": "success",
  "count": 0,
  "filters": {},
  "data": [],
  "metadata": {}
}
```
