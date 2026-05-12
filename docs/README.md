# Documentation Projet

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | index |
| Périmètre | dossier `docs` complet |
| Source de vérité | Oui |
| Documents liés | [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md), [DOCUMENT_MAP](./01_project_reference/DOCUMENT_MAP.md), [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md) |
| Dernière mise à jour | 2026-04-17 |

## Rôle du dossier `docs`

Le dossier `docs` constitue le référentiel documentaire du projet. Il doit servir simultanément :

- la documentation de référence du projet ;
- la mémoire projet et la mémoire métier utilisables par les agents IA ;
- la préparation des rapports, annexes et livrables contractuels ;
- la conservation des notes de travail et des historiques utiles sans concurrencer les documents maîtres.

La porte d’entrée prioritaire vers la réalité vérifiée du système est désormais [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md).

## Arborescence active

| Dossier / document | Rôle |
|---|---|
| `00_SOURCE_OF_TRUTH_MASTER.md` | photographie transverse vérifiée DB + backend + frontend + lots |
| `01_project_reference/` | références durables du projet, sources de vérité techniques et documentaires |
| `02_contractual_and_reports/` | CPS, rapports Mission IV, annexes contractuelles et exports bureautiques |
| `03_ai_knowledge_base/` | mémoire courte et robuste destinée aux agents IA |
| `04_working_prompts_and_runs/` | prompts, runs, notes d’exécution, workflows de tests et historiques d’atelier |
| `99_legacy_archive/` | archives techniques, snapshots, anciens doublons et historiques non maîtres |

## Lecture recommandée

### Pour un développeur ou un chef de projet

1. [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md)
2. [DOCUMENT_MAP](./01_project_reference/DOCUMENT_MAP.md)
3. [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md)
4. [README projet de référence](./01_project_reference/README.md)
5. [DATABASE_SCHEMA](./01_project_reference/data/DATABASE_SCHEMA.md)

### Pour un agent IA

1. [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md)
2. [MEMORY_CORE](./03_ai_knowledge_base/MEMORY_CORE.md)
3. [QUICK_REFERENCE](./03_ai_knowledge_base/QUICK_REFERENCE.md)
4. [DATABASE_SCHEMA_SUMMARY](./03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md)
5. [api_for_agents](./03_ai_knowledge_base/api_for_agents.md)

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
