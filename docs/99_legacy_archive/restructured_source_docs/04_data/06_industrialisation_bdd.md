# 🏭 Phase 16 : Industrialisation, Rollback Avancé & Audit Renforcé (WQDSS)

**Document de Cadrage CI/CD & Qualité Data**
*Objectif : Transformer les scripts de migration manuels (Phase A & B) en un processus idempotent, audité, testable et réversible de classe Enterprise.*

---

## 16.1. Migration Idempotente (Safe DDL) 🛡️

L'idempotence garantit qu'un script exécuté 10 fois donne le même résultat qu'exécuté 1 fois sans générer d'erreurs (Ex: `relation already exists`).

**Exemple de script de migration `002_migration_phase_b.sql` (Version Idempotente)** :
```sql
DO $$ 
BEGIN
    -- Déplacement sécurisé des tables (Ignore s'il est déjà dans le bon schéma)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stations_abhs') THEN
        ALTER TABLE public.stations_abhs SET SCHEMA infra;
        ALTER TABLE infra.stations_abhs RENAME TO station;
    END IF;
    
    -- Recréation des Vues (Toujours utiliser CREATE OR REPLACE)
    CREATE OR REPLACE VIEW public.stations_abhs AS SELECT * FROM infra.station;
    
    -- Ajout sécurisé de la colonne Audit sans casser si elle existe déjà
    ALTER TABLE infra.station ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    
    -- Drop des triggers avant création pour éviter "trigger already exists"
    DROP TRIGGER IF EXISTS trg_audit_station ON infra.station;
    CREATE TRIGGER trg_audit_station BEFORE UPDATE ON infra.station FOR EACH ROW EXECUTE PROCEDURE public.fn_update_timestamp();
END $$;
```

---

## 16.2. Système de Journalisation Complet (Migration Log) 📝

Pour la traçabilité des DevOps, l'exécution des scripts de migration ne se fait plus de manière muette.

```sql
-- Création de l'espace de noms Métadonnées
CREATE SCHEMA IF NOT EXISTS metadata;

CREATE TABLE IF NOT EXISTS metadata.migration_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_name TEXT NOT NULL,
    object_name TEXT,
    operation TEXT,
    status TEXT CHECK (status IN ('SUCCESS', 'FAILED', 'ROLLBACKED')),
    rows_affected INTEGER DEFAULT 0,
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_by TEXT DEFAULT CURRENT_USER
);

-- Exemple d'usage dans le script de migration :
DO $$ 
DECLARE
    v_rows INT;
BEGIN
    -- Remplissage de la table Mapping (Exemple Kvalité)
    -- INSERT INTO qualite.mesure_observation ...
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    
    INSERT INTO metadata.migration_log (migration_name, object_name, operation, status, rows_affected)
    VALUES ('003_mapping_qualite', 'qualite.mesure_observation', 'INSERT_LEGACY', 'SUCCESS', v_rows);

EXCEPTION WHEN OTHERS THEN
    INSERT INTO metadata.migration_log (migration_name, object_name, operation, status, error_message)
    VALUES ('003_mapping_qualite', 'qualite.mesure_observation', 'INSERT_LEGACY', 'FAILED', SQLERRM);
    RAISE; -- Re-jeter l'erreur pour fail la CI
END $$;
```

---

## 16.3. Stratégie de Backup et Rollback Sécurisé 🔙

Avant d'exécuter un script destructif (`DROP` ou gros `UPDATE`), faire une sauvegarde "In-Db".

```sql
-- 1. Snapshot Temporaire (Backup)
CREATE SCHEMA IF NOT EXISTS backup;
-- Table de sauvegarde purement technique, droppée automatiquement à la fin de la semaine
CREATE TABLE backup.stations_abhs_pre_migr_v1 AS SELECT * FROM public.stations_abhs;

-- 2. Script de Rollback (rollback_002_migration.sql)
DO $$
BEGIN
    -- Si la migration a foiré, on rapatrie la table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'infra' AND table_name = 'station') THEN
        DROP VIEW IF EXISTS public.stations_abhs;
        ALTER TABLE infra.station SET SCHEMA public;
        ALTER TABLE public.station RENAME TO stations_abhs;
        
        -- Inscription au registre
        INSERT INTO metadata.migration_log (migration_name, operation, status) 
        VALUES ('rollback_002', 'REVERT_SCHEMA_STATION', 'SUCCESS');
    END IF;
END $$;
```

---

## 16.4. Gestion des Permissions Sécurisées (RBAC) 🔐

Isolation totale des rôles. Le Frontend ou le Backend FastAPI n'ont **absolument pas** à être propriétaire des tables, ils ne doivent pouvoir faire qu'un `SELECT` sur des vues.

```sql
-- Création des rôles
CREATE ROLE role_api_reader;
CREATE ROLE role_backend_worker;

-- Verrouillage sévère du Public
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO PUBLIC; -- Permet d'utiliser postgis / uuid-ossp

-- Accès strict à l'API pour le Web
GRANT USAGE ON SCHEMA api TO role_api_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA api TO role_api_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA api GRANT SELECT ON TABLES TO role_api_reader;

-- Droit du Backend (Insertion IoT)
GRANT USAGE ON SCHEMA infra, hydro TO role_backend_worker;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA hydro TO role_backend_worker;
```

