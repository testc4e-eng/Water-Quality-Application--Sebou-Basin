# DOCUMENT_MAP

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | cartographie documentaire projet |
| Source de vérité | Oui |
| Documents liés | [SOURCE_OF_TRUTH](./SOURCE_OF_TRUTH.md), [LIVRABLES_MATRIX](./LIVRABLES_MATRIX.md), [EVIDENCE_REGISTER](./EVIDENCE_REGISTER.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Organisation cible en production

| Zone | Usage principal | Niveau d’autorité | Utilisation par agents IA |
|---|---|---|---|
| `docs/01_project_reference` | Documentation de référence durable | Maître | Oui, lecture prioritaire |
| `docs/02_contractual_and_reports` | CPS, rapports, annexes et exports | Maître sur le volet contractuel | Oui, pour rédaction et conformité |
| `docs/03_ai_knowledge_base` | Mémoire courte, rappels et règles agents | Dérivé contrôlé | Oui, lecture rapide |
| `docs/04_working_prompts_and_runs` | Prompts, runs, notes de travail, workflows ciblés | Non maître | Oui, en contexte de fabrication uniquement |
| `docs/99_legacy_archive` | Historique, snapshots, anciens doublons | Archive | Non, sauf besoin explicite de traçabilité |

## 2. Navigation par besoin

### Architecture projet

- [Vision projet](./overview/project_vision.md)
- [Gouvernance et standards](./overview/data_governance_and_standards.md)
- [Architecture système](./architecture/system_architecture.md)
- [Architecture base de données](./architecture/database_architecture.md)

### Référence applicative

- [Backend overview](./backend/backend_overview.md)
- [API contracts](./backend/api_contracts.md)
- [Traceability matrix](./backend/traceability_matrix.md)
- [Frontend reference](./frontend/frontend_reference.md)

### Référence data

- [DATABASE_SCHEMA](./data/DATABASE_SCHEMA.md)
- [DATA_MODELS](./data/DATA_MODELS.md)
- [DATA_FLOW](./data/DATA_FLOW.md)
- [DATA_QUALITY](./data/DATA_QUALITY.md)
- [API_DATA_MAPPING](./data/API_DATA_MAPPING.md)
- [SQL introspection and metadata](./data/sql_introspection_and_metadata.md)
- [Data sources reference](./data/data_sources_reference.md)
- [Data migration history summary](./data/data_migration_history_summary.md)

### Déploiement et exploitation

- [Deployment and operations](./deployment_operations/deployment_and_operations.md)

### Livrables et conformité

- [CPS requirements summary](../02_contractual_and_reports/cps/cps_requirements_summary.md)
- [CPS mapping project](../02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md)
- [Rapport provisoire Mission IV](../02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md)
- [Livrables matrix](./LIVRABLES_MATRIX.md)
- [Evidence register](./EVIDENCE_REGISTER.md)

### Connaissance IA

- [MEMORY_CORE](../03_ai_knowledge_base/MEMORY_CORE.md)
- [QUICK_REFERENCE](../03_ai_knowledge_base/QUICK_REFERENCE.md)
- [AGENT_RULES](../03_ai_knowledge_base/AGENT_RULES.md)

## 3. Règles d’usage

- Un document actif doit appartenir à une seule zone logique.
- Un sujet technique ne doit pas être traité dans plusieurs documents maîtres concurrents.
- Les historiques de run, prompts et notes de fusion restent hors des zones maîtres.
- Les exports bureautiques sont conservés dans `generated_exports/` sans devenir des références maîtres.

## 4. Format d’en-tête standard Markdown

Tous les nouveaux documents actifs doivent reprendre l’en-tête suivant :

```md
# Titre du document

| Champ | Valeur |
|---|---|
| Statut | Actif / Archive / Généré |
| Type | reference / report / summary / prompt / working_note / archive |
| Périmètre | domaine couvert par le document |
| Source de vérité | Oui / Non |
| Documents liés | liens vers les documents actifs liés |
| Dernière mise à jour | AAAA-MM-JJ |
```

## 5. Procédure de mise à jour

1. Mettre à jour le document maître concerné.
2. Ajuster les résumés dérivés si nécessaire dans `03_ai_knowledge_base/`.
3. Ajouter ou compléter la preuve documentaire dans [EVIDENCE_REGISTER](./EVIDENCE_REGISTER.md) si la modification crée un nouveau livrable ou une nouvelle preuve.
4. Vérifier les liens d’entrée dans `README.md`, `backend/README.md`, `frontend/README.md` et `docs/README.md`.
