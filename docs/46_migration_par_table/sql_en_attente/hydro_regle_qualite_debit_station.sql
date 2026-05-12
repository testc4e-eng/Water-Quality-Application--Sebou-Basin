-- Table : hydro.regle_qualite_debit_station
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "hydro"."regle_qualite_debit_station";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'hydro' AND table_name = 'regle_qualite_debit_station'
ORDER BY ordinal_position;

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "hydro"."regle_qualite_debit_station"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
