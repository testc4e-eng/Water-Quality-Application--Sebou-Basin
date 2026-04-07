-- analytics.mv_dashboard_climat_meteo_menu
-- Source de vérité Climat & Météo pour:
-- - options menu (scenario / sous-menu / variable / site)
-- - KPI (min/max/moyenne/statut)
-- - tableau historique
-- - série temporelle graphique

BEGIN;

CREATE SCHEMA IF NOT EXISTS analytics;

DROP MATERIALIZED VIEW IF EXISTS analytics.mv_dashboard_climat_meteo_menu;

CREATE MATERIALIZED VIEW analytics.mv_dashboard_climat_meteo_menu AS
WITH station_dim AS (
    SELECT
        s.station_id,
        s.code_station::text AS site_code,
        s.station_nom::text AS site_name,
        s.type_station::text AS station_type,
        s.longitude::double precision AS longitude,
        s.latitude::double precision AS latitude,
        s.geom
    FROM api.v_station_dimension s
    WHERE s.station_id IS NOT NULL
),
temperature_daily AS (
    SELECT
        t.station_id,
        (t.temps AT TIME ZONE 'UTC')::date AS date_obs,
        MIN(t.val_min)::double precision AS value_temp_min,
        MAX(t.val_max)::double precision AS value_temp_max,
        AVG(t.val_moy)::double precision AS value_temp_moy
    FROM meteo.mesure_temperature t
    WHERE t.station_id IS NOT NULL
    GROUP BY t.station_id, (t.temps AT TIME ZONE 'UTC')::date
),
temperature_rows AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'climat_meteo'::text AS theme_code,
        'Climat & Météo'::text AS theme_label,
        'temperature'::text AS submenu_code,
        'Température'::text AS submenu_label,
        'temperature_min'::text AS variable_code,
        'Température min'::text AS variable_label,
        TRUE AS variable_enabled,
        d.station_id,
        d.date_obs,
        d.value_temp_min AS value_num,
        '°C'::text AS unit,
        'meteo.mesure_temperature'::text AS source_table,
        'ok'::text AS data_quality_flag
    FROM temperature_daily d
    WHERE d.value_temp_min IS NOT NULL

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo',
        'temperature', 'Température',
        'temperature_max', 'Température max', TRUE,
        d.station_id, d.date_obs, d.value_temp_max, '°C',
        'meteo.mesure_temperature', 'ok'
    FROM temperature_daily d
    WHERE d.value_temp_max IS NOT NULL

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo',
        'temperature', 'Température',
        'temperature_moyenne', 'Température moyenne', TRUE,
        d.station_id, d.date_obs, d.value_temp_moy, '°C',
        'meteo.mesure_temperature', 'ok'
    FROM temperature_daily d
    WHERE d.value_temp_moy IS NOT NULL
),
precip_monthly AS (
    SELECT
        p.station_id,
        date_trunc('month', p.temps AT TIME ZONE 'UTC')::date AS date_obs,
        SUM(p.val_remplies)::double precision AS value_precip_cumul,
        MIN(p.val_remplies)::double precision AS value_precip_min,
        MAX(p.val_remplies)::double precision AS value_precip_max,
        AVG(p.val_remplies)::double precision AS value_precip_moy,
        BOOL_OR(
            COALESCE(p.qa_flag_negative, FALSE)
            OR COALESCE(p.qa_flag_null_filled, FALSE)
            OR COALESCE(p.qa_flag_fill_inconsistency, FALSE)
            OR COALESCE(p.qa_flag_source_nasa_only, FALSE)
            OR COALESCE(p.qa_flag_method_missing, FALSE)
            OR COALESCE(NOT p.est_valide, FALSE)
        ) AS has_qa_issue
    FROM meteo.mesure_precipitation p
    WHERE p.station_id IS NOT NULL
      AND p.val_remplies IS NOT NULL
    GROUP BY p.station_id, date_trunc('month', p.temps AT TIME ZONE 'UTC')::date
),
precip_rows AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'climat_meteo'::text AS theme_code,
        'Climat & Météo'::text AS theme_label,
        'precipitation'::text AS submenu_code,
        'Précipitation'::text AS submenu_label,
        'precipitation_max'::text AS variable_code,
        'Précipitation max'::text AS variable_label,
        TRUE AS variable_enabled,
        m.station_id,
        m.date_obs,
        m.value_precip_max AS value_num,
        'mm'::text AS unit,
        'meteo.mesure_precipitation'::text AS source_table,
        CASE WHEN m.has_qa_issue THEN 'qa_flagged' ELSE 'ok' END::text AS data_quality_flag
    FROM precip_monthly m
    WHERE m.value_precip_max IS NOT NULL

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo',
        'precipitation', 'Précipitation',
        'precipitation_min', 'Précipitation min', TRUE,
        m.station_id, m.date_obs, m.value_precip_min, 'mm',
        'meteo.mesure_precipitation',
        CASE WHEN m.has_qa_issue THEN 'qa_flagged' ELSE 'ok' END
    FROM precip_monthly m
    WHERE m.value_precip_min IS NOT NULL

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo',
        'precipitation', 'Précipitation',
        'precipitation_moyenne', 'Précipitation moyenne', TRUE,
        m.station_id, m.date_obs, m.value_precip_moy, 'mm',
        'meteo.mesure_precipitation',
        CASE WHEN m.has_qa_issue THEN 'qa_flagged' ELSE 'ok' END
    FROM precip_monthly m
    WHERE m.value_precip_moy IS NOT NULL

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'climat_meteo', 'Climat & Météo',
        'precipitation', 'Précipitation',
        'cumul_precipitation', 'Cumul précipitation', TRUE,
        m.station_id, m.date_obs, m.value_precip_cumul, 'mm',
        'meteo.mesure_precipitation',
        CASE WHEN m.has_qa_issue THEN 'qa_flagged' ELSE 'ok' END
    FROM precip_monthly m
    WHERE m.value_precip_cumul IS NOT NULL
),
evaporation_daily AS (
    SELECT
        e.station_id,
        (e.temps AT TIME ZONE 'UTC')::date AS date_obs,
        AVG(e.valeur)::double precision AS value_num,
        BOOL_OR(
            COALESCE(e.qa_flag_negative, FALSE)
            OR COALESCE(e.qa_flag_outlier, FALSE)
            OR COALESCE(e.qa_flag_method_missing, FALSE)
            OR COALESCE(e.qa_flag_null_value, FALSE)
            OR COALESCE(NOT e.est_valide, FALSE)
        ) AS has_qa_issue
    FROM meteo.mesure_evaporation e
    WHERE e.station_id IS NOT NULL
      AND e.valeur IS NOT NULL
    GROUP BY e.station_id, (e.temps AT TIME ZONE 'UTC')::date
),
evaporation_rows AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'climat_meteo'::text AS theme_code,
        'Climat & Météo'::text AS theme_label,
        'evaporation'::text AS submenu_code,
        'Evaporation'::text AS submenu_label,
        NULL::text AS variable_code,
        NULL::text AS variable_label,
        FALSE AS variable_enabled,
        d.station_id,
        d.date_obs,
        d.value_num,
        'mm'::text AS unit,
        'meteo.mesure_evaporation'::text AS source_table,
        CASE WHEN d.has_qa_issue THEN 'qa_flagged' ELSE 'ok' END::text AS data_quality_flag
    FROM evaporation_daily d
    WHERE d.value_num IS NOT NULL
),
all_rows AS (
    SELECT * FROM temperature_rows
    UNION ALL
    SELECT * FROM precip_rows
    UNION ALL
    SELECT * FROM evaporation_rows
)
SELECT
    r.scenario_code,
    r.scenario_label,
    r.theme_code,
    r.theme_label,
    r.submenu_code,
    r.submenu_label,
    r.variable_code,
    COALESCE(r.variable_code, '__none__')::text AS variable_code_nz,
    r.variable_label,
    r.variable_enabled,
    s.station_id AS site_id,
    s.site_code,
    s.site_name,
    s.station_type,
    r.date_obs,
    EXTRACT(YEAR FROM r.date_obs)::int AS year,
    EXTRACT(MONTH FROM r.date_obs)::int AS month,
    EXTRACT(DAY FROM r.date_obs)::int AS day,
    r.value_num,
    r.unit,
    TRUE AS has_data,
    r.source_table,
    r.data_quality_flag,
    s.longitude,
    s.latitude,
    s.geom
