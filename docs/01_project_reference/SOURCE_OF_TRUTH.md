# SOURCE_OF_TRUTH

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | gouvernance documentaire et sources de vérité |
| Source de vérité | Oui |
| Documents liés | [DOCUMENT_MAP](./DOCUMENT_MAP.md), [README](./README.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Règles générales

- Une seule source de vérité par sujet.
- Un document dérivé peut résumer un document maître, mais ne doit pas le concurrencer.
- Un document placé en archive n’est plus un support de décision courant.
- Un export bureautique n’est jamais la référence primaire si une version Markdown existe.

## 2. Matrice des sujets maîtres

| Sujet | Document maître | Documents dérivés / d’appui | Documents archivés ou non maîtres |
|---|---|---|---|
| Cartographie documentaire | [DOCUMENT_MAP](./DOCUMENT_MAP.md) | `docs/README.md` | anciens index dispersés |
| Gouvernance documentaire | [SOURCE_OF_TRUTH](./SOURCE_OF_TRUTH.md) | [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md) | notes de restructuration historiques |
| Vision projet | [project_vision](./overview/project_vision.md) | [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md) | anciens overview dispersés |
| Standards et gouvernance data | [data_governance_and_standards](./overview/data_governance_and_standards.md) | [GLOSSARY](./GLOSSARY.md) | notes transverses anciennes |
| Architecture système | [system_architecture](./architecture/system_architecture.md) | [architecture_for_agents](../03_ai_knowledge_base/architecture_for_agents.md) | anciens récits d’architecture |
| Architecture base de données | [database_architecture](./architecture/database_architecture.md) | [DATABASE_SCHEMA](./data/DATABASE_SCHEMA.md), [database_for_agents](../03_ai_knowledge_base/database_for_agents.md) | anciens récits BD concurrents |
| Référence backend | [backend_overview](./backend/backend_overview.md) | [api_for_agents](../03_ai_knowledge_base/api_for_agents.md) | anciennes notes backend dispersées |
| Contrats API | [api_contracts](./backend/api_contracts.md) | [api_for_agents](../03_ai_knowledge_base/api_for_agents.md) | anciens snapshots OpenAPI / notes concurrentes |
| Traçabilité backend | [traceability_matrix](./backend/traceability_matrix.md) | [EVIDENCE_REGISTER](./EVIDENCE_REGISTER.md) | anciennes notes isolées |
| Référence frontend | [frontend_reference](./frontend/frontend_reference.md) | [QUICK_REFERENCE](../03_ai_knowledge_base/QUICK_REFERENCE.md) | anciennes docs frontend concurrentes |
| Dictionnaire de données détaillé | [DATABASE_SCHEMA](./data/DATABASE_SCHEMA.md) | [DATABASE_SCHEMA_SUMMARY](../03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md), [database_for_agents](../03_ai_knowledge_base/database_for_agents.md) | anciens dictionnaires et exports bruts |
| Modèle logique des données | [DATA_MODELS](./data/DATA_MODELS.md) | [DATABASE_SCHEMA_SUMMARY](../03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md) | anciennes notes BD dispersées |
| Flux de données | [DATA_FLOW](./data/DATA_FLOW.md) | [database_for_agents](../03_ai_knowledge_base/database_for_agents.md) | anciennes notes de flux dispersées |
| Qualité et gouvernance des données | [DATA_QUALITY](./data/DATA_QUALITY.md) | [EVIDENCE_REGISTER](./EVIDENCE_REGISTER.md) | anciennes notes QA dispersées |
| Mapping API/data | [API_DATA_MAPPING](./data/API_DATA_MAPPING.md) | [database_for_agents](../03_ai_knowledge_base/database_for_agents.md) | anciens documents de vues concurrents |
| Sources de données | [data_sources_reference](./data/data_sources_reference.md) | [GLOSSARY](./GLOSSARY.md) | ancien inventaire isolé |
| Historique migration data | [data_migration_history_summary](./data/data_migration_history_summary.md) | [EVIDENCE_REGISTER](./EVIDENCE_REGISTER.md) | historiques détaillés en archive |
| Déploiement et exploitation | [deployment_and_operations](./deployment_operations/deployment_and_operations.md) | [deployment_for_agents](../03_ai_knowledge_base/deployment_for_agents.md), [QUICK_REFERENCE](../03_ai_knowledge_base/QUICK_REFERENCE.md) | anciens guides `06_deployment` et `08_roadmap` |
| Exigences CPS | [cps_requirements_summary](../02_contractual_and_reports/cps/cps_requirements_summary.md) | [CPS_MAPPING_PROJECT](../02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md) | notes de synthèse dispersées |
| Mapping CPS/projet | [CPS_MAPPING_PROJECT](../02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md) | [rapport_provisoire_mission_iv_sad](../02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md) | anciennes tables de conformité isolées |
| Rapport Mission IV | [rapport_provisoire_mission_iv_sad](../02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md) | export `.docx` généré | ancien rapport à l’emplacement racine |
| Mémoire agent | [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md) | [QUICK_REFERENCE](../03_ai_knowledge_base/QUICK_REFERENCE.md), [AGENT_RULES](../03_ai_knowledge_base/AGENT_RULES.md) | anciens kits concurrents |

## 3. Ce qui n’est pas une source de vérité

- `docs/04_working_prompts_and_runs/*`
- `docs/99_legacy_archive/*`
- `docs/02_contractual_and_reports/mission_iv/generated_exports/*`
- les documents historiques de merge, de prompt ou de migration détaillée conservés pour traçabilité

## 4. Règle de maintenance

Lorsqu’un sujet évolue :

1. mettre à jour le document maître ;
2. ajuster, si nécessaire, les documents dérivés ;
3. ne pas créer un nouveau document maître concurrent pour le même sujet.