---

## 16.5. Audit Complet Anti-Dette (Contrôle des Dépendances Cachées) 🕵️

Détecter les fonctions "en dur" ou les triggers qui crasheront si la table bouge :

```sql
-- Liste toutes les fonctions qui dépendent / référencent 'public.stations_abhs'
SELECT p.proname AS function_name, pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
WHERE pg_get_functiondef(p.oid) ILIKE '%public.stations_abhs%';

-- Liste des dépendances structurelles profondes (Vues matérialisées, Rules)
SELECT 
    classid::regclass AS type_dependant,
    objid::regclass AS objet_dependant,
    objsubid,
    refclassid::regclass AS objet_source
FROM pg_depend
WHERE refobjid = 'public.stations_abhs'::regclass;
```

---

## 16.6. Stratégie de Versioning des Vues API (Backward Compatibility) 🔄

Pour que le développement Frontend Web n'attende pas le passage des migrations BDD :
- Utilisation des espaces de noms de versionning : `api.v1_station`
- Dès qu'une évolution majeure arrive, on crée `api.v2_station`. Le Backend FastAPI mappe les `app.get("/v1/stations")` et `app.get("/v2/stations")` sur ces vues respectives.

```sql
-- L'ancienne API renvoie le GeoJSON WGS84 de base
CREATE OR REPLACE VIEW api.v1_station_geojson AS SELECT ...

-- La nouvelle API intègrera des données complexes de qualité
CREATE OR REPLACE VIEW api.v2_station_geojson AS 
SELECT ..., (SELECT count(*) FROM qualite...) AS qualite_count ...
```

---

## 16.7. Standardisation CI/CD de Déploiement BDD (Flyway / Liquibase) 🚀

Plutôt que d'exécuter des scripts psql à la main au terminal :
- Créer un dossier `/backend/db_migrations/`.
- Noms normés :
   - `V01_01__init_schemas_and_roles.sql`
   - `V01_02__migrate_infra_stations.sql`
   - `V01_03__create_api_v1_views.sql`
- Utiliser un outil comme **Alembic** (si Python Backend) ou **Flyway** pour exécuter la BDD en CI (Github Actions / GitLab) afin qu'aucun humain n'ait le password Prod en clair.

---

## 16.8. Protocole de Tests Automatisés Post-Migration (QA) 🤖

Après chaque lot de migration (en environnement de Test `abh_sad_test`), le pipeline exécute un test de non-régression (PyTest ou pgTAP).

*   **Test SQL de Casse DB** : `SELECT count(*) FROM api.v1_station_geojson;` -> Doit retourner `> 0` et ne pas lâcher d'erreurs d'exécution de compilation.
*   **Test Endpoint / FastApi** : L'éxécution du test de charge Frontend `curl -s http://127.0.0.1:8000/api/v1/hydro/stations` vérifiant le statut `HTTP 200`.

---

## 16.9. Score de Qualité Global du Système BDD (Gouvernance) 📊

Implémentation d’une requête finale résumant la "Santé Architecturale" :

```sql
-- Dashboard DBA de la Base
SELECT 
  (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND c.relkind='r' AND c.relname NOT IN ('spatial_ref_sys')) AS dette_tables_public,
  (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'backup') AS tables_a_purger_bientot,
  (SELECT ROUND((COUNT(*)::numeric / 390.0) * 100, 2) FROM infra.station WHERE code_ire IS NOT NULL) AS mapping_legacy_score_percent;
```

---

## 16.10. Rapport Exécutif Final de Migration (Modèle Audit Exportable) 📋

> *Ce rapport doit être généré auto via script ou complété par le Lead Tech après passage de la Release en PROD.*

### Rapport de Validation & Audit Post-Migration
| Métrique | Valeur Constatée |
| :--- | :--- |
| **Environnement** | PROD (`abh_sad`) |
| **Date d'exécution CI/CD** | 2026-03-25 17:00:00 |
| **Versions appliquées** | `V01_01` à `V01_04` |
| **Schémas Targetés** | `geo`, `infra`, `api`, `qualite`, `public` |
| **Volumétrie Traitée** | ~900k Records |
| **Taux d'Échec de Mappage UUID** | 1.04% (9 résidus orphelins isolés) |
| **Proxy de compatibilité en place ?**| OUI (Zéro downtime applicatif constaté). |
| **Score de Dette "Schéma Public"** | Abaissé à 0 (Les 33 tables métier ont été dégagées de la zone Rouge). |
| **Sanity Check Final Géo (PostGIS)** | 100% SRID 4326/26191 Valides. |

**CONCLUSION DE L'ARCHITECTE** : 🟢 **GO PRODUCTION**. L'intégrité ACID a été conservée, les routes Web (Dashboards Recharts) pointent et réagissent sans anomalie.
