-- Table : qualite.mesure_qualite_nappe
-- Statut : PENDING - SQL NON EXECUTE
-- Principe : audit read-only et gabarit de migration contrôlée après validation humaine.

-- 1. Volume source
SELECT COUNT(*) AS volume_source FROM "qualite"."mesure_qualite_nappe";

-- 2. Colonnes disponibles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'qualite' AND table_name = 'mesure_qualite_nappe'
ORDER BY ordinal_position;

-- 3. Paramètres distincts via parametre_qualite
SELECT "parametre_qualite" AS parametre, COUNT(*) AS volume
FROM "qualite"."mesure_qualite_nappe"
GROUP BY "parametre_qualite"
ORDER BY volume DESC;

-- 4. Qualité valeurs pour valeur
SELECT COUNT(*) FILTER (WHERE "valeur" IS NULL) AS nb_null, COUNT(*) AS volume_total
FROM "qualite"."mesure_qualite_nappe";

-- 5. Gabarit futur après validation, à compléter avant exécution
-- BEGIN;
-- INSERT INTO <schema_cible>.<table_cible> (...)
-- SELECT ... FROM "qualite"."mesure_qualite_nappe"
-- WHERE <condition_validée_par_le_métier>;
-- ROLLBACK; -- remplacer par COMMIT uniquement après validation et contrôle
