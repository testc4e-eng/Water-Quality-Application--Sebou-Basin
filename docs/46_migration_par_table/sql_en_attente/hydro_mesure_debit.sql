-- Table : hydro.mesure_debit
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "hydro"."mesure_debit";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'hydro' AND table_name = 'mesure_debit'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour valeur
SELECT COUNT(*) FILTER (WHERE "valeur" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "hydro"."mesure_debit";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "hydro"."mesure_debit"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
