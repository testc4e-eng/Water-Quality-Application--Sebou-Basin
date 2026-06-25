# API_DATA_MAPPING

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | mapping entre routes backend, vues SQL, tables métier et écrans de restitution |
| Source de vérité | Oui |
| Documents liés | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), [DATA_FLOW](./DATA_FLOW.md), [DATABASE_SCHEMA_SUMMARY](../../03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Répartition cataloguée des vues API

| Domaine | Nombre de vues actives |
|---|---|
| carto | 4 |
| climat | 8 |
| hydro | 1 |
| hydrologie | 14 |
| infra | 1 |
| meteo | 1 |
| pollution | 13 |
| qualite | 9 |
| swat_output | 2 |
| transverse | 3 |
| wasp_output | 1 |

## 2. Mappings principaux

### Dashboard cartographique

- Routes : `/api/v1/layers`, `/api/v1/geojson`, `/api/v1/observatory`.
- Objets : `api.viz_carto_layers`, `api.mv_bassin_geojson`, `api.mv_sous_bassin_geojson`, `api.mv_reseau_hydrographique`, `api.mv_station_dimension`, `api.mv_barrage_dimension`, `metadata.popup_rules_config`.

### Dashboard analytique climat

- Routes : `/api/v1/analytics`, `/api/v1/climate`, `/api/v1/observatory`.
- Objets : `analytics.mv_dashboard_climat_meteo_menu`, `api.viz_climat_timeseries`, `api.ca_meteo_precip_day`, `api.ca_meteo_evaporation_day`, `api.ca_meteo_temp_day`, `meteo.mesure_precipitation`, `meteo.mesure_evaporation`, `meteo.mesure_temperature`.

### Dashboard analytique hydrologie

- Routes : `/api/v1/analytics`, `/api/v1/hydro`, `/api/v1/observatory`.
- Objets : `analytics.mv_dashboard_hydrologie_menu`, `api.viz_hydro_timeseries`, `api.mv_hydro_debit_day_qa`, `api.mv_hydro_debit_mensuel`, `hydro.mesure_debit`, `hydro.mesure_barrage`, `hydro.mesure_debit_source`.

### Dashboard analytique qualité et pollution

- Routes : `/api/v1/analytics`, `/api/v1/quality`, `/api/v1/observatory`.
- Objets : `analytics.mv_dashboard_pollution_menu`, `api.viz_qualite_timeseries`, `api.viz_pollution_timeseries`, `api.mv_qualite_riviere_day`, `api.mv_qualite_barrages_day`, `api.mv_qualite_nappes_day`, `api.mv_qualite_sebou_day`, `qualite.mesure_qualite_*`, `swat_output.mesure_qualite_subbasin_ts`, `wasp_output.mesure_qualite_segment_ts`.

### Ingestion et QA des scénarios

- Routes : `/api/v1/ingestion/*`.
- Objets : `swat_sebou.swat_scenarios`, `swat_sebou.swat_subbasin_results`, `swat_sebou.swat_reach_results`, `wasp_sebou.wasp_scenarios`, `wasp_sebou.wasp_results`, `wasp_sebou.wasp_variables`, `qa.variable_thresholds`, `audit.ingestion_audit_logs`, `audit.ingestion_dataset_signatures`.

### Administration sécurité et audit

- Routes : `/api/v1/auth`, `/api/v1/admin/users`, `/api/v1/admin/password-resets`, `/api/v1/security/logs`.
- Objets : `security.users`, `security.roles`, `security.permissions`, `security.role_permissions`, `security.activity_logs`, `security.auth_logs`, `security.log_audit`.

## 3. Règles popups actives

| Layer key | Titre | Actif |
|---|---|---|
| `adm_communes_abhs` | Commune | true |
| `adm_douars_abhs` | Douar | true |
| `adm_provinces_abhs` | Province / Préfecture | true |
| `adm_regions_abhs` | Région | true |
| `adm_villes_abhs` | Ville | true |
| `barrages_abhs` | Barrage | true |
| `points_eau` | Point d'eau | true |
| `reseau_hydro_abhs` | Segment hydrographique | true |
| `sources` | Source d'eau | true |
| `sous_bassins_swat` | Sous-bassin SWAT | true |
| `stations_abhs` | Station | true |
