-- ATTENTION : REQUETES READ-ONLY UNIQUEMENT
-- Run source : f0f2a858-1c90-4b15-a6af-cc172bece071

-- Exemple de contrôle standard :
-- 1. volume candidat E0
-- SELECT source_table, COUNT(*)
-- FROM qa_dry_run.e0_mesures_preparees
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
-- GROUP BY source_table
-- ORDER BY source_table;

-- 2. doublons métier cible
-- Adapter la clé selon la table cible :
-- hydro.mesure_debit -> (temps, station_id)
-- hydro.mesure_debit_mensuel -> (bucket_month, station_id)
-- meteo.mesure_precipitation -> (temps, station_id)
-- qualite.* -> (temps, station_id, parametre_qualite)

-- 3. détection `source_row_id` instable
-- SELECT source_table, COUNT(*)
-- FROM qa_dry_run.e0_mesures_preparees
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND source_row_id ~ '^\([0-9]+,[0-9]+\)$'
-- GROUP BY source_table;

-- 4. contrôle source/cible avant écriture
-- Reprendre les CTE détaillés dans les fiches table du dossier 59.
