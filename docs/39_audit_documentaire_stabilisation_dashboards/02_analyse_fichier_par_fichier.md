# Analyse fichier par fichier

## Méthode

Le tableau ci-dessous couvre :

- les documents explicitement imposés ;
- les documents dashboards/API/ingestion/cartographie les plus structurants pour la phase actuelle ;
- les dossiers anomalies comme historique clôturé.

Colonnes :

- `Statut` : `actif`, `clôturé`, `obsolète`, `à archiver`, `à mettre à jour`
- `Ce que le fichier dit` : thèmes réellement portés par le document
- `Décision` : `conserver`, `déplacer en archive`, `mettre à jour`, `référencer comme historique`

## 1. Documents maîtres

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/README.md` | portail du projet | actif | dashboards, backend, frontend, API, exécution locale | point d'entrée global | ne porte pas encore assez la phase stabilisation dashboards | mettre à jour |
| `docs/00_SOURCE_OF_TRUTH_MASTER.md` | vérité consolidée projet | actif | architecture, DB, frontend, backend, APIs, pollution, préprod, blocages | document maître numéro 1 | surpondère encore des résidus anomalies/IDP dans certains passages | mettre à jour |

## 2. `03_ai_knowledge_base`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/03_ai_knowledge_base/AGENT_RULES.md` | règles de travail agents | actif | backend, frontend, priorités agent, garde-fous | très utile | pas centré explicitement sur la stabilisation dashboards | mettre à jour |
| `docs/03_ai_knowledge_base/api_for_agents.md` | synthèse API réelle | actif | endpoints, dashboards, pollution, qualité, home, data-admin | critique pour contrats API | ne reflète pas encore clairement `pollution_campagnes` déjà présent | mettre à jour |
| `docs/03_ai_knowledge_base/architecture_for_agents.md` | synthèse architecture réelle | actif | frontend, backend, dashboards, home, qualité, pollution, carte, admin | critique pour repositionnement | mélange actif et historique sans hiérarchie assez nette | mettre à jour |
| `docs/03_ai_knowledge_base/code_standards_for_agents.md` | standards code | actif | backend, frontend, SIG | utile pour corrections futures | pas document de phase | conserver |
| `docs/03_ai_knowledge_base/database_for_agents.md` | orientation BD rapide | à mettre à jour | base, schémas, points d'entrée | utile en appui | version datée 2026-04-10, trop générique | mettre à jour |
| `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md` | synthèse DB détaillée | actif | schémas, cardinalités, pollution, data_admin, runtime topo | utile pour pollution et ingestion | moins utile pour bugs UI purs | conserver |
| `docs/03_ai_knowledge_base/dependencies_for_agents.md` | dépendances projet | actif | backend, frontend, libs | utile pour diagnostic env | périphérique à la phase | conserver |
| `docs/03_ai_knowledge_base/deployment_for_agents.md` | déploiement / docker | actif | déploiement, URLs, chaîne locale | utile pour vérifier runtime | secondaire tant qu'on reste en audit doc | conserver |
| `docs/03_ai_knowledge_base/environments_for_agents.md` | variables et env | actif | backend, frontend, URLs, variables | utile pour bugs front/back | peu métier | conserver |
| `docs/03_ai_knowledge_base/MEMORY_CORE.md` | mémoire centrale agents | actif | mission, modules critiques, pollution, IA, chemin critique | utile pour recalage rapide | doit être recentré sur stabilisation dashboards | mettre à jour |
| `docs/03_ai_knowledge_base/project_structure_for_agents.md` | cartographie du repo | actif | emplacements code/doc/dashboard/API | très utile | n'intègre pas assez le statut réel de certains chantiers | mettre à jour |
| `docs/03_ai_knowledge_base/QUICK_REFERENCE.md` | aide rapide | actif | commandes, docs à ouvrir, repères back/front | utile | n'oriente pas vers la phase active corrigée | mettre à jour |
| `docs/03_ai_knowledge_base/testing_quick_reference.md` | guide tests | actif | tests backend/frontend | utile pour stabilisation | trop générique, peu spécifique dashboard par dashboard | mettre à jour |
| `docs/03_ai_knowledge_base/troubleshooting_for_agents.md` | aide diagnostic | actif | API, frontend vide, carte vide, qualité vide | utile pour incidents | devrait intégrer Home V2 et pollution campagnes | mettre à jour |
| `docs/03_ai_knowledge_base/workflows_for_agents.md` | workflows métiers | actif | carto, hydro, qualité, SWAT, data management | utile comme vue d'ensemble | ne couvre pas assez Home V2 et déclaration pollution | mettre à jour |

