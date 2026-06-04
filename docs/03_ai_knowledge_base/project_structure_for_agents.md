# Structure Projet - SAD Sebou 2026

```text
repo_git/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   └── schemas/
│   ├── scripts/
│   ├── sql/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── package.json
├── docs/
│   ├── 00_SOURCE_OF_TRUTH_MASTER.md
│   ├── 00_source_of_truth/
│   ├── 01_contexte_projet/
│   ├── 01_project_reference/
│   ├── 02_gouvernance_et_decisions/
│   ├── 02_contractual_and_reports/
│   ├── 03_architecture_globale/
│   ├── 03_ai_knowledge_base/
│   ├── 04_etat_avancement/
│   ├── 04_working_prompts_and_runs/
│   ├── 05_blocages_et_risques/
│   ├── 06_anomalies_et_arbitrages/
│   ├── 07_donnees_et_referentiels/
│   ├── 08_pipelines_et_ingestion/
│   ├── 09_modeles_swat_wasp/
│   ├── 10_dashboards_et_api/
│   ├── 11_execution_technique/
│   ├── 105_ml_experiments/
│   ├── 12_historique_et_archives/
│   ├── 90_reorganisation_documentaire_finale/
│   └── 99_legacy_archive/
├── README.md
└── requirements.txt
```

## Lecture fonctionnelle

