# APIs, dashboards et monitoring futurs

## APIs ingestion futures

| API cible | Rôle |
|---|---|
| `/api/v1/ingestion/batches` | suivi des lots |
| `/api/v1/ingestion/batches/{id}` | détail batch |
| `/api/v1/ingestion/quarantine` | consultation quarantaine |
| `/api/v1/ingestion/referentiel-check` | validation mapping / alias |
| `/api/v1/ingestion/geo-review` | revue GEO |

## Dashboards futurs

| Dashboard | Usage |
|---|---|
| QA ingestion | volumétrie, erreurs, warnings, taux réussite |
| quarantaine | lignes bloquées, motifs, priorités |
| GEO review | points non résolus, rattachements manuels |
| monitoring batch | durée, volumes, statut |

## Monitoring

- temps de batch ;
- taux de rejet ;
- volume par source ;
- paramètres non mappés ;
- supports non reconnus ;
- lots rollbackés.

## Composants frontend cibles

- `IngestionBatchTable`
- `QuarantineReviewTable`
- `GeoReviewMap`
- `IngestionMetricsPanel`
- `ReferentielMappingInspector`
