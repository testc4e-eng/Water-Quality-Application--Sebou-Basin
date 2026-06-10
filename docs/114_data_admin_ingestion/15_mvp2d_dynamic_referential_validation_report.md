# MVP2-D — Validation référentielle dynamique avant promotion

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Lot | `114_MVP2_D` |
| Date | 2026-06-05 |
| Verdict | `DYNAMIC_REFERENTIAL_VALIDATION_ACTIVE` |

## Objectif

Ajouter une couche de validation dynamique entre la validation métier minimale et le staging, sans écrire dans les tables métier et sans activer la promotion.

Flux obtenu :

```text
upload -> validation structurelle -> validation métier minimale -> validation référentielle dynamique -> staging
```

## Tables `data_admin`

Nouvelle table :

- `data_admin.validation_rule_registry`

Tables réutilisées :

- `data_admin.ingestion_run`
- `data_admin.ingestion_file`
- `data_admin.ingestion_validation_error`
- `data_admin.ingestion_staging_row`

Extension de schéma :

- `data_admin.ingestion_validation_error.error_scope`

## Règles seedées

Volume seedé :

```text
13 règles actives
```

Répartition :

- `HYDRO_DEBIT` : `4`
- `METEO_PRECIPITATION` : `4`
- `QUALITE_RIVIERE` : `5`

## Endpoints actifs

- `GET /api/v1/data-admin/validation-rules`
- `GET /api/v1/data-admin/classes/{class_code}/validation-rules`
- `POST /api/v1/data-admin/classes/{class_code}/ingestion/upload`
- `GET /api/v1/data-admin/ingestion/runs`
- `GET /api/v1/data-admin/ingestion/runs/{run_id}`
- `GET /api/v1/data-admin/ingestion/runs/{run_id}/errors`
- `GET /api/v1/data-admin/ingestion/runs/{run_id}/staging-preview`

## Contrôles dynamiques actifs

- existence station via `infra.stations_mesure.id`
- existence code station via `infra.stations_mesure.code_station`
- existence paramètre canonique actif
- doublon potentiel sur tables métier existantes
- date future
- valeur hors plage raisonnable

## Tests exécutés

| Classe | Cas | Résultat |
|---|---|---|
| `HYDRO_DEBIT` | fixture valide | `STAGED` |
| `HYDRO_DEBIT` | fixture invalide structurelle | `VALIDATION_FAILED` |
| `HYDRO_DEBIT` | station inconnue | `VALIDATION_FAILED` + `REFERENTIAL` |
| `HYDRO_DEBIT` | doublon existant | `VALIDATED_WITH_WARNINGS` + `DUPLICATE` |
| `HYDRO_DEBIT` | valeur extrême + date future | `VALIDATED_WITH_WARNINGS` |
| `METEO_PRECIPITATION` | station inconnue | `VALIDATION_FAILED` + `REFERENTIAL` |
| `METEO_PRECIPITATION` | lot valide runtime | `STAGED` |
| `QUALITE_RIVIERE` | fixture valide | `STAGED` |
| `QUALITE_RIVIERE` | fixture invalide structurelle | `VALIDATION_FAILED` |
| `QUALITE_RIVIERE` | paramètre inconnu | `VALIDATION_FAILED` + `REFERENTIAL` |
| `QUALITE_RIVIERE` | station inconnue | `VALIDATION_FAILED` + `REFERENTIAL` |

## Non-régression métier

- `hydro.mesure_debit = 652446`
- `meteo.mesure_precipitation = 546007`
- `qualite.mesure_qualite_riviere = 59534`

Conclusion :

```text
Aucune écriture dans les tables métier.
```

## Décision

```text
114_MVP2_D_STATUS = DYNAMIC_REFERENTIAL_VALIDATION_ACTIVE
```

## Étape suivante recommandée

```text
114_MVP3_CHANGE_REQUEST_AND_PROMOTION
```
