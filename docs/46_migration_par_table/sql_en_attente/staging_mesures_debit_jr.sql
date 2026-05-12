-- Table : staging.mesures_debit_jr
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_debit_jr";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'staging' AND table_name = 'mesures_debit_jr'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour code_debit
SELECT COUNT(*) FILTER (WHERE "code_debit" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_debit_jr";

-- 4. Qualité valeurs pour debit_jr
SELECT COUNT(*) FILTER (WHERE "debit_jr" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_debit_jr";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "staging"."mesures_debit_jr"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
