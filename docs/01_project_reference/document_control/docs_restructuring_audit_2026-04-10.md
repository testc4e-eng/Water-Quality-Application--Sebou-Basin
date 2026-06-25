# Audit et plan de restructuration du dossier `docs`

Date: 2026-04-10

## 1. Synthèse d’audit du dossier `docs`

### 1.1 Constat global

- Le dossier `docs` contient **125 fichiers** hétérogènes, sans cartographie documentaire centrale ni règle explicite de source de vérité.
- La racine `docs/` mélange des références durables, des notes d’exécution, des prompts, des rapports et des artefacts bureautiques.
- Le recouvrement le plus important concerne la documentation IA avec **deux kits concurrents** : `10_ia_kit/` et `kit_documentation_ia/`.
- Les sujets les plus dupliqués sont : architecture système, architecture base de données, API/endpoints, déploiement/exploitation, Mission IV, migration de données, prompts Mission IV.
- Deux dossiers existent sans contenu exploité : `docs/05_sig_gis/` et `docs/07_decisions/`. Ils créent une attente structurelle sans valeur documentaire réelle à ce stade.
- Plusieurs documents sont mal classés : par exemple `docs/01_architecture/README.md` parle d’intégration frontend, et `docs/08_roadmap/README.md` traite en réalité d’exploitation/maintenance.
- Plusieurs noms de fichiers ne sont pas maintenables sur la durée : espaces, accents, casse hétérogène, suffixes de date non normalisés, doublons sémantiques.

### 1.2 Zones à fort recouvrement

| Sujet | Documents concurrents ou recouvrants | Risque documentaire | Décision cible |
|---|---|---|---|
| Architecture système | `01_architecture/architecture_globale.md`, `kit_documentation_ia/ARCHITECTURE.md`, `10_ia_kit/ARCHITECTURE.md`, `99_audit_legacy/Guides_Migration_Maintenance/api_architecture.md` | Plusieurs récits concurrents du même système | Un maître de référence + un résumé IA dérivé + archives historiques |
| Base de données | `01_architecture/architecture_bd_reference.md`, `01_architecture/architecture_bd_expertise.md`, `04_data/01_architecture_bdd_postgis.md`, `04_data/10_dictionnaire_bdd_executif.md`, `kit_documentation_ia/DATABASE_SCHEMA.md`, `99_audit_legacy/Dictionnaires/database_dictionary.md` | Collision entre référence, expertise, audit et résumé IA | Un maître BD + un data dictionary + annexes historiques |
| API / endpoints | `02_backend/endpoints.md`, `02_backend/README.md`, `kit_documentation_ia/API_ENDPOINTS.md`, `10_ia_kit/API_ENDPOINTS.md`, `99_audit_legacy/.../api_architecture.md`, `openapi_waterqual_sebou.yaml` | Contrats potentiellement divergents | Une référence API backend + un résumé IA synthétique + snapshots archivés |
| Déploiement / exploitation | `06_deployment/deploiement_local.md`, `08_roadmap/README.md`, `kit_documentation_ia/DEPLOYMENT.md`, `implementation_guide.md`, `maintenance_procedures.md` | Mélange entre local setup, exploitation et prescriptions infra | Un maître déploiement/ops + annexes legacy |
| Mission IV / rapports | `recommendation rapport.md`, `Rapport_Provisoire_Mission_IV_SAD.docx`, `exigences CPS.md`, `pr_description_merge_dashboards_2026-04-09.md` | Difficulté à distinguer référence contractuelle, rapport, statut et preuve | Un espace contractual/reporting structuré |
| Prompts Mission IV | `kit_documentation_ia/partie*_prompts_appliques/*`, `10_ia_kit/partie*_prompts_appliques/*`, `prompt_observatory_layers_enrichi.md`, `10_ia_kit/Prompt_BD/*` | La mémoire de fabrication concurrence la documentation de référence | Déplacer dans `working_prompts_and_runs` |
| Historique migration / qualité data | `04_data/04_*` à `07_*`, `synthese_migration_public_vers_metier.md`, `99_audit_legacy/Rapports_Audit/*`, `Raw_Data_Audit/*` | Références historiques utiles mais trop présentes dans le flux courant | Résumer dans l’évidence register puis archiver |

### 1.3 Décisions structurantes recommandées