## 3. `33_annexes_anomalies_detaillees`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/33_annexes_anomalies_detaillees/00_index.md` | index anomalies détaillées | à archiver | anomalies historiques | preuve de contexte | contredit la phase si lu comme backlog actif | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A01_parametres_non_standardises.md` | anomalie paramètres | clôturé | données métier, paramètres, mapping | utile pour matrice métier historique | plus un chantier actif | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A02_parametres_ambigus_HG_sat.md` | anomalie paramètres ambigus | clôturé | qualité, paramètres, sens métier | utile pour compréhension qualité | plus prioritaire | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A03_incoherence_valeurs_qualite.md` | anomalie valeurs qualité | clôturé | qualité, données, QA | utile comme mémoire | ne doit plus piloter le projet | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A04_doublons_stations_barrages.md` | anomalie doublons référentiels | clôturé | données, référentiels, géo | utile pour carte métier historique | plus phase active | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A05_absence_referentiel_rejets.md` | anomalie rejets | clôturé | pollution, référentiels, rejets | utile pour déclaration pollution | n'est plus backlog principal | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A06_fragmentation_donnees_IDP.md` | anomalie fragmentation IDP | clôturé | pollution, IDP, sources | utile pour pollution déclarée | ne pas rouvrir comme chantier central | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A07_sources_pollution_non_rattachees.md` | anomalie rattachement pollution | clôturé | pollution, sources, rattachement | utile pour workflow déclaration | plus phase active | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A08_donnees_qualite_null.md` | anomalie null qualité | clôturé | qualité, données | utile comme garde-fou métier | non prioritaire | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A09_donnees_meteo_manquantes.md` | anomalie météo | clôturé | météo, données | faible utilité actuelle | sans lien direct dashboards actifs | déplacer en archive |
| `docs/33_annexes_anomalies_detaillees/A10_temperature_non_disponible.md` | archive résolue | obsolète | archive d'anomalie résolue | preuve de résolution | explicitement archive | déplacer en archive |
| `docs/33_annexes_anomalies_detaillees/A11_incoherence_noms_unites.md` | anomalie noms/unités | clôturé | données métier, unités | utile pour matrice future | plus prioritaire | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A12_incoherence_sources_donnees.md` | anomalie sources | clôturé | données, sources, cohérence | utile pour déclaration pollution | ne doit plus être phase active | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A13_parametres_non_mappes.md` | anomalie paramètres non mappés | clôturé | qualité, pollution, mapping | utile pour matrice métier | clôturé | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A14_donnees_extremes_aberrantes.md` | anomalie extrêmes | clôturé | données, QA | faible utilité opérationnelle immédiate | plus un sujet central | référencer comme historique |
| `docs/33_annexes_anomalies_detaillees/A15_structuration_donnees_non_unifiee.md` | anomalie structuration | clôturé | structuration données, sources | utile pour future gouvernance | plus phase active | référencer comme historique |

## 4. `34_synthese_strategique_anomalies`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/34_synthese_strategique_anomalies/00_vue_globale.md` | synthèse globale anomalies | à archiver | vue stratégique anomalies | utile pour histoire du projet | contredit le cadrage actuel si utilisé comme cockpit | référencer comme historique |
| `docs/34_synthese_strategique_anomalies/01_bloc_parametres.md` | bloc paramètres | clôturé | paramètres métier, arbitrages | utile pour matrice | non prioritaire | référencer comme historique |
| `docs/34_synthese_strategique_anomalies/02_bloc_pollution.md` | bloc pollution | clôturé | pollution, sources, rejets | utile pour déclaration pollution | ne doit plus être plan actif | référencer comme historique |
| `docs/34_synthese_strategique_anomalies/03_bloc_donnees.md` | bloc données | clôturé | données et manques | utile pour expliquer dette historique | plus phase active | référencer comme historique |
| `docs/34_synthese_strategique_anomalies/04_bloc_referentiels.md` | bloc référentiels | clôturé | référentiels, doublons | utile pour carte métier historique | non prioritaire | référencer comme historique |
| `docs/34_synthese_strategique_anomalies/05_plan_decision_metier.md` | plan de réunion ancienne | clôturé | décisions métier anomalies | historique seulement | ne doit plus piloter l'équipe | déplacer en archive |

## 5. `35_donnees_problematiques_par_bloc`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/35_donnees_problematiques_par_bloc/00_index.md` | index bloc problématiques | à archiver | données à problème historiques | mémoire technique | contredit phase active si pris comme backlog | référencer comme historique |
| `docs/35_donnees_problematiques_par_bloc/01_donnees_problematiques_parametres.md` | bloc paramètres | clôturé | paramètres, unités, mapping | utile pour matrice future | non prioritaire | référencer comme historique |
| `docs/35_donnees_problematiques_par_bloc/02_donnees_problematiques_pollution.md` | bloc pollution | clôturé | pollution, rejets, IDP, mapping | utile pour déclaration pollution | plus phase active | référencer comme historique |
| `docs/35_donnees_problematiques_par_bloc/03_donnees_problematiques_donnees.md` | bloc données | clôturé | données manquantes/extremes | faible utilité directe UI | non prioritaire | référencer comme historique |
| `docs/35_donnees_problematiques_par_bloc/04_donnees_problematiques_referentiels.md` | bloc référentiels | clôturé | référentiels, entités | utile carte métier historique | non prioritaire | référencer comme historique |
| `docs/35_donnees_problematiques_par_bloc/05_tableau_global_entites_problematiques.md` | entités critiques historiques | clôturé | pollution, référentiels, entités | utile en mémoire | n'est plus cockpit actif | référencer comme historique |
| `docs/35_donnees_problematiques_par_bloc/06_requetes_sql_diagnostic_readonly.md` | SQL diagnostic historique | clôturé | requêtes audit | utile seulement en preuve | hors phase dashboard | déplacer en archive |
| `docs/35_donnees_problematiques_par_bloc/07_limites_et_points_a_verifier.md` | limites audit historique | clôturé | limites et vérifs | utile comme prudence historique | non prioritaire | référencer comme historique |