- `backend/app/api` et `backend/app/routers`: exposition API, services métier et couches historiques
- `backend/app/api/v1/pollution.py`: endpoints DEV lecture seule pour la couche pollution IDP MapLibre
- `backend/sql`: industrialisation SQL, vues matérialisées et performance
- `backend/sql/2026_05_create_load_referentiel_parametre_canonique.sql`: execution auditee du referentiel canonique final
- `docs/84_hydro_barrage_param_deploiement`: controles Phase 1 avant creation de `hydro.mesure_barrage_param`
- `frontend/src/pages`: parcours utilisateurs et écrans métier
- `frontend/src/components`: composants UI, graphiques, cartographie, tables
- `frontend/src/components/decision`: composants isoles du dashboard decisionnel ABH test
- `frontend/src/config/decisionDashboardCatalog.ts`: catalogue local des visions, familles, campagnes, supports et classes de fraicheur
- `frontend/src/pages/DecisionDashboardTest.tsx`: route de validation metier `/decision-dashboard-test`
- `frontend/src/pages/PollutionIdpDevPage.tsx`: route DEV isolee `/pollution-idp-dev`
- `frontend/src/api/pollutionIdp.ts` et `frontend/src/hooks/usePollutionIdp.ts`: client et hook de la couche IDP pollution
- `frontend/src/pages/DashboardCartoMetier.tsx`: route DEV isolee `/dashboard-carto-metier`
- `frontend/src/api/mapBusiness.ts` et `frontend/src/hooks/useMapBusiness.ts`: client et hooks React Query du backend cartographique metier `/api/v1/map/*`
- `frontend/src/components/DashboardMetier`: composants isoles sidebar, carte MapLibre, popup, legende, panneau detail et filtres metier
- `docs/00_source_of_truth`: porte d'entrée vers les documents actifs, historiques, expérimentaux et obsolètes
- `docs/01_contexte_projet`: MVP et périmètre officiel
- `docs/01_project_reference`: documentation maître
- `docs/02_gouvernance_et_decisions`: registre des décisions
- `docs/04_etat_avancement`: cockpit projet global
- `docs/05_blocages_et_risques`: problèmes racines et risques
- `docs/07_donnees_et_referentiels`: cartographie des données et référentiels
- `docs/03_ai_knowledge_base`: mémoire synthétique pour agents
- `docs/12_historique_et_archives/root_legacy`: anciens fichiers historiques racine déplacés le 2026-05-22
- `docs/90_reorganisation_documentaire_finale`: audit global, mapping de déplacement, écarts documentation/BD/pipelines/dashboards et rapport final
- `docs/95_dashboard_decisionnel_abh`: documentation active du chantier dashboard decisionnel ABH
- `docs/96_dashboard_operationnel/` : conception de l'accueil opérationnel SAD centré sur barrages, hydro, pluvio et 6 stations qualité, avec architecture métier, données, alertes, prévisions et plan de mise en œuvre
- `docs/97_dashboard_home_v2_contract/` : contrat JSON détaillé du futur endpoint `GET /api/v1/dashboard/home`, mapping sources BD/API, règles métier pluvio/qualité, plans backend/frontend et tests de validation
- `docs/97_dashboard_home_v2_contract/09_backend_implementation_report.md` : rapport d’implémentation réelle du backend agrégateur Home V2 et décision `GO_BACKEND_HOME_V2_READY`
- `docs/97_dashboard_home_v2_contract/10_frontend_implementation_report.md` : rapport d’implémentation réelle du frontend Home V2 et décision `GO_FRONTEND_HOME_V2_READY`
- `docs/97_dashboard_home_v2_contract/11_frontend_design_alignment_report.md` : rapport d’alignement visuel du Home V2 sur la maquette institutionnelle DG, avec shell sombre, bande KPI compacte, carte centrale et décision `GO_HOME_V2_DESIGN_ALIGNED`
- `docs/97_dashboard_home_v2_contract/12_layout_optimization_report.md` : optimisation des dimensions, proportions et règles responsive du Home V2, avec compactage sidebar/header, recentrage carte métier et décision `GO_HOME_V2_LAYOUT_OPTIMIZED`
- `docs/97_dashboard_home_v2_contract/13_ui_bugfix_and_dashboard_unification_report.md` : correction du Home V2 bloqué sur skeleton, cache local du payload, sidebar compacte sans texte déformé, shell institutionnel unifié et décision `GO_UI_HOME_V2_CONTENT_AND_LAYOUT_FIXED`
- `docs/97_dashboard_home_v2_contract/14_backend_performance_audit.md` : audit des lenteurs de `GET /api/v1/dashboard/home`, sections coûteuses, requêtes redondantes et optimisations recommandées
- `docs/97_dashboard_home_v2_contract/15_backend_performance_optimization_report.md` : optimisation réelle du backend Home V2, cache mémoire court, mutualisation des requêtes et décision `GO_BACKEND_HOME_V2_PERFORMANCE_OPTIMIZED`
- `docs/pollution_dashboard/14_runtime_stabilization`: stabilisation runtime du moteur topologique pollution
- `docs/pollution_dashboard/15_future_hydraulic_validation`: preparation documentaire de la validation hydraulique future
- `docs/IDP_POLLUTION_ANALYSIS`: pipeline DEV pollution IDP, rapports staging/QA/API et test MapLibre
- `docs/IDP_POLLUTION_ANALYSIS/40_spatial_identity_master_audit.md` a `45_spatial_identity_migration_plan.md`: gouvernance du referentiel spatial maitre pollution/qualite
- `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_outputs`: sorties CSV dry-run de resolution identitaire
- `docs/IDP_POLLUTION_ANALYSIS/46_spatial_identity_post_ddl_dev.md` a `49_spatial_identity_go_nogo_arbitrage.md`: rapports DDL DEV, chargement QA, vues de revue et GO/NOGO arbitrage
- `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_review_batches`: CSV de revue metier par lots
- `docs/IDP_POLLUTION_ANALYSIS/cartographic_review_workspace`: package QGIS/GeoPackage/GeoJSON pour arbitrage cartographique simplifie (`EXACT_0M`, `VERY_CLOSE_2M`, `DIFFERENT_OBJECT`, `ORPHAN`)
- `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_auto_validation`: previews CSV de mappings logiques source -> site maitre pour auto-validation QA-first
- `docs/IDP_POLLUTION_ANALYSIS/60_spatial_auto_validation_strategy.md` a `65_spatial_identity_auto_validation_execution_report.md`: consolidation auto-validation, vrais ambigus et GO/NOGO
- `docs/IDP_POLLUTION_ANALYSIS/final_human_review_workspace`: workspace QGIS final pour Imane, limite aux buckets `TRUE_AMBIGUOUS` et `ORPHAN_REVIEW`
- `docs/IDP_POLLUTION_ANALYSIS/66_remaining_human_review_strategy.md` a `68_remaining_review_execution_report.md`: strategie, decisions autorisees et rapport workspace final
- `docs/dashboard_metier_p0`: audit actif, architecture cible et implementation backend P0 du dashboard cartographique metier unifie
- `docs/105_ml_experiments/` : dossier officiel des expérimentations ML appliquées au SAD, incluant extraction dataset, benchmark tabulaire, analyse des limites, transition Graph Snapshot et roadmap ML
- `docs/109_validation_reseau_hydrographique/` : rapports datés d’intégration du réseau hydrographique validé métier, comparaison avant/après et recommandations de bascule runtime
- `docs/109_validation_reseau_hydrographique/05_audit_gaps_noded.md` et `06_reseau_gapfixed_consolide.md` : audit des micro-gaps, version additive gapfixed et décision de non-bascule tant qu’un gap reste en revue manuelle
- `docs/109_validation_reseau_hydrographique/07_arbitrage_gap_residuel.md` : package QGIS d’arbitrage et consigne métier pour le dernier gap résiduel
- `database/sql/109_validation_reseau_hydrographique/apply_gap_residuel_decision_20260602.sql` : script préparatoire post-arbitrage avec branches `RECONNECTER`, `IGNORER`, `CORRECTION_QGIS` et `ROLLBACK` par défaut
- `docs/109_validation_reseau_hydrographique/08_cloture_validation_hydrologique.md` : clôture officielle du chantier hydrologique, statut `VALIDE`, métriques finales et GO de préparation runtime
- `database/sql/109_validation_reseau_hydrographique/final_swap_runtime_20260602.sql` : script transactionnel final de promotion runtime, `ROLLBACK` par défaut, cible `geo_work.reseau_hydro_edges_final_candidate_20260602`
- `docs/110_preparation_moteur_propagation_pollution/00_plan_transition.md` : ouverture officielle de la phase propagation pollution, usage du réseau validé, routage aval et intégration SWAT/WASP
- `docs/110_preparation_moteur_propagation_pollution/01_architecture_mvp_propagation.md` : audit read-only pollution, inventaire stations/barrages/exutoires/sources et architecture MVP topologique sans SWAT/WASP
- `docs/110_preparation_moteur_propagation_pollution/02_implementation_backend_mvp_source_to_garde.md` : implémentation backend MVP `source -> garde`, règles d'entrée, réponse JSON, validations et limites
- `docs/110_preparation_moteur_propagation_pollution/03_snap_diagnostic_endpoint.md` : contrat et justification du diagnostic pur de snap
- `docs/110_preparation_moteur_propagation_pollution/04_plan_endpoints_cibles.md` : plan de conception des endpoints cibles propagation, avec `source-to-stations` désormais implémenté MVP
- `docs/110_preparation_moteur_propagation_pollution/05_audit_source_to_stations.md` : audit read-only de `api.v_station_dimension` pour l'endpoint stations
- `docs/110_preparation_moteur_propagation_pollution/05_implementation_source_to_stations.md` : implémentation backend MVP `source -> stations`, règles de snap source/cible, réponse et validations
- `docs/110_preparation_moteur_propagation_pollution/06_audit_source_to_barrages.md` : audit read-only de `api.v_barrage_dimension`, absence de `legacy_barrage_id=51` et rappel garde station `52`
- `docs/110_preparation_moteur_propagation_pollution/06_implementation_source_to_barrages.md` : implémentation backend MVP `source -> barrages`, distinction barrage vs garde, réponse et validations
- `docs/110_preparation_moteur_propagation_pollution/07_audit_source_to_exutoires.md` : audit read-only des noeuds finaux et règle exutoire `eout=0 AND ein>=1`
- `docs/110_preparation_moteur_propagation_pollution/07_implementation_source_to_exutoires.md` : implémentation backend MVP `source -> exutoires`, réponse et validations
- `docs/110_preparation_moteur_propagation_pollution/08_cloture_backend_mvp_v1.md` : clôture du backend MVP V1, endpoints disponibles, limites et recommandations frontend
- `docs/47_sad_dashboard_decision_first/` : stratégie de convergence décisionnelle des dashboards SAD, hiérarchie d'information, architecture cible, KPI, roadmap, estimation et GO/NOGO
- `docs/48_sad_dashboard_implementation/` : plan d'implémentation convergent par phase pour `Accueil SAD`, `Carte Métier`, `Qualité des Eaux`, `Pollution`, `Analyses`, `Expert` et `Administration`, avec backlog P0/P1/P2, risques et décision finale `GO_IMPLEMENTATION_DECISION_FIRST_SAD`
- `docs/49_kpi_engine/` : documentation Sprint 1.5 du `KPI Engine`, `Alert Engine`, `Recommendation Engine`, catalogue KPI, plan d'intégration frontend et décision `GO_SPRINT_1_5_KPI_AND_ALERT_ENGINE`
- `backend/app/services/propagation/propagation_pollution_service.py` : service dédié de propagation topologique MVP sur le réseau candidat final validé
- `backend/app/services/kpi/engine.py` : moteur backend des KPI décisionnels DG/métier
- `backend/app/services/alerts/engine.py` : moteur backend des alertes métier
- `backend/app/services/recommendations/engine.py` : moteur backend des recommandations actionnables
- `backend/app/services/dashboard/home_service.py` : agrégateur backend du Home opérationnel V2, réutilisant KPI/alertes/recommandations et les sources métier barrage/hydro/pluie/qualité
- `backend/app/services/dashboard/home_service.py` : inclut désormais un cache mémoire court configurable par `SAD_DASHBOARD_HOME_CACHE_SECONDS` et une mutualisation interne des dates/counts du Home V2
- `backend/app/api/v1/propagation.py` : endpoints `GET /api/v1/propagation/source-to-garde`, `snap-diagnostic`, `source-to-stations`, `source-to-barrages` et `source-to-exutoires`
- `backend/app/api/v1/kpi.py` : endpoints `GET /api/v1/kpi/overview`, `stations`, `subbasins`, `pollution`
- `backend/app/api/v1/recommendations.py` : endpoint `GET /api/v1/recommendations`
- `backend/app/api/v1/dashboard.py` : endpoint `GET /api/v1/dashboard/home`
- `backend/tests/test_dashboard_home_v2.py` : tests backend du contrat Home V2
- `backend/tests/test_propagation_mvp.py` : tests backend du MVP propagation pollution
- `frontend/src/pages/AccueilSadPage.tsx` : nouvel accueil décisionnel DG/métier avec KPI, alertes, pollutions prioritaires et recommandations
- `frontend/src/pages/DashboardHomeV2.tsx` : Home opérationnel V2 centré supervision bassin, carte métier, alertes, actions, tendances et KPI DG secondaires
- `frontend/src/api/dashboardHome.ts` et `frontend/src/hooks/useDashboardHome.ts` : client et hook React Query du endpoint `GET /api/v1/dashboard/home`
- `frontend/src/components/home-v2/*` : composants UI du Home V2 (`HeroSection`, `OperationalMap`, `BasinStatus`, `AlertsPanel`, `RecommendedActionsPanel`, `TrendPanel`, `SecondaryKpiPanel`, `DataFreshnessBadge`, `LayerSummary`)
- `frontend/src/api/propagation.ts` et `frontend/src/hooks/usePropagation.ts` : clients frontend des endpoints propagation MVP V1 existants
- `frontend/src/api/decisionIntelligence.ts` et `frontend/src/hooks/useDecisionIntelligence.ts` : clients frontend des endpoints KPI, alertes et recommandations
- `frontend/src/components/decision-first/*` : composants UI de la nouvelle couche décisionnelle Sprint 1
- `frontend/src/components/DashboardMetier/PanneauActionMetier.tsx` : panneau métier décisionnel pour `/dashboard-carto-metier`
- `frontend/src/components/quality-regulatory/QualityAlertCenter.tsx` : centre d'alertes décisionnel de l'écran qualité
- `database/idp_pollution`: SQL executables/propositionnels du pipeline IDP pollution
- `database/sql/109_validation_reseau_hydrographique/`: scripts préparatoires transactionnels pour validation et bascule contrôlée du réseau hydrographique validé métier
- `database/idp_pollution/25_create_site_object_mapping.sql` et `26_create_final_spatial_identity_views.sql`: modele propositionnel site physique -> objets metier lies
- `scripts/idp_pollution`: scripts reproductibles import staging, consolidation, profiling IDP pollution et resolution dry-run d'identite spatiale
- `scripts/idp_pollution/auto_validate_exact_0m.py` et `auto_validate_very_close_2m.py`: generation dry-run des mappings auto-validables sans fusion destructive

