# Audit IDP pollution

| Fichier | Rôle |
| --- | --- |
| 00_resume_executif.md | Synthèse |
| 01_inventaire_couches.md | Inventaire couches |
| 02_profiling_champs_valeurs.md | Profiling champs |
| 03_analyse_geometrique_doublons.md | Géométrie et doublons |
| 04_relation_inventaire_mesures.md | Matching inventaire/mesures |
| 05_modele_cible_postgresql_postgis.md | Modèle cible |
| 06_plan_migration_etl.md | Pipeline ETL |
| 07_dictionnaires_valeurs.md | Dictionnaires |
| 08_anomalies_et_arbitrages.md | Arbitrages |
| 09_recommandations_plateforme.md | Recommandations |
| 10_plan_arbitrage_metier.md | Règles et statuts d'arbitrage métier |
| 11_plan_migration_controlee_v2.md | Plan de pré-migration contrôlée |
| 12_matrice_decision_arbitrage.md | Matrice décisionnelle métier vers modèle PostGIS |
| 13_validation_parametres_qualite.md | Validation des paramètres qualité détectés en format long |
| 14_phase3_validation_metier_report.md | Rapport de fin phase 3 |
| 15_inventory_existing_spatial_layers.md | Inventaire opérationnel des couches métier pollution existantes |
| 16_go_nogo_phase4_consolidation_spatiale.md | Checklist GO/NOGO de consolidation spatiale et pré-migration |
| 17_dev_environment_check.md | Validation environnement PostgreSQL/PostGIS DEV |
| 18_sql_execution_report.md | Rapport d'exécution SQL DEV |
| 19_staging_import_report.md | Rapport d'import staging SHP IDP |
| 20_spatial_consolidation_report.md | Rapport consolidation spatiale DEV |
| 21_quality_pipeline_report.md | Rapport pipeline qualité P0 |
| 22_api_validation_report.md | Validation vues API et endpoints FastAPI pollution |
| 23_maplibre_first_layer_report.md | Première couche MapLibre DEV |
| 24_qa_blocking_report.md | QA bloquant DEV |
| 25_go_nogo_dev_execution.md | GO/NOGO DEV après exécution réelle |
| 26_p0_parameter_mapping_report.md | Rapport correction mappings paramètres P0 |
| 27_p0_unit_mapping_report.md | Rapport correction unités P0 |
| 28_p0_quality_reload_report.md | Rapport rechargement format long P0 |
| 29_qa_after_p0_mapping_report.md | QA après correction P0 |
| 30_react_maplibre_integration_report.md | Intégration React/MapLibre DEV |
| 31_phase6_test_report.md | Tests backend/frontend Phase 6 |
| 32_demo_dg_metier_pollution_idp.md | Support scénario démo DG/métier |
| CHANGELOG.md | Historique des corrections documentaires |
| arbitrage_batches/ | Lots CSV de validation métier priorisés |
| audit_manifest.json | Traçabilité audit |
| arbitrage_template.csv | Modèle CSV d'arbitrage à compléter |
| arbitrage_candidates_preview.csv | Échantillon lecture seule des candidats d'arbitrage |
| crs_consistency_report.md | Vérification CRS `EPSG:4261` / `EPSG:26191` |
| quality_long_format_preview.md | Prévisualisation du pivot qualité en format long |
| ref_parametres_qualite_template.csv | Template de validation du référentiel paramètres qualité |
| ref_typologie_pollution_template.csv | Template de validation de la typologie pollution |
| maplibre_pollution_sites_sample.geojson | Échantillon GeoJSON DEV issu de l'API pollution |
| maplibre_pollution_layer_config.json | Configuration minimale MapLibre |
| maplibre_pollution_first_layer.html | Page de test MapLibre autonome |
