# Rapport MVP3-C — Rollback logique des promotions `INSERT_ONLY`

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'execution |
| Perimetre | module 114 `data_admin` |
| Date | 2026-06-05 |

## Objectif

Activer un rollback logique controle des promotions `INSERT_ONLY`, sans ouvrir `UPSERT`, `UPDATE_EXISTING`, `DELETE` libre ou `MERGE`.

Le rollback est limite a :

- `HYDRO_DEBIT`
- `METEO_PRECIPITATION`
- `QUALITE_RIVIERE`

Le principe reste :

```text
DELETE_CONTROLLED_BY_TARGET_PK_AND_AUDIT
```

## Extension DB appliquee

Script execute :

- `backend/sql/2026_06_data_admin_rollback.sql`

Colonnes ajoutees a `data_admin.change_request` :

- `rollback_available`
- `rollback_status`
- `rollback_reference`
- `rollback_requested_by`
- `rollback_requested_at`
- `rollback_approved_by`
- `rollback_approved_at`
- `rollback_applied_by`
- `rollback_applied_at`

Contrainte ajoutee :

- `change_request_rollback_status_chk`

Valeurs autorisees :

- `NOT_PREPARED`
- `READY`
- `REQUESTED`
- `APPROVED`
- `APPLIED`
- `FAILED`

## Backend active

Service ajoute :

- `backend/app/services/data_admin/rollback_service.py`

Endpoints ajoutes :

- `POST /api/v1/data-admin/change-requests/{id}/rollback/prepare`
- `POST /api/v1/data-admin/change-requests/{id}/rollback/request`
- `POST /api/v1/data-admin/change-requests/{id}/rollback/approve`
- `POST /api/v1/data-admin/change-requests/{id}/rollback/apply`
- `GET /api/v1/data-admin/change-requests/{id}/rollback/status`

Regles backend :

- une `change_request` doit etre `APPLIED`
- `promotion_mode` doit etre `INSERT_ONLY`
- `rollback_reference` doit etre complete et prouvee
- chaque item doit disposer d'un `target_pk` et d'un audit `APPLY_ITEM`
- l'`apply rollback` exige une cible unique identifiee par `target_pk`

Erreurs exposees :

- `ROLLBACK_NOT_AVAILABLE`
- `ROLLBACK_NOT_APPROVED`
- `ROLLBACK_TARGET_NOT_FOUND`
- `ROLLBACK_TARGET_NOT_UNIQUE`
- `ROLLBACK_ALREADY_APPLIED`
- `ROLLBACK_REQUEST_NOT_APPLIED`
- `ROLLBACK_TRANSACTION_FAILED`

## Frontend active

Le panneau `ChangeRequestDetail` expose maintenant :

- statut rollback
- table cible
- nombre d'items rollbackables
- boutons :
  - `Preparer rollback`
  - `Demander rollback`
  - `Approuver rollback`
  - `Appliquer rollback`

Confirmation forte :

```text
Cette action va annuler une promotion déjà appliquée et supprimer les lignes insérées par data_admin. Confirmez-vous ?
```

## Campagne de test executee

### Cas nominal

Scenario :

```text
upload -> staging -> change_request -> submit -> approve -> apply
prepare rollback -> request -> approve -> apply rollback
```

Classe testee :

- `HYDRO_DEBIT`

Resultat :

- `hydro.mesure_debit` : `652451 -> 652453 -> 652451`
- delta net final : `0`
- `request_status` reste `APPLIED`
- `rollback_status = APPLIED`
- `rollback_reference` peuplee avec `2` items

### Cas refuses verifies

- rollback sans prepare :
  - `ROLLBACK_NOT_AVAILABLE`
- rollback sans approve :
  - `ROLLBACK_NOT_APPROVED`
- rollback double :
  - `ROLLBACK_ALREADY_APPLIED`
- rollback d'une demande non appliquee :
  - `ROLLBACK_REQUEST_NOT_APPLIED`
- rollback avec role insuffisant :
  - `403 DATA_ADMIN_PERMISSION_DENIED:apply_change_request:role=manager`
- rollback cible non unique :
  - `ROLLBACK_TARGET_NOT_UNIQUE`

### Cas cible non unique

Sur `hydro.mesure_debit`, la cle reelle `(temps, station_id)` est deja unique. Le cas `ROLLBACK_TARGET_NOT_UNIQUE` a donc ete provoque volontairement en corrompant `rollback_reference` dans `data_admin` uniquement, sans modification du schema metier, afin de valider le garde backend.

## Non-regression BD

Comptages verifies apres campagne :

- `hydro.mesure_debit = 652451`
- `meteo.mesure_precipitation = 546008`
- `qualite.mesure_qualite_riviere = 59535`

Delta net apres lot :

```text
hydro = 0
meteo = 0
qualite = 0
```

## Build

Controles executes :

- `python -m compileall backend/app`
- `npm run build`

Resultat :

- backend : OK
- frontend : OK

## Verdict

```text
114_MVP3_C_STATUS = ROLLBACK_LOGIQUE_ACTIVE
```

Statut detaille :

```text
ROLLBACK_MODE = ROLLBACK_INSERT_ONLY
ROLLBACK_AUDIT = ACTIVE
ROLLBACK_APPROVAL = REQUIRED
ROLLBACK_NET_DELTA = 0
```

## Suite recommandee

```text
114_MVP3_D_EXTEND_TO_INFRA_AND_POLLUTION
```

Condition :

```text
Ne pas ouvrir UPSERT tant que rollback logique et RBAC cible complet ne sont pas stabilises.
```
