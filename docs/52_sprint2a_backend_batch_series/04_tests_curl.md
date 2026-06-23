# 4. Tests Curl

## Test Batch Simple (Hydro)
```bash
curl -X POST "http://localhost:8010/api/v1/business-map/analysis/series/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "date_from": "2015-01-01",
    "date_to": "2025-12-31",
    "aggregation": "monthly",
    "series": [
      {
        "support_type": "STATION_HYDRO",
        "object_id": "92",
        "domain": "HYDROLOGIE",
        "parameter_code": "DEBIT"
      }
    ]
  }'
```

## Test Batch Mixte
```bash
curl -X POST "http://localhost:8010/api/v1/business-map/analysis/series/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "date_from": "2020-01-01",
    "date_to": "2022-12-31",
    "aggregation": "monthly",
    "series": [
      {
        "support_type": "STATION_HYDRO",
        "object_id": "92",
        "domain": "HYDROLOGIE",
        "parameter_code": "DEBIT"
      },
      {
        "support_type": "BARRAGE",
        "object_id": "4",
        "domain": "HYDROLOGIE",
        "parameter_code": "LACHER"
      }
    ]
  }'
```

## Test Forçage (Downsampling)
```bash
curl -X POST "http://localhost:8010/api/v1/business-map/analysis/series/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "date_from": "1990-01-01",
    "date_to": "2025-12-31",
    "aggregation": "raw",
    "series": [
      {
        "support_type": "STATION_HYDRO",
        "object_id": "92",
        "domain": "HYDROLOGIE",
        "parameter_code": "DEBIT"
      }
    ]
  }'
```
*(Résultat attendu : aggregation_changed vers annual).*
