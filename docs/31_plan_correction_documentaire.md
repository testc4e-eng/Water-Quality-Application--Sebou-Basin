# Plan de Correction Documentaire

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | working_note |
| Perimetre | arbitrage des sources de verite et plan de mise a jour documentaire |
| Source de verite | Non |
| Documents lies | [30_audit_incoherences_global](./30_audit_incoherences_global.md), [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md), [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md) |
| Derniere mise a jour | 2026-04-17 |

## 1. Regle directrice

Ordre de precedence retenu pour cette consolidation :

1. base `abh_sad` verifiee en lecture seule ;
2. code backend et frontend effectivement presents dans le depot ;
3. documentation active corrigee pour s'aligner sur 1 et 2 ;
4. documents devenus speculatifs ou prospectifs reclasses comme reference cible, backlog ou historique.

## 2. Strategie par incoherence

| ID audit | Source de verite retenue | Decision | Fichiers a corriger |
|---|---|---|---|
| `INC-DB-001` | DB | Mettre a jour les cardinalites de `DATABASE_SCHEMA_SUMMARY.md`. | `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md` |
| `INC-DB-002` | DB | Reprendre les schemas applicatifs reels et leurs comptages. | `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| `INC-DOC-001` | Documentation active | Remplacer la reference manquante `data_dictionary.md` par le referentiel reel `DATABASE_SCHEMA.md`. | `docs/01_project_reference/LIVRABLES_MATRIX.md` |
| `INC-API-001` | Backend code | Recrire `backend_overview.md` a partir de `main.py`, `api_v1.py` et des routeurs montes. | `docs/01_project_reference/backend/backend_overview.md` |
| `INC-API-002` | Backend + DB | Ne plus presenter `api_contracts.md` comme verite de l'API deployee. Le reclasser implicitement en reference cible / backlog contractuel. | `docs/01_project_reference/SOURCE_OF_TRUTH.md`, `docs/01_project_reference/DOCUMENT_MAP.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| `INC-FE-001` | Frontend code | Recrire l'inventaire des routes UI a partir de `frontend/src/App.tsx`. | `docs/01_project_reference/frontend/frontend_reference.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| `INC-FE-002` | Frontend code | Documenter `admin/gestion-users` comme route reelle et `admin/users`, `admin/audit` comme redirections. | `docs/01_project_reference/frontend/frontend_reference.md` |
| `INC-PROJ-001` | Dossier lots actif (`12_*`, `14_*`, `20_*`...) | Refaire le statut par lot a partir des audits, dry-runs et blocages ouverts. | `docs/12_plan_execution_par_lots.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| `INC-BE-DB-001` | Backend + DB | Documenter explicitement les segments legacy encore relies a `public.*` absent de `abh_sad`. Ne pas les presenter comme stables. | `docs/01_project_reference/backend/backend_overview.md`, `docs/03_ai_knowledge_base/api_for_agents.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| `INC-BE-API-001` | Backend code | Signaler le double prefix probable du routeur SWAT analysis et le sortir du contrat API stable. | `docs/01_project_reference/backend/backend_overview.md`, `docs/03_ai_knowledge_base/api_for_agents.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| `INC-FE-BE-001` | Frontend code + docs ops | Documenter la divergence de configuration locale `8000` vs `8011` comme dette technique courante. | `docs/01_project_reference/frontend/frontend_reference.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| `INC-DOC-002` | Gouvernance documentaire | Ajouter un document maitre transverse et ajuster la matrice de verite. | `docs/00_SOURCE_OF_TRUTH_MASTER.md`, `docs/01_project_reference/SOURCE_OF_TRUTH.md`, `docs/01_project_reference/DOCUMENT_MAP.md`, `docs/README.md` |
| `INC-DOC-003` | Backend + frontend code | Introduire dans les docs une distinction explicite entre modules verifies, modules legacy et zones a risque. | `docs/01_project_reference/backend/backend_overview.md`, `docs/01_project_reference/frontend/frontend_reference.md`, `docs/00_SOURCE_OF_TRUTH_MASTER.md` |

## 3. Corrections appliquees dans ce cycle

Documents cibles :

- creation de `docs/00_SOURCE_OF_TRUTH_MASTER.md`
- creation de `docs/30_audit_incoherences_global.md`
- creation de `docs/31_plan_correction_documentaire.md`
- mise a jour de `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
- mise a jour de `docs/03_ai_knowledge_base/api_for_agents.md`
- mise a jour de `docs/01_project_reference/backend/backend_overview.md`
- mise a jour de `docs/01_project_reference/frontend/frontend_reference.md`
- mise a jour de `docs/01_project_reference/DOCUMENT_MAP.md`
- mise a jour de `docs/01_project_reference/SOURCE_OF_TRUTH.md`
- mise a jour de `docs/01_project_reference/LIVRABLES_MATRIX.md`
- mise a jour de `docs/12_plan_execution_par_lots.md`
- mise a jour de `docs/README.md`

## 4. Regle de maintenance post-correction

Quand un doute apparait :

1. verifier la base `abh_sad` ;
2. verifier les routeurs montes dans `backend/app/api/api_v1.py` ;
3. verifier les routes React dans `frontend/src/App.tsx` ;
4. corriger d'abord `00_SOURCE_OF_TRUTH_MASTER.md` et le document maitre du domaine ;
5. seulement ensuite ajuster les resumes IA et les documents derives.
