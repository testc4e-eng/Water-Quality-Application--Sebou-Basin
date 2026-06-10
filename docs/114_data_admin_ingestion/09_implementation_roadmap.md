# Roadmap d’implémentation

## Décision d’exécution

Commencer par :

```text
Phase 0 + Phase 1 + Phase 2
```

## MVP1 — Audit lecture seule + registre des classes

- inventaire piloté par classe ;
- compteurs ;
- schémas/champs ;
- anomalies ;
- exposition lecture seule ;
- premières classes du registre.

### Mise a jour 2026-06-05

- `114_MVP1_A_STATUS = DEV_DB_ACTIVE`
- domaine backend cree :
  - `backend/app/api/v1/data_admin/`
  - `backend/app/services/data_admin/`
  - `backend/app/repositories/data_admin/`
  - `backend/app/schemas/data_admin/`
- endpoints lecture seule ajoutes :
  - `GET /api/v1/data-admin/classes`
  - `GET /api/v1/data-admin/classes/{class_code}`
  - `GET /api/v1/data-admin/classes/{class_code}/schema`
  - `GET /api/v1/data-admin/classes/{class_code}/records`
  - `GET /api/v1/data-admin/classes/{class_code}/count`
- scripts DDL prepares :
  - `backend/sql/2026_06_data_admin_registry.sql`
  - `backend/sql/2026_06_data_admin_registry_seed.sql`
- activation DEV realisee :
  - `data_admin.data_class_registry` cree ;
  - `data_admin.field_registry` cree ;
  - `8` classes seedees ;
  - fallback desactive sur le runtime `sad-backend`.

### Prochaine etape

```text
114_MVP1_B_FRONTEND_AUDIT
```

avec :

- route `/admin/data-governance/audit` ;
- premier ecran lecture seule du registre ;
- compteurs par classe ;
- statut sante `ACTIVE/EMPTY/MISSING/WARNING`.

### Mise a jour 2026-06-05 (lot B)

- `114_MVP1_B_STATUS = FRONTEND_AUDIT_ACTIVE`
- nouveaux fichiers frontend :
  - `frontend/src/pages/admin/DataGovernanceAuditPage.tsx`
  - `frontend/src/components/data-governance/*`
  - `frontend/src/hooks/useDataAdmin.ts`
  - `frontend/src/api/dataAdmin.ts`
  - `frontend/src/types/dataAdmin.ts`
- la navigation admin redirige `/administration` vers `/admin/data-governance/audit`
- le frontend consomme uniquement :
  - `GET /api/v1/data-admin/classes`
  - `GET /api/v1/data-admin/classes/{class_code}`
  - `GET /api/v1/data-admin/classes/{class_code}/schema`
  - `GET /api/v1/data-admin/classes/{class_code}/count`
  - `GET /api/v1/data-admin/classes/{class_code}/records`
- build frontend valide via `npm run build`

### Nouvelle prochaine etape

```text
114_MVP2_A_TEMPLATE_GENERATION
```

avec :

- generation automatique des canevas ;
- spec JSON par classe ;
- telechargement `.xlsx` puis `.csv` ;
- sans upload ni staging.

### Mise a jour 2026-06-05 (lot MVP2-A)

- `114_MVP2_A_STATUS = TEMPLATE_GENERATION_ACTIVE`
- backend ajoute :
  - `GET /api/v1/data-admin/classes/{class_code}/template/spec`
  - `POST /api/v1/data-admin/classes/{class_code}/template/generate`
- frontend ajoute :
  - onglet `Canevas` dans `/admin/data-governance/audit`
  - `frontend/src/api/dataAdminTemplates.ts`
  - `frontend/src/components/data-governance/TemplateGeneratorPanel.tsx`
- script idempotent prepare et non execute :
  - `backend/sql/2026_06_data_admin_template_fields.sql`
- limite active :
  - `FIELD_REGISTRY_INCOMPLETE = TRUE`

### Nouvelle prochaine etape

```text
114_MVP2_B_FIELD_REGISTRY_ENRICHMENT
```

puis :

```text
114_MVP2_C_UPLOAD_VALIDATION_STAGING
```

### Mise a jour 2026-06-05 (lot MVP2-B)

- `114_MVP2_B_STATUS = FIELD_REGISTRY_ENRICHED`
- script cree :
  - `backend/sql/2026_06_data_admin_field_registry_seed.sql`
- script execute :
  - `backend/sql/2026_06_data_admin_template_fields.sql`
  - `backend/sql/2026_06_data_admin_field_registry_seed.sql`