- Retenir **une seule base IA maître** : `kit_documentation_ia/` pour les résumés, puis en extraire les prompts vers une zone de travail dédiée.
- Considérer `10_ia_kit/` comme **doublon concurrent**, à vider après fusion des rares éléments uniques (`Prompt_BD/*`).
- Considérer `04_data/10_dictionnaire_bdd_executif.md` comme **meilleur point de départ** pour le dictionnaire de données maître.
- Considérer `02_backend/endpoints.md` comme **socle de la référence API** et `02_backend/traceability.md` comme annexe durable.
- Considérer `recommendation rapport.md` comme **source de vérité Markdown** pour le rapport Mission IV ; le `.docx` ne doit être qu’un export.
- Reclasser immédiatement les documents de travail ponctuels hors de la racine `docs/`.

## 2. Matrice de décision fichier par fichier
### Racine docs

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/recommendation rapport.md | report | rapport provisoire Mission IV | critique | déplacer | Rapport Markdown maître ; renommer et déplacer vers `02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md`. |
| docs/Rapport_Provisoire_Mission_IV_SAD.docx | report | export bureautique du rapport | moyenne | déplacer | Conserver comme export généré dans `generated_exports/`, hors source de vérité. |
| docs/exigences CPS.md | reference | synthèse des exigences CPS | critique | déplacer | Déplacer vers `02_contractual_and_reports/cps/` et relier à `CPS_MAPPING_PROJECT.md`. |
| docs/pr_description_merge_dashboards_2026-04-09.md | working_note | journal de merge et améliorations | élevée | déplacer | Déplacer vers `04_working_prompts_and_runs/runs/2026-04-09_merge_dashboards/` et référencer comme preuve. |
| docs/guide_merge_3_branches_dashboards.md | working_note | procédure de merge multi-branches | moyenne | déplacer | Document de travail ponctuel à sortir de la racine `docs`. |
| docs/checklist_courte_merge_10_commandes.md | working_note | checklist de merge rapide | moyenne | déplacer | À ranger avec le guide de merge dans la zone runs. |
| docs/popup_rules_functional_test_workflow.md | working_note | workflow de test popup-rules | élevée | déplacer | Procédure de test ciblée à conserver dans `runs/popup_rules/`. |
| docs/prompt_observatory_layers_enrichi.md | prompt | prompt de refactorisation observatory | moyenne | déplacer | Prompt d’atelier à déplacer vers `prompts/observatory/`. |

### 00_overview

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/00_overview/README.md | reference | gouvernance des données et standards | élevée | déplacer | Renommer et déplacer vers `01_project_reference/overview/data_governance_and_standards.md`. |
| docs/00_overview/vision_projet.md | reference | vision projet et parties prenantes | élevée | déplacer | Déplacer vers `01_project_reference/overview/project_vision.md`. |

### 01_architecture

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/01_architecture/README.md | reference | guide frontend mal classé | élevée | fusionner | Fusionner avec `03_frontend/README.md` dans un seul maître frontend. |
| docs/01_architecture/architecture_globale.md | reference | vue d’ensemble architecture système | élevée | fusionner | Fusionner dans un `system_architecture.md` aligné sur le code réel. |
| docs/01_architecture/architecture_bd_reference.md | reference | architecture de référence BD | critique | fusionner | Base forte pour le futur maître base de données. |
| docs/01_architecture/architecture_bd_expertise.md | reference | expertise architecture BD redondante | moyenne | supprimer après fusion | Redondant avec `architecture_bd_reference.md` ; absorber puis retirer. |

### 02_backend

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/02_backend/README.md | reference | vue d’ensemble backend | élevée | déplacer | Déplacer dans `01_project_reference/backend/backend_overview.md`. |
| docs/02_backend/endpoints.md | reference | catalogue détaillé des endpoints | critique | déplacer | Déplacer vers `01_project_reference/backend/api_contracts.md`. |
| docs/02_backend/traceability.md | reference | matrice de traçabilité API | élevée | déplacer | Déplacer vers `01_project_reference/backend/traceability_matrix.md`. |

### 03_frontend

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/03_frontend/README.md | reference | documentation frontend | élevée | fusionner | Devenir le maître frontend après absorption du guide mal classé. |

