-- Table : hydro.mesure_debit_mensuel
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "hydro"."mesure_debit_mensuel";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'hydro' AND table_name = 'mesure_debit_mensuel'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour valeur_moy_m3s
SELECT COUNT(*) FILTER (WHERE "valeur_moy_m3s" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "hydro"."mesure_debit_mensuel";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "hydro"."mesure_debit_mensuel"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
