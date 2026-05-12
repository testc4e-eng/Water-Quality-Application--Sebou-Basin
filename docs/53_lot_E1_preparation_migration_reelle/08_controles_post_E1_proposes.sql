-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- E1 - controles post insertion

-- 1. Volumes inseres par table cible
-- SELECT target_table, COUNT(*) FROM qa_dry_run.e1_insert_audit
-- WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
-- GROUP BY target_table;

-- 2. Comparaison eligible vs insere
-- SELECT source_table, volume_eligible_e1 FROM <snapshot_scope_e1>;
-- SELECT target_table, COUNT(*) FROM qa_dry_run.e1_insert_audit WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid GROUP BY target_table;

-- 3. Delta global attendu
-- SELECT
--   (SELECT SUM(volume_eligible_e1) FROM <snapshot_scope_e1>) AS eligible,
--   (SELECT COUNT(*) FROM qa_dry_run.e1_insert_audit WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid) AS inserted,
--   (SELECT SUM(volume_eligible_e1) FROM <snapshot_scope_e1>) - (SELECT COUNT(*) FROM qa_dry_run.e1_insert_audit WHERE run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid) AS delta;

-- 4. Doublons potentiels
-- SELECT code_parametre, station_id, date_mesure, COUNT(*)
-- FROM qualite.mesure_qualite_riviere
-- GROUP BY code_parametre, station_id, date_mesure
-- HAVING COUNT(*) > 1;

-- 5. Valeurs nulles inattendues
-- SELECT COUNT(*) FROM hydro.mesure_debit WHERE valeur IS NULL;
-- SELECT COUNT(*) FROM meteo.mesure_precipitation WHERE valeur IS NULL;
-- SELECT COUNT(*) FROM qualite.mesure_qualite_nappe WHERE valeur IS NULL;

-- 6. Rattachement geographique
-- SELECT COUNT(*) FROM qualite.mesure_qualite_riviere WHERE station_id IS NULL;
-- SELECT COUNT(*) FROM hydro.mesure_barrage WHERE barrage_id IS NULL;

-- 7. Parametres non mappes
-- SELECT COUNT(*) FROM <table_cible> WHERE code_parametre IS NULL;
