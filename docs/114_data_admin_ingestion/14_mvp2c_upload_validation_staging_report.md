# MVP2-C — Upload, validation et staging sans promotion

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Lot | `114_MVP2_C` |
| Date | 2026-06-05 |
| Verdict | `UPLOAD_VALIDATION_STAGING_ACTIVE` |

## Portee

Le lot active l'ingestion controlee jusqu'au staging uniquement pour les classes pilotes :

- `HYDRO_DEBIT`
- `METEO_PRECIPITATION`
- `QUALITE_RIVIERE`

Le flux s'arrete a :

```text
upload -> validation -> rapport erreurs -> staging
```

Aucune promotion vers les tables metier n'est activee.

## Tables `data_admin` materialisees

- `data_admin.ingestion_run`
- `data_admin.ingestion_file`
- `data_admin.ingestion_validation_error`
- `data_admin.ingestion_staging_row`

## Endpoints actifs

- `POST /api/v1/data-admin/classes/{class_code}/ingestion/upload`
- `GET /api/v1/data-admin/ingestion/runs`
- `GET /api/v1/data-admin/ingestion/runs/{run_id}`
- `GET /api/v1/data-admin/ingestion/runs/{run_id}/errors`
- `GET /api/v1/data-admin/ingestion/runs/{run_id}/staging-preview`

## Regles implementees

### Parsing

- formats acceptes : `.csv`, `.xlsx`
- `.xlsx` : feuille `DONNEES` uniquement
- fichier sans entetes : rejet
- fichier vide : rejet
- classe hors perimetre MVP2-C : rejet
- limite : `10_000` lignes

### Validation structurelle

Source prioritaire :

```text
data_admin.field_registry
```

Controles :

- colonnes obligatoires
- colonnes inconnues
- numeriques
- dates
- booleens
- champs requis non vides

### Validation metier minimale

- `HYDRO_DEBIT` :
  - `station_id` non vide
  - `temps` valide
  - `valeur >= 0`
- `METEO_PRECIPITATION` :
  - `station_id` non vide
  - `temps` valide
  - `val_observees >= 0`
- `QUALITE_RIVIERE` :
  - `parametre_qualite` non vide
  - `valeur` numerique
  - `temps` valide
  - `station_id` ou `ire_station` present

## Resultats de validation executes

### Fixtures versionnees

- `backend/tests/fixtures/data_admin/HYDRO_DEBIT_valid.csv`
- `backend/tests/fixtures/data_admin/HYDRO_DEBIT_invalid.csv`
- `backend/tests/fixtures/data_admin/QUALITE_RIVIERE_valid.csv`
- `backend/tests/fixtures/data_admin/QUALITE_RIVIERE_invalid.csv`

### Cas verifies

| Classe | Fichier | Resultat |
|---|---|---|
| `HYDRO_DEBIT` | `HYDRO_DEBIT_valid.csv` | `STAGED`, `2` lignes en staging |
| `HYDRO_DEBIT` | `HYDRO_DEBIT_invalid.csv` | `VALIDATION_FAILED`, `5` erreurs, `0` ligne en staging |
| `QUALITE_RIVIERE` | `QUALITE_RIVIERE_valid.csv` | `STAGED`, `2` lignes en staging |
| `QUALITE_RIVIERE` | `QUALITE_RIVIERE_invalid.csv` | `VALIDATION_FAILED`, `6` erreurs, `0` ligne en staging |
| `METEO_PRECIPITATION` | lot inline valide | `STAGED`, `1` ligne en staging |
| `METEO_PRECIPITATION` | lot inline invalide | `VALIDATION_FAILED`, `3` erreurs, `0` ligne en staging |

## Frontend active

La route :

```text
/admin/data-governance/audit
```

expose maintenant un onglet `Ingestion` avec :

- choix classe pilote
- upload `.csv` / `.xlsx`
- historique des runs
- resume du run
- table des erreurs
- apercu staging

## Non-regression

- `python -m compileall backend/app` : `OK`
- `npm run build` : `OK`
- aucune ecriture detectee dans `geo`, `infra`, `hydro`, `meteo`, `qualite`, `metadata`, `api`, `analytics`

## Limites restantes

- aucune promotion automatique
- aucune validation referentielle dynamique lourde
- aucune jointure metier vers les referentiels externes
- aucun workflow `change_request`
- `python-multipart` devient une dependance backend obligatoire pour les uploads FastAPI

## Decision

```text
114_MVP2_C_STATUS = UPLOAD_VALIDATION_STAGING_ACTIVE
```

## Prochaine etape recommandee

```text
114_MVP2_D_DYNAMIC_REFERENTIAL_VALIDATION
```

Puis :

```text
114_MVP3_CHANGE_REQUEST_AND_PROMOTION
```
