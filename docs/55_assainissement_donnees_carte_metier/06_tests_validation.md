# Tests de validation

## Test 1 — Qualité ABH

```bash
curl "http://localhost:8010/api/v1/business-map/availability?support_type=STATION_QUALITE"
```

Attendu :

```text
data_family = QUALITE_ABH
domain = QUALITE
aucun POINT_PRELEVEMENT_POLLUTION
aucune source IDP
```

## Test 2 — Pollution IDP

```bash
curl "http://localhost:8010/api/v1/business-map/availability?support_type=POINT_PRELEVEMENT_POLLUTION"
```

Attendu :

```text
data_family = POLLUTION_IDP
domain = POLLUTION
measurement_context = campagne_pollution_idp
data_temporality = POINT_MEASURE
```

## Test 3 — Time series

Choisir une station hydro avec plusieurs dates.

```bash
curl "http://localhost:8010/api/v1/business-map/series?support_type=STATION_HYDRO&object_id=...&parameter_code=DEBIT&date_from=2020-01-01&date_to=2026-06-15&aggregation=monthly"
```

Attendu :

```text
series_type = TIME_SERIES
values > 0
```

## Test 4 — Donnée ponctuelle

Choisir un point IDP.

```bash
curl "http://localhost:8010/api/v1/business-map/series?support_type=POINT_PRELEVEMENT_POLLUTION&object_id=...&parameter_code=DBO5&date_from=2020-01-01&date_to=2026-06-15"
```

Attendu :

```text
series_type = POINT_MEASURE
aggregation = null
```

## Test 5 — Batch mixte

```bash
curl -X POST "http://localhost:8010/api/v1/business-map/analysis/series/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "date_from":"2020-01-01",
    "date_to":"2026-06-15",
    "aggregation":"monthly",
    "series":[
      {"support_type":"STATION_HYDRO","object_id":"...","parameter_code":"DEBIT","domain":"HYDROLOGIE"},
      {"support_type":"POINT_PRELEVEMENT_POLLUTION","object_id":"...","parameter_code":"DBO5","domain":"POLLUTION"}
    ]
  }'
```

Attendu :

```text
hydro = TIME_SERIES
pollution IDP = POINT_MEASURE
warning explicite
```

## Test 6 — Build frontend

```bash
cd frontend
npm run build
```

Attendu : build sans erreur TypeScript.
