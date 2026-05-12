-- Phase 1 - Strategie RESET_AND_RELOAD proposee
-- STOP obligatoire avant execution reelle.
-- Ne pas lancer sans backup et validation humaine.

-- 0. PRE-CHECK
-- Verifier:
--   - referentiel canonique charge
--   - backup cible disponible
--   - controles 06_controles.sql au vert hors backlog accepte

BEGIN;

-- 1. BACKUP CIBLE
CREATE TABLE IF NOT EXISTS audit.backup_hydro_mesure_barrage_param AS
SELECT *
FROM hydro.mesure_barrage_param
WHERE false;

INSERT INTO audit.backup_hydro_mesure_barrage_param
SELECT *
FROM hydro.mesure_barrage_param;

-- 2. AUDIT PRE-RESET
CREATE TEMP TABLE tmp_mesure_barrage_param_precheck AS
SELECT
    COUNT(*) AS row_count,
    COUNT(DISTINCT target_business_key_hash) AS distinct_hash_count,
    MIN(created_at) AS min_created_at,
    MAX(created_at) AS max_created_at
FROM hydro.mesure_barrage_param;

-- 3. RESET
-- STOP: ne decommenter qu'apres validation.
-- TRUNCATE TABLE hydro.mesure_barrage_param;

-- 4. RELOAD
-- STOP: executer ensuite 04_sql_insert_normalise.sql.

COMMIT;

-- ROLLBACK FONCTIONNEL
-- Si recharge invalide:
--
-- BEGIN;
-- TRUNCATE TABLE hydro.mesure_barrage_param;
-- INSERT INTO hydro.mesure_barrage_param
-- SELECT *
-- FROM audit.backup_hydro_mesure_barrage_param;
-- COMMIT;
