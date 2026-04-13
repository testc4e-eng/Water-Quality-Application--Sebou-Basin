# CPS_MAPPING_PROJECT

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | mapping des exigences Mission IV vers les composants projet |
| Source de vérité | Oui |
| Documents liés | [cps_requirements_summary](./cps_requirements_summary.md), [rapport_provisoire_mission_iv_sad](../mission_iv/rapport_provisoire_mission_iv_sad.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Objet

Ce document relie les exigences majeures de la Mission IV aux modules effectivement structurés dans le projet et aux documents maîtres permettant d’en justifier la couverture.

## 2. Tableau de mapping

| Exigence CPS | Réponse projet | Composants / preuves principales | Niveau de couverture documentaire |
|---|---|---|---|
| Centralisation et intégration des données | Schémas métier, `staging`, `metadata`, vues `api`, modules `raw` et `data-scan` | `database_architecture.md`, backend routes `raw`, `meta`, `admin/data-scan` | Couvert |
| Intégration des modèles et scénarios | Schémas `swat_*`, `wasp_*`, module admin d’ingestion, QA et audit | `database_architecture.md`, `IngestionPage`, routes `ingestion/*`, rapport Mission IV | Couvert |
| Tableaux de bord interactifs | Dashboards analytiques et cartographiques React | `frontend_reference.md`, `frontend/src/App.tsx`, pages dashboards | Couvert |
| Cartes thématiques | Couches `layers/*`, objets géographiques `api.mv_*_geojson`, popup rules | `system_architecture.md`, `database_architecture.md`, `frontend_reference.md` | Couvert |
| Rapports personnalisés / exports | exports PDF, CSV, XLSX, image selon les modules | `frontend_reference.md`, rapport Mission IV | Couvert en finalisation |
| Aide à la décision | Observatoire, KPI, comparaisons multi-séries, scénarios, cartographie métier | rapport Mission IV, architecture système, dashboards | Couvert |
| Architecture full web | Stack React + FastAPI + PostgreSQL/PostGIS | `system_architecture.md` | Couvert |
| Compatibilité HTTPS | Architecture découplée et déployable en environnement sécurisé | `deployment_and_operations.md` | Couvert en finalisation |
| Technologies modernes | React, Vite, TypeScript, FastAPI, PostgreSQL, PostGIS, TimescaleDB | `system_architecture.md`, `database_architecture.md` | Couvert |
| Sécurité informatique | Comptes, rôles, jetons, logs, routes protégées | `backend_overview.md`, `database_architecture.md`, `EVIDENCE_REGISTER.md` | Couvert en finalisation |
| Responsive / usage mobile | Frontend web structuré avec adaptation progressive des écrans | `frontend_reference.md`, rapport Mission IV | Couvert en finalisation |
| Habilitations et droits nominatifs | `security.users`, `roles`, `permissions`, écrans admin utilisateurs | `database_architecture.md`, `backend_overview.md`, `frontend_reference.md` | Couvert |
| Traçabilité des opérations | `security.activity_logs`, `auth_logs`, `audit.ingestion_audit_logs` | `traceability_matrix.md`, `EVIDENCE_REGISTER.md` | Couvert en finalisation |
| Extraction multi-formats | PDF, CSV, XLSX, PNG/exports écran selon modules | rapport Mission IV, `frontend_reference.md` | Couvert en finalisation |
| Base de données intégrée | Base `abh_sad` sectorisée en schémas métier et vues d’exposition | `database_architecture.md`, `data_dictionary.md` | Couvert |
| Tests de fonctionnement | workflows ciblés, tests de run et validation fonctionnelle en consolidation | `04_working_prompts_and_runs/*`, rapport Mission IV | Couvert en finalisation |
| Maintenance | guide d’exploitation et maintenance, scripts de refresh et procédures d’ops | `deployment_and_operations.md` | Couvert au titre du dispositif préparatoire |

## 3. Usage

Ce mapping sert directement :

- à l’alimentation du rapport Mission IV ;
- à la préparation des tableaux de conformité ;
- à la justification des choix techniques face au maître d’ouvrage ;
- à la préparation des annexes et synthèses de pilotage.
