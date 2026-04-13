# LIVRABLES_MATRIX

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | matrice de suivi des livrables documentaires et techniques |
| Source de vérité | Oui |
| Documents liés | [EVIDENCE_REGISTER](./EVIDENCE_REGISTER.md), [CPS_MAPPING_PROJECT](../02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md) |
| Dernière mise à jour | 2026-04-10 |

## Matrice

| Livrable | Emplacement maître | Finalité | Statut documentaire | Source de vérité |
|---|---|---|---|---|
| Cartographie documentaire | `docs/01_project_reference/DOCUMENT_MAP.md` | Point d’entrée du référentiel | Actif | Oui |
| Gouvernance documentaire | `docs/01_project_reference/SOURCE_OF_TRUTH.md` | Règles de vérité et maintenance | Actif | Oui |
| Glossaire | `docs/01_project_reference/GLOSSARY.md` | Vocabulaire métier et technique partagé | Actif | Oui |
| Architecture système | `docs/01_project_reference/architecture/system_architecture.md` | Référence de conception applicative | Actif | Oui |
| Architecture base de données | `docs/01_project_reference/architecture/database_architecture.md` | Référence de structuration des données | Actif | Oui |
| Référence backend | `docs/01_project_reference/backend/backend_overview.md` | Vue backend et modules API | Actif | Oui |
| Contrats API | `docs/01_project_reference/backend/api_contracts.md` | Catalogue d’accès et conventions d’API | Actif | Oui |
| Référence frontend | `docs/01_project_reference/frontend/frontend_reference.md` | Vue UI, dashboards, routes, intégration API | Actif | Oui |
| Dictionnaire de données | `docs/01_project_reference/data/data_dictionary.md` | Description fonctionnelle des structures de données | Actif | Oui |
| Référence déploiement/ops | `docs/01_project_reference/deployment_operations/deployment_and_operations.md` | Déploiement local, exploitation et maintenance | Actif | Oui |
| Mapping CPS / projet | `docs/02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md` | Couverture des exigences Mission IV | Actif | Oui |
| Rapport provisoire Mission IV | `docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md` | Livrable de restitution principal | Actif | Oui |
| Export Word du rapport | `docs/02_contractual_and_reports/mission_iv/generated_exports/Rapport_Provisoire_Mission_IV_SAD.docx` | Export bureautique du rapport | Généré | Non |
| Mémoire agent | `docs/03_ai_knowledge_base/MEMORY_CORE.md` | Noyau de contexte pour agents IA | Actif | Oui sur le périmètre IA |
| Quick reference IA | `docs/03_ai_knowledge_base/QUICK_REFERENCE.md` | Accès rapide pour agents et intervenants techniques | Actif | Oui sur le périmètre IA |
| Registre de preuves | `docs/01_project_reference/EVIDENCE_REGISTER.md` | Base de preuves mobilisables dans les livrables | Actif | Oui |

## Principes

- La version Markdown est la source de vérité pour tout livrable éditable.
- Les exports `.docx` ou `.pdf` sont des formats de diffusion.
- Les documents d’archive et les notes d’exécution ne sont pas des livrables maîtres.