- enrichissement DB :
  - `38` champs seedes
  - classes prioritaires couvertes :
    - `HYDRO_DEBIT`
    - `METEO_PRECIPITATION`
    - `QUALITE_RIVIERE`
    - `POLLUTION_SITE`
    - `INFRA_STATION`
- effet runtime :
  - `field_source = data_admin.field_registry`
  - `field_registry_incomplete = false` sur les classes prioritaires

### Nouvelle prochaine etape

```text
114_MVP2_C_UPLOAD_VALIDATION_STAGING
```

### Mise a jour 2026-06-05 (lot MVP2-C)

- `114_MVP2_C_STATUS = UPLOAD_VALIDATION_STAGING_ACTIVE`
- script execute :
  - `backend/sql/2026_06_data_admin_ingestion_runs.sql`
- tables creees :
  - `data_admin.ingestion_run`
  - `data_admin.ingestion_file`
  - `data_admin.ingestion_validation_error`
  - `data_admin.ingestion_staging_row`
- backend ajoute :
  - `POST /api/v1/data-admin/classes/{class_code}/ingestion/upload`
  - `GET /api/v1/data-admin/ingestion/runs`
  - `GET /api/v1/data-admin/ingestion/runs/{run_id}`
  - `GET /api/v1/data-admin/ingestion/runs/{run_id}/errors`
  - `GET /api/v1/data-admin/ingestion/runs/{run_id}/staging-preview`
- frontend ajoute :
  - onglet `Ingestion` dans `/admin/data-governance/audit`
  - `frontend/src/api/dataAdminIngestion.ts`
  - `frontend/src/components/data-governance/IngestionUploadPanel.tsx`
  - `frontend/src/components/data-governance/IngestionRunSummary.tsx`
  - `frontend/src/components/data-governance/IngestionErrorTable.tsx`
- classes pilotes actives :
  - `HYDRO_DEBIT`
  - `METEO_PRECIPITATION`
  - `QUALITE_RIVIERE`
- statut fonctionnel :
  - upload `.csv` / `.xlsx`
  - validation structurelle
  - validation metier minimale
  - rapport d'erreurs
  - staging sans promotion

### Nouvelle prochaine etape

```text
114_MVP2_D_DYNAMIC_REFERENTIAL_VALIDATION
```

ou :

```text
114_MVP3_CHANGE_REQUEST_AND_PROMOTION
```

## MVP2 — Canevas + upload + validation + staging

### Mise a jour 2026-06-05 (lot MVP2-D)

- `114_MVP2_D_STATUS = DYNAMIC_REFERENTIAL_VALIDATION_ACTIVE`
- scripts executes :
  - `backend/sql/2026_06_data_admin_dynamic_validation_rules.sql`
  - `backend/sql/2026_06_data_admin_dynamic_validation_rules_seed.sql`
  - `backend/sql/2026_06_data_admin_field_registry_seed.sql`
- table creee :
  - `data_admin.validation_rule_registry`
- extension appliquee :
  - `data_admin.ingestion_validation_error.error_scope`
- backend ajoute :
  - `GET /api/v1/data-admin/validation-rules`
  - `GET /api/v1/data-admin/classes/{class_code}/validation-rules`
  - `DynamicValidationService`
- frontend ajoute :
  - `ValidationRulesPanel`
  - affichage `error_scope` dans l'onglet `Ingestion`
- prochaine etape :
  - `114_MVP3_CHANGE_REQUEST_AND_PROMOTION`

- génération de canevas ;
- upload ;
- validation structurelle et métier ;
- rapport d’erreurs ;
- staging sans promotion automatique.

## MVP3 — Change request + promotion contrôlée

### Mise a jour 2026-06-05 (lot MVP3)

- `114_MVP3_STATUS = CHANGE_REQUEST_PROMOTION_ACTIVE`
- script execute :
  - `backend/sql/2026_06_data_admin_change_request.sql`
- tables creees :
  - `data_admin.change_request`
  - `data_admin.change_request_item`
  - `data_admin.promotion_audit_log`
- backend ajoute :
  - `POST /api/v1/data-admin/ingestion/runs/{run_id}/change-request`
  - `GET /api/v1/data-admin/change-requests`
  - `GET /api/v1/data-admin/change-requests/{change_request_id}`
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/submit`
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/approve`
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/reject`
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/apply`
  - `GET /api/v1/data-admin/change-requests/{change_request_id}/audit-log`
- services ajoutes :
  - `ChangeRequestService`
  - `PromotionMappingService`
