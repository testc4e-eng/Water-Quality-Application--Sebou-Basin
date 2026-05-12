-- Table : meteo.mesure_temperature
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "meteo"."mesure_temperature";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'meteo' AND table_name = 'mesure_temperature'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour val_min
SELECT COUNT(*) FILTER (WHERE "val_min" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "meteo"."mesure_temperature";

-- 4. Qualité valeurs pour val_max
SELECT COUNT(*) FILTER (WHERE "val_max" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "meteo"."mesure_temperature";

-- 4. Qualité valeurs pour val_moy
SELECT COUNT(*) FILTER (WHERE "val_moy" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "meteo"."mesure_temperature";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "meteo"."mesure_temperature"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
