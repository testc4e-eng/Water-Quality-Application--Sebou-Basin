-- Table : hydro.barrage_bathymetrie
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "hydro"."barrage_bathymetrie";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'hydro' AND table_name = 'barrage_bathymetrie'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour volume_mm3
SELECT COUNT(*) FILTER (WHERE "volume_mm3" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "hydro"."barrage_bathymetrie";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "hydro"."barrage_bathymetrie"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
