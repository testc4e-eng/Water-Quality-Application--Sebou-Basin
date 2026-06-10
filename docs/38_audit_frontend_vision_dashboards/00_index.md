# Audit Frontend SAD Sebou / WQDSS

## Contexte

Ce dossier consolide l'audit frontend demandé pour vérifier l'alignement entre :

- la vision finale `DECISION_FIRST / DG_FIRST / METIER_FIRST` ;
- les modules réellement visibles dans le frontend ;
- les APIs réellement montées dans le backend ;
- l'état réel des données et des modèles ;
- les attentes DG et métier portées par la documentation maîtresse.

## Sources autoritaires utilisées

- `docs/00_source_of_truth/00_documents_prioritaires.md`
- `docs/00_source_of_truth/01_source_of_truth_consolidee.md`
- `docs/04_etat_avancement/00_project_global_status.md`
- `docs/01_contexte_projet/01_mvp_scope.md`
- `docs/05_blocages_et_risques/00_problemes_racines.md`
- `docs/02_gouvernance_et_decisions/00_registre_decisions.md`
- `docs/07_donnees_et_referentiels/00_data_landscape.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
- `docs/03_ai_knowledge_base/project_structure_for_agents.md`
- `docs/34_synthese_strategique_anomalies/*`
- `docs/35_donnees_problematiques_par_bloc/*`
- `docs/36_nettoyage_idp_2024_securise/*`
- `docs/92_referentiel_reglementaire_qualite_SAD/*`
- `docs/96_catalogue_metier_donnees_affichage/*`
- `docs/pollution_dashboard/*`
- `docs/47_sad_dashboard_decision_first/*`
- `docs/48_sad_dashboard_implementation/*`
- `docs/95_dashboard_decisionnel_abh/*`

## Contraintes structurantes retenues

- Le SAD doit être organisé autour de 7 espaces : `Accueil SAD`, `Qualité des Eaux`, `Carte Métier`, `Pollution`, `Analyses`, `Expert`, `Administration`.
- Les dashboards doivent présenter la décision avant les détails techniques.
- Les modules `SWAT` et `WASP` sont des dépendances métier externes, non des modules décisionnels finalisés.
- Le routage pollution est `topologique visuel`, pas hydraulique scientifique.
- Le référentiel réglementaire qualité est `DEV_PARTIAL` : DDL appliqué en DEV, chargement et validation métier encore à sécuriser.
- Le module `114_data_admin_ingestion` est la cible officielle d'administration et de gouvernance des données.
- Les écrans legacy restent présents mais ne constituent pas la cible UX finale.

## Livrables

1. `01_audit_frontend_vs_vision_finale.md`
2. `02_matrice_modules_frontend_backend_data.md`
3. `03_manques_incoherences_frontend.md`
4. `04_plan_dashboards_modules_finalises.md`
5. `05_plan_dashboards_modules_en_construction.md`
6. `06_tests_connexion_api_frontend.md`
7. `07_audit_ux_dg_metier.md`
8. `08_roadmap_implementation_dashboards.md`
9. `09_support_restitution_dg_metier.md`

## Périmètre analysé

- Frontend React : pages, composants, hooks, clients API, navigation.
- Backend FastAPI : routeurs montés `/api/v1`, services métier exposés, endpoints optionnels.
- Documentation projet : vision cible, statut réel, périmètre MVP, modèles, qualité réglementaire, pollution, gouvernance data.

## Règle de lecture

- `fait existant` : visible dans le code et corroboré par la documentation.
- `manque` : attendu par la vision ou le périmètre, mais absent du frontend.
- `incohérence` : présent mais mal aligné avec la vision, les données ou le backend réel.
- `module à venir` : documenté ou anticipé, mais non prêt à être présenté comme opérationnel.

## Résumé exécutif

- Nombre de modules fonctionnels analysés : `12`
- Dashboards modules finalisés à industrialiser : `4`
- Ecrans modules en construction à encadrer : `4`
- Modules transverses à clarifier : `Accueil DG`, `Stations`, `Barrages`, `Reporting`

## Note documentaire

La création de ce dossier introduit une nouvelle branche documentaire active. Si ce dossier devient une référence durable, `docs/03_ai_knowledge_base/project_structure_for_agents.md` devra être enrichi lors de la prochaine synchronisation documentaire.
