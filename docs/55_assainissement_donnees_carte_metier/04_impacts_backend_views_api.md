# Impacts backend, vues et API

## Fichiers modifiés

### SQL

- `database/migrations/2026_06_business_map_temporality_v1.sql`
  - Recrée `api.mv_business_map_availability` avec les nouveaux champs.
  - Recrée `api.mv_business_map_features_v1` avec `attributes` enrichis.
  - Recrée `api.mv_business_map_last_values` (inchangé, déjà séparé).

### Modèles Pydantic

- `backend/app/models/business_map_models.py`
  - `BusinessMapAvailabilityItem` : ajout de `date_count`, `source_table`, `data_family`, `measurement_context`, `data_temporality`.
  - `AnalyticalSeries` : ajout de `series_type`, `data_family`, `measurement_context`, `source_table`.

- `backend/app/models/analysis_models.py`
  - `AnalyticalSeries` : ajout de `series_type`.

### Services

- `backend/app/services/business_map_service.py`
  - `_resolve_temporality()` : règle métier POLLUTION_IDP = POINT_MEASURE.
  - `_build_point_measure_response()` : format de réponse pour données ponctuelles.
  - `get_series()` : routage `TIME_SERIES` vs `POINT_MEASURE`.
  - `get_availability()` / `get_features()` : filtres `data_temporality`, `data_family`, `measurement_context`.
  - `PollutionSeriesProvider.build_query()` : correction `p.temps_prelevement` → `COALESCE(p.date_prelevement, p.date_reception)`.

- `backend/app/services/analysis_service.py`
  - `process_batch_series()` : détection `POINT_MEASURE`, warning explicite, conservation de `series_type`.

### Routeurs

- `backend/app/routers/business_map.py`
  - `/availability` : query params `data_temporality`, `data_family`, `measurement_context`.
  - `/features` : idem.

## Endpoints impactés

```text
GET  /api/v1/business-map/availability
GET  /api/v1/business-map/features
GET  /api/v1/business-map/series
POST /api/v1/business-map/analysis/series/batch
```

## Breaking changes

Aucun. Les nouveaux champs sont optionnels. Les anciens clients continuent de fonctionner.
