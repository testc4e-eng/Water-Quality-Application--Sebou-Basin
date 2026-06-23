# Sources API

Le dashboard Qualité repose exclusivement sur la vue unifiée SQL `api.v_qualite_dashboard_unifiee`, exposée à travers le routeur `quality.py`.

Endpoints utilisés :
- `GET /api/v1/quality/unified/stations` : (query param: `support_type`)
- `GET /api/v1/quality/unified/parameters` : (query param: `support_type`, `station_id`)
- `GET /api/v1/quality/unified/timeseries` : (query param: `support_type`, `ire_station`)

*Note de performance :* Ces endpoints utilisent des `CTE MATERIALIZED` sur PostgreSQL pour résoudre une exécution initiale de 50 secondes, la ramenant à environ 1,5 seconde.
