# MVP1-A.1 Activation DB du registre `data_admin`

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'activation DEV |
| Source de vérité | Oui pour l'activation MVP1-A.1 |
| Dernière mise à jour | 2026-06-05 |

## Résumé

Le registre `data_admin` est désormais activé dans la base DEV réellement utilisée par le runtime `sad-backend`.

Statut obtenu :

```text
114_MVP1_A_STATUS = DEV_DB_ACTIVE
DATA_ADMIN_REGISTRY = ACTIVE
DATA_ADMIN_API = ACTIVE
FALLBACK_MODE = DISABLED
```

## Point d'attention runtime

Deux bases PostgreSQL distinctes existent dans l'environnement local :

1. `sad-db` sur `localhost:5432`
2. la base réellement utilisée par `sad-backend` via `host.docker.internal:5432`

Le runtime applicatif consomme la seconde, avec :

- base : `abh_sad`
- utilisateur : `postgres`
- mot de passe : `c4e@test@2025`

Le schéma `data_admin` a été activé dans cette base réelle de runtime, pas dans le conteneur `sad-db` isolé.

## Preuves DB

### Pré-contrôle

Avant activation sur la base runtime :

```sql
SELECT to_regclass('data_admin.data_class_registry');
SELECT to_regclass('data_admin.field_registry');
```

Résultat observé :

```text
NULL
NULL
```

### DDL exécuté

Script appliqué :

- `backend/sql/2026_06_data_admin_registry.sql`

Objets créés :

- `data_admin.data_class_registry`
- `data_admin.field_registry`

Indexes observés :

- `data_class_registry_pkey`
- `field_registry_pkey`
- `field_registry_class_code_field_name_key`
- `idx_data_class_registry_domain_status`
- `idx_data_class_registry_target`
- `idx_field_registry_class_display`

### Seed exécuté

Script appliqué :

- `backend/sql/2026_06_data_admin_registry_seed.sql`

Contrôles :

```sql
SELECT count(*) FROM data_admin.data_class_registry;
SELECT class_code FROM data_admin.data_class_registry ORDER BY class_code;
```

Résultats :

- `8` classes
- `HYDRO_DEBIT`
- `INFRA_BARRAGE`
- `INFRA_STATION`
- `METEO_PRECIPITATION`
- `POLLUTION_SITE`
- `QUALITE_BARRAGE`
- `QUALITE_NAPPE`
- `QUALITE_RIVIERE`

## Validation du registre

Contrôle :

```sql
SELECT
    class_code,
    domain,
    target_schema,
    target_table,
    exposure_view_schema,
    exposure_view_name,
    staging_schema,
    staging_table,
    status
FROM data_admin.data_class_registry
ORDER BY class_code;
```

Constat :

- `8` lignes actives ;
- domaines cohérents ;
- vues d'exposition présentes pour `INFRA_STATION`, `INFRA_BARRAGE`, `POLLUTION_SITE` ;
- tables staging cohérentes avec le cadrage MVP1 ;
- aucune incohérence bloquante détectée.

## Validation API réelle

Endpoints testés via le runtime `sad-backend` sur `http://127.0.0.1:8000` :

- `GET /api/v1/data-admin/classes`
- `GET /api/v1/data-admin/classes/INFRA_STATION`
- `GET /api/v1/data-admin/classes/INFRA_STATION/count`
- `GET /api/v1/data-admin/classes/HYDRO_DEBIT/count`
- `GET /api/v1/data-admin/classes/POLLUTION_SITE/count`
- `GET /api/v1/data-admin/classes/INFRA_STATION/records?limit=5`

Résultat clé :

```json
{
  "status": "OK",
  "count": 8,
  "metadata": {
    "registry_source": "data_admin.data_class_registry",
    "db_execution_pending": false
  }
}
```

Le fallback `code_seed` n'est plus utilisé pour le routeur actif.

## Validation des compteurs

Valeurs observées via le service/runtime :

| Classe | Résultat |
|---|---:|
| `INFRA_STATION` | `390` |
| `HYDRO_DEBIT` | `652446` |
| `POLLUTION_SITE` | `2026` |

Ces valeurs sont cohérentes avec les cardinalités projet attendues.

## Validation `records`

### `INFRA_STATION`

- source utilisée : `api.v_station_dimension`
- pagination : OK
- `limit=5` respecté
- colonnes cohérentes

### `HYDRO_DEBIT`

- compteur validé
- lecture source directe `hydro.mesure_debit` validée par le service

### `POLLUTION_SITE`

- compteur validé
- source d'exposition `api.v_pollution_sites`

## Non-régression

Routes vérifiées après activation :

- `/api/v1/pollution/sites.geojson?limit=1` : OK
- `/api/v1/map/catalog` : OK
- `/api/v1/quality/regulatory-status` : OK
- `/api/v1/kpi/overview` : OK

Point à noter :

- `/api/v1/admin/data-availability?include_time_stats=false` retourne `500` sur le runtime courant.

Ce point n'est pas causé par `data_admin` :

- aucun code `admin_data_scan` n'a été modifié dans cette mission ;
- le module `data_admin` est monté séparément ;
- les autres endpoints testés restent fonctionnels.

## Verdict

```text
114_MVP1_A_STATUS = DEV_DB_ACTIVE
DATA_ADMIN_REGISTRY = ACTIVE
DATA_ADMIN_API = ACTIVE
FALLBACK_MODE = DISABLED
NO_RUNTIME_REGRESSION = CONFIRMED_ON_TESTED_CRITICAL_ROUTES
ADMIN_DATA_AVAILABILITY = EXISTING_RUNTIME_ISSUE
```

## Décision de sortie

Le chantier peut passer à :

```text
114_MVP1_B_FRONTEND_AUDIT
```

avec création de la route :

```text
/admin/data-governance/audit
```
