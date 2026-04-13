# EVIDENCE_REGISTER

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | registre des preuves techniques, fonctionnelles et documentaires |
| Source de vérité | Oui |
| Documents liés | [LIVRABLES_MATRIX](./LIVRABLES_MATRIX.md), [CPS_MAPPING_PROJECT](../02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Registre synthétique

| Domaine | Preuve | Emplacement | Valeur documentaire |
|---|---|---|---|
| Architecture backend | Routeur principal FastAPI et agrégation des routes | `backend/app/main.py`, `backend/app/api/api_v1.py` | Confirme la structure API et les familles fonctionnelles |
| Architecture frontend | Déclaration des routes applicatives et parcours principaux | `frontend/src/App.tsx` | Confirme les écrans actifs et les accès UI |
| Cartographie | Endpoints de couches et composants cartographiques | `backend/app/api/v1/*`, `frontend/src/pages/DashboardCartographique.tsx` | Alimente les annexes cartographie et observatoire |
| Dashboards analytiques | Écrans analytiques et composants de séries / KPI | `frontend/src/pages/DashboardAnalytique.tsx`, `frontend/src/pages/DashboardClimate.tsx` | Preuve de restitution métier multi-domaines |
| Ingestion scénarios | Module admin d’ingestion et routes `ingestion/*` | `frontend/src/pages/admin/IngestionPage.tsx`, backend ingestion routes | Preuve d’intégration des modèles et de la QA |
| Traçabilité | Matrice de traçabilité et tables de logs | `docs/01_project_reference/backend/traceability_matrix.md`, schéma `security`, schéma `audit` | Justifie la couverture sécurité / audit |
| Materialized views | Pack SQL de performance et scripts de refresh | `backend/sql/2026_04_mv_perf_pack.sql`, `backend/scripts/refresh_mviews.py` | Preuve de l’industrialisation analytique |
| Introspection BD réelle | Snapshot JSON SQL + référentiel maître BD | `docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json`, `docs/01_project_reference/data/DATABASE_SCHEMA.md` | Preuve de structuration réelle de la base et base documentaire pour rapports et agents IA |
| Conformité CPS | Synthèse CPS et mapping projet | `docs/02_contractual_and_reports/cps/*` | Base des tableaux de conformité |
| Rapport Mission IV | Rapport provisoire version avancée | `docs/02_contractual_and_reports/mission_iv/rapport_provisoire_mission_iv_sad.md` | Livrable principal de restitution |
| Historique d’améliorations | Note de merge dashboards et workflows associés | `docs/04_working_prompts_and_runs/runs/2026-04-09_merge_dashboards/*` | Traçabilité des améliorations récentes |

## 2. Snapshot base de données du 2026-04-10

Les requêtes de diagnostic exécutées le `2026-04-10` ont confirmé la structuration suivante de la base `abh_sad` :

| Schéma | Tables | Vues | Vues matérialisées |
|---|---:|---:|---:|
| `api` | 0 | 49 | 25 |
| `analytics` | 0 | 0 | 3 |
| `metadata` | 37 | 2 | 3 |
| `security` | 11 | 0 | 0 |
| `audit` | 1 | 0 | 0 |
| `staging` | 35 | 0 | 0 |
| `geo` | 13 | 0 | 0 |
| `infra` | 22 | 0 | 0 |
| `hydro` | 7 | 0 | 0 |
| `meteo` | 5 | 0 | 0 |
| `qualite` | 8 | 0 | 0 |
| `swat_output` | 8 | 0 | 0 |
| `swat_sebou` | 4 | 0 | 0 |
| `wasp_output` | 5 | 0 | 0 |
| `wasp_sebou` | 3 | 0 | 0 |

## 3. Objets structurants confirmés en base

### Vues matérialisées et agrégats d’exposition

- `analytics.mv_dashboard_climat_meteo_menu`
- `analytics.mv_dashboard_hydrologie_menu`
- `analytics.mv_dashboard_pollution_menu`
- `api.mv_hierarchie_metier_listing`
- `api.mv_bassin_geojson`
- `api.mv_sous_bassin_geojson`
- `api.mv_reseau_hydrographique`
- `api.mv_station_dimension`
- `api.mv_barrage_dimension`
- `api.mv_hydro_debit_day_qa`
- `api.mv_qualite_riviere_day`
- `api.mv_qualite_sebou_day`
- `api.mv_swat_qualite_subbasin_day`
- `api.mv_wasp_qualite_segment_day`
- `api.ca_meteo_precip_day`
- `api.ca_meteo_evaporation_day`
- `api.ca_hydro_debit_source_day`

### Objets de gouvernance et de sécurité

- `security.users`
- `security.roles`
- `security.permissions`
- `security.role_permissions`
- `security.refresh_tokens`
- `security.activity_logs`
- `security.auth_logs`
- `security.log_audit`
- `audit.ingestion_audit_logs`
- `metadata.popup_rules_config`
- `metadata.mv_refresh_status`
- `metadata.api_view_catalog`
- `metadata.dictionnaire_donnees`

### Objets modèles et scénarios

- `swat_sebou.swat_models`
- `swat_sebou.swat_scenarios`
- `swat_sebou.swat_reach_results`
- `swat_sebou.swat_subbasin_results`
- `wasp_sebou.wasp_scenarios`
- `wasp_sebou.wasp_results`
- `wasp_sebou.wasp_variables`

## 4. Usage du registre

Ce registre sert de base pour :

- la rédaction des rapports et annexes techniques ;
- la préparation des tableaux de conformité CPS ;
- la justification des choix d’architecture dans les comités de suivi ;
- l’orientation des agents IA vers les preuves projet les plus utiles.
