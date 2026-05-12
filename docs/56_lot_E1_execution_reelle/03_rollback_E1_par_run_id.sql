-- Rollback E1 par run_id f0f2a858-1c90-4b15-a6af-cc172bece071
-- DELETE exact base sur l'audit qa_dry_run.e1_insert_audit

-- Exemple :
-- DELETE FROM hydro.mesure_debit t
-- USING qa_dry_run.e1_insert_audit a
-- WHERE a.e0_run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND a.target_table = 'hydro.mesure_debit'
--   AND t.ctid = a.row_ctid::tid;