### 04_data

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/04_data/README.md | reference | index documentation data | élevée | déplacer | Conserver comme porte d’entrée data dans `01_project_reference/data/README.md`. |
| docs/04_data/01_architecture_bdd_postgis.md | reference | architecture détaillée BDD/PostGIS | critique | fusionner | Fusionner avec les autres documents d’architecture BD. |
| docs/04_data/02_livrables_sql_metadata.md | reference | requêtes d’introspection et livrables SQL | élevée | déplacer | Conserver dans `01_project_reference/data/sql_introspection_and_metadata.md`. |
| docs/04_data/03_export_brut_systeme.md | archive | export brut massif de la base | moyenne | archiver | Conserver en archive technique et résumer dans `EVIDENCE_REGISTER.md`. |
| docs/04_data/04_phase_A_assainissement.md | working_note | phase A assainissement structurel | moyenne | archiver | Historique de chantier à archiver après extraction de la doctrine utile. |
| docs/04_data/05_phase_B_migration.md | working_note | phase B migration contrôlée | élevée | archiver | Historique d’exécution utile mais non maître ; archiver après synthèse. |
| docs/04_data/06_industrialisation_bdd.md | working_note | industrialisation et rollback BDD | élevée | fusionner | Le contenu utile doit alimenter la référence déploiement/ops. |
| docs/04_data/07_phase_C_qualite_data.md | working_note | phase C qualité des données | élevée | archiver | Historique de remédiation data à archiver après synthèse. |
| docs/04_data/08_rapport_audit_phase_C.md | report | mini rapport audit phase C | faible | supprimer après fusion | Version dégradée et concurrente du rapport final `09_...`. |
| docs/04_data/09_rapport_audit_qualite_migration_final.md | report | rapport final audit qualité migration | élevée | déplacer | Déplacer vers `02_contractual_and_reports/technical_annexes/data_quality/`. |
| docs/04_data/10_dictionnaire_bdd_executif.md | reference | dictionnaire de données exécutif | critique | déplacer | Déplacer vers `01_project_reference/data/data_dictionary.md` comme source de vérité naturelle. |
| docs/04_data/data_sources.md | reference | inventaire des sources de données | moyenne | fusionner | Fusionner dans le futur `GLOSSARY.md` ou `DATA_SOURCES.md` maître. |
| docs/04_data/views.md | reference | documentation des vues SQL | élevée | déplacer | Déplacer vers `01_project_reference/data/sql_views_reference.md`. |
| docs/04_data/synthese_migration_public_vers_metier.md | summary | synthèse migration public vers métier | moyenne | fusionner | Absorber dans une chronologie de migration puis archiver l’original. |

### 05_visualization

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/05_visualization/strategie_visualisation_expert.md | reference | stratégie de visualisation SIG | moyenne | déplacer | Reclasser dans `01_project_reference/gis_visualization/visualization_strategy.md`. |

### 06_deployment

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/06_deployment/deploiement_local.md | reference | déploiement local | élevée | fusionner | Fusionner avec les notes d’exploitation pour produire une seule référence ops. |

### 08_roadmap

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/08_roadmap/README.md | reference | guide exploitation et maintenance mal classé | élevée | fusionner | Le contenu relève du déploiement/ops et non d’une roadmap. |

