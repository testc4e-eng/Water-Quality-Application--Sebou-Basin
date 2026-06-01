# SOURCE_OF_TRUTH

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | gouvernance documentaire et sources de vérité |
| Source de vérité | Oui |
| Documents liés | [../00_SOURCE_OF_TRUTH_MASTER.md](../00_SOURCE_OF_TRUTH_MASTER.md), [DOCUMENT_MAP](./DOCUMENT_MAP.md), [README](./README.md) |
| Dernière mise à jour | 2026-05-22 |

## 1. Règles générales

- Une seule source de vérité par sujet.
- Un document dérivé peut résumer un document maître, mais ne doit pas le concurrencer.
- Un document placé en archive n’est plus un support de décision courant.
- Un export bureautique n’est jamais la référence primaire si une version Markdown existe.
- Si code, DB et documentation divergent, la vérité opérationnelle vérifiée prévaut et la documentation doit être corrigée.

## 2. Rôle du master transverse

Le document [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) est la photographie transverse vérifiée du système réel :

- architecture réellement observée ;
- base réellement observée ;
- API réellement montée ;
- frontend réellement routé ;
- statut réel des lots et blocages.

Il prime sur tout résumé ou toute spécification cible lorsqu’un écart est démontré.

## 3. Matrice des sujets maîtres

| Sujet | Document maître | Documents dérivés / d’appui | Documents archivés ou non maîtres |
|---|---|---|---|
| Photographie transverse du système réel | [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) | [DOCUMENT_MAP](./DOCUMENT_MAP.md), [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md) | anciens états globaux dispersés |
| Priorisation documentaire | [00_documents_prioritaires](../00_source_of_truth/00_documents_prioritaires.md) | [README](../README.md), [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md) | index historiques dispersés |
| État global projet | [00_project_global_status](../04_etat_avancement/00_project_global_status.md) | [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) | anciens statuts par lots et phases |
| MVP et périmètre | [01_mvp_scope](../01_contexte_projet/01_mvp_scope.md) | [00_project_global_status](../04_etat_avancement/00_project_global_status.md) | notes de périmètre dispersées |
| Problèmes racines | [00_problemes_racines](../05_blocages_et_risques/00_problemes_racines.md) | [34_synthese_strategique_anomalies](../34_synthese_strategique_anomalies/00_vue_globale.md) | fiches anomalies isolées |
| Registre des décisions | [00_registre_decisions](../02_gouvernance_et_decisions/00_registre_decisions.md) | dossiers d'arbitrage et rapports de lots | décisions implicites dans notes historiques |
| Cartographie des données stratégique | [00_data_landscape](../07_donnees_et_referentiels/00_data_landscape.md) | [DATABASE_SCHEMA_SUMMARY](../03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md), [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) | inventaires bruts dispersés |
| Source consolidée 2026-05-22 | [01_source_of_truth_consolidee](../00_source_of_truth/01_source_of_truth_consolidee.md) | [90_reorganisation_documentaire_finale](../90_reorganisation_documentaire_finale/00_index.md) | anciens rapports d'audit dispersés |
| Rapport de réorganisation documentaire | [16_rapport_final_reorganisation](../90_reorganisation_documentaire_finale/16_rapport_final_reorganisation.md) | [17_execution_deplacement_lot_a](../90_reorganisation_documentaire_finale/17_execution_deplacement_lot_a.md) | mappings non exécutés |
| Cartographie documentaire | [DOCUMENT_MAP](./DOCUMENT_MAP.md) | `docs/README.md` | anciens index dispersés |
| Gouvernance documentaire | [SOURCE_OF_TRUTH](./SOURCE_OF_TRUTH.md) | [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md) | notes de restructuration historiques |
| Vision projet | [project_vision](./overview/project_vision.md) | [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md) | anciens overview dispersés |
| Standards et gouvernance data | [data_governance_and_standards](./overview/data_governance_and_standards.md) | [GLOSSARY](./GLOSSARY.md) | notes transverses anciennes |
| Architecture système | [system_architecture](./architecture/system_architecture.md) | [architecture_for_agents](../03_ai_knowledge_base/architecture_for_agents.md) | anciens récits d’architecture |
| Architecture base de données | [database_architecture](./architecture/database_architecture.md) | [DATABASE_SCHEMA](./data/DATABASE_SCHEMA.md), [DATABASE_SCHEMA_SUMMARY](../03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md) | anciens récits BD concurrents |
| Réalité backend déployée | [backend_overview](./backend/backend_overview.md) | [api_for_agents](../03_ai_knowledge_base/api_for_agents.md), [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) | anciennes notes backend dispersées |
| API réellement observée | [backend_overview](./backend/backend_overview.md) | [api_for_agents](../03_ai_knowledge_base/api_for_agents.md), [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) | snapshots non vérifiés |
| API cible / spécification | [api_contracts](./backend/api_contracts.md) | [traceability_matrix](./backend/traceability_matrix.md) | anciens snapshots OpenAPI / notes concurrentes |
| Traçabilité backend | [traceability_matrix](./backend/traceability_matrix.md) | [EVIDENCE_REGISTER](./EVIDENCE_REGISTER.md) | anciennes notes isolées |
| Référence frontend | [frontend_reference](./frontend/frontend_reference.md) | [QUICK_REFERENCE](../03_ai_knowledge_base/QUICK_REFERENCE.md), [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) | anciennes docs frontend concurrentes |
| Dictionnaire de données détaillé | [DATABASE_SCHEMA](./data/DATABASE_SCHEMA.md) | [DATABASE_SCHEMA_SUMMARY](../03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md) | anciens dictionnaires et exports bruts |
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

## 4. Ce qui n’est pas une source de vérité

- `docs/04_working_prompts_and_runs/*`
- `docs/99_legacy_archive/*`
- `docs/02_contractual_and_reports/mission_iv/generated_exports/*`
- les documents historiques de merge, de prompt ou de migration détaillée conservés pour traçabilité
- tout document de spécification non vérifié par le code ou la base
- les anciens chemins racine déplacés vers `docs/12_historique_et_archives/root_legacy/`, sauf comme références historiques dans le mapping de réorganisation

## 5. Règle de maintenance

Lorsqu’un sujet évolue :

1. mettre à jour le document maître ;
2. ajuster, si nécessaire, les documents dérivés ;
3. ne pas créer un nouveau document maître concurrent pour le même sujet ;
4. si la vérité opérationnelle diffère d’une spécification cible, documenter explicitement l’écart au lieu de masquer la divergence.