## 6. `36_nettoyage_idp_2024_securise`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/36_nettoyage_idp_2024_securise/00_index.md` | index nettoyage IDP | à archiver | IDP, doublons, paramètres, sources | utile pour pollution déclarée historique | ne doit plus être phase active | référencer comme historique |
| `docs/36_nettoyage_idp_2024_securise/01_audit_tables_idp.md` | audit tables IDP | clôturé | tables sources pollution/qualité | utile pour comprendre héritage | non prioritaire | référencer comme historique |
| `docs/36_nettoyage_idp_2024_securise/02_conflits_et_doublons_idp.md` | conflits et doublons | clôturé | pollution, doublons, marché cadre | utile pour contexte IDP | ne pas rouvrir comme backlog | référencer comme historique |
| `docs/36_nettoyage_idp_2024_securise/03_parametres_idp_problematiques.md` | paramètres IDP | clôturé | paramètres pollution, unités, valeurs | utile pour future matrice | non prioritaire | référencer comme historique |
| `docs/36_nettoyage_idp_2024_securise/04_sources_pollution_idp_problematiques.md` | sources/rejets à risque | clôturé | pollution, sources, workflow métier | encore utile pour déclaration pollution | plus phase active | référencer comme historique |
| `docs/36_nettoyage_idp_2024_securise/05_comparaison_globale_vs_marche_cadre.md` | comparaison jeux IDP | clôturé | sources pollution, qualité, marché cadre | utile en arrière-plan | historique | référencer comme historique |
| `docs/36_nettoyage_idp_2024_securise/06_plan_nettoyage_securise.md` | plan de nettoyage ancien | clôturé | plan de remédiation IDP | faible utilité actuelle | contredit la phase si lu comme action courante | déplacer en archive |
| `docs/36_nettoyage_idp_2024_securise/10_points_validation_metier.md` | points de validation IDP | clôturé | validation métier IDP | utile comme preuve | plus prioritaire | référencer comme historique |

## 7. Dashboard qualité

### `45_dashboard_quality_regulatory`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/45_dashboard_quality_regulatory/00_audit_implementation.md` | audit implémentation P0 | actif | backend, frontend, APIs, règles qualité | utile pour stabilisation | aucun majeur | conserver |
| `docs/45_dashboard_quality_regulatory/01_architecture.md` | architecture écran qualité | actif | frontend, backend, APIs, composants | utile | peut nécessiter alignement runtime actuel | conserver |
| `docs/45_dashboard_quality_regulatory/02_api_consumption.md` | endpoints consommés | actif | contrat API qualité | très utile | none | conserver |
| `docs/45_dashboard_quality_regulatory/03_components.md` | composants frontend | actif | frontend, structure écran | utile | secondaire par rapport au contrat | conserver |
| `docs/45_dashboard_quality_regulatory/04_test_report.md` | rapport de tests | actif | build, APIs, navigateur | utile pour stabilisation | daté, à rejouer si régression | conserver |
| `docs/45_dashboard_quality_regulatory/05_go_nogo.md` | décision go/no-go | actif | état fonctionnel, limites P0 | utile | doit être revalidé si périmètre change | conserver |

### `46_refonte_dashboard_qualite_metier`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/46_refonte_dashboard_qualite_metier/00_index.md` | index refonte qualité | à mettre à jour | onglets, API, limites, décisions | utile comme historique | ne montre pas clairement le statut historique | mettre à jour |
| `docs/46_refonte_dashboard_qualite_metier/01_onglets_connectes.md` | onglets reliés | à mettre à jour | frontend, tabs, parcours qualité | utile pour écrans hérités | partiellement supersédé par écran P0 | référencer comme historique |
| `docs/46_refonte_dashboard_qualite_metier/02_sources_api.md` | sources API qualité | actif | APIs, backend, qualité | utile | coexistence legacy/P0 à clarifier | mettre à jour |
| `docs/46_refonte_dashboard_qualite_metier/03_limites_indicateurs.md` | limites indicateurs | actif | limitations métier/techniques qualité | utile | datation à préciser | conserver |
| `docs/46_refonte_dashboard_qualite_metier/04_tests_frontend_api.md` | tests front/API | actif | frontend, backend, qualité | utile | doit être rapproché du runtime réel | conserver |
| `docs/46_refonte_dashboard_qualite_metier/05_decisions_restantes.md` | décisions restantes | à mettre à jour | arbitrages qualité | utile partiellement | certaines décisions peuvent être déjà dépassées | mettre à jour |
| `docs/46_refonte_dashboard_qualite_metier/06_referentiel_parametres_seuils.md` | mapping paramètres/seuils | actif | qualité, endpoints, matching, statuts | très utile | aucun majeur | conserver |
| `docs/46_refonte_dashboard_qualite_metier/07_perspectives_classification_reglementaire.md` | perspective V2 | à mettre à jour | qualité, classification future | utile pour roadmap | document de projection, pas phase active pure | référencer comme historique |

