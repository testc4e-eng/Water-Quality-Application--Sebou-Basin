# Écarts documentation vs base de données

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport de réorganisation documentaire |
| Source de vérité | Non - rapport d'audit et de consolidation |
| Date | 2026-05-22 |

## Inspection BD

Base `abh_sad` inspectée en lecture seule : `True`.

## Objets par schéma

| Schéma | Objets |
|---|---|
| metadata | 49 |
| qualite | 9 |
| hydro | 8 |
| meteo | 5 |
| infra | 22 |
| api | 77 |
| staging | 51 |
| swat_output | 8 |
| wasp_output | 5 |
| geo | 18 |
| security | 11 |
| audit | 17 |
| qa | 31 |
| swat_sebou | 4 |
| wasp_sebou | 3 |
| modeles | 3 |
| monitoring | 3 |
| admin | 5 |
| public | 3 |
| geo_work | 7 |

## Cardinalités critiques observées

| Objet | Count ou estimation |
|---|---|
| geo.ref_site_pollution | 1951 |
| hydro.mesure_barrage_param | 272652 |
| hydro.mesure_debit | 652446 |
| hydro.mesure_debit_mensuel | 19316 |
| infra.barrages | 33 |
| infra.stations_mesure | 390 |
| meteo.mesure_evaporation | 48900 |
| meteo.mesure_precipitation | 546007 |
| meteo.mesure_temperature | 0 |
| qualite.mesure_qualite_barrage | 7820 |
| qualite.mesure_qualite_nappe | 63047 |
| qualite.mesure_qualite_riviere | 59534 |
| qualite.mesure_qualite_sebou | 49954 |
| qualite.resultat_mesure | 1409 |
| qualite.source_pollution_mesure_param | 7191 |
| qualite.source_pollution_prelevement | 141 |
| qualite.suivi_qualite_barrage_garde_hebdo | 1780 |
| security.activity_logs | 86671 |
| swat_sebou.swat_scenarios | 1 |
| wasp_sebou.wasp_results | 931770 |
| wasp_sebou.wasp_scenarios | 1 |

## Objets référencés mais absents