## Règle d’usage documentaire

- lire d’abord `docs/00_source_of_truth/00_documents_prioritaires.md`
- puis les cinq documents maîtres de gouvernance et `docs/00_SOURCE_OF_TRUTH_MASTER.md`
- utiliser `docs/01_project_reference/SOURCE_OF_TRUTH.md` pour la matrice des vérités documentaires techniques
- consulter `docs/00_source_of_truth/01_source_of_truth_consolidee.md` pour l'état consolidé 2026-05-22
- consulter `docs/90_reorganisation_documentaire_finale/17_execution_deplacement_lot_a.md` pour retrouver les anciens fichiers racine déplacés
- utiliser `docs/03_ai_knowledge_base/*` comme aide rapide, pas comme vérité concurrente
- ne consulter `docs/99_legacy_archive/*` qu’en cas de besoin explicite de traçabilité

## Dockerisation locale simple

Mise à jour 2026-06-02 :

- `docker-compose.yml` : orchestration locale simple `sad-db` + `sad-backend` + `sad-frontend`
- `backend/Dockerfile` : image FastAPI avec dépendances Python et bibliothèques géospatiales système
- `frontend/Dockerfile` : image Vite React en mode développement
- `.env.docker.example` : variables d'environnement Docker sans secret réel
- `docs/dockerisation_sad/` : audit, guide de lancement Windows/WSL, commandes utiles et dépannage
- `database/docker_init/` : scripts SQL proposés, non destructifs et non exécutés automatiquement, pour initialiser la base Docker par niveaux
- `scripts/test_docker_api.ps1` : script PowerShell de validation rapide des endpoints Docker
- `docs/dockerisation_sad/05_audit_objets_sql_attendus.md` à `09_plan_tests_api_docker.md` : audit SQL backend, audit base Docker, matrice de tests, stratégie d'initialisation et plan de tests
- `docs/dockerisation_sad/11_connexion_backend_docker_postgresql_local.md` : mode recommandé `sad-backend` Docker vers PostgreSQL local Windows `abh_sad` via `host.docker.internal`

## Dashboard qualité réglementaire P0

- `frontend/src/pages/DashboardQualiteReglementaire.tsx`: dashboard métier qualité réglementaire P0 sur `/dashboard-qualite-reglementaire`
- `frontend/src/api/qualityRegulatory.ts` et `frontend/src/hooks/useQualityRegulatory.ts`: client et hooks des endpoints `/api/v1/quality/*`
- `frontend/src/components/quality-regulatory`: composants réglementaires isolés header, KPI, stations, historique, paramètres et statuts
- `docs/45_dashboard_quality_regulatory`: audit, architecture, tests et GO/NOGO du dashboard qualité P0

## Validation hydrologique clôturée

Mise à jour 2026-06-02 :

- réseau candidat final validé : `geo_work.reseau_hydro_edges_final_candidate_20260602`
- nœuds runtime candidats : `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`
- couche de diagnostic : `geo_work.reseau_hydro_nodes_final_candidate_20260602`
- cible garde validée : station `legacy_station_id = 52` / `brg de garde / sebou`
- métriques finales : `746` segments, `3,994,886.25 m`, `7` composantes, `0` intersection `ST_Crosses`, `0` gap candidat `< 50 m`
