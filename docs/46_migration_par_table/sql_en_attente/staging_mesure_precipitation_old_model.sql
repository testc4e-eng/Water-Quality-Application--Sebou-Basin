-- Table : staging.mesure_precipitation_old_model
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "staging"."mesure_precipitation_old_model";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'staging' AND table_name = 'mesure_precipitation_old_model'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour valeur
SELECT COUNT(*) FILTER (WHERE "valeur" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesure_precipitation_old_model";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "staging"."mesure_precipitation_old_model"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
