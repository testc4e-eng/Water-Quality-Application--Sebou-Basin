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
- `database/idp_pollution`: SQL executables/propositionnels du pipeline IDP pollution
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

## Dashboard qualité réglementaire P0

- `frontend/src/pages/DashboardQualiteReglementaire.tsx`: dashboard métier qualité réglementaire P0 sur `/dashboard-qualite-reglementaire`
- `frontend/src/api/qualityRegulatory.ts` et `frontend/src/hooks/useQualityRegulatory.ts`: client et hooks des endpoints `/api/v1/quality/*`
- `frontend/src/components/quality-regulatory`: composants réglementaires isolés header, KPI, stations, historique, paramètres et statuts
- `docs/45_dashboard_quality_regulatory`: audit, architecture, tests et GO/NOGO du dashboard qualité P0
