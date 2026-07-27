-- =====================================================================
-- 119 — Script de QUARANTAINE des objets orphelins (base abh_sad)
-- Généré le 2026-07-27 — NON EXÉCUTÉ. À lancer uniquement après
-- validation du chef de projet, hors période de démonstration.
--
-- Principe : déplacement vers un schéma d'archive (réversible par
-- ALTER TABLE ... SET SCHEMA), AUCUN DROP. Le DROP éventuel du schéma
-- d'archive est une décision séparée, après période d'observation et
-- pg_dump préalable.
--
-- Réversibilité : ALTER TABLE zzz_archive_2026.<t> SET SCHEMA <origine>;
-- =====================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS zzz_archive_2026;
COMMENT ON SCHEMA zzz_archive_2026 IS
  'Quarantaine audit 119 (2026-07-27) : objets sans référence code. NE PAS UTILISER EN RUNTIME.';

-- ---------------------------------------------------------------------
-- 1. qa_dry_run — artefacts du dry-run de migration qualité (~1,24 Go)
--    Zéro référence dans backend/app et backend/scripts.
--    Migration clôturée (DEC-001 du 2026-05-08).
-- ---------------------------------------------------------------------
ALTER TABLE qa_dry_run.e0_mesures_preparees          SET SCHEMA zzz_archive_2026;
ALTER TABLE qa_dry_run.e0_mesures_quarantaine        SET SCHEMA zzz_archive_2026;
ALTER TABLE qa_dry_run.e1_1_insert_audit             SET SCHEMA zzz_archive_2026;
ALTER TABLE qa_dry_run.qualite_sebou_migration_audit SET SCHEMA zzz_archive_2026;
ALTER TABLE qa_dry_run.e1_insert_audit               SET SCHEMA zzz_archive_2026;
ALTER TABLE qa_dry_run.e0_mapping_scope              SET SCHEMA zzz_archive_2026;
ALTER TABLE qa_dry_run.e0_controle_volumes           SET SCHEMA zzz_archive_2026;
-- Une fois vide, le schéma peut être supprimé sans risque :
-- DROP SCHEMA qa_dry_run;

-- ---------------------------------------------------------------------
-- 2. geo_work — intermédiaires de fabrication de la topologie (~30 Mo)
--    Sans référence code. Les objets VIVANTS (edges_final, nodes,
--    *_final_candidate_20260602, matrix_v2_20260724, edges_raw,
--    edges_noded, edges_noded_preview) et les rasters MNT (paquets QGIS
--    docs/43) ne sont PAS déplacés.
-- ---------------------------------------------------------------------
ALTER TABLE geo_work.reseau_hydro_edges_gapfixed_20260602              SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_edges_gapfixed_20260602_vertices_pgr SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_edges_valides_20260602               SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_edges_valides_20260602_vertices_pgr  SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_edges_noded_20260602                 SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_edges_noded_20260602_vertices_pgr    SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_edges_raw_backup_20260602            SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_nodes_valides_20260602               SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_nodes_gapfixed_20260602              SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_nodes_noded_20260602                 SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_nodes_backup_20260602                SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_gaps_gapfixed_20260602               SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_gaps_noded_20260602                  SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_gap_residuel_20260602                SET SCHEMA zzz_archive_2026;
ALTER TABLE geo_work.reseau_hydro_gap_residuel_context_20260602        SET SCHEMA zzz_archive_2026;

COMMIT;

-- =====================================================================
-- CONTRÔLE POST-EXÉCUTION (lecture seule) :
--   SELECT relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
--   WHERE n.nspname='zzz_archive_2026' ORDER BY relname;   -- attendu : 22 objets
-- Puis 2 semaines d'observation runtime avant tout DROP.
-- =====================================================================
