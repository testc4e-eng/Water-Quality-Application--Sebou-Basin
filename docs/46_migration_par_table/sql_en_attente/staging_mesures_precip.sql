-- Table : staging.mesures_precip
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_precip";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'staging' AND table_name = 'mesures_precip'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour id_precipitation_jr
SELECT COUNT(*) FILTER (WHERE "id_precipitation_jr" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_precip";

-- 4. Qualité valeurs pour precipitation_jr
SELECT COUNT(*) FILTER (WHERE "precipitation_jr" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_precip";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "staging"."mesures_precip"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
