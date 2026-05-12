-- Table : staging.mesures_precipitations_jr_traitees
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_precipitations_jr_traitees";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'staging' AND table_name = 'mesures_precipitations_jr_traitees'
ORDER BY ordinal_position;

-- 4. Qualité valeurs pour val_observees
SELECT COUNT(*) FILTER (WHERE "val_observees" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_precipitations_jr_traitees";

-- 4. Qualité valeurs pour val_power_nasa
SELECT COUNT(*) FILTER (WHERE "val_power_nasa" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_precipitations_jr_traitees";

-- 4. Qualité valeurs pour val_remplies
SELECT COUNT(*) FILTER (WHERE "val_remplies" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_precipitations_jr_traitees";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "staging"."mesures_precipitations_jr_traitees"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
