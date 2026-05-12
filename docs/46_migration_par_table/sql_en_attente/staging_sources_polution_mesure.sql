-- Table : staging.sources_polution_mesure
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "staging"."sources_polution_mesure";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'staging' AND table_name = 'sources_polution_mesure'
ORDER BY ordinal_position;

-- 3. Paramètres distincts via Parametre
SELECT "Parametre" AS parametre, COUNT(*) AS volume
FROM "staging"."sources_polution_mesure"
GROUP BY "Parametre"
ORDER BY volume DESC;

-- 4. Qualité valeurs pour T_eau
SELECT COUNT(*) FILTER (WHERE "T_eau" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."sources_polution_mesure";

-- 4. Qualité valeurs pour pH
SELECT COUNT(*) FILTER (WHERE "pH" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."sources_polution_mesure";

-- 4. Qualité valeurs pour O2_Diss
SELECT COUNT(*) FILTER (WHERE "O2_Diss" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."sources_polution_mesure";

-- 4. Qualité valeurs pour DCO
SELECT COUNT(*) FILTER (WHERE "DCO" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."sources_polution_mesure";

-- 4. Qualité valeurs pour DBO5
SELECT COUNT(*) FILTER (WHERE "DBO5" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."sources_polution_mesure";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "staging"."sources_polution_mesure"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