### kit_documentation_ia

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/kit_documentation_ia/_ADAPTATION_SUMMARY.md | summary | resume adaptation kit IA | moyenne | archiver | Historique de fabrication du kit ; archiver apres creation de la cartographie documentaire IA. |
| docs/kit_documentation_ia/AGENT_RULES.md | summary | regles operatoires pour agents | critique | deplacer | Conserver comme noyau de `03_ai_knowledge_base/MEMORY_CORE.md` ou `AGENT_RULES.md`. |
| docs/kit_documentation_ia/API_ENDPOINTS.md | summary | resume agent des endpoints API | elevee | fusionner | Refondre en derive synthetique du maitre API backend, sans duplication litterale. |
| docs/kit_documentation_ia/ARCHITECTURE.md | summary | resume agent architecture | elevee | fusionner | Relier au maitre architecture systeme et condenser pour usage agent. |
| docs/kit_documentation_ia/CODE_STANDARDS.md | summary | standards de code pour agents | elevee | deplacer | Conserver dans `03_ai_knowledge_base/code_standards_for_agents.md`. |
| docs/kit_documentation_ia/DATABASE_SCHEMA.md | summary | resume agent schema base de donnees | elevee | fusionner | Refondre a partir du maitre data dictionary et de la reference BD. |
| docs/kit_documentation_ia/DEPENDENCIES.md | summary | resume dependances projet | moyenne | deplacer | Conserver dans `03_ai_knowledge_base/dependencies_for_agents.md`. |
| docs/kit_documentation_ia/DEPLOYMENT.md | summary | resume agent deploiement | moyenne | fusionner | Deriver de la reference deploiement/ops pour eviter un recit concurrent. |
| docs/kit_documentation_ia/ENVIRONNEMENTS.md | summary | resume environnements | elevee | deplacer | Conserver dans `03_ai_knowledge_base/environments_for_agents.md`. |
| docs/kit_documentation_ia/PARTIE1_ANALYSE_BESOIN_MISSION4.md | summary | analyse Mission IV orientee agent | moyenne | deplacer | Reclasser dans `04_working_prompts_and_runs/mission4/` comme contexte de travail et de redaction. |
| docs/kit_documentation_ia/PROJECT_STRUCTURE.md | summary | resume structure projet | elevee | deplacer | Conserver dans `03_ai_knowledge_base/project_structure_for_agents.md`. |
| docs/kit_documentation_ia/TESTING_GUIDE.md | summary | guide de tests pour agents | elevee | deplacer | Conserver dans `03_ai_knowledge_base/testing_quick_reference.md`. |
| docs/kit_documentation_ia/TROUBLESHOOTING.md | summary | troubleshooting pour agents | elevee | deplacer | Conserver dans `03_ai_knowledge_base/troubleshooting_for_agents.md`. |
| docs/kit_documentation_ia/WORKFLOWS.md | summary | workflows fonctionnels synthetiques | elevee | fusionner | Relier au referentiel projet pour produire un resume IA court sans concurrence. |
| docs/kit_documentation_ia/partie1_prompts_appliques/01_ANALYSE_PROBLEME_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie1_prompts_appliques/02_CLARIFICATION_OBJECTIFS_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie1_prompts_appliques/03_IDENTIFICATION_DONNEES_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie1_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE1_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie2_prompts_appliques/01_ARCHITECTURE_APPLICATIVE_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie2_prompts_appliques/02_DESIGN_BASE_DONNEES_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie2_prompts_appliques/03_DEFINITION_MODULES_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie2_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE2_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie3_prompts_appliques/01_DECOUPAGE_TACHES_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie3_prompts_appliques/02_ROADMAP_TECHNIQUE_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie3_prompts_appliques/03_PRIORISATION_TECHNIQUE_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie3_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE3_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie4_prompts_appliques/01_AUDIT_QUALITE_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie4_prompts_appliques/02_DETECTION_BUGS_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie4_prompts_appliques/03_OPTIMISATION_PERFORMANCE_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie4_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE4_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie5_prompts_appliques/01_ANALYSE_VULNERABILITES_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie5_prompts_appliques/02_SECURITE_API_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie5_prompts_appliques/03_GESTION_SECRETS_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |
| docs/kit_documentation_ia/partie5_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE5_MISSION4.md | prompt | prompts appliques Mission IV | moyenne | deplacer | Deplacer vers `04_working_prompts_and_runs/prompts/mission4/` ; conserver comme memoire de fabrication hors base de reference. |

