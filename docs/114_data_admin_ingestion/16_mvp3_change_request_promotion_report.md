# MVP3 — Change request et promotion contrôlée

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Lot | `114_MVP3` |
| Date | 2026-06-05 |
| Verdict | `CHANGE_REQUEST_PROMOTION_ACTIVE` |

## Objectif

Ajouter un workflow contrôlé entre le staging `data_admin` et les tables métier, sans promotion automatique et sans écriture directe frontend -> schémas métier.

Flux obtenu :

```text
upload -> validation structurelle -> validation métier -> validation référentielle dynamique -> staging
-> change_request -> submit -> approve -> apply (INSERT_ONLY)
```

## Tables `data_admin`

Nouvelles tables :

- `data_admin.change_request`
- `data_admin.change_request_item`
- `data_admin.promotion_audit_log`

Tables réutilisées :

- `data_admin.ingestion_run`
- `data_admin.ingestion_staging_row`
- `data_admin.ingestion_validation_error`
- `data_admin.validation_rule_registry`

## Endpoints actifs

- `POST /api/v1/data-admin/ingestion/runs/{run_id}/change-request`
- `GET /api/v1/data-admin/change-requests`
- `GET /api/v1/data-admin/change-requests/{change_request_id}`
- `POST /api/v1/data-admin/change-requests/{change_request_id}/submit`
- `POST /api/v1/data-admin/change-requests/{change_request_id}/approve`
- `POST /api/v1/data-admin/change-requests/{change_request_id}/reject`
- `POST /api/v1/data-admin/change-requests/{change_request_id}/apply`
- `GET /api/v1/data-admin/change-requests/{change_request_id}/audit-log`

## Classes activées

- `HYDRO_DEBIT`
- `METEO_PRECIPITATION`
- `QUALITE_RIVIERE`

Mode de promotion actif :

```text
INSERT_ONLY
```

Modes non actifs :

- `UPDATE_EXISTING`
- `UPSERT`
- `DELETE`
- `MERGE`

## Mapping cible vérifié

### `HYDRO_DEBIT`

- cible : `hydro.mesure_debit`
- colonnes vérifiées :
  - `station_id`
  - `temps`
  - `valeur`
  - `est_valide`

### `METEO_PRECIPITATION`

- cible : `meteo.mesure_precipitation`
- colonnes vérifiées :
  - `station_id`
  - `temps`
  - `val_observees`
  - `pas_temps`
  - `ire_precipitation`

### `QUALITE_RIVIERE`

- cible : `qualite.mesure_qualite_riviere`
- colonnes vérifiées :
  - `station_id`
  - `ire_station`
  - `temps`
  - `parametre_qualite`
  - `valeur`

## Tests exécutés

### Cas valide

Fixture :

```text
HYDRO_DEBIT_valid.csv
```

Résultat :

- run `STAGED`
- change request `DRAFT`
- `submit -> SUBMITTED`
- `approve -> APPROVED`
- `apply -> APPLIED`
- audit log créé
- `hydro.mesure_debit` : `652446 -> 652448`

### Cas invalide

Fixture :

```text
HYDRO_DEBIT_invalid.csv
```

Résultat :

- run `VALIDATION_FAILED`
- création de change request refusée
- aucune écriture métier

### Cas warning doublon

Fixture :

```text
HYDRO_DEBIT_duplicate_candidate.csv
```

Résultat :

- run `VALIDATED_WITH_WARNINGS`
- change request créée et approuvée
- tentative `apply` autorisée seulement après approbation
- échec contrôlé au moment de l'application :
  - `request_status = FAILED`
  - `item_status = FAILED`
  - `error_message = PROMOTION_INSERT_WOULD_DUPLICATE_EXISTING_ROW`
- variation métier :
  - `hydro.mesure_debit` : `+0` sur ce cas

## Non-régression métier

Cardinalités observées après campagne :

- `hydro.mesure_debit = 652448`
- `meteo.mesure_precipitation = 546007`
- `qualite.mesure_qualite_riviere = 59534`

Conclusion :

```text
La seule écriture métier constatée correspond à la promotion contrôlée validée du cas HYDRO_DEBIT_valid.csv (+2 lignes).
```

## Limites MVP3

- promotion `INSERT_ONLY` uniquement ;
- pas de `UPSERT` ;
- pas de `UPDATE_EXISTING` ;
- pas de rollback métier complet ;
- RBAC encore simulé via `actor = data_admin_ui` ;
- périmètre limité à `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE`.

## Décision

```text
114_MVP3_STATUS = CHANGE_REQUEST_PROMOTION_ACTIVE
```

## Étape suivante recommandée

```text
114_MVP3_B_RBAC_AND_PROMOTION_HARDENING
```

avec :

- durcissement RBAC ;
- messages métier plus explicites côté apply ;
- extension progressive à d'autres classes ;
- préparation d'un rollback logique métier avant tout `UPSERT`.
