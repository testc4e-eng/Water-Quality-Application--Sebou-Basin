-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Run dry-run source : f0f2a858-1c90-4b15-a6af-cc172bece071

-- Principe :
-- 1. selectionner uniquement qa_dry_run.e0_mesures_preparees
-- 2. exclure toutes les tables IDP 2024
-- 3. router par domaine vers les tables finales

-- Filtre commun de scope E1 sans IDP :
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'
--   AND source_table NOT IN (,
--     'staging.raw_idp_2024_mesures_qualite_globale',
--     'staging.raw_idp_2024_mesures_qualite_marche_cadre',
--     'staging.raw_idp_2024_src_pollution_globale',
--     'staging.raw_idp_2024_src_pollution_marche_cadre'
--   )

-- Exemple hydro.mesure_debit
-- INSERT INTO hydro.mesure_debit (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'
--   AND source_table = 'staging.raw_mesures_debit_jr';

-- Exemple meteo.mesure_precipitation
-- INSERT INTO meteo.mesure_precipitation (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'
--   AND source_table IN (
--     'staging.raw_mesures_precipitations_jr',
--     'staging.raw_mesures_precipitations_jr_traitees'
--   );

-- Exemple qualite.mesure_qualite_riviere
-- INSERT INTO qualite.mesure_qualite_riviere (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'
--   AND source_table = 'staging.raw_mesures_qualite_rivieres';

-- Controle avant insertion :
-- SELECT source_table, COUNT(*)
-- FROM qa_dry_run.e0_mesures_preparees
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'
--   AND source_table NOT IN (
--     'staging.raw_idp_2024_mesures_qualite_globale',
--     'staging.raw_idp_2024_mesures_qualite_marche_cadre',
--     'staging.raw_idp_2024_src_pollution_globale',
--     'staging.raw_idp_2024_src_pollution_marche_cadre'
--   )
-- GROUP BY source_table
-- ORDER BY source_table;