## 8. Carte métier et matrices

### `48_sprint0_audit_sources_carte_metier`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/48_sprint0_audit_sources_carte_metier/00_index.md` | index sprint 0 | actif | matrices/supports/sources | utile pour nouvelle matrice | sprint terminé | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/01_inventaire_supports.md` | inventaire supports | actif | carte métier, support spatial | utile | historique mais encore structurant | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/02_inventaire_domaines_parametres.md` | inventaire domaines | actif | données métier, paramètres | utile | none | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/03_matrice_availability_cible.md` | matrice disponibilité | actif | matrice, frontend, API | très utile | datation à vérifier | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/04_matrice_features_cible.md` | matrice features | actif | matrice métier, affichage | très utile | none | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/05_matrice_series_cible.md` | matrice séries | actif | timeseries, APIs, carte | très utile | none | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/06_droits_acces_bassin.md` | droits accès | actif | rôles, données | utile | secondaire à ce stade | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/07_seuils_reglementaires_cartographie.md` | seuils carto | actif | qualité, pollution, classification | utile | none | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/08_risques_architecture.md` | risques archi | actif | backend, frontend, API | utile | historique mais encore pertinent | conserver |
| `docs/48_sprint0_audit_sources_carte_metier/10_recommandations_sprint0.md` | reco sprint0 | à mettre à jour | recommandations d'implémentation | utile comme fondation | sprint terminé, à reclasser | référencer comme historique |

### `50_sprint1_5_carte_metier_ux_fonctionnelle`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/00_index.md` | index sprint 1.5 | actif | UX carte métier | utile | sprint passé | référencer comme historique |
| `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/00_plan_consolide_v1.md` | plan consolidé | actif | frontend, backend, UX | utile | historique de sprint | référencer comme historique |
| `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/01_corrections_filtres_features.md` | correctifs filtres/features | actif | frontend, API, carte | utile pour bugs carte | none | conserver |
| `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/02_popup_et_panneau_analyse.md` | popup/panneau | actif | frontend carte | utile | none | conserver |
| `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/03_symbologie_et_controles_carte.md` | symbologie | actif | carte, légende, contrôles | utile | none | conserver |
| `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/04_tests_api_frontend.md` | tests API/front | actif | carte, API, build | utile | none | conserver |
| `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/05_limites_restantes.md` | limites connues | actif | bugs/limites carte | utile | none | conserver |

### `55_assainissement_donnees_carte_metier`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/55_assainissement_donnees_carte_metier/00_index.md` | index assainissement carte | actif | données, API, frontend | utile | chantier sprint terminé | conserver |
| `docs/55_assainissement_donnees_carte_metier/01_separation_timeseries_vs_ponctuel.md` | séparation séries/ponctuel | actif | données métier, affichage | très utile | none | conserver |
| `docs/55_assainissement_donnees_carte_metier/02_separation_qualite_abh_vs_pollution_idp.md` | séparation qualité/pollution | actif | pollution, qualité, carte | très utile | none | conserver |
| `docs/55_assainissement_donnees_carte_metier/03_regles_classification_data_temporality.md` | règles temporality | actif | contrat données, affichage | utile | none | conserver |
| `docs/55_assainissement_donnees_carte_metier/04_impacts_backend_views_api.md` | impacts backend/API | actif | backend, vues, API | utile | none | conserver |
| `docs/55_assainissement_donnees_carte_metier/05_impacts_frontend_workspace.md` | impacts frontend | actif | frontend, workspace | utile | none | conserver |
| `docs/55_assainissement_donnees_carte_metier/06_tests_validation.md` | tests validation | actif | API/front/data | utile | none | conserver |
| `docs/55_assainissement_donnees_carte_metier/07_limites_et_arbitrages.md` | limites/arbitrages | actif | limites data/carto | utile | arbitrages anciens clos à distinguer | mettre à jour |
| `docs/55_assainissement_donnees_carte_metier/08_validation_metier.md` | validation métier | actif | métier, sources, qualité/pollution | utile | none | conserver |
| `docs/55_assainissement_donnees_carte_metier/09_cloture_sprint_2_checklist_e2e.md` | clôture sprint 2 | clôturé | frontend, backend, doc, robustesse | preuve de fermeture | sprint clos | référencer comme historique |

### `96_catalogue_metier_donnees_affichage`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/96_catalogue_metier_donnees_affichage/00_index.md` | index catalogue métier | actif | catalogue affichage | utile | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/01_catalogue_global_parametres.md` | catalogue paramètres | actif | données métier, paramètres | très utile pour matrice | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/02_catalogue_campagnes.md` | catalogue campagnes | actif | campagnes, pollution, affichage | très utile pour déclaration pollution | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/03_catalogue_supports.md` | catalogue supports | actif | carte, entités, supports | très utile | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/04_catalogue_sources_tables.md` | sources/tables | actif | backend, tables, vues, sources | très utile | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/05_catalogue_vues_api.md` | vues API | actif | API, contrats de restitution | très utile | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/06_regles_affichage_metier.md` | règles affichage | actif | frontend, filtres, statuts | très utile | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/07_priorisation_decisionnelle.md` | priorisation vue | actif | priorités d'affichage | utile | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/08_historique_vs_recent.md` | historique vs récent | actif | temporalité affichage | utile | none | conserver |
| `docs/96_catalogue_metier_donnees_affichage/09_checklist_validation_metier_finale.md` | checklist métier | actif | validation métier | utile | none | conserver |

