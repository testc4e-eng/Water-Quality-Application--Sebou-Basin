# Audit final température

## Audit source
| Fichier | Lignes | Stations | Début | Fin | Doublons | T_Min > T_Max | Outliers |
|---|---|---|---|---|---|---|---|
| timeseries_temperature_global.csv | 445194 | 37 | 1983-01-01 | 2026-06-10 | 0 | 0 | 0 |
| timeseries_TMAX_par_station.csv | 15867 | 37 | 1983-01-01 | 2026-06-10 | 0 | n/a | n/a |
| timeseries_TMIN_par_station.csv | 15867 | 37 | 1983-01-01 | 2026-06-10 | 0 | n/a | n/a |


Températures : T_Min min `-12.41`, T_Max max `49.54`.

## Audit DB read-only
| Objet | Existe | Volume |
|---|---|---|
| meteo.mesure_temperature | True | 0 |
| infra.stations_mesure | True | 390 |
| staging.temperature_daily_raw | False | absente |
| metadata.import_batch | False | absente |
| metadata.import_batch_lineage | False | absente |


## Colonnes cible actuelles
| Colonne | Type | Nullable |
|---|---|---|
| temps | timestamp with time zone | NO |
| station_id | uuid | NO |
| val_min | double precision | YES |
| val_max | double precision | YES |
| val_moy | double precision | YES |


Colonnes lineage absentes : `import_batch_id, source_station_name, qa_status, source_file, source_row_number`.

## Contraintes et index existants
| Table | Contrainte | Type | Définition |
|---|---|---|---|
| stations_mesure | station_mesure_pkey | p | PRIMARY KEY (id) |
| stations_mesure | station_mesure_code_station_key | u | UNIQUE (code_station) |
| mesure_temperature | mesure_temperature_station_id_fkey | f | FOREIGN KEY (station_id) REFERENCES infra.stations_mesure(id) |
| mesure_temperature | mesure_temperature_pkey | p | PRIMARY KEY (temps, station_id) |


| Table | Index | Définition |
|---|---|---|
| stations_mesure | idx_infra_station_commune | CREATE INDEX idx_infra_station_commune ON infra.stations_mesure USING btree (commune_id) |
| stations_mesure | idx_infra_station_geom | CREATE INDEX idx_infra_station_geom ON infra.stations_mesure USING gist (geom) |
| stations_mesure | idx_infra_station_type_actif | CREATE INDEX idx_infra_station_type_actif ON infra.stations_mesure USING btree (type_station, actif) |
| stations_mesure | station_mesure_code_station_key | CREATE UNIQUE INDEX station_mesure_code_station_key ON infra.stations_mesure USING btree (code_station) |
| stations_mesure | station_mesure_pkey | CREATE UNIQUE INDEX station_mesure_pkey ON infra.stations_mesure USING btree (id) |
| mesure_temperature | idx_meteo_temp_station_temps | CREATE INDEX idx_meteo_temp_station_temps ON meteo.mesure_temperature USING btree (station_id, temps DESC) |
| mesure_temperature | mesure_temperature_pkey | CREATE UNIQUE INDEX mesure_temperature_pkey ON meteo.mesure_temperature USING btree (temps, station_id) |
| mesure_temperature | mesure_temperature_temps_idx | CREATE INDEX mesure_temperature_temps_idx ON meteo.mesure_temperature USING btree (temps DESC) |