FROM all_rows r
JOIN station_dim s
  ON s.station_id = r.station_id
WHERE r.value_num IS NOT NULL;

-- Unique key required for REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_dashboard_climat_meteo_menu_uk
  ON analytics.mv_dashboard_climat_meteo_menu (
    scenario_code,
    submenu_code,
    variable_code_nz,
    site_id,
    date_obs,
    source_table
  );

CREATE INDEX idx_mv_dashboard_climat_meteo_menu_scenario
  ON analytics.mv_dashboard_climat_meteo_menu (scenario_code);

CREATE INDEX idx_mv_dashboard_climat_meteo_menu_submenu
  ON analytics.mv_dashboard_climat_meteo_menu (submenu_code);

CREATE INDEX idx_mv_dashboard_climat_meteo_menu_variable
  ON analytics.mv_dashboard_climat_meteo_menu (variable_code);

CREATE INDEX idx_mv_dashboard_climat_meteo_menu_site
  ON analytics.mv_dashboard_climat_meteo_menu (site_id);

CREATE INDEX idx_mv_dashboard_climat_meteo_menu_date
  ON analytics.mv_dashboard_climat_meteo_menu (date_obs);

CREATE INDEX idx_mv_dashboard_climat_meteo_menu_geom
  ON analytics.mv_dashboard_climat_meteo_menu USING GIST (geom);

ANALYZE analytics.mv_dashboard_climat_meteo_menu;

COMMIT;

-- Refresh script:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_dashboard_climat_meteo_menu;