## 9. Transition API / frontend

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/94_api_frontend_transition/01_audit_backend_fastapi.md` | audit backend initial | à mettre à jour | backend, API | utile en fondation | ancien contexte | référencer comme historique |
| `docs/94_api_frontend_transition/02_architecture_fastapi_cible.md` | architecture cible API | à mettre à jour | backend, API | utile | partiellement absorbé par le code | référencer comme historique |
| `docs/94_api_frontend_transition/03_mapping_endpoints_vues.md` | mapping endpoints/vues | actif | API, vues SQL | utile pour contrats | vérifier actualisation | conserver |
| `docs/94_api_frontend_transition/04_standard_api_response.md` | réponse standard | actif | contrat API, frontend typing | très utile | none | conserver |
| `docs/94_api_frontend_transition/05_audit_frontend_react.md` | audit front initial | à mettre à jour | frontend, dette | utile | ancien contexte | référencer comme historique |
| `docs/94_api_frontend_transition/06_architecture_frontend_cible.md` | archi frontend cible | à mettre à jour | frontend, composants | utile | partiellement dépassé | référencer comme historique |
| `docs/94_api_frontend_transition/07_ecrans_frontend_cibles.md` | écrans cibles | à mettre à jour | dashboards cibles | utile | certaines routes déjà réalisées | mettre à jour |
| `docs/94_api_frontend_transition/08_plan_migration_progressive.md` | plan migration | clôturé | stratégie progressive | utile comme trace | plus phase active | référencer comme historique |
| `docs/94_api_frontend_transition/09_priorisation_implementation.md` | priorisation ancienne | clôturé | ordre d'implémentation | utile en historique | dépassé par la phase actuelle | référencer comme historique |
| `docs/94_api_frontend_transition/10_recommandation_api_frontend.md` | recommandation finale initiale | à mettre à jour | API/Frontend, P0 qualité | utile | `FRONTEND_HOLD` n'est plus le bon cadrage global | mettre à jour |
| `docs/94_api_frontend_transition/backend_p0/00_index.md` | index backend P0 | clôturé | backend spécialisé qualité | preuve de démarrage | historique | référencer comme historique |
| `docs/94_api_frontend_transition/backend_p0/01_implementation_backend_p0.md` | implémentation P0 | clôturé | backend, endpoints créés | utile en preuve | historique | référencer comme historique |
| `docs/94_api_frontend_transition/backend_p0/05_backlog_backend_p1.md` | backlog P1 ancien | clôturé | backlog backend | historique | plus prioritaire | déplacer en archive |
| `docs/94_api_frontend_transition/frontend_pilote_metaux/00_index.md` | pilote métaux | clôturé | frontend pilote qualité | utile en preuve | historique | référencer comme historique |
| `docs/94_api_frontend_transition/observatory_menu_v2/00_index.md` | observatoire V2 | clôturé | menu observatoire | utile comme héritage UX | plus chantier principal | référencer comme historique |
| `docs/94_api_frontend_transition/runtime_fix_swat/00_index.md` | fix runtime SWAT | clôturé | stabilité backend globale | utile pour dette legacy | hors phase dashboard active | référencer comme historique |

## 10. Dashboard décisionnel ABH et dashboard opérationnel

### `95_dashboard_decisionnel_abh`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/95_dashboard_decisionnel_abh/00_index.md` | index vision ABH | clôturé | vision dashboard test | utile comme précurseur | plus cockpit actif | référencer comme historique |
| `docs/95_dashboard_decisionnel_abh/01_vision_metier_carto_decisionnelle.md` | vision métier | clôturé | besoins décisionnels, carte | utile | supersédé par Home/Carte métier | référencer comme historique |
| `docs/95_dashboard_decisionnel_abh/02_typologie_donnees_et_fraicheur.md` | typologie/fraîcheur | actif | temporalité et fraîcheur | utile pour dashboards | none | conserver |
| `docs/95_dashboard_decisionnel_abh/03_organisation_par_campagne.md` | organisation campagnes | actif | campagnes, affichage | utile pour déclaration pollution | none | conserver |
| `docs/95_dashboard_decisionnel_abh/04_organisation_par_support_spatial.md` | organisation spatiale | actif | support spatial, carte | utile | none | conserver |
| `docs/95_dashboard_decisionnel_abh/05_modes_affichage_carte_tableau_graphique.md` | modes d'affichage | actif | frontend UX | utile | none | conserver |
| `docs/95_dashboard_decisionnel_abh/06_regles_performance_et_lazy_loading.md` | perf/lazy loading | actif | frontend, performance | utile | none | conserver |
| `docs/95_dashboard_decisionnel_abh/07_personas_et_besoins_abh.md` | personas | actif | métier, rôles | utile | none | conserver |
| `docs/95_dashboard_decisionnel_abh/08_spec_dashboard_test.md` | spec dashboard test | clôturé | écran test | utile en preuve | historique | référencer comme historique |
| `docs/95_dashboard_decisionnel_abh/09_checklist_validation_metier.md` | checklist métier | actif | validation métier | utile | none | conserver |
| `docs/95_dashboard_decisionnel_abh/10_backlog_evolution_dashboard_decisionnel.md` | backlog évolution | à mettre à jour | backlog dashboard | utile partiellement | doit être réaligné sur phase actuelle | mettre à jour |