### 10_ia_kit

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/10_ia_kit/_ADAPTATION_SUMMARY.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/AGENT_RULES.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/API_ENDPOINTS.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/ARCHITECTURE.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/CODE_STANDARDS.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/DATABASE_SCHEMA.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/DEPENDENCIES.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/DEPLOYMENT.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/ENVIRONNEMENTS.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/PARTIE1_ANALYSE_BESOIN_MISSION4.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/PROJECT_STRUCTURE.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/TESTING_GUIDE.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/TROUBLESHOOTING.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/WORKFLOWS.md | summary | doublon de synthese IA | faible | supprimer apres fusion | Dossier concurrent de `kit_documentation_ia` ; conserver le kit maitre, absorber les rares ecarts utiles, puis retirer ce duplicat. |
| docs/10_ia_kit/partie1_prompts_appliques/01_ANALYSE_PROBLEME_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie1_prompts_appliques/02_CLARIFICATION_OBJECTIFS_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie1_prompts_appliques/03_IDENTIFICATION_DONNEES_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie1_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE1_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie2_prompts_appliques/01_ARCHITECTURE_APPLICATIVE_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie2_prompts_appliques/02_DESIGN_BASE_DONNEES_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie2_prompts_appliques/03_DEFINITION_MODULES_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie2_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE2_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie3_prompts_appliques/01_DECOUPAGE_TACHES_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie3_prompts_appliques/02_ROADMAP_TECHNIQUE_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie3_prompts_appliques/03_PRIORISATION_TECHNIQUE_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie3_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE3_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie4_prompts_appliques/01_AUDIT_QUALITE_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie4_prompts_appliques/02_DETECTION_BUGS_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie4_prompts_appliques/03_OPTIMISATION_PERFORMANCE_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie4_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE4_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie5_prompts_appliques/01_ANALYSE_VULNERABILITES_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie5_prompts_appliques/02_SECURITE_API_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie5_prompts_appliques/03_GESTION_SECRETS_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/partie5_prompts_appliques/04_PROMPTS_PERSONNALISES_PARTIE5_MISSION4.md | prompt | doublon de prompts Mission IV | faible | supprimer apres fusion | Doublon logique de `kit_documentation_ia/partie*_prompts_appliques/` ; conserver une seule serie puis supprimer ce duplicat. |
| docs/10_ia_kit/Prompt_BD/Prompt - A - assainissement structurel immédiat.md | prompt | prompt assainissement structurel vide | faible | supprimer apres fusion | Fichier vide ; supprimer apres creation d un index des prompts et verification de non-perte. |
| docs/10_ia_kit/Prompt_BD/Prompt - B - migration contrôlée .md | prompt | prompts base de donnees | moyenne | deplacer | Prompts utiles et uniques ; deplacer vers `04_working_prompts_and_runs/prompts/data/`. |
| docs/10_ia_kit/Prompt_BD/Prompt - C - Corrections de qualité de données .md | prompt | prompts base de donnees | moyenne | deplacer | Prompts utiles et uniques ; deplacer vers `04_working_prompts_and_runs/prompts/data/`. |
| docs/10_ia_kit/Prompt_BD/Prompt - D - Dictionnaire de données enrichi de la BD.md | prompt | prompts base de donnees | moyenne | deplacer | Prompts utiles et uniques ; deplacer vers `04_working_prompts_and_runs/prompts/data/`. |

### 99_audit_legacy

| Chemin actuel | Type estime | Sujet principal | Niveau utilite | Statut recommande | Justification |
|---|---|---|---|---|---|
| docs/99_audit_legacy/Dictionnaires/DATA_DICTIONARY.csv | archive | export CSV dictionnaire legacy | moyenne | archiver | Conserver comme preuve d inventaire legacy dans `99_legacy_archive/db_audit_legacy/` ; non adapte comme source de verite active. |
| docs/99_audit_legacy/Dictionnaires/database_dictionary.md | archive | dictionnaire legacy et MCD | elevee | fusionner | Absorber les elements encore utiles dans la reference data moderne, puis archiver l original. |
| docs/99_audit_legacy/Guides_Migration_Maintenance/api_architecture.md | archive | architecture API legacy | elevee | fusionner | Source utile pour l historique d architecture et certains contrats API ; fusionner les elements encore valides puis archiver. |
| docs/99_audit_legacy/Guides_Migration_Maintenance/implementation_guide.md | archive | guide implementation SGBD legacy | moyenne | fusionner | Extraire les parametres encore valides vers la reference deploiement/ops, puis archiver. |
| docs/99_audit_legacy/Guides_Migration_Maintenance/maintenance_procedures.md | archive | procedures maintenance legacy | moyenne | fusionner | Le contenu utile doit etre repris dans la reference exploitation et maintenance, puis archive. |
| docs/99_audit_legacy/Guides_Migration_Maintenance/migration_plan.md | archive | plan de migration legacy | moyenne | fusionner | Synthétiser dans une chronologie de migration puis archiver comme historique de projet. |
| docs/99_audit_legacy/Guides_Migration_Maintenance/openapi_waterqual_sebou.yaml | archive | snapshot OpenAPI legacy | moyenne | archiver | Conserver comme artefact technique historique ; potentiellement divergent du backend actuel. |
| docs/99_audit_legacy/Rapports_Audit/AUDIT_REPORT_FINAL.md | archive | rapport audit final post-migration | moyenne | archiver | A référencer dans `EVIDENCE_REGISTER.md` puis conserver en archive probante. |
| docs/99_audit_legacy/Rapports_Audit/AUDIT_REPORT.md | archive | rapport audit initial | moyenne | archiver | Historique d etat initial a conserver en archive ; resume des constats a reporter dans le registre de preuves. |
| docs/99_audit_legacy/Rapports_Audit/walkthrough.md | archive | walkthrough refonte BD | moyenne | archiver | Document narratif d historique technique a archiver ; reprendre seulement les jalons utiles. |
| docs/99_audit_legacy/Raw_Data_Audit/db_size.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |
| docs/99_audit_legacy/Raw_Data_Audit/extensions.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |
| docs/99_audit_legacy/Raw_Data_Audit/indexes.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |
| docs/99_audit_legacy/Raw_Data_Audit/object_counts.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |
| docs/99_audit_legacy/Raw_Data_Audit/routines.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |
| docs/99_audit_legacy/Raw_Data_Audit/tables_data.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |
| docs/99_audit_legacy/Raw_Data_Audit/tables_size.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |
| docs/99_audit_legacy/Raw_Data_Audit/version.json | archive | preuves brutes audit base | moyenne | archiver | Donnees brutes probantes a conserver en archive structuree ; les syntheses doivent vivre dans `EVIDENCE_REGISTER.md`. |

