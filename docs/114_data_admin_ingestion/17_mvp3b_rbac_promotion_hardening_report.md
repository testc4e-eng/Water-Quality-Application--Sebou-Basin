# Rapport MVP3-B — RBAC et durcissement promotion

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'execution |
| Perimetre | module 114 `data_admin` |
| Date | 2026-06-05 |

## Contexte

Le lot `114_MVP3` avait active un workflow de promotion controlee `INSERT_ONLY` pour `HYDRO_DEBIT`, `METEO_PRECIPITATION` et `QUALITE_RIVIERE`, mais avec deux limites majeures :

- `RBAC_PENDING` ;
- acteur technique `data_admin_ui` trop generique pour un audit metier robuste.

L'objectif de `MVP3-B` etait de durcir :

- la protection des routes `data-admin` ;
- la tracabilite des acteurs ;
- la matrice de transition des `change_request` ;
- les messages metier de promotion ;
- les campagnes E2E `METEO_PRECIPITATION` et `QUALITE_RIVIERE`.

## Audit securite

Etat constate dans le code :

- authentification JWT disponible via `app.security.deps.get_current_user` ;
- utilisateurs reels portes par `security.users` ;
- roles reels existants : `viewer`, `manager`, `admin` ;
- permissions generiques disponibles dans `security.role_permissions`, mais sans granularite `data_admin` dediee ;
- routes `/api/v1/data-admin/*` desormais protegees cote backend par `rbac_guard.py`.

Decision retenue :

```text
DATA_ADMIN_RBAC_AUDIT = AUTH_AVAILABLE
RBAC_MODE = RBAC_SIMULATED
```

Le lot ne cree pas encore de nouveaux roles SQL `DATA_VIEWER`, `DATA_OPERATOR`, `DATA_REVIEWER`, `DATA_APPROVER`, `DATA_ADMIN`.
Il mappe les roles applicatifs existants vers des capacites `data_admin` :

- `viewer` -> `view_audit`
- `manager` -> `view_audit`, `generate_template`, `upload_file`, `create_change_request`, `submit_change_request`, `approve_change_request`
- `admin` -> toutes les capacites, y compris `apply_change_request`

## Durcissements appliques

### 1. Routes protegees

Les routes suivantes exigent des capacites explicites :

- lecture audit : `classes`, `schema`, `records`, `count`, `validation-rules`, `ingestion/runs`, `change-requests`, `audit-log`
- generation canevas : `template/generate`
- upload : `ingestion/upload`
- creation et soumission : `change-request`, `submit`
- approbation / rejet : `approve`, `reject`
- application : `apply`

### 2. Traçabilite acteur

Les actions n'acceptent plus un acteur libre depuis le frontend.
Le backend derive l'acteur depuis l'utilisateur authentifie :

```text
user:{user_id}:{email}
```

Fallback controle :

```text
system:data_admin_ui
```

Le fallback reste reserve aux contextes internes, et n'est plus la voie nominale des routes HTTP.

### 3. Matrice de transitions

Transitions autorisees :

- `DRAFT -> SUBMITTED`
- `SUBMITTED -> APPROVED`
- `SUBMITTED -> REJECTED`
- `APPROVED -> APPLIED`
- `APPROVED -> FAILED`

Transitions explicitement refusees :

- `DRAFT -> APPROVED`
- `DRAFT -> APPLIED`
- `SUBMITTED -> APPLIED`
- `REJECTED -> APPLIED`
- `FAILED -> APPLIED`
- `APPLIED -> APPLIED`

Messages metier normalises :

- `INVALID_CHANGE_REQUEST_TRANSITION`
- `CHANGE_REQUEST_NOT_APPROVED`
- `CHANGE_REQUEST_ALREADY_APPLIED`
- `CHANGE_REQUEST_REJECTED`

### 4. Messages metier promotion

Les erreurs d'`apply` sont maintenant plus explicites :

