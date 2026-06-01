-- NON EXECUTE - SPECIFICATION ONLY
-- Purpose: candidate read-only extraction for hydro_ml_baseline_v0_sandbox.
-- Rule: this file must be reviewed against real column names before execution.
-- Rule: use a read-only DB role/session only.

-- SET TRANSACTION READ ONLY;

WITH hydro_daily AS (
    SELECT
        station_id,
        temps::date AS bucket_day,
        AVG(valeur) AS q_m3s
    FROM hydro.mesure_debit
    WHERE temps IS NOT NULL
      AND valeur IS NOT NULL
      AND COALESCE(est_valide, true) = true
    GROUP BY station_id, temps::date
),
rain_basin_daily AS (
    SELECT
        temps::date AS bucket_day,
        AVG(COALESCE(val_observees, val_remplies, val_power_nasa)) AS rainfall_1d
    FROM meteo.mesure_precipitation
    WHERE temps IS NOT NULL
      AND COALESCE(val_observees, val_remplies, val_power_nasa) IS NOT NULL
      AND COALESCE(est_valide, true) = true
    GROUP BY temps::date
),
evap_basin_daily AS (
    SELECT
        temps::date AS bucket_day,
        AVG(valeur) AS evap_1d
    FROM meteo.mesure_evaporation
    WHERE temps IS NOT NULL
      AND valeur IS NOT NULL
      AND COALESCE(est_valide, true) = true
    GROUP BY temps::date
),
features AS (
    SELECT
        h.station_id,
        h.bucket_day,
        h.q_m3s,
        LAG(h.q_m3s, 1) OVER (PARTITION BY h.station_id ORDER BY h.bucket_day) AS q_lag_1,
        LAG(h.q_m3s, 7) OVER (PARTITION BY h.station_id ORDER BY h.bucket_day) AS q_lag_7,
        SUM(COALESCE(r.rainfall_1d, 0)) OVER (
            PARTITION BY h.station_id
            ORDER BY h.bucket_day
            ROWS BETWEEN CURRENT ROW AND CURRENT ROW
        ) AS rainfall_1d,
        SUM(COALESCE(r.rainfall_1d, 0)) OVER (
            PARTITION BY h.station_id
            ORDER BY h.bucket_day
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS rainfall_7d,
        SUM(COALESCE(r.rainfall_1d, 0)) OVER (
            PARTITION BY h.station_id
            ORDER BY h.bucket_day
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS rainfall_30d,
        AVG(e.evap_1d) OVER (
            PARTITION BY h.station_id
            ORDER BY h.bucket_day
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS evap_7d,
        AVG(e.evap_1d) OVER (
            PARTITION BY h.station_id
            ORDER BY h.bucket_day
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS evap_30d,
        EXTRACT(MONTH FROM h.bucket_day)::int AS month,
        CASE WHEN EXTRACT(MONTH FROM h.bucket_day)::int IN (11, 12, 1, 2, 3, 4) THEN 1 ELSE 0 END AS wet_season_flag
    FROM hydro_daily h
    LEFT JOIN rain_basin_daily r
      ON r.bucket_day = h.bucket_day
    LEFT JOIN evap_basin_daily e
      ON e.bucket_day = h.bucket_day
)
SELECT
    station_id,
    bucket_day,
    q_m3s,
    q_lag_1,
    q_lag_7,
    rainfall_1d,
    rainfall_7d,
    rainfall_30d,
    evap_7d,
    evap_30d,
    month,
    wet_season_flag,
    LEAD(q_m3s, 1) OVER (PARTITION BY station_id ORDER BY bucket_day) AS q_t_plus_1,
    LEAD(q_m3s, 7) OVER (PARTITION BY station_id ORDER BY bucket_day) AS q_t_plus_7
FROM features
WHERE q_lag_1 IS NOT NULL
  AND q_lag_7 IS NOT NULL;