## 3. Structure cible recommandée

```text
docs/
├── 01_project_reference/
│   ├── DOCUMENT_MAP.md
│   ├── SOURCE_OF_TRUTH.md
│   ├── GLOSSARY.md
│   ├── LIVRABLES_MATRIX.md
│   ├── EVIDENCE_REGISTER.md
│   ├── overview/
│   │   ├── project_vision.md
│   │   └── data_governance_and_standards.md
│   ├── architecture/
│   │   ├── system_architecture.md
│   │   └── database_architecture.md
│   ├── backend/
│   │   ├── backend_overview.md
│   │   ├── api_contracts.md
│   │   └── traceability_matrix.md
│   ├── frontend/
│   │   └── frontend_reference.md
│   ├── data/
│   │   ├── data_dictionary.md
│   │   ├── sql_views_reference.md
│   │   ├── sql_introspection_and_metadata.md
│   │   └── data_migration_history_summary.md
│   ├── gis_visualization/
│   │   └── visualization_strategy.md
│   └── deployment_operations/
│       └── deployment_and_operations.md
├── 02_contractual_and_reports/
│   ├── cps/
│   │   ├── cps_requirements_summary.md
│   │   └── CPS_MAPPING_PROJECT.md
│   ├── mission_iv/
│   │   ├── rapport_provisoire_mission_iv_sad.md
│   │   └── generated_exports/
│   ├── technical_annexes/
│   │   ├── data_quality/
│   │   └── database/
│   └── status_notes/
├── 03_ai_knowledge_base/
│   ├── MEMORY_CORE.md
│   ├── QUICK_REFERENCE.md
│   ├── AGENT_RULES.md
│   ├── architecture_for_agents.md
│   ├── api_for_agents.md
│   ├── database_for_agents.md
│   ├── environments_for_agents.md
│   ├── project_structure_for_agents.md
│   ├── testing_quick_reference.md
│   ├── troubleshooting_for_agents.md
│   └── workflows_for_agents.md
├── 04_working_prompts_and_runs/
│   ├── prompts/
│   │   ├── mission4/
│   │   ├── observatory/
│   │   └── data/
│   ├── runs/
│   │   ├── 2026-04-09_merge_dashboards/
│   │   └── popup_rules/
│   └── mission4/
└── 99_legacy_archive/
    ├── db_audit_legacy/
    ├── duplicated_ia_kits/
    ├── generated_raw_exports/
    └── data_migration_history/
```

### 3.1 Règles de séparation à appliquer

- `01_project_reference` : documentation maître, durable, maintenue, directement mobilisable pour développement et onboarding.
- `02_contractual_and_reports` : exigences, mapping CPS, rapports, annexes techniques, preuves de livrables.
- `03_ai_knowledge_base` : résumés courts et stables pour agents ; jamais de duplication littérale des références maîtres.
- `04_working_prompts_and_runs` : prompts, workflows ponctuels, statuts d’exécution, journaux de runs, checklists d’intégration.
- `99_legacy_archive` : historique, audits bruts, snapshots et documents déclassés mais conservés pour traçabilité.

## 4. Plan de fusion / déduplication