### `96_dashboard_operationnel`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/96_dashboard_operationnel/00_vision_globale.md` | vision dashboard opérationnel | actif | home, supervision, métier | utile | aucun | conserver |
| `docs/96_dashboard_operationnel/01_architecture_metier.md` | architecture métier | actif | métier, usages home | utile | aucun | conserver |
| `docs/96_dashboard_operationnel/02_architecture_donnees.md` | architecture données | actif | données, APIs, sources | utile | aucun | conserver |
| `docs/96_dashboard_operationnel/03_architecture_dashboard.md` | architecture UI | actif | frontend, layout, blocs | utile | aucun | conserver |
| `docs/96_dashboard_operationnel/04_kpi_operationnels.md` | KPI opérationnels | actif | KPI, home, DG | utile | aucun | conserver |
| `docs/96_dashboard_operationnel/05_alertes_operationnelles.md` | alertes | actif | alertes, home, backend | très utile | aucun | conserver |
| `docs/96_dashboard_operationnel/06_previsions_et_prospective.md` | prévisions futures | à mettre à jour | prospective, sources externes | utile plus tard | pas priorité immédiate stabilisation | conserver |
| `docs/96_dashboard_operationnel/07_plan_implementation.md` | plan implémentation | clôturé | sprints home/carte/alertes/tendances | utile en historique | implémentation déjà avancée | référencer comme historique |

## 11. Home V2

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/97_dashboard_home_v2_contract/00_index.md` | index contrat home | actif | périmètre, contrat, plans | utile | doit distinguer actif vs historique | mettre à jour |
| `docs/97_dashboard_home_v2_contract/01_contrat_api_dashboard_home.md` | contrat API home | actif | JSON, backend, frontend, règles métier | critique | aucun | conserver |
| `docs/97_dashboard_home_v2_contract/02_payload_json_exemple.md` | exemple payload | actif | contrat JSON détaillé | très utile | vérifier alignement exact runtime | conserver |
| `docs/97_dashboard_home_v2_contract/03_mapping_sources_bd.md` | mapping BD/API | actif | backend, sources, home | très utile | aucun | conserver |
| `docs/97_dashboard_home_v2_contract/04_regles_metier_pluvio_qualite.md` | règles métier | actif | pluie, qualité, home | très utile | aucun | conserver |
| `docs/97_dashboard_home_v2_contract/05_plan_backend_implementation.md` | plan backend | clôturé | implémentation backend | utile en trace | déjà implémenté | référencer comme historique |
| `docs/97_dashboard_home_v2_contract/06_plan_frontend_implementation.md` | plan frontend | clôturé | implémentation frontend | utile en trace | déjà implémenté | référencer comme historique |
| `docs/97_dashboard_home_v2_contract/07_tests_validation.md` | tests de validation | actif | tests home | utile | rejouer selon régressions | conserver |
| `docs/97_dashboard_home_v2_contract/08_risques_et_points_ouverts.md` | risques | actif | home, backend, frontend, points ouverts | utile | à revalider | conserver |
| `docs/97_dashboard_home_v2_contract/09_backend_implementation_report.md` | rapport backend | clôturé | backend réalisé | utile | historique | référencer comme historique |
| `docs/97_dashboard_home_v2_contract/10_frontend_implementation_report.md` | rapport frontend | clôturé | frontend réalisé | utile | historique | référencer comme historique |
| `docs/97_dashboard_home_v2_contract/11_frontend_design_alignment_report.md` | alignement design | clôturé | UI/UX home | utile | historique | référencer comme historique |
| `docs/97_dashboard_home_v2_contract/12_layout_optimization_report.md` | optimisation layout | clôturé | UI/UX responsive | utile | historique | référencer comme historique |
| `docs/97_dashboard_home_v2_contract/13_ui_bugfix_and_dashboard_unification_report.md` | bugfix UI | actif | bugs frontend, shell, skeleton | utile | aucun | conserver |
| `docs/97_dashboard_home_v2_contract/14_backend_performance_audit.md` | audit perf back | actif | causes erreur home, lenteur, requêtes | critique | aucun | conserver |
| `docs/97_dashboard_home_v2_contract/15_backend_performance_optimization_report.md` | optimisation back | actif | cache, mutualisation | utile | aucun | conserver |
| `docs/97_dashboard_home_v2_contract/23_home_v2_final_validation.md` | validation finale | actif | tests front/back, statut final | critique | signale encore cold-start élevé | conserver |

### `101_optimisation_dashboard_accueil`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/101_optimisation_dashboard_accueil/01_audit_performance_accueil.md` | audit performance home | actif | backend, frontend, home | utile | aucun | conserver |
| `docs/101_optimisation_dashboard_accueil/02_corrections_appliquees.md` | corrections appliquées | actif | fichiers front/back touchés | critique pour diagnostic | aucun | conserver |
| `docs/101_optimisation_dashboard_accueil/03_validation.md` | validation post-correctifs | actif | build, backend, mesures avant/après | utile | aucun | conserver |
| `docs/101_optimisation_dashboard_accueil/04_correction_regression_network_tendances.md` | régression carte/tendances | actif | bugs front/back home | critique | aucun | conserver |