- frontend ajoute :
  - `frontend/src/api/dataAdminChangeRequests.ts`
  - `frontend/src/components/data-governance/ChangeRequestPanel.tsx`
  - `frontend/src/components/data-governance/ChangeRequestDetail.tsx`
  - `frontend/src/components/data-governance/PromotionAuditLog.tsx`
- regles actives :
  - `INSERT_ONLY` uniquement ;
  - aucune promotion automatique ;
  - aucune ligne `INVALID` candidate ;
  - creation de demande limitee aux runs `STAGED` et `VALIDATED_WITH_WARNINGS` ;
  - application possible seulement apres `APPROVED` ;
  - les doublons exacts detectes a l'apply echouent proprement avec `PROMOTION_INSERT_WOULD_DUPLICATE_EXISTING_ROW`.
- preuve runtime :
  - `HYDRO_DEBIT_valid.csv` : `APPLIED`, `hydro.mesure_debit +2`
  - `HYDRO_DEBIT_invalid.csv` : creation de change request refusee
  - `HYDRO_DEBIT_duplicate_candidate.csv` : `FAILED` a l'apply, sans ecriture metier

### Nouvelle prochaine etape

```text
114_MVP3_B_RBAC_AND_PROMOTION_HARDENING
```

### Mise a jour 2026-06-05 (lot MVP3-B)

- `114_MVP3_B_STATUS = RBAC_PROMOTION_HARDENED`
- mecanisme retenu :
  - authentification JWT existante reutilisee ;
  - roles existants `viewer`, `manager`, `admin` mappes vers des capacites `data_admin` ;
  - statut de ce lot historique : `RBAC_SIMULATED`
- backend durci :
  - toutes les routes `/api/v1/data-admin/*` sont protegees par `require_data_admin_capability(...)`
  - l'acteur n'est plus fourni librement par le frontend ;
  - la trace applique `user:{id}:{email}` cote backend ;
  - les transitions de `change_request` sont explicitement verrouillees ;
  - les messages d'erreur `apply` sont normalises et plus precis
- frontend durci :
  - affichage du role courant ;
  - affichage du statut historique `RBAC_SIMULATED` ;
  - boutons `Approve` et `Apply` desactives si role insuffisant ;
  - confirmation forte avant `Apply`
- campagnes E2E validees :
  - `HYDRO_DEBIT` : `APPLIED`
  - `METEO_PRECIPITATION` : `APPLIED`
  - `QUALITE_RIVIERE` : `APPLIED`
  - warning doublon hydro : `FAILED` proprement sans ecriture supplementaire
- cardinalites observees apres campagne :
  - `hydro.mesure_debit = 652451`
  - `meteo.mesure_precipitation = 546008`
  - `qualite.mesure_qualite_riviere = 59535`

### Nouvelle prochaine etape

```text
114_MVP3_C_ROLLBACK_LOGIQUE
```

ou :

```text
114_MVP3_D_EXTEND_TO_INFRA_AND_POLLUTION
```

### Mise a jour 2026-06-05 (lot MVP3-C)

- `114_MVP3_C_STATUS = ROLLBACK_LOGIQUE_ACTIVE`
- script execute :
  - `backend/sql/2026_06_data_admin_rollback.sql`
- extension DB :
  - colonnes `rollback_*` ajoutees a `data_admin.change_request`
  - contrainte `change_request_rollback_status_chk`
- backend ajoute :
  - `RollbackService`
  - `POST /rollback/prepare`
  - `POST /rollback/request`
  - `POST /rollback/approve`
  - `POST /rollback/apply`
  - `GET /rollback/status`
- regles :
  - rollback `INSERT_ONLY` uniquement ;
  - approbation rollback obligatoire ;
  - suppression controlee uniquement par `target_pk` + audit ;
  - refus si cible absente ou non unique
- campagne validee :
  - `HYDRO_DEBIT` : `+2` a l'apply puis `-2` au rollback
  - `request_status` reste `APPLIED`
  - `rollback_status = APPLIED`
  - delta net final `0`
- cas refuses verifies :
  - sans prepare
  - sans approve
  - double rollback
  - demande non appliquee
  - role insuffisant
  - cible non unique

### Nouvelle prochaine etape

```text
114_MVP3_D_EXTEND_TO_INFRA_AND_POLLUTION
```

### Mise a jour 2026-06-05 (lot MVP3-D)

- `114_MVP3_D_STATUS = INFRA_POLLUTION_EXTENSION_ACTIVE`
- scripts executes :
  - `backend/sql/2026_06_data_admin_field_registry_seed.sql`
  - `backend/sql/2026_06_data_admin_dynamic_validation_rules_seed.sql`