| Sujet logique | Fichier maître à conserver / créer | Fichiers secondaires à absorber | Structure du document fusionné | Éléments à garder |
|---|---|---|---|---|
| Vision et gouvernance projet | `01_project_reference/overview/project_vision.md` + `data_governance_and_standards.md` | `00_overview/vision_projet.md`, `00_overview/README.md` | contexte, objectifs, parties prenantes, gouvernance data, règles transverses | vision métier, gouvernance, standards de qualité, rôles et sensibilité des données |
| Architecture système | `01_project_reference/architecture/system_architecture.md` | `01_architecture/architecture_globale.md`, `kit_documentation_ia/ARCHITECTURE.md`, `10_ia_kit/ARCHITECTURE.md`, `99_audit_legacy/Guides_Migration_Maintenance/api_architecture.md` | vue d’ensemble, couches, flux, modules, technologies, limites connues | architecture 3 couches, flux de données, rôles backend/frontend/DB, composants métier réels |
| Architecture base de données | `01_project_reference/architecture/database_architecture.md` | `01_architecture/architecture_bd_reference.md`, `01_architecture/architecture_bd_expertise.md`, `04_data/01_architecture_bdd_postgis.md`, `99_audit_legacy/Dictionnaires/database_dictionary.md`, `kit_documentation_ia/DATABASE_SCHEMA.md` | vue d’ensemble BD, schémas, objets clés, gouvernance, performance, historique | schémas métiers, vues, matviews, Timescale/PostGIS, contraintes, risques, gouvernance |
| Dictionnaire de données | `01_project_reference/data/data_dictionary.md` | `04_data/10_dictionnaire_bdd_executif.md`, `04_data/data_sources.md`, `99_audit_legacy/Dictionnaires/DATA_DICTIONARY.csv` | domaines, tables/vues structurantes, glossaire métier, provenance | dictionnaire exécutif, inventaire des sources, correspondances métier |
| Référence backend / API | `01_project_reference/backend/api_contracts.md` | `02_backend/endpoints.md`, `02_backend/README.md`, `kit_documentation_ia/API_ENDPOINTS.md`, `10_ia_kit/API_ENDPOINTS.md`, `openapi_waterqual_sebou.yaml` | overview backend, groupes de routes, endpoints sensibles, conventions, auth | endpoints actuels, préfixes, auth, routes analytics/observatory/layers/ingestion/admin |
| Frontend | `01_project_reference/frontend/frontend_reference.md` | `03_frontend/README.md`, `01_architecture/README.md` | architecture UI, routes, composants, intégration API, patterns | routes actuelles, composants dashboards, intégration frontend/API, patterns de requêtes |
| Déploiement et exploitation | `01_project_reference/deployment_operations/deployment_and_operations.md` | `06_deployment/deploiement_local.md`, `08_roadmap/README.md`, `kit_documentation_ia/DEPLOYMENT.md`, `implementation_guide.md`, `maintenance_procedures.md` | setup local, environnement, exploitation, maintenance, jobs, sauvegarde | démarrage local, variables d’environnement, refresh MV, maintenance et sauvegarde |
| Historique migration / qualité data | `01_project_reference/data/data_migration_history_summary.md` + annexe qualité | `04_data/04_*`, `05_*`, `06_*`, `07_*`, `08_*`, `synthese_migration_public_vers_metier.md`, `09_rapport_audit_qualite_migration_final.md`, rapports legacy | chronologie, décisions, état atteint, preuves et réserves | synthèses par phase, constats qualité, résultats finaux utiles, liens vers preuves brutes |
| Conformité CPS et livrables | `02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md` + `LIVRABLES_MATRIX.md` | `exigences CPS.md`, `recommendation rapport.md`, notes d’amélioration récentes | exigences, couverture, preuves, livrables, statut | exigences Mission IV, mapping vers code/docs, état des livrables |
| Base de connaissance IA | `03_ai_knowledge_base/*` | `kit_documentation_ia/*.md`, `10_ia_kit/*.md` hors prompts | mémoires courtes, rappels, règles agents, quick refs | règles agents, structure projet, troubleshooting, workflows, environnements, dépendances |
| Prompts et runs | `04_working_prompts_and_runs/*` | `kit_documentation_ia/partie*_prompts_appliques/*`, `10_ia_kit/partie*_prompts_appliques/*`, `Prompt_BD/*`, `prompt_observatory_layers_enrichi.md`, merge guides, popup workflow | prompts classés par domaine, runs classés par date, statuts et preuves | prompts Mission IV, prompts data, procédures de tests ciblées, notes de merge |

## 5. Normalisation

### 5.1 En-tête Markdown standard

```markdown
---
title: "Titre du document"
status: draft | active | archived | generated
type: reference | summary | prompt | report | working_note | archive
scope: project | backend | frontend | data | gis | mission_iv | cps | operations
source_of_truth: true | false
owner: "équipe ou rôle responsable"
last_updated: YYYY-MM-DD
related_documents:
  - ../path/to/document.md
supersedes:
  - ancien_document.md
superseded_by: null
---
```