## 12. Carte métier P0

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/dashboard_metier_p0/00_audit_dashboard_metier.md` | audit P0 | actif | backend, frontend, carte, qualité, pollution | critique | aucun | conserver |
| `docs/dashboard_metier_p0/01_inventory_existing_components.md` | inventaire composants | actif | frontend existant | utile | aucun | conserver |
| `docs/dashboard_metier_p0/02_reuse_vs_refactor_strategy.md` | stratégie réutilisation | actif | frontend/backend | utile | aucun | conserver |
| `docs/dashboard_metier_p0/03_target_business_architecture.md` | archi cible | actif | carte, API, composants | critique | aucun | conserver |
| `docs/dashboard_metier_p0/04_api_map_p0_implementation.md` | API map P0 | actif | backend, endpoints map | très utile | aucun | conserver |
| `docs/dashboard_metier_p0/08_support_catalog_reorganization.md` | réorganisation catalogue | actif | catalogue métier, supports | utile | aucun | conserver |
| `docs/dashboard_metier_p0/09_frontend_dashboard_carto_metier.md` | frontend carte métier | actif | page et composants | utile | aucun | conserver |
| `docs/dashboard_metier_p0/10_frontend_components_inventory.md` | composants front | actif | frontend | utile | aucun | conserver |
| `docs/dashboard_metier_p0/11_frontend_go_nogo_report.md` | go/no-go front | actif | validation écran | utile | dater à revalider | conserver |
| `docs/dashboard_metier_p0/12_p01_frontend_ux_fix_report.md` | correctifs UX | actif | bugs/UX carte | utile | aucun | conserver |

## 13. Pollution topologique

### `110_preparation_moteur_propagation_pollution`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/110_preparation_moteur_propagation_pollution/00_plan_transition.md` | plan de transition | actif | pollution, backend, réseau | utile | aucun | conserver |
| `docs/110_preparation_moteur_propagation_pollution/01_architecture_mvp_propagation.md` | architecture MVP | actif | propagation, endpoints, sources | critique | aucun | conserver |
| `docs/110_preparation_moteur_propagation_pollution/02_implementation_backend_mvp_source_to_garde.md` | implémentation garde | actif | endpoint propagation | utile | aucun | conserver |
| `docs/110_preparation_moteur_propagation_pollution/03_snap_diagnostic_endpoint.md` | contrat snap | actif | endpoint diagnostic, backend | utile | aucun | conserver |
| `docs/110_preparation_moteur_propagation_pollution/04_plan_endpoints_cibles.md` | endpoints cibles | actif | roadmap propagation | utile | certains endpoints déjà faits | mettre à jour |
| `docs/110_preparation_moteur_propagation_pollution/05_implementation_source_to_stations.md` | implémentation stations | actif | endpoint stations | utile | aucun | conserver |
| `docs/110_preparation_moteur_propagation_pollution/06_implementation_source_to_barrages.md` | implémentation barrages | actif | endpoint barrages | utile | aucun | conserver |
| `docs/110_preparation_moteur_propagation_pollution/07_implementation_source_to_exutoires.md` | implémentation exutoires | actif | endpoint exutoires | utile | aucun | conserver |
| `docs/110_preparation_moteur_propagation_pollution/08_cloture_backend_mvp_v1.md` | clôture backend V1 | clôturé | backend MVP terminé | utile en référence active | V1 clos, mais encore référence fonctionnelle | conserver |

