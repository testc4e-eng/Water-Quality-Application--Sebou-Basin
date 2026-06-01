# Standard API response

## Format standard

```json
{
  "status": "success",
  "count": 0,
  "filters": {},
  "data": [],
  "metadata": {}
}
```

## Champs

| Champ | Type | Role |
|---|---|---|
| `status` | string | `success` ou `error` |
| `count` | integer | Nombre de lignes retournees |
| `filters` | object | Filtres appliques apres validation |
| `data` | array | Donnees metier |
| `metadata` | object | Vue source, pagination, unite, QA, temps SQL |

## Pagination

```json
{
  "limit": 500,
  "offset": 0,
  "has_more": true
}
```

Regles :

- `limit` par defaut : 500.
- `limit` maximum : 5000.
- `offset` obligatoire pour les tables longues.
- Les endpoints séries peuvent proposer une agrégation `day`, `month`, `year` plus tard.

## Filtres standards

| Filtre | Type | Description |
|---|---|---|
| `date_start` | date | Date debut |
| `date_end` | date | Date fin |
| `support_type` | string | station, nappe, barrage, point_idp |
| `support_id` | uuid/text | Identifiant support |
| `code_parametre` | string/list | Code canonique |
| `qa_status` | string | Statut QA |
| `geo_status` | string | Statut GEO |
| `limit` | integer | Pagination |
| `offset` | integer | Pagination |

## Géométrie

- Les endpoints tabulaires retournent `geom` seulement si explicitement demandé (`include_geom=true`).
- Pour les cartes, préférer un endpoint dédié ou un mode GeoJSON contrôlé.
- Les points non résolus restent exposables avec `geo_status = GEO_UNRESOLVED`.

## QA et consultation only

- `qa_status` doit être retourné dans chaque endpoint spécialisé.
- `consultation_only` doit être transmis dans `metadata` ou dans chaque ligne si applicable.
- `COULEUR` doit rester hors analytics quantitatifs.
- `LARGEUR` et `PROFONDEUR` doivent rester contexte station.

## Erreurs

```json
{
  "status": "error",
  "count": 0,
  "filters": {},
  "data": [],
  "metadata": {
    "error_code": "INVALID_FILTER",
    "message": "Unsupported code_parametre for this endpoint"
  }
}
```

Codes minimum :

- `INVALID_FILTER`
- `UNKNOWN_PARAMETER`
- `VIEW_UNAVAILABLE`
- `QUERY_TIMEOUT`
- `UNAUTHORIZED`

## Métadonnées recommandées

| Cle | Exemple |
|---|---|
| `source_view` | `api.v_qualite_metaux` |
| `source_version` | `2026-05-13` |
| `unit_policy` | `referentiel_canonique` |
| `excluded_parameters` | `["FM", "F_M_MES"]` |
| `business_rules` | `["MO != Mo"]` |
