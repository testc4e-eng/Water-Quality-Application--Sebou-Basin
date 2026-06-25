-- backend/sql/2026_04_mv_analytics_climat.sql
-- Materialized View for Climate & Weather Dashboard Analytics
-- Created for SAD Sebou Project

BEGIN;

CREATE SCHEMA IF NOT EXISTS analytics;

DROP MATERIALIZED VIEW IF EXISTS analytics.mv_dashboard_climat_meteo;

CREATE MATERIALIZED VIEW analytics.mv_dashboard_climat_meteo AS
WITH base_data AS (
    -- Temperature Max
    SELECT 
        'actuel'::text as scenario_code,
        'Actuel'::text as scenario_label,
        'climat_meteo'::text as theme_code,
        'Climat & Météo'::text as theme_label,
        'temperature'::text as submenu_code,
        'Température'::text as submenu_label,
        'temperature_max'::text as variable_code,
        'Température max'::text as variable_label,
        true::boolean as variable_enabled,
        t.station_id,
        t.temps::date as date_obs,
        t.val_max as value_num,
        '°C'::text as unit
    FROM meteo.mesure_temperature t
    WHERE t.val_max IS NOT NULL

    UNION ALL

    -- Temperature Min
    SELECT 
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo', 'temperature', 'Température',
        'temperature_min', 'Température min', true,
        t.station_id, t.temps::date, t.val_min, '°C'
    FROM meteo.mesure_temperature t
    WHERE t.val_min IS NOT NULL

    UNION ALL

    -- Temperature Moyenne
    SELECT 
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo', 'temperature', 'Température',
        'temperature_moyenne', 'Température moyenne', true,
        t.station_id, t.temps::date, t.val_moy, '°C'
    FROM meteo.mesure_temperature t
    WHERE t.val_moy IS NOT NULL

    UNION ALL

    -- Precipitation Cumul
    SELECT 
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo', 'precipitation', 'Précipitation',
        'cumul_precipitation', 'Cumul précipitation', true,
        p.station_id, p.temps::date, p.val_observees, 'mm'
    FROM meteo.mesure_precipitation p
    WHERE p.val_observees IS NOT NULL

    UNION ALL

    -- Precipitation Max
    SELECT 
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo', 'precipitation', 'Précipitation',
        'precipitation_max', 'Précipitation max', true,
        p.station_id, p.temps::date, p.val_observees, 'mm'
    FROM meteo.mesure_precipitation p
    WHERE p.val_observees IS NOT NULL

    UNION ALL

    -- Precipitation Min
    SELECT 
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo', 'precipitation', 'Précipitation',
        'precipitation_min', 'Précipitation min', true,
        p.station_id, p.temps::date, p.val_observees, 'mm'
    FROM meteo.mesure_precipitation p
    WHERE p.val_observees IS NOT NULL

    UNION ALL

    -- Precipitation Moyenne
    SELECT 
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo', 'precipitation', 'Précipitation',
        'precipitation_moyenne', 'Précipitation moyenne', true,
        p.station_id, p.temps::date, p.val_observees, 'mm'
    FROM meteo.mesure_precipitation p
    WHERE p.val_observees IS NOT NULL

    UNION ALL

    -- Evaporation
    SELECT 
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo', 'evaporation', 'Evaporation',
        NULL, NULL, false,
        e.station_id, e.temps::date, e.valeur, 'mm'
    FROM meteo.mesure_evaporation e
    WHERE e.valeur IS NOT NULL
)
SELECT 
    d.scenario_code,
    d.scenario_label,
    d.theme_code,
    d.theme_label,
    d.submenu_code,
    d.submenu_label,
    d.variable_code,
    d.variable_label,
    d.variable_enabled,
    s.station_id as site_id,
    s.code_station as site_code,
    s.station_nom as site_name,
    s.type_station as station_type,
    d.date_obs,
    EXTRACT(YEAR FROM d.date_obs)::int as year,
    EXTRACT(MONTH FROM d.date_obs)::int as month,
    EXTRACT(DAY FROM d.date_obs)::int as day,
    d.value_num,
    d.unit,
    true::boolean as has_data
FROM base_data d
JOIN api.v_station_dimension s ON d.station_id = s.station_id;

-- Indexes for performance
CREATE INDEX idx_mv_climat_scen ON analytics.mv_dashboard_climat_meteo(scenario_code);
CREATE INDEX idx_mv_climat_sub ON analytics.mv_dashboard_climat_meteo(submenu_code);
CREATE INDEX idx_mv_climat_var ON analytics.mv_dashboard_climat_meteo(variable_code);
CREATE INDEX idx_mv_climat_site ON analytics.mv_dashboard_climat_meteo(site_id);
CREATE INDEX idx_mv_climat_date ON analytics.mv_dashboard_climat_meteo(date_obs);

-- Unique key for concurrent refresh support
CREATE UNIQUE INDEX idx_mv_climat_pk ON analytics.mv_dashboard_climat_meteo(scenario_code, submenu_code, COALESCE(variable_code, 'N/A'), site_id, date_obs);

COMMIT;
