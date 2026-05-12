-- Table : hydro.mesure_barrage
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "hydro"."mesure_barrage";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'hydro' AND table_name = 'mesure_barrage'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour volume_mm3
SELECT COUNT(*) FILTER (WHERE "volume_mm3" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "hydro"."mesure_barrage";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "hydro"."mesure_barrage"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