### `pollution_dashboard`

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/pollution_dashboard/00_contexte_dashboard_pollution.md` | contexte global ancien | à mettre à jour | pollution dashboard, vision générale | utile | doit être recadré sur phase actuelle | mettre à jour |
| `docs/pollution_dashboard/01_architecture_actuelle.md` | architecture actuelle | actif | frontend/backend pollution | utile | vérifier alignement avec endpoints actuels | conserver |
| `docs/pollution_dashboard/02_flux_cartographiques.md` | flux carto | actif | carte, couches, pollution | utile | aucun | conserver |
| `docs/pollution_dashboard/03_simulation_actuelle_limites.md` | limites simulation | actif | limites topologiques/scientifiques | utile | aucun | conserver |
| `docs/pollution_dashboard/04_etat_mvp_dashboard_pollution.md` | état MVP | actif | état dashboard pollution | utile | revalider avec code actuel | conserver |
| `docs/pollution_dashboard/05_backlog_phase_1.md` | backlog phase 1 | à mettre à jour | backlog pollution | utile partiellement | phase 1 ancienne | mettre à jour |
| `docs/pollution_dashboard/06_vision_architecture_cible.md` | vision cible | actif | backend, frontend, architecture pollution | utile | aucun | conserver |
| `docs/pollution_dashboard/07_risques_et_dette_technique.md` | risques/dette | actif | backend, topo, dette | utile | aucun | conserver |
| `docs/pollution_dashboard/08_audit_hydrologique_reseau.md` | audit hydrologique | clôturé | réseau, topo | utile en preuve | historique | référencer comme historique |
| `docs/pollution_dashboard/09_plan_implementation_phase1_routage_visuel.md` | plan phase1 | clôturé | routage visuel | utile en trace | déjà absorbé | référencer comme historique |
| `docs/pollution_dashboard/10_topologie_reseau_hydro/00_index.md` | index phase topologie | à archiver | audit topologique | preuve technique | plus phase active | référencer comme historique |
| `docs/pollution_dashboard/11_reconnexion_topologique/00_index.md` | index reconnexion | à archiver | reconnexion réseau | preuve technique | plus phase active | référencer comme historique |
| `docs/pollution_dashboard/12_reconstruction_topologique_reelle/00_index.md` | index nodification réelle | à archiver | reconstruction réseau | preuve technique | plus phase active | référencer comme historique |
| `docs/pollution_dashboard/13_normalisation_post_nodification/00_index.md` | index normalisation | à archiver | normalisation réseau | preuve technique | plus phase active | référencer comme historique |
| `docs/pollution_dashboard/14_runtime_stabilization/00_runtime_stabilization.md` | runtime stabilisé | actif | contrat API runtime, frontend QA, limites | critique | aucun | conserver |
| `docs/pollution_dashboard/15_future_hydraulic_validation/00_future_hydraulic_validation.md` | futur chantier hydraulique | actif | validation future, non scientifique | utile | pas priorité immédiate | conserver |

## 14. Pollution campagnes / déclaration pollution

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/70_dashboard_pollution/01_audit_existant.md` | audit écran existant | à mettre à jour | frontend, backend, APIs, pollution, campagnes | critique | dit que certaines briques sont absentes alors que le code en montre déjà | mettre à jour |
| `docs/70_dashboard_pollution/02_analyse_donnees.md` | analyse données campagnes | actif | tables sources, volumétrie, paramètres, géoloc | critique pour matrice | aucun | conserver |
| `docs/70_dashboard_pollution/03_objectifs_metier.md` | objectifs métier | actif | besoins dashboard campagnes | utile | aucun | conserver |
| `docs/70_dashboard_pollution/04_propositions_ameliorations.md` | propositions UI/UX | actif | carte, liste, alertes, export | utile | à réaligner avec code existant | conserver |
| `docs/70_dashboard_pollution/05_plan_implementation.md` | plan implémentation | à mettre à jour | route, front, back, endpoints | utile | certaines briques annoncées futures existent déjà | mettre à jour |
| `docs/70_dashboard_pollution/06_tests_et_validation.md` | plan tests | actif | E2E, API, build | utile | doit être réajusté au code réel | conserver |

## 15. Administration / ingestion

| Fichier | Rôle | Statut | Ce que le fichier dit | Utile aujourd'hui | Non prioritaire / contradiction | Décision |
|---|---|---|---|---|---|---|
| `docs/114_data_admin_ingestion/00_index.md` | index chantier 114 | actif | data-admin, ingestion, gouvernance | critique | secondaire aux dashboards mais actif | conserver |
| `docs/114_data_admin_ingestion/01_audit_existant.md` | audit existant | actif | audit lecture seule, modules admin | utile | aucun | conserver |
| `docs/114_data_admin_ingestion/02_architecture_cible.md` | archi cible | actif | backend, workflow, rôles | utile | aucun | conserver |
| `docs/114_data_admin_ingestion/03_data_class_registry.md` | registre classes | actif | données métier, sources, classes | très utile pour future matrice | aucun | conserver |
| `docs/114_data_admin_ingestion/04_workflow_modification_controlee.md` | workflow contrôle | actif | workflow métier, rôles, validations | très utile pour déclaration pollution | aucun | conserver |
| `docs/114_data_admin_ingestion/05_workflow_ingestion_intelligente.md` | workflow ingestion | actif | upload, validation, staging | utile | aucun | conserver |
| `docs/114_data_admin_ingestion/08_security_roles_permissions.md` | rôles/permissions | actif | rôles utilisateurs | utile pour future matrice | aucun | conserver |
| `docs/114_data_admin_ingestion/09_implementation_roadmap.md` | roadmap | actif | plan de mise en œuvre | utile | aucun | conserver |
| `docs/114_data_admin_ingestion/11_mvp1b_frontend_audit_report.md` | audit frontend admin | actif | frontend admin | utile | aucun | conserver |
| `docs/114_data_admin_ingestion/14_mvp2c_upload_validation_staging_report.md` | staging/validation | actif | backend, validation, erreurs | utile | aucun | conserver |
| `docs/114_data_admin_ingestion/16_mvp3_change_request_promotion_report.md` | change request | actif | workflow promotion | utile | aucun | conserver |
| `docs/114_data_admin_ingestion/22_rbac_implementation_report.md` | RBAC réel | actif | rôles, sécurité, API | utile | aucun | conserver |
