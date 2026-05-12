-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- E1 - rollback propose
-- Hypothese recommandee : chaque insertion E1 doit etre tracee dans une table audit avec run_id et cle primaire cible

-- Exemple de table d'audit a creer avant execution reelle
-- CREATE TABLE qa_dry_run.e1_insert_audit (
--   run_id uuid,
--   target_table text,
--   inserted_pk text,
--   inserted_at timestamptz default now()
-- );

-- Rollback type si audit d'insertion disponible
-- DELETE FROM qualite.mesure_qualite_riviere t
-- USING qa_dry_run.e1_insert_audit a
-- WHERE a.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND a.target_table = 'qualite.mesure_qualite_riviere'
--   AND t.id::text = a.inserted_pk;

-- DELETE FROM hydro.mesure_debit t
-- USING qa_dry_run.e1_insert_audit a
-- WHERE a.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND a.target_table = 'hydro.mesure_debit'
--   AND t.id::text = a.inserted_pk;

-- Variante minimaliste si aucune table audit n'existe :
-- effectuer un backup par table cible avant insertion E1
-- puis restaurer le backup si rollback necessaire.
