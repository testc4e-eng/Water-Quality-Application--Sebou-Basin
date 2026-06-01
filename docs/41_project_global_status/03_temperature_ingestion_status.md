# Température - statut ingestion

## Statut
`GO_TEMPERATURE_INGESTION_COMMITTED`

## Batch
| Champ | Valeur |
|---|---|
| import_batch_id | 2d67f599-7714-4712-ba1f-5f3584c4c961 |
| source_system | TEMPERATURE_CSV |
| source_file | timeseries_temperature_global.csv |
| domain | meteo.temperature |
| batch_status | COMMITTED |
| expected_rows | 445194 |
| loaded_rows | 445194 |
| committed_rows | 437889 |
| rejected_rows | 7305 |
| started_at | 2026-05-25 02:09:21.208224+00:00 |
| committed_at | 2026-05-25 13:35:26.773500+00:00 |


## Cible métier
| Contrôle | Valeur |
|---|---|
| meteo.mesure_temperature total | 437889 |
| batch cible | 437889 |
| stations distinctes cible | 36 |
| date min | 1983-01-01 |
| date max | 2026-06-10 |
| null station | 0 |
| null values | 0 |
| inversions | 0 |
| source_station_name manquant | 0 |
| doublons cible | 0 |
| lineage inserted | 437889 |


## Staging
| Indicateur | Valeur |
|---|---|
| staging_count | 445194 |
| validated | 286757 |
| manual_validated | 135913 |
| alias_validated | 22524 |
| blocked | 0 |


## Notes techniques
- `DEDUP_CANONICAL_ONLY` appliqué pour `Bab Ouender/Bab_Ouender`.
- 7305 doublons exacts alias retirés de la cible métier.
- `import_batch_id` en cible est sans FK directe à cause de la limitation hypertable/columnstore; la traçabilité est portée par `metadata.import_batch_lineage`.

## Documentation obsolète détectée
- `docs/07_donnees_et_referentiels/00_data_landscape.md` dit encore `Météo température = DONNEE_ABSENTE`; ce statut est dépassé.
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md` indique `meteo.mesure_temperature = 0` dans le snapshot; il faut mettre à jour à 437889.
