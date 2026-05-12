-- Table : staging.mesures_niv_eau_barrages
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_niv_eau_barrages";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'staging' AND table_name = 'mesures_niv_eau_barrages'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour niveau_eau_m_ngm
SELECT COUNT(*) FILTER (WHERE "niveau_eau_m_ngm" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_niv_eau_barrages";

-- 4. Qualité valeurs pour volume_mm3
SELECT COUNT(*) FILTER (WHERE "volume_mm3" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_niv_eau_barrages";

-- 4. Qualité valeurs pour restitutions_mm3
SELECT COUNT(*) FILTER (WHERE "restitutions_mm3" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_niv_eau_barrages";

-- 4. Qualité valeurs pour transfert_mm3
SELECT COUNT(*) FILTER (WHERE "transfert_mm3" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_niv_eau_barrages";

-- 4. Qualité valeurs pour apports_mm3
SELECT COUNT(*) FILTER (WHERE "apports_mm3" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_niv_eau_barrages";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "staging"."mesures_niv_eau_barrages"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
