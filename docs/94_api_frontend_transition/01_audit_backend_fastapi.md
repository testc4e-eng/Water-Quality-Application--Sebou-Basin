# Audit backend FastAPI

## Synthese

Le backend est monte via `backend/app/api/api_v1.py` sous `/api/v1`. Il combine des routes modernes basees sur `api.*`, des routes analytiques basees sur `analytics.*`, des routes legacy qui interrogent encore `public.*`, et des routes metier qui interrogent directement `qualite.*`, `meteo.*` ou `hydro.*`.

Regle cible : les nouvelles routes de restitution doivent consommer les vues SQL specialisees du schema `api`, pas les tables metier directement.

## Endpoints audites

| Endpoint actuel | Router | Tables utilisees | Vue api.* cible | Action recommandee | Priorite |
|---|---|---|---|---|---|
| `/api/v1/climate/stations` | `app.routers.climate` | `api.v_meteo_precipitation_annuelle_max`, `api.v_station_dimension` | `api.v_meteo_precipitation`, `api.v_meteo_temperature`, `api.v_meteo_evaporation` | `REFACTORER` | P1 |
| `/api/v1/climate/timeseries` | `app.routers.climate` | `api.v_meteo_precipitation_annuelle_max` | vues meteo specialisees | `REMPLACER_PROGRESSIF` | P1 |
| `/api/v1/climate/kpis` | `app.routers.climate` | `api.v_meteo_precipitation_annuelle_max` | vues meteo specialisees | `REFACTORER` | P2 |
| `/api/v1/hydro/stations` | `app.routers.hydro` | `api.v_station_dimension`, `api.v_hydro_debit_mensuel` | `api.v_hydro_debit` future ou `api.v_barrage_parametres` selon usage | `CONSERVER_PUIS_ETENDRE` | P2 |
| `/api/v1/hydro/timeseries` | `app.routers.hydro` | `api.v_hydro_debit_mensuel` | `api.v_hydro_debit` future | `REFACTORER` | P2 |
| `/api/v1/hydro/latest` | `app.routers.hydro` | `api.v_hydro_debit_mensuel` | `api.v_hydro_debit` future | `REFACTORER` | P2 |
| `/api/v1/observatory/barrage/timeseries` | `app.routers.observatory` | `api.v_hydro_barrage_param_journalier` | `api.v_barrage_parametres` | `REFACTORER_COMPATIBLE` | P1 |
| `/api/v1/observatory/barrage/latest` | `app.routers.observatory` | `api.v_hydro_barrage_param_journalier` | `api.v_barrage_parametres` | `REFACTORER_COMPATIBLE` | P1 |
| `/api/v1/quality/stations` | `app.routers.quality` | `qualite.mesure_qualite_riviere`, `api.v_station_dimension` | `api.v_qualite_base_multi_support` | `REMPLACER` | P0 |
| `/api/v1/quality/parameters` | `app.routers.quality` | `qualite.mesure_qualite_riviere` | vues qualite specialisees | `REMPLACER` | P0 |
| `/api/v1/quality/timeseries` | `app.routers.quality` | `qualite.mesure_qualite_riviere` | vues qualite specialisees | `REMPLACER` | P0 |
| `/api/v1/quality/latest` | `app.routers.quality` | `qualite.mesure_qualite_riviere`, `api.v_station_dimension` | vues qualite specialisees | `REMPLACER` | P0 |
| `/api/v1/quality/inventory/rows` | `app.routers.quality` | `api.v_points_eau`, `api.v_step_industrielles`, `api.v_stm` | `api.v_pollution_constat_prealable`, `api.v_pollution_analyses_finales`, `api.v_idp_points` | `SCINDER` | P1 |
| `/api/v1/barrages/{id}/quality-parameters` | `app.routers.entities` | `qualite.mesure_qualite_barrage` | `api.v_barrage_qualite` | `REMPLACER` | P1 |
| `/api/v1/barrages/{id}/quality-series` | `app.routers.entities` | `qualite.mesure_qualite_barrage` | `api.v_barrage_qualite` | `REMPLACER` | P1 |
| `/api/v1/entity/{id}/data` | `app.routers.entities` | `hydro.*`, `meteo.*`, `qualite.*`, `swat_output.*`, `wasp_output.*` | route generique par catalogue `table_cible` + vues `api.*` | `REFACTORER_FORT` | P1 |
| `/api/v1/observatory/parameter/latest` | `app.routers.observatory` | `meteo.*`, `hydro.*`, `qualite.*`, `swat_output.*`, `wasp_output.*` | dispatcher vues `api.*` via `table_cible` | `REFACTORER_FORT` | P1 |
| `/api/v1/observatory/parameter/timeseries` | `app.routers.observatory` | `meteo.*`, `hydro.*`, `qualite.*`, `swat_output.*`, `wasp_output.*` | dispatcher vues `api.*` via `table_cible` | `REFACTORER_FORT` | P1 |
| `/api/v1/analytics/*` | `app.routers.analytics` | `analytics.mv_dashboard_*` | vues `api.*` en amont ou MVs dediees futures | `CONSERVER_PUIS_MATERIALISER` | P2 |
| `/api/v1/layers/*` | `app.routers.layers` | `api.mv_*`, `api.v_*`, parfois `infra.*` fallback | vues geo existantes | `CONSERVER` | P2 |
| `/api/v1/names/*` | `app.routers.names` | `api.v_barrage_dimension`, `api.v_station_dimension` | vues dimensionnelles `api.*` | `CONSERVER` | P2 |
| `/api/v1/geojson/*` | `app.api.v1.geojson` | `api.v_bassin_geojson`, `api.v_station_dimension`, `api.v_barrage_dimension` | vues `api.*` | `CONSERVER` | P2 |
| `/api/v1/catalog/*` | `app.routers.catalog` | `public.*` | vues dimensionnelles `api.*` | `DEPRECIER` | P1 |
| `/api/v1/stations` | `app.routers.stations` / `app.api.v1.stations` | `public.stations_abhs` ou fallback | `api.v_station_dimension` | `REMPLACER` | P1 |
| `/api/v1/raw/*` | `app.api.v1.raw` | tables arbitraires | hors restitution | `CONSERVER_ADMIN_SECURISER` | P3 |
| `/api/v1/swat/*` | `app.api.v1.swat`, `swat_analysis` | `swat_*`, `wasp_*`, `hydro.mesure_debit` | futures vues modelisation | `CONSERVER_LEGACY_MODELING` | P3 |
| `/api/v1/ingestion/*` | `app.routers.ingestion` | services ingestion, `swat_*`, audit | module ingestion futur | `HOLD_FIN_PROJET` | P3 |

## Routes compatibles ou proches

- `layers`, `names`, `geojson` consomment majoritairement des vues `api.*`.
- `climate` et `hydro` consomment deja des vues `api.*`, mais pas encore les nouvelles vues specialisees.
- `analytics` consomme des MVs `analytics.*`; acceptable en restitution dashboard existante, mais a aligner avec la nouvelle couche `api.*` lors d'une phase de materialisation.

## Routes legacy ou a risque

- `quality.py` doit etre traite en premier : il lit directement `qualite.mesure_qualite_riviere`.
- `entities.py` et `observatory.py` contiennent des dispatchers generiques qui lisent les tables metier selon le parametre.
- `catalog.py`, `objects.py`, `stations.py`, `measurements.py` contiennent encore des references `public.*`.
- `raw.py` permet du CRUD generique ; il doit rester admin et ne doit pas devenir une source frontend metier.

## Decision d'audit

Statut backend : `GO_CONCEPTION_API_SPECIALISEE`.

Implementation recommandee : ajouter de nouveaux routers specialises sans supprimer les routers legacy, puis migrer le frontend ecran par ecran.
