# Schéma Base de Données - SAD Sebou 2026 (mis à jour)

## Vue d’ensemble
Base PostgreSQL/PostGIS organisée par schémas métiers:
- `geo`: entités géographiques (bassin, sous-bassins, réseau hydro, nappes, sources)
- `infra`: entités infrastructure (stations, barrages, STEP, STM, rejets, etc.)
- `meteo`: mesures météo (précipitation, évaporation, température)
- `hydro`: mesures hydrologiques (débit, niveau/volume barrage)
- `qualite`: mesures qualité (rivière, barrage, nappe, sebou, pollution ponctuelle)
- `swat_output` / `wasp_output`: sorties de modélisation diffuse
- `metadata`: mapping, référentiels, catalogue API, règles popup, suivi refresh
- `api`: vues et vues matérialisées exposées au frontend
- `staging`: archivage/traçabilité des tables sources migrées

## État confirmé (scan DB)
- Vues `api.*`: **49**
- Materialized views (`api` + `metadata`): **26**

### Materialized views principales
`api`:
- `mv_hierarchie_metier_listing`
- `mv_bassin_geojson`
- `mv_sous_bassin_geojson`
- `mv_sous_bassin_swat_geojson`
- `mv_reseau_hydrographique`
- `mv_nappes_geojson`
- `mv_sources_geojson`
- `mv_station_dimension`
- `mv_barrage_dimension`
- `mv_points_eau`
- `mv_hydro_debit_day_qa`
- `mv_hydro_debit_mensuel`
- `mv_meteo_precipitation_annuelle_max`
- `mv_qualite_riviere_day`
- `mv_qualite_sebou_day`
- `mv_qualite_barrages_day`
- `mv_qualite_nappes_day`
- `mv_suivi_qualite_barrage_garde_hebdo_day`
- `mv_swat_qualite_subbasin_day`
- `mv_wasp_qualite_segment_day`
- (+ cagg `ca_*` existantes)

`metadata`:
- `mv_obs_referentiel_parametre`
- `mv_obs_parametre_entite_compat`
- `mv_obs_parametre_coverage`

## Gouvernance refresh MV
Implémentation dans:
- [backend/sql/2026_04_mv_perf_pack.sql](../../backend/sql/2026_04_mv_perf_pack.sql)

Objets:
- `metadata.refresh_perf_mviews(note text)` (fonction de refresh centralisée)
- `metadata.mv_refresh_status` (tracking `refreshed_at`, `row_count`, `note`)

Exploitation:
- API status: `GET /api/v1/observatory/mviews/status`
- API refresh: `POST /api/v1/observatory/mviews/refresh`
- Script local: `backend/scripts/refresh_mviews.py`
- Tâche Windows toutes les 6h: `WQDSS_MV_Refresh_6h`

## Vues API métier structurantes
- `api.v_hierarchie_metier_listing`
- `api.v_meteo_precipitation_journalier_qa`
- `api.v_meteo_evaporation_journalier_qa`
- `api.v_meteo_temperature_journalier`
- `api.v_hydro_debit_journalier_qa`
- `api.v_hydro_niveau_barrage_journalier`
- `api.v_qualite_riviere_mesures`
- `api.v_qualite_sebou_mesures`
- `api.v_qualite_barrages_mesures`
- `api.v_qualite_nappes_mesures`
- `api.v_source_pollution_prelevement`
- `api.v_suivi_qualite_barrage_garde_hebdo`
- `api.v_swat_qualite_subbasin_consolide`
- `api.v_wasp_qualite_segment_consolide`

## Notes importantes
- Le schéma `public` est désormais minimal (métadonnées PostGIS).
- Les mappings métier sont centralisés dans `metadata.*`.
- Les objets `_legacy_*` et tables sources historiques sont archivés dans `staging`.
