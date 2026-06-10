# Tests de Validation de l'API Unifiée

Le script de test `test_api.py` a été exécuté sur les endpoints unifiés expérimentaux.

## Requêtes exécutées
- `GET /api/v1/quality/unified/stations?support_type=SENTINELLE`
- `GET /api/v1/quality/unified/stations?support_type=RIVIERE`
- `GET /api/v1/quality/unified/parameters?support_type=SENTINELLE`
- `GET /api/v1/quality/unified/timeseries?support_type=SENTINELLE&ire_station=3695/8`
- `GET /api/v1/quality/unified/timeseries?support_type=BARRAGE`
- `GET /api/v1/quality/unified/timeseries?support_type=BARRAGE_GARDE`

## Résultats
Tous les tests ont réussi (Code HTTP 200).
- Les jointures entre `api.v_qualite_dashboard_unifiee` et `api.v_station_dimension` ont retourné correctement les noms métier (`station_nom`).
- Le filtrage par `support_type` a permis d'isoler efficacement les données (ex: temps réel pour `SENTINELLE`).
- Les données sont formatées selon les Pydantic Models définis (`UnifiedQualityStationResponse`, etc.), offrant une structure claire et uniforme au frontend.
