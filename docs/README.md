# Documentation Projet

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | index |
| Périmètre | dossier `docs` complet |
| Source de vérité | Oui |
| Documents liés | [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md), [DOCUMENT_MAP](./01_project_reference/DOCUMENT_MAP.md), [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md) |
| Dernière mise à jour | 2026-05-22 |

## Rôle du dossier `docs`

Le dossier `docs` constitue le référentiel documentaire du projet. Il doit servir simultanément :

- la documentation de référence du projet ;
- la mémoire projet et la mémoire métier utilisables par les agents IA ;
- la préparation des rapports, annexes et livrables contractuels ;
- la conservation des notes de travail et des historiques utiles sans concurrencer les documents maîtres.

La porte d’entrée prioritaire vers la réalité vérifiée du système est [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md).

Depuis le 2026-05-22, le pilotage projet passe aussi par une couche de gouvernance décisionnelle. Cette couche ne remplace pas les preuves techniques ; elle organise le statut, le périmètre, les problèmes racines, les décisions et la cartographie des données.

## Arborescence active

| Dossier / document | Rôle |
|---|---|
| `00_SOURCE_OF_TRUTH_MASTER.md` | photographie transverse vérifiée DB + backend + frontend + lots |
| `00_source_of_truth/` | priorisation documentaire, documents actifs, historiques, expérimentaux et obsolètes |
| `01_contexte_projet/` | contexte projet, MVP et périmètre officiel |
| `01_project_reference/` | références durables du projet, sources de vérité techniques et documentaires |
| `02_gouvernance_et_decisions/` | registre des décisions et gouvernance projet |
| `02_contractual_and_reports/` | CPS, rapports Mission IV, annexes contractuelles et exports bureautiques |
| `03_architecture_globale/` | index stratégique vers l'architecture active |
| `03_ai_knowledge_base/` | mémoire courte et robuste destinée aux agents IA |
| `04_etat_avancement/` | cockpit d'état global projet |
| `04_working_prompts_and_runs/` | prompts, runs, notes d’exécution, workflows de tests et historiques d’atelier |
| `05_blocages_et_risques/` | problèmes racines, risques et blocages |
| `06_anomalies_et_arbitrages/` | espace cible pour arbitrages métier détaillés |
| `07_donnees_et_referentiels/` | cartographie data, référentiels et fiabilité |
| `08_pipelines_et_ingestion/` | espace cible pipelines officiels et ingestion |
| `09_modeles_swat_wasp/` | espace cible modèles SWAT/WASP officiels ou sandbox |
| `10_dashboards_et_api/` | espace cible dashboards, API et contrats de restitution |
| `11_execution_technique/` | espace cible runbooks, exécution et exploitation |
| `12_historique_et_archives/` | espace cible historique non legacy |
| `90_reorganisation_documentaire_finale/` | audit de réorganisation, mapping, écarts documentation/BD et rapport final |
| `99_legacy_archive/` | archives techniques, snapshots, anciens doublons et historiques non maîtres |

## Lecture recommandée

### Pour un développeur ou un chef de projet

1. [État global projet](./04_etat_avancement/00_project_global_status.md)
2. [MVP et périmètre](./01_contexte_projet/01_mvp_scope.md)
3. [Problèmes racines](./05_blocages_et_risques/00_problemes_racines.md)
4. [Registre des décisions](./02_gouvernance_et_decisions/00_registre_decisions.md)
5. [Cartographie des données](./07_donnees_et_referentiels/00_data_landscape.md)
6. [Source consolidée](./00_source_of_truth/01_source_of_truth_consolidee.md)
7. [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md)

### Pour un agent IA

1. [Documents prioritaires](./00_source_of_truth/00_documents_prioritaires.md)
2. [État global projet](./04_etat_avancement/00_project_global_status.md)
3. [MVP et périmètre](./01_contexte_projet/01_mvp_scope.md)
4. [Problèmes racines](./05_blocages_et_risques/00_problemes_racines.md)
5. [Registre des décisions](./02_gouvernance_et_decisions/00_registre_decisions.md)
6. [Source consolidée](./00_source_of_truth/01_source_of_truth_consolidee.md)
7. [Rapport de réorganisation](./90_reorganisation_documentaire_finale/16_rapport_final_reorganisation.md)
8. [MEMORY_CORE](./03_ai_knowledge_base/MEMORY_CORE.md)

### Pour un livrable Mission IV

1. [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md)
2. [CPS requirements summary](./02_contractual_and_reports/cps/cps_requirements_summary.md)
3. [CPS mapping project](./02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md)
4. [Rapport provisoire Mission IV](./02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md)
5. [Evidence register](./01_project_reference/EVIDENCE_REGISTER.md)
6. [DATABASE_SCHEMA](./01_project_reference/data/DATABASE_SCHEMA.md)

## Règles de maintenance

- Un sujet documentaire ne doit avoir qu’une seule source de vérité.
- Les documents de `03_ai_knowledge_base/` résument les références ; ils ne les remplacent pas.
- Les fichiers de `04_working_prompts_and_runs/` servent de mémoire d’exécution ; ils ne font pas autorité.
- Les exports bureautiques ne remplacent jamais la version Markdown source.
- Les archives sont conservées pour traçabilité, pas pour usage courant.
- Si une spécification cible diverge de la réalité technique vérifiée, il faut documenter l’écart explicitement au lieu de laisser la divergence implicite.
