-- Table : staging.mesures_qualite_barrages
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_qualite_barrages";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'staging' AND table_name = 'mesures_qualite_barrages'
ORDER BY ordinal_position;

-- 3. Paramètres distincts via parametre_qualite
SELECT "parametre_qualite" AS parametre, COUNT(*) AS volume
FROM "staging"."mesures_qualite_barrages"
GROUP BY "parametre_qualite"
ORDER BY volume DESC;

-- 4. Qualité valeurs pour val_qual_barr
SELECT COUNT(*) FILTER (WHERE "val_qual_barr" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "staging"."mesures_qualite_barrages";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "staging"."mesures_qualite_barrages"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
