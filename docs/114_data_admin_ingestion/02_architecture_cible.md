# Architecture cible

## Principe directeur

Le module 114 doit industrialiser la gouvernance opérationnelle des données sans réintroduire :

- du CRUD direct sur les tables métier ;
- des imports non tracés ;
- des corrections SQL manuelles ;
- des contournements frontend -> table métier.

## Architecture backend cible

Créer un domaine dédié :

```text
backend/app/api/v1/data_admin/
backend/app/services/data_admin/
backend/app/repositories/data_admin/
backend/app/schemas/data_admin/
```

## Contrats API cibles

### Audit et consultation

```text
GET /api/v1/data-admin/classes
GET /api/v1/data-admin/classes/{class_code}
GET /api/v1/data-admin/classes/{class_code}/schema
GET /api/v1/data-admin/classes/{class_code}/records
GET /api/v1/data-admin/classes/{class_code}/anomalies
GET /api/v1/data-admin/audit-log
```

### Modification contrôlée

```text
POST /api/v1/data-admin/classes/{class_code}/draft-change
POST /api/v1/data-admin/classes/{class_code}/submit-change
POST /api/v1/data-admin/classes/{class_code}/approve-change
POST /api/v1/data-admin/classes/{class_code}/reject-change
POST /api/v1/data-admin/classes/{class_code}/apply-change
POST /api/v1/data-admin/classes/{class_code}/rollback-change
```

### Ingestion métier

```text
GET  /api/v1/ingestion/templates
POST /api/v1/ingestion/templates/generate
POST /api/v1/ingestion/upload
POST /api/v1/ingestion/validate
POST /api/v1/ingestion/review
POST /api/v1/ingestion/promote
GET  /api/v1/ingestion/runs
GET  /api/v1/ingestion/runs/{run_id}
GET  /api/v1/ingestion/runs/{run_id}/errors
GET  /api/v1/ingestion/runs/{run_id}/report-client
```

### Réception temps réel future

```text
GET  /api/v1/realtime/sources
POST /api/v1/realtime/sources
POST /api/v1/realtime/sources/{id}/test
GET  /api/v1/realtime/health
GET  /api/v1/realtime/events
```

## Architecture frontend cible

Créer un espace unifié :

```text
/admin/data-governance
```

Avec 4 onglets :

1. Audit des données
2. Modification contrôlée
3. Ingestion
4. Temps réel

## Architecture SQL cible

Créer un schéma dédié :

```text
data_admin
```

Tables cibles :

```text
data_admin.data_class_registry
data_admin.field_registry
data_admin.ingestion_template
data_admin.ingestion_run
data_admin.ingestion_file
data_admin.ingestion_validation_error
data_admin.change_request
data_admin.change_request_item
data_admin.approval_workflow
data_admin.audit_log
data_admin.realtime_source_config
data_admin.realtime_event_log
```

## Règles d’architecture

- aucune écriture frontend directe dans `geo`, `infra`, `hydro`, `meteo`, `qualite`, `metadata` ;
- toute ingestion passe par `staging + validation + review + promotion` ;
- toute modification passe par `change_request + approbation + audit` ;
- les vues `api.*` restent la couche de lecture métier privilégiée.