### 5.2 Règles de contenu

- Un sujet = un document maître identifié avec `source_of_truth: true`.
- Un document IA est un résumé orienté exécution ; il doit pointer vers le maître, pas le recopier.
- Les artefacts générés (`.docx`, exports bruts, snapshots JSON) ne sont jamais des sources de vérité.
- Les prompts, workflows ponctuels et comptes rendus d’exécution doivent sortir de la documentation de référence.

## 6. Documents à créer

| Document à créer | Rôle | Sources d’alimentation | Usage principal | Priorité |
|---|---|---|---|---|
| `DOCUMENT_MAP.md` | carte d’entrée unique du référentiel | arborescence cible + documents maîtres | onboarding humain/agent | immédiate |
| `SOURCE_OF_TRUTH.md` | registre des documents maîtres par sujet | architecture, API, DB, rapports, CPS | éviter les doublons et arbitrer les mises à jour | immédiate |
| `GLOSSARY.md` | glossaire métier, technique et contractuel | vision projet, data dictionary, CPS | alignement vocabulaire humain/agent | immédiate |
| `MEMORY_CORE.md` | mémoire agent minimale et stable | AGENT_RULES, architecture, structure projet, mission IV | code generation et rappel de contexte | immédiate |
| `QUICK_REFERENCE.md` | mémo opérationnel court | routes, scripts, chemins, commandes, variables | exécution rapide par agents et devs | immédiate |
| `CPS_MAPPING_PROJECT.md` | mapping exigences ↔ code ↔ docs ↔ preuves | exigences CPS, rapport Mission IV, endpoints, modules | rapports, comités, suivi de conformité | immédiate |
| `LIVRABLES_MATRIX.md` | matrice des livrables projet | rapports, annexes, guides, preuves | pilotage contractuel | haute |
| `EVIDENCE_REGISTER.md` | registre de preuves techniques | notes de merge, rapports d’audit, exports, workflows de test | rédaction de rapports et justification des états | haute |

## 7. Conventions de nommage et de maintenance documentaire

### 7.1 Nommage

- Utiliser uniquement des noms en minuscules ASCII, avec `_` ou `-`, sans espace ni accent.
- Réserver les majuscules aux documents de contrôle explicitement voulus (`DOCUMENT_MAP.md`, `SOURCE_OF_TRUTH.md`).
- Les documents datés doivent suivre le format `YYYY-MM-DD_sujet.md` uniquement pour les runs, statuts ou snapshots.
- Éviter les `README.md` ambigus lorsqu’un nom explicite apporte plus de valeur (`frontend_reference.md`, `api_contracts.md`).

### 7.2 Maintenance

- Toute création de document doit être rattachée à l’une des cinq zones cibles.
- Toute mise à jour d’un document maître doit déclencher une vérification de ses dérivés IA et des renvois de `SOURCE_OF_TRUTH.md`.
- Toute note ponctuelle créée pour un run doit être rangée immédiatement dans `04_working_prompts_and_runs/`.
- Toute information historique non maintenue doit être déplacée en archive, jamais laissée en concurrence active.
- Les documents vides ou quasi vides doivent être supprimés seulement après vérification de non-perte et consignation dans le plan de fusion.

## 8. Plan d’exécution immédiat recommandé

1. Créer la nouvelle arborescence cible sans déplacer encore les anciens fichiers.
2. Créer les huit documents de contrôle prioritaires (`DOCUMENT_MAP`, `SOURCE_OF_TRUTH`, `GLOSSARY`, `MEMORY_CORE`, `QUICK_REFERENCE`, `CPS_MAPPING_PROJECT`, `LIVRABLES_MATRIX`, `EVIDENCE_REGISTER`).
3. Promouvoir les documents maîtres de référence en copiant/renommant les meilleurs candidats dans `01_project_reference/`.
4. Recomposer la base IA à partir de `kit_documentation_ia/` uniquement, en sortant tous les prompts vers `04_working_prompts_and_runs/`.
5. Déplacer les notes de travail de la racine `docs/` vers `04_working_prompts_and_runs/`.
6. Basculer tous les audits, exports bruts et snapshots vers `99_legacy_archive/`.
7. Mettre à jour les README du dépôt et les liens croisés pour ne pointer que vers les nouveaux maîtres.
8. Supprimer les doublons concurrents `10_ia_kit/*` hors éléments uniques uniquement après validation des fusions.
