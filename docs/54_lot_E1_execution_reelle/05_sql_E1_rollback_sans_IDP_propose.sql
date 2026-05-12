-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Rollback cible pour un run E1 derive du dry-run f0f2a858-1c90-4b15-a6af-cc172bece071

-- Principe :
-- 1. identifier les lignes inserees par run_id / source_table / horodatage de lot
-- 2. supprimer uniquement le sous-ensemble E1 sans IDP
-- 3. controler les volumes avant / apres

-- Exemple conceptuel :
-- DELETE FROM hydro.mesure_debit
-- WHERE lot_run_id = '<RUN_ID_E1_REEL>'
--   AND source_table = 'staging.raw_mesures_debit_jr';

-- Controle avant rollback :
-- SELECT source_table, COUNT(*)
-- FROM hydro.mesure_debit
-- WHERE lot_run_id = '<RUN_ID_E1_REEL>'
-- GROUP BY source_table;
