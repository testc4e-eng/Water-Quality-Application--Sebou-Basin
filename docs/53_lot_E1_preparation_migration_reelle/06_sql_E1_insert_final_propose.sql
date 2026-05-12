-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- E1 - insertion finale depuis qa_dry_run.e0_mesures_preparees
-- precondition : run_id E0 retenu = f0f2a858-1c90-4b15-a6af-cc172bece071
-- precondition : aucune ligne en quarantaine E0 ou backlog geo ne doit entrer dans les INSERT ci-dessous

-- Exemple domaine hydro
-- INSERT INTO hydro.mesure_debit (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_debit_jr';

-- INSERT INTO hydro.mesure_debit_mensuel (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_debit_m';

-- INSERT INTO hydro.mesure_debit_source (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_debit_sources';

-- INSERT INTO hydro.mesure_barrage (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table IN ('raw_mesures_niv_eau_barrages', 'raw_barrages_abhs');

-- INSERT INTO hydro.barrage_bathymetrie (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_bathymetries_barrages_abhs';

-- Exemple domaine meteo
-- INSERT INTO meteo.mesure_precipitation (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table IN ('raw_mesures_precipitations_jr', 'raw_mesures_precipitations_jr_traitees');

-- INSERT INTO meteo.mesure_precipitation_annuelle_max (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_precipitations_jr_max';

-- INSERT INTO meteo.mesure_evaporation (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_evaporation_jr';

-- Exemple domaine qualite
-- INSERT INTO qualite.mesure_qualite_barrage (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_qualite_barrages';

-- INSERT INTO qualite.mesure_qualite_nappe (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_qualite_nappes';

-- INSERT INTO qualite.mesure_qualite_riviere (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_mesures_qualite_rivieres';

-- INSERT INTO qualite.mesure_qualite_sebou (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_suivi_qualite_sebou_jr';

-- INSERT INTO qualite.suivi_qualite_barrage_garde_hebdo (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_suivi_qualite_brg_garde_hebdo';

-- IDP globale geo-fiable : router uniquement si la table cible qualite est explicitement validee
-- INSERT INTO qualite.<table_a_confirmer> (...)
-- SELECT ...
-- FROM qa_dry_run.e0_mesures_preparees p
-- WHERE p.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
--   AND p.source_table = 'raw_idp_2024_mesures_qualite_globale';