- `PROMOTION_INSERT_WOULD_DUPLICATE_EXISTING_ROW`
- `PROMOTION_TARGET_TABLE_UNAVAILABLE`
- `PROMOTION_TARGET_COLUMN_INVALID`
- `PROMOTION_MAPPING_MISSING_COLUMN`
- `PROMOTION_ITEM_FAILED`
- `PROMOTION_TRANSACTION_ROLLED_BACK`

Chaque message remonte au minimum :

- classe ;
- table cible ;
- cle ou colonne en cause quand disponible ;
- action attendue.

### 5. Audit mapping

`PromotionMappingService` verifie maintenant :

- existence de la table cible ;
- presence des colonnes ciblees ;
- couverture des colonnes `NOT NULL` sans valeur par defaut.

Le lot `MVP3-B` a aussi complete les valeurs statiques minimales pour les tables cibles :

- `meteo.mesure_precipitation.source_system = 'data_admin_mvp3'`
- `qualite.mesure_qualite_riviere.source_row_id = -1`
- `qualite.mesure_qualite_riviere.source_system = 'data_admin_mvp3'`

## Campagnes E2E executees

### RBAC et transitions

Resultats verifies :

- utilisateur `viewer` :
  - ne peut pas `approve`
  - ne peut pas `apply`
- utilisateur `manager` :
  - peut `create`, `submit`, `approve`
  - ne peut pas `apply`
- `apply` avant `approve` : refuse avec `CHANGE_REQUEST_NOT_APPROVED`
- `apply` double : refuse avec `CHANGE_REQUEST_ALREADY_APPLIED`
- `reject` puis `apply` : refuse avec `CHANGE_REQUEST_REJECTED`

### Promotion `HYDRO_DEBIT`

Campagne valide :

```text
upload -> STAGED -> DRAFT -> SUBMITTED -> APPROVED -> APPLIED
```

Effet constate :

- `hydro.mesure_debit` : `652449 -> 652451`
- delta du lot documente ici : `+2`

Cas warning doublon :

```text
VALIDATED_WITH_WARNINGS -> DRAFT -> SUBMITTED -> APPROVED -> APPLY = FAILED
```

Effet constate :

- aucune ecriture supplementaire ;
- erreur `PROMOTION_INSERT_WOULD_DUPLICATE_EXISTING_ROW`.

### Promotion `METEO_PRECIPITATION`

Campagne valide :

```text
upload -> STAGED -> DRAFT -> SUBMITTED -> APPROVED -> APPLIED
```

Effet constate :

- `meteo.mesure_precipitation` : `546007 -> 546008`
- audit log cree ;
- `request_status = APPLIED`

### Promotion `QUALITE_RIVIERE`

Campagne valide :

```text
upload -> STAGED -> DRAFT -> SUBMITTED -> APPROVED -> APPLIED
```

Effet constate :

- `qualite.mesure_qualite_riviere` : `59534 -> 59535`
- audit log cree ;
- `request_status = APPLIED`

## Build et non-regression

Controles executes :

- `python -m compileall backend/app`
- `npm run build`

Resultat :

- backend : OK
- frontend : OK

Le lot ne change pas :

- le mode `INSERT_ONLY`
- l'absence de `UPSERT`
- l'absence de `DELETE`
- l'absence de rollback metier automatique

## Verdict

```text
114_MVP3_B_STATUS = RBAC_PROMOTION_HARDENED
```

Statut detaille :

```text
RBAC_MODE = RBAC_SIMULATED
ACTOR_TRACEABILITY = HARDENED
CHANGE_REQUEST_TRANSITIONS = HARDENED
PROMOTION_MESSAGES = HARDENED
METEO_PROMOTION_E2E = VALIDATED
QUALITE_PROMOTION_E2E = VALIDATED
```

## Suites recommandees

1. `114_MVP3_C_ROLLBACK_LOGIQUE`
2. ou `114_MVP3_D_EXTEND_TO_INFRA_AND_POLLUTION`

Condition forte :

```text
Ne pas activer UPSERT tant que rollback logique et RBAC cible ne sont pas stabilises.
```
