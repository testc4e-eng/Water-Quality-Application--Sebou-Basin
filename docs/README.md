# Documentation Projet

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | index |
| Périmètre | dossier `docs` complet |
| Source de vérité | Oui |
| Documents liés | [DOCUMENT_MAP](./01_project_reference/DOCUMENT_MAP.md), [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md) |
| Dernière mise à jour | 2026-04-10 |

## Rôle du dossier `docs`

Le dossier `docs` constitue le référentiel documentaire unique du projet. Il est structuré pour servir simultanément :

- la documentation de référence du projet ;
- la mémoire projet et la mémoire métier utilisables par les agents IA ;
- la préparation des rapports, annexes et livrables contractuels ;
- la conservation des notes de travail et des historiques utiles sans concurrencer les documents maîtres.

## Arborescence active

| Dossier | Rôle |
|---|---|
| `01_project_reference/` | Références durables du projet, sources de vérité techniques et documentaires |
| `02_contractual_and_reports/` | CPS, rapports Mission IV, annexes contractuelles et exports bureautiques |
| `03_ai_knowledge_base/` | Mémoire courte et robuste destinée aux agents IA |
| `04_working_prompts_and_runs/` | Prompts, runs, notes d’exécution, workflows de tests et historiques d’atelier |
| `99_legacy_archive/` | Archives techniques, snapshots, anciens doublons et historiques non maîtres |

## Lecture recommandée

### Pour un développeur ou un chef de projet

1. [DOCUMENT_MAP](./01_project_reference/DOCUMENT_MAP.md)
2. [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md)
3. [README projet de référence](./01_project_reference/README.md)
4. [DATABASE_SCHEMA](./01_project_reference/data/DATABASE_SCHEMA.md)

### Pour un agent IA

1. [MEMORY_CORE](./03_ai_knowledge_base/MEMORY_CORE.md)
2. [QUICK_REFERENCE](./03_ai_knowledge_base/QUICK_REFERENCE.md)
3. [DATABASE_SCHEMA_SUMMARY](./03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md)
4. [AGENT_RULES](./03_ai_knowledge_base/AGENT_RULES.md)

### Pour un livrable Mission IV

1. [CPS requirements summary](./02_contractual_and_reports/cps/cps_requirements_summary.md)
2. [CPS mapping project](./02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md)
3. [Rapport provisoire Mission IV](./02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md)
4. [Evidence register](./01_project_reference/EVIDENCE_REGISTER.md)
5. [DATABASE_SCHEMA](./01_project_reference/data/DATABASE_SCHEMA.md)

## Règles de maintenance

- Un sujet documentaire ne doit avoir qu’une seule source de vérité.
- Les documents de `03_ai_knowledge_base/` résument les références ; ils ne les remplacent pas.
- Les fichiers de `04_working_prompts_and_runs/` servent de mémoire d’exécution ; ils ne font pas autorité.
- Les exports bureautiques ne remplacent jamais la version Markdown source.
- Les archives sont conservées pour traçabilité, pas pour usage courant.
