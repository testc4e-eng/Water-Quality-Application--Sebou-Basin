-- Table : qualite.source_pollution_mesure_param
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "qualite"."source_pollution_mesure_param";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'qualite' AND table_name = 'source_pollution_mesure_param'
ORDER BY ordinal_position;

-- 3. Paramètres distincts via param_code_legacy
SELECT "param_code_legacy" AS parametre, COUNT(*) AS volume
FROM "qualite"."source_pollution_mesure_param"
GROUP BY "param_code_legacy"
ORDER BY volume DESC;

-- 4. Qualité valeurs pour valeur_raw
SELECT COUNT(*) FILTER (WHERE "valeur_raw" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "qualite"."source_pollution_mesure_param";

-- 4. Qualité valeurs pour valeur_num
SELECT COUNT(*) FILTER (WHERE "valeur_num" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "qualite"."source_pollution_mesure_param";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "qualite"."source_pollution_mesure_param"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