- extensions appliquees :
  - `INFRA_STATION` :
    - champs `geom_wkt`, `srid`
    - validation geospatiale dynamique
    - promotion `INSERT_ONLY`
    - rollback logique actif
  - `POLLUTION_SITE` :
    - champs `bassin`, `geom_wkt`, `srid`
    - validation geospatiale dynamique
    - garde `site_code LIKE 'IDP-C1B-%'`
    - promotion `INSERT_ONLY`
    - rollback logique actif
- regles dynamiques ajoutees :
  - `INFRA_STATION_CODE_UNIQUE`
  - `INFRA_GEOM_WKT_VALID`
  - `INFRA_SRID_ALLOWED`
  - `INFRA_GEOM_NOT_EMPTY`
  - `INFRA_GEOM_WITHIN_MOROCCO_BOUNDS`
  - `POLLUTION_SITE_CODE_UNIQUE`
  - `POLLUTION_GEOM_WKT_VALID`
  - `POLLUTION_SRID_ALLOWED`
  - `POLLUTION_GEOM_NOT_EMPTY`
  - `POLLUTION_GEOM_WITHIN_MOROCCO_BOUNDS`
  - `POLLUTION_GEOMETRY_DUPLICATE_WARNING`
- comportement runtime verifie :
  - `INFRA_STATION_invalid_geom.csv` -> `VALIDATION_FAILED`
  - `POLLUTION_SITE_invalid_srid.csv` -> `VALIDATION_FAILED`
  - `POLLUTION_SITE_duplicate_geom.csv` -> `VALIDATED_WITH_WARNINGS`
  - `INFRA_STATION` : `390 -> 392 -> 390`
  - `POLLUTION_SITE` : `2026 -> 2028 -> 2026`
- garde-fous verifies :
  - `geo.ref_site_pollution_source_link` reste `105`
  - `site_code LIKE 'IDP-C1B-%'` reste `75`
  - aucune fusion automatique IDP

### Nouvelle prochaine etape

```text
114_MVP4_RBAC_REEL_ET_CONTRATS_OPERATEURS
```

### Mise a jour 2026-06-05 (lot MVP4)

- `114_MVP4_STATUS = RBAC_REAL_ACTIVE`
- script execute :
  - `backend/sql/2026_06_rbac_roles_permissions.sql`
- source RBAC retenue :
  - `security.users`
  - `security.roles`
  - `security.permissions`
  - `security.role_permissions`
- roles de demonstration actives :
  - `ROLE_DECIDEUR`
  - `ROLE_EXPERT`
  - `ROLE_CONSULTANT`
  - `ROLE_DATA_ADMIN`
  - `ROLE_SYS_ADMIN`
  - `ROLE_AI_AGENT`
- backend durci :
  - `/api/v1/auth/login` et `/api/v1/auth/me` exposent `role_label`, `permissions`, `rbac_status`
  - `rbac_guard.py` lit maintenant les permissions reelles en base
  - `approve`, `apply`, `rollback/apply` utilisent des permissions reelles
  - les routes utilisateurs / reset / logs n'utilisent plus `require_roles("admin")` mais des permissions
- frontend durci :
  - stockage session de `role`, `role_label`, `permissions`, `rbac_status`
  - affichage du role connecte et des permissions actives
  - masquage/desactivation des actions selon permission reelle
- preuves E2E reelles :
  - `demo_consultant` : upload/create/submit OK, `approve` refuse
  - `demo_expert` : `approve` OK, `apply` refuse
  - `demo_data_admin` : `apply` et `rollback/apply` OK
  - `demo_sys_admin` : gestion utilisateurs OK
  - `demo_decideur` : lecture audit OK, upload refuse
  - `demo_ai_agent` : canevas/upload/soumission OK, promotion refusee
- campagnes controlees :
  - `HYDRO_DEBIT` : `upload -> approve -> apply -> rollback`
  - `METEO_PRECIPITATION` : `upload -> approve -> apply -> rollback`
  - `QUALITE_RIVIERE` : `upload -> approve -> apply -> rollback`
- cardinalites nettes finales preservees apres rollback :
  - `hydro.mesure_debit = 652451`
  - `meteo.mesure_precipitation = 546008`
  - `qualite.mesure_qualite_riviere = 59535`

### Nouvelle prochaine etape

```text
DEMO_CLIENT_READY
```

## MVP4 — Temps réel

- configuration des sources ;
- monitoring ;
- journal des événements ;
- tests de connectivité ;
- sans activation automatique client.

## Verdict

```text
DATA_ADMIN_INGESTION_PLAN = READY
```