| Objet | Références |
|---|---|
| admin.catalogue_parametre | docs/01_project_reference/backend/api_contracts.md; docs/01_project_reference/backend/traceability_matrix.md; docs/01_project_reference/overview/data_governance_and_standards.md; docs/12_historique_et_archives/root_legacy/30_audit_incoherences_global.md |
| admin.commune | docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/migration_plan.md; docs/99_legacy_archive/superseded_active_data_docs/2026-04-10_db_reference_refresh/sql_views_reference.md |
| admin.organisme | docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/migration_plan.md; docs/99_legacy_archive/superseded_active_data_docs/2026-04-10_db_reference_refresh/sql_views_reference.md |
| admin.province | docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/migration_plan.md; docs/99_legacy_archive/superseded_active_data_docs/2026-04-10_db_reference_refresh/sql_views_reference.md |
| admin.region | docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/migration_plan.md; docs/99_legacy_archive/superseded_active_data_docs/2026-04-10_db_reference_refresh/sql_views_reference.md |
| admin.villes | backend/app/routers/layers.py |
| analytics.mv_dashboard_ | docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md; docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad_word_ready.md; docs/03_ai_knowledge_base/database_for_agents.md; docs/94_api_frontend_transition/01_audit_backend_fastapi.md |
| analytics.mv_dashboard_climat_meteo | backend/sql/2026_04_mv_analytics_climat.sql |
| analytics.mv_dashboard_pollution_idp_candidate | database/idp_pollution/05_create_qa_views.sql; scripts/idp_pollution/profile_layers.py |
| analytics.mv_idp_pollution_dashboard_candidate | database/idp_pollution/09_create_api_views_idp_pollution.sql |
| analytics.py | backend/app/routers/analytics.py; docs/04_working_prompts_and_runs/runs/2026-04-09_merge_dashboards/status_note_merge_dashboards_2026-04-09.md; docs/84_hydro_barrage_param_deploiement/19_backend_refactor.md; docs/84_hydro_barrage_param_deploiement/25_apport_refactor_backend.md |
| analytics.router | backend/app/api/api_v1.py |
| analytics.ts | docs/04_working_prompts_and_runs/runs/2026-04-09_merge_dashboards/status_note_merge_dashboards_2026-04-09.md; docs/94_api_frontend_transition/05_audit_frontend_react.md; docs/94_api_frontend_transition/frontend_pilote_metaux/04_tests_frontend.md; frontend/src/api/analytics.ts |
| api.api_v1 | backend/app/main.py; backend/tests/test_runtime_optional_swat.py |
| api.ca_ | docs/01_project_reference/overview/data_governance_and_standards.md; docs/99_legacy_archive/restructured_source_docs/01_architecture/architecture_bd_expertise.md |
| api.ca_meteo_precipitation_traitee_day | docs/02_contractual_and_reports/technical_annexes/data_quality/data_quality_migration_report.md |
| api.canScrollNext | frontend/src/components/ui/carousel.tsx |
| api.canScrollPrev | frontend/src/components/ui/carousel.tsx |
| api.delete | frontend/src/api/client.ts; frontend/src/services/layerConfigApi.ts; frontend/src/services/userService.ts |
| api.deps | backend/app/api/v1/items.py |
| api.fn_refresh_qualite_matviews | docs/02_contractual_and_reports/technical_annexes/data_quality/data_quality_migration_report.md |
| api.get | frontend/src/api/analytics.ts; frontend/src/api/client.ts; frontend/src/api/climate.ts; frontend/src/api/hydro.ts |
| api.hydro | docs/99_legacy_archive/restructured_source_docs/01_architecture/README.md |
| api.infra | docs/99_legacy_archive/restructured_source_docs/01_architecture/README.md |
| api.interceptors | frontend/src/api/client.ts |
| api.js | frontend/src/components/Dashboard/MapContainer.jsx; frontend/src/components/Dashboard/StationTable.jsx; frontend/src/components/Map/StationMapPanel.jsx; frontend/src/hooks/useKPIData.js |
| api.mv_ | docs/01_project_reference/data/DATA_FLOW.md; docs/01_project_reference/overview/data_governance_and_standards.md; docs/02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md; docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md |
| api.mv_hydro_ | docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md; docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad_word_ready.md |
| api.mv_hydro_barrage_param_day | docs/75_hydro_barrage_param_model/07_impact_architecture.md |
| api.mv_kpi_qualite_annuel | docs/99_legacy_archive/data_migration_history/phase_a_assainissement.md; docs/99_legacy_archive/data_migration_history/phase_b_migration.md |
| api.mv_qualite_ | docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md; docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad_word_ready.md |
| api.mv_qualite_month | docs/01_project_reference/backend/api_contracts.md; docs/01_project_reference/backend/traceability_matrix.md; docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md; docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/api_architecture.md |
| api.mv_station_latest_status | docs/01_project_reference/backend/api_contracts.md; docs/01_project_reference/backend/traceability_matrix.md; docs/01_project_reference/overview/data_governance_and_standards.md; docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.mv_suivi_qualite_barrages_hebdo_day | docs/02_contractual_and_reports/technical_annexes/data_quality/data_quality_migration_report.md |
| api.on | frontend/src/components/ui/carousel.tsx |
| api.patch | frontend/src/services/passwordResetService.ts; frontend/src/services/userService.ts |
| api.post | frontend/src/api/client.ts; frontend/src/pages/admin/IngestionPage.tsx; frontend/src/services/ingestionService.ts; frontend/src/services/layerConfigApi.ts |
| api.put | frontend/src/api/client.ts; frontend/src/services/layerConfigApi.ts; frontend/src/services/userService.ts |
| api.py | backend/app/routers/api.py; docs/12_historique_et_archives/root_legacy/40_revue_critique_transversale_finale.md |
| api.ts | docs/100_frontend_industrialisation/01_audit_dette_et_points_lourds.md; docs/94_api_frontend_transition/05_audit_frontend_react.md; frontend/src/lib/api.ts |
| api.v1 | backend/app/api/api_v1.py; backend/fix_api_v1.py; backend/tests/test_qualite_specialized_api.py; docs/00_SOURCE_OF_TRUTH_MASTER.md |
| api.v1_station | docs/99_legacy_archive/restructured_source_docs/04_data/06_industrialisation_bdd.md |
| api.v1_station_geojson | docs/99_legacy_archive/restructured_source_docs/04_data/06_industrialisation_bdd.md |
| api.v2_station | docs/99_legacy_archive/restructured_source_docs/04_data/06_industrialisation_bdd.md |
| api.v2_station_geojson | docs/99_legacy_archive/restructured_source_docs/04_data/06_industrialisation_bdd.md |
| api.v_ | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_c_qualite.md; docs/04_working_prompts_and_runs/prompts/observatory/observatory_layers_refactor_prompt.md; docs/12_historique_et_archives/root_legacy/40_revue_critique_transversale_finale.md; docs/94_api_frontend_transition/01_audit_backend_fastapi.md |
| api.v_barrage_dashboard | docs/92_enrichissement_referentiel_canonique/20_audit_table_cible_manquantes.md; docs/92_enrichissement_referentiel_canonique/21_proposition_vues_exposition.sql; docs/92_enrichissement_referentiel_canonique/22_api_cibles_frontend.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/01_audit_final_65_table_cible.md |
| api.v_barrage_geojson | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md; docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/api_architecture.md |
| api.v_bassin_sebou | backend/test_tables.py |
| api.v_geojson_ | docs/99_legacy_archive/restructured_source_docs/04_data/01_architecture_bdd_postgis.md |
| api.v_geojson_reseau_hydro | docs/99_legacy_archive/restructured_source_docs/04_data/01_architecture_bdd_postgis.md |
| api.v_geojson_stations | docs/99_legacy_archive/data_migration_history/phase_a_assainissement.md; docs/99_legacy_archive/restructured_source_docs/04_data/01_architecture_bdd_postgis.md |
| api.v_hydro_barrage_consolide | docs/69_diagnostic_hydro_mesure_barrage/08_recommandation_architecture.md |
| api.v_hydro_barrage_param_ | docs/01_contexte_projet/01_mvp_scope.md; docs/07_donnees_et_referentiels/00_data_landscape.md |
| api.v_hydro_dashboard | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md |
| api.v_hydro_debit | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/01_taxonomie_domaines_parametres.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/04_classification_tables_sources.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/07_api_frontend_par_usage.md |
| api.v_hydro_mesures_enrichies | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_hydro_niveau_barrage_journalier_v2 | docs/75_hydro_barrage_param_model/01_modele_parametrique.md |
| api.v_hydromorphologie_contexte | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/validation_arbitrages/01_journal_validation_arbitrages.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/validation_arbitrages/02_decisions_validees.md |
| api.v_idp_ | docs/98_pollution_idp_architecture/02_architecture_cible_api_front_carto.md |
| api.v_idp_points_proposed | database/idp_pollution/05_create_qa_views.sql; scripts/idp_pollution/profile_layers.py |
| api.v_idp_pollution_arbitrage_status | database/idp_pollution/09_create_api_views_idp_pollution.sql |
| api.v_idp_pollution_measurements | database/idp_pollution/09_create_api_views_idp_pollution.sql |
| api.v_idp_pollution_sites | database/idp_pollution/09_create_api_views_idp_pollution.sql |
| api.v_kpi_global | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_kpi_hydro_meteo | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_kpi_qualite | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_map_points_kpi | docs/12_historique_et_archives/root_legacy/22_rapport_global_blocages_interne.md |
| api.v_measurements_ | docs/03_ai_knowledge_base/troubleshooting_for_agents.md; docs/03_ai_knowledge_base/workflows_for_agents.md; docs/04_working_prompts_and_runs/mission4/mission4_need_analysis.md; docs/04_working_prompts_and_runs/prompts/mission4/partie1_prompts_appliques/03_IDENTIFICATION_DONNEES_MISSION4.md |
| api.v_measurements_annual | docs/04_working_prompts_and_runs/mission4/mission4_need_analysis.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/PARTIE1_ANALYSE_BESOIN_MISSION4.md |
| api.v_measurements_daily | docs/04_working_prompts_and_runs/mission4/mission4_need_analysis.md; docs/04_working_prompts_and_runs/prompts/mission4/partie4_prompts_appliques/02_DETECTION_BUGS_MISSION4.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/PARTIE1_ANALYSE_BESOIN_MISSION4.md |
| api.v_measurements_latest | docs/04_working_prompts_and_runs/mission4/mission4_need_analysis.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/PARTIE1_ANALYSE_BESOIN_MISSION4.md |
| api.v_measurements_monthly | docs/04_working_prompts_and_runs/mission4/mission4_need_analysis.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/PARTIE1_ANALYSE_BESOIN_MISSION4.md |
| api.v_meteo_ | docs/12_historique_et_archives/root_legacy/40_revue_critique_transversale_finale.md |
| api.v_meteo_dashboard | docs/92_enrichissement_referentiel_canonique/20_audit_table_cible_manquantes.md; docs/92_enrichissement_referentiel_canonique/21_proposition_vues_exposition.sql; docs/92_enrichissement_referentiel_canonique/22_api_cibles_frontend.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/01_audit_final_65_table_cible.md |
| api.v_meteo_mesures_enrichies | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_meteo_precipitation_traitee_journalier_qa | docs/02_contractual_and_reports/technical_annexes/data_quality/data_quality_migration_report.md |
| api.v_pollution_ | docs/94_api_frontend_transition/05_audit_frontend_react.md; docs/98_pollution_idp_architecture/02_architecture_cible_api_front_carto.md |
| api.v_pollution_dashboard | docs/92_enrichissement_referentiel_canonique/21_proposition_vues_exposition.sql; docs/92_enrichissement_referentiel_canonique/22_api_cibles_frontend.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/02_mapping_parametres_vers_vues.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/03_sql_vues_exposition_VALIDATION_REQUISE.sql |
| api.v_pollution_sources | docs/92_enrichissement_referentiel_canonique/table_cible_execution/final_recalcul_metier/06_impact_frontend_api.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/01_taxonomie_domaines_parametres.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/07_api_frontend_par_usage.md |
| api.v_qualite_ | backend/tests/test_qualite_specialized_api.py; docs/07_donnees_et_referentiels/00_data_landscape.md; docs/12_historique_et_archives/root_legacy/40_revue_critique_transversale_finale.md; docs/12_historique_et_archives/root_legacy/41_plan_stabilisation_preindustrialisation.md |
| api.v_qualite_dashboard | docs/92_enrichissement_referentiel_canonique/20_audit_table_cible_manquantes.md; docs/92_enrichissement_referentiel_canonique/21_proposition_vues_exposition.sql; docs/92_enrichissement_referentiel_canonique/22_api_cibles_frontend.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/01_audit_final_65_table_cible.md |
| api.v_qualite_dashboard_global | docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md; docs/03_ai_knowledge_base/api_for_agents.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/final_recalcul_metier/02_changements_vs_ancienne_proposition.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/final_recalcul_metier/05_rapport_decision_final_table_cible.md |
| api.v_qualite_mesures_enrichies | docs/01_project_reference/backend/api_contracts.md; docs/01_project_reference/backend/traceability_matrix.md; docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md; docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/api_architecture.md |
| api.v_qualite_nutriments | docs/92_enrichissement_referentiel_canonique/table_cible_execution/final_recalcul_metier/06_impact_frontend_api.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/01_taxonomie_domaines_parametres.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/02_classification_parametres_qualite.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md |
| api.v_quality_ | docs/03_ai_knowledge_base/troubleshooting_for_agents.md; docs/04_working_prompts_and_runs/mission4/mission4_need_analysis.md; docs/04_working_prompts_and_runs/prompts/mission4/partie1_prompts_appliques/03_IDENTIFICATION_DONNEES_MISSION4.md; docs/04_working_prompts_and_runs/prompts/mission4/partie3_prompts_appliques/01_DECOUPAGE_TACHES_MISSION4.md |
| api.v_quality_kpis | docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md |
| api.v_quality_measurements | docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md |
| api.v_quality_stations | docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md |
| api.v_reseau_hydro_geojson | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_reseau_hydrographique_geojson | backend/app/routers/layers.py; docs/04_working_prompts_and_runs/prompts/observatory/observatory_layers_refactor_prompt.md |
| api.v_source_pollution_dimension | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_sources_pollution_geojson | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_station_geojson | docs/01_project_reference/gis_visualization/visualization_strategy.md; docs/12_historique_et_archives/root_legacy/40_revue_critique_transversale_finale.md; docs/99_legacy_archive/data_migration_history/phase_b_migration.md; docs/99_legacy_archive/db_audit_legacy/Dictionnaires/database_dictionary.md |
| api.v_station_status | docs/01_project_reference/gis_visualization/visualization_strategy.md |
| api.v_station_status_geojson | docs/01_project_reference/backend/traceability_matrix.md; docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md; docs/12_historique_et_archives/root_legacy/30_audit_incoherences_global.md; docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/api_architecture.md |
| api.v_stations_stats | docs/04_working_prompts_and_runs/mission4/mission4_need_analysis.md; docs/04_working_prompts_and_runs/prompts/mission4/partie1_prompts_appliques/03_IDENTIFICATION_DONNEES_MISSION4.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/DATABASE_SCHEMA.md; docs/99_legacy_archive/duplicated_ia_kits/10_ia_kit_snapshot/PARTIE1_ANALYSE_BESOIN_MISSION4.md |
| api.v_step_industrielles | backend/app/routers/layers.py; backend/app/routers/quality.py; docs/02_contractual_and_reports/technical_annexes/data_quality/data_quality_migration_report.md; docs/04_working_prompts_and_runs/prompts/observatory/observatory_layers_refactor_prompt.md |
| api.v_suivi_qualite_barrages_hebdo | docs/02_contractual_and_reports/technical_annexes/data_quality/data_quality_migration_report.md |
| api.v_swat_latest | docs/92_enrichissement_referentiel_canonique/21_proposition_vues_exposition.sql; docs/92_enrichissement_referentiel_canonique/22_api_cibles_frontend.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/02_mapping_parametres_vers_vues.md |
| api.v_swat_results | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/01_taxonomie_domaines_parametres.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/04_classification_tables_sources.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md |
| api.v_swat_runs | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/01_taxonomie_domaines_parametres.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/04_classification_tables_sources.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md |
| api.v_territoire_dimension | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| api.v_wasp_latest | docs/92_enrichissement_referentiel_canonique/21_proposition_vues_exposition.sql; docs/92_enrichissement_referentiel_canonique/22_api_cibles_frontend.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/02_mapping_parametres_vers_vues.md |
| api.v_wasp_results | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/01_taxonomie_domaines_parametres.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/04_classification_tables_sources.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md |
| api.v_wasp_runs | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/01_taxonomie_domaines_parametres.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/04_classification_tables_sources.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/06_vues_exposition_metier_proposees.md |
| api.viz_ | docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md; docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad_word_ready.md; docs/03_ai_knowledge_base/database_for_agents.md |
| api.waterqual | docs/01_project_reference/backend/api_contracts.md; docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/openapi_waterqual_sebou.yaml |
| audit.backup_hydro_mesure_barrage_param | docs/75_hydro_barrage_param_model/05_sql_reset_reload.sql |
| audit.bkp_hydro_mesure_barrage_param_ | docs/84_hydro_barrage_param_deploiement/14_backup_avant_load.md |
| audit.bkp_qualite_param_ref_safe_mapping_ | docs/91_resolution_anomalies_execution/REF_001_004_mapping_parametres/06_sql_correction_proposee_non_executee.md |
| audit.bkp_ref_table_cible_65_20260512 | docs/92_enrichissement_referentiel_canonique/table_cible_execution/04_sql_update_table_cible_VALIDATION_REQUISE.sql; docs/92_enrichissement_referentiel_canonique/table_cible_execution/06_sql_validation_table_cible.sql |
| audit.bkp_ref_table_cible_arbitrages_YYYYMMDD | docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/validation_arbitrages/05_sql_update_classification_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_ca_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_cf_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_chla_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_cl_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_co3_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_couleur_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_ct_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_dco_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_detergent_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_disque_secchi_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_eh_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_fe_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_fet_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_hct_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_ibd_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_ibgn_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_k_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_largeur_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_mes_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_mg_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_mn_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_mo_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_na_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_oh_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_ph_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_phenol_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_pheopigment_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_profondeur_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_s2_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_s_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_sf_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_so4_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_t_air_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_t_eau_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_ta_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_tac_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_ref_unite_th_20260512 | docs/92_enrichissement_referentiel_canonique/validation_unites/04_sql_unites_VALIDATION_REQUISE.sql |
| audit.bkp_referentiel_parametre_canonique_avant_enrichissement_20260508 | docs/92_enrichissement_referentiel_canonique/09_sql_enrichissement_referentiel_NON_EXECUTE.sql |
| audit.ingestion_ | docs/12_historique_et_archives/root_legacy/40_revue_critique_transversale_finale.md |
| audit.ingestion_audit_logs_id_seq | docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json |
| audit.ingestion_dataset_signatures | backend/app/services/ingestion_dedup_service.py; docs/01_project_reference/data/API_DATA_MAPPING.md; docs/01_project_reference/data/DATA_FLOW.md; docs/01_project_reference/data/DATA_QUALITY.md |
| audit.ingestion_rollback_log | docs/89_modele_ingestion_futures_donnees/finalisation/01_architecture_ingestion.md |
| geo._bak_ | docs/04_working_prompts_and_runs/prompts/observatory/observatory_layers_refactor_prompt.md |
| geo.bassin | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md; docs/99_legacy_archive/data_migration_history/phase_a_assainissement.md; docs/99_legacy_archive/data_migration_history/phase_b_migration.md; docs/99_legacy_archive/data_migration_history/phase_c_qualite_data.md |
| geo.bassin_sebou | docs/99_legacy_archive/data_migration_history/phase_b_migration.md; docs/99_legacy_archive/restructured_source_docs/04_data/01_architecture_bdd_postgis.md |
| geo.bassin_versant_id_seq | docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo.cours_eau | docs/01_project_reference/gis_visualization/visualization_strategy.md; docs/99_legacy_archive/db_audit_legacy/Guides_Migration_Maintenance/migration_plan.md; docs/99_legacy_archive/superseded_active_data_docs/2026-04-10_db_reference_refresh/data_dictionary.md |
| geo.fn_ref_site_pollution_set_geom_4326 | database/idp_pollution/10_create_ref_site_pollution.sql; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo.fn_set_updated_at | database/idp_pollution/10_create_ref_site_pollution.sql; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo.nappes_abhs_n_id_seq | docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo.points_non_resolus_idp | docs/89_modele_ingestion_futures_donnees/finalisation/13_strategie_geo_idp_progressive.md; docs/92_enrichissement_referentiel_canonique/21_proposition_vues_exposition.sql; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/03_classification_types_mesures.md; docs/92_enrichissement_referentiel_canonique/table_cible_execution/metier_classification/04_classification_tables_sources.md |
| geo.province | docs/99_legacy_archive/data_migration_history/phase_a_assainissement.md |
| geo.reseau_hydro | docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md |
| geo.reseau_hydro_abhs | docs/99_legacy_archive/restructured_source_docs/04_data/01_architecture_bdd_postgis.md |
| geo.reseau_hydrographique_id_seq | docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo.set_updated_at | database/idp_pollution/20_create_ref_site_pollution_master.sql |
| geo.site_object_mapping | database/idp_pollution/25_create_site_object_mapping.sql; database/idp_pollution/26_create_final_spatial_identity_views.sql; docs/03_ai_knowledge_base/architecture_for_agents.md; docs/07_donnees_et_referentiels/00_data_landscape.md |
| geo.sources_abhs_id_seq | docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo.sous_bassin | docs/01_project_reference/backend/traceability_matrix.md; docs/04_working_prompts_and_runs/prompts/data/prompt_data_phase_b_migration.md; docs/88_swat_wasp_legacy_transition/03_regles_future_ingestion_modeles.md; docs/89_modele_ingestion_futures_donnees/06_mapping_parametres_geo.md |
| geo.sous_bassin_ | docs/102_preparation_model_build_feature_store/02_canonical_reference_spec.md |
| geo.sous_bassin_id_seq | docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo.sous_bassin_sebou | docs/99_legacy_archive/restructured_source_docs/04_data/01_architecture_bdd_postgis.md |
| geo.sous_bassin_swat | docs/02_contractual_and_reports/technical_annexes/data_quality/data_quality_migration_report.md |
| geo.sous_bassin_swat_ | docs/01_project_reference/data/DATA_MODELS.md; docs/102_preparation_model_build_feature_store/02_canonical_reference_spec.md; docs/102_preparation_model_build_feature_store/06_model_build_specification.md; scripts/render_db_docs_from_snapshot.py |
| geo.sous_bassin_swat_id_seq | docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json; docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql |
| geo_work.noded | docs/pollution_dashboard/12_reconstruction_topologique_reelle/04_audit_avant_apres_nodification.md |
| geo_work.rattachement_hydro | docs/pollution_dashboard/10_topologie_reseau_hydro/05_audit_rattachement_stations_barrages.md |

## Objets présents mais peu/non référencés textuellement

| Objet |
|---|
| audit.bkp_metadata_referentiel_parametre_20260507_145102_388030 |
