-- analytics.mv_dashboard_hydrologie_menu
-- Source de vérité Hydrologie pour:
-- - options menu (scenario / sous-menu / variable / site)
-- - KPI (min/max/moyenne/statut)
-- - tableau historique
-- - série temporelle graphique

BEGIN;

CREATE SCHEMA IF NOT EXISTS analytics;

DROP MATERIALIZED VIEW IF EXISTS analytics.mv_dashboard_hydrologie_menu;

CREATE MATERIALIZED VIEW analytics.mv_dashboard_hydrologie_menu AS
WITH station_dim AS (
    SELECT
        s.station_id::uuid AS site_id,
        s.code_station::text AS site_code,
        s.station_nom::text AS site_name,
        COALESCE(s.type_station::text, 'station') AS station_type,
        s.longitude::double precision AS longitude,
        s.latitude::double precision AS latitude,
        s.geom
    FROM api.v_station_dimension s
    WHERE s.station_id IS NOT NULL
),
barrage_dim AS (
    SELECT
        b.barrage_id::uuid AS site_id,
        COALESCE(b.legacy_ire_barrage, b.barrage_id::text) AS site_code,
        COALESCE(b.barrage_nom, b.barrage_id::text) AS site_name,
        'barrage'::text AS station_type,
        b.longitude::double precision AS longitude,
        b.latitude::double precision AS latitude,
        b.geom
    FROM api.v_barrage_dimension b
    WHERE b.barrage_id IS NOT NULL
),
source_dim AS (
    SELECT
        ms.source_id::uuid AS site_id,
        ms.legacy_ire_source::text AS site_code,
        COALESCE(gs.nom_source, ms.legacy_ire_source, ms.source_id::text) AS site_name,
        'source_eau'::text AS station_type,
        gs.coord_x::double precision AS longitude,
        gs.coord_y::double precision AS latitude,
        gs.geom
    FROM metadata.mapping_source ms
    LEFT JOIN geo.source gs
      ON gs.ire_source = ms.legacy_ire_source
    WHERE ms.source_id IS NOT NULL
),
debit_station_daily AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'hydrologie'::text AS theme_code,
        'Hydrologie'::text AS theme_label,
        'debit'::text AS submenu_code,
        'Débit'::text AS submenu_label,
        'debit_journalier'::text AS variable_code,
        'Débit journalier'::text AS variable_label,
        TRUE AS variable_enabled,
        m.station_id::uuid AS site_id,
        (m.temps AT TIME ZONE 'UTC')::date AS date_obs,
        AVG(m.valeur)::double precision AS value_num,
        'm3/s'::text AS unit,
        'hydro.mesure_debit'::text AS source_table,
        CASE
            WHEN BOOL_OR(
                COALESCE(m.qa_flag_negative, FALSE)
                OR COALESCE(m.qa_flag_outlier, FALSE)
                OR COALESCE(m.qa_flag_method_missing, FALSE)
                OR COALESCE(NOT m.est_valide, FALSE)
            ) THEN 'qa_flagged'
            ELSE 'ok'
        END::text AS data_quality_flag
    FROM hydro.mesure_debit m
    WHERE m.station_id IS NOT NULL
      AND m.valeur IS NOT NULL
    GROUP BY m.station_id, (m.temps AT TIME ZONE 'UTC')::date
),
debit_station_monthly AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'hydrologie'::text AS theme_code,
        'Hydrologie'::text AS theme_label,
        'debit'::text AS submenu_code,
        'Débit'::text AS submenu_label,
        'debit_mensuel'::text AS variable_code,
        'Débit mensuel moyen'::text AS variable_label,
        TRUE AS variable_enabled,
        m.station_id::uuid AS site_id,
        m.bucket_month::date AS date_obs,
        m.valeur_moy_m3s::double precision AS value_num,
        'm3/s'::text AS unit,
        'hydro.mesure_debit_mensuel'::text AS source_table,
        'ok'::text AS data_quality_flag
    FROM hydro.mesure_debit_mensuel m
    WHERE m.station_id IS NOT NULL
      AND m.valeur_moy_m3s IS NOT NULL
),
debit_source_daily AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'hydrologie'::text AS theme_code,
        'Hydrologie'::text AS theme_label,
        'debit'::text AS submenu_code,
        'Débit'::text AS submenu_label,
        'debit_source'::text AS variable_code,
        'Débit source'::text AS variable_label,
        TRUE AS variable_enabled,
        m.source_id::uuid AS site_id,
        (m.temps AT TIME ZONE 'UTC')::date AS date_obs,
        AVG(m.valeur_m3s)::double precision AS value_num,
        'm3/s'::text AS unit,
        'hydro.mesure_debit_source'::text AS source_table,
        CASE
            WHEN BOOL_OR(
                COALESCE(m.qa_flag_negative, FALSE)
                OR COALESCE(m.qa_flag_outlier, FALSE)
                OR COALESCE(m.qa_flag_method_missing, FALSE)
                OR COALESCE(NOT m.est_valide, FALSE)
            ) THEN 'qa_flagged'
            ELSE 'ok'
        END::text AS data_quality_flag
    FROM hydro.mesure_debit_source m
    WHERE m.source_id IS NOT NULL
      AND m.valeur_m3s IS NOT NULL
    GROUP BY m.source_id, (m.temps AT TIME ZONE 'UTC')::date
),
barrage_rows AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'hydrologie'::text AS theme_code,
        'Hydrologie'::text AS theme_label,
        'barrage'::text AS submenu_code,
        'Barrage'::text AS submenu_label,
        'niveau_barrage'::text AS variable_code,
        'Niveau barrage'::text AS variable_label,
        TRUE AS variable_enabled,
        m.barrage_id::uuid AS site_id,
        (m.temps AT TIME ZONE 'UTC')::date AS date_obs,
        m.cote_m::double precision AS value_num,
        'm'::text AS unit,
        'hydro.mesure_barrage'::text AS source_table,
        'ok'::text AS data_quality_flag
    FROM hydro.mesure_barrage m
    WHERE m.barrage_id IS NOT NULL AND m.cote_m IS NOT NULL

    UNION ALL

    SELECT
        'actuel','Actuel','hydrologie','Hydrologie',
        'barrage','Barrage',
        'volume_barrage','Volume barrage',TRUE,
        m.barrage_id::uuid, (m.temps AT TIME ZONE 'UTC')::date, m.volume_mm3::double precision,
        'Mm3','hydro.mesure_barrage','ok'
    FROM hydro.mesure_barrage m
    WHERE m.barrage_id IS NOT NULL AND m.volume_mm3 IS NOT NULL

    UNION ALL

    SELECT
        'actuel','Actuel','hydrologie','Hydrologie',
        'barrage','Barrage',
        'lacher_barrage','Lâcher barrage',TRUE,
        m.barrage_id::uuid, (m.temps AT TIME ZONE 'UTC')::date, m.lacher_m3s::double precision,
        'm3/s','hydro.mesure_barrage','ok'
    FROM hydro.mesure_barrage m
    WHERE m.barrage_id IS NOT NULL AND m.lacher_m3s IS NOT NULL
),
all_rows AS (
    SELECT * FROM debit_station_daily
    UNION ALL
    SELECT * FROM debit_station_monthly
    UNION ALL
    SELECT * FROM debit_source_daily
    UNION ALL
    SELECT * FROM barrage_rows
),
resolved AS (
    SELECT
        r.*,
        sd.site_code,
        sd.site_name,
        sd.station_type,
        sd.longitude,
        sd.latitude,
        sd.geom
    FROM all_rows r
    JOIN station_dim sd
      ON sd.site_id = r.site_id
    WHERE r.source_table IN ('hydro.mesure_debit', 'hydro.mesure_debit_mensuel')

    UNION ALL

    SELECT
        r.*,
        bd.site_code,
        bd.site_name,
        bd.station_type,
        bd.longitude,
        bd.latitude,
        bd.geom
    FROM all_rows r
    JOIN barrage_dim bd
      ON bd.site_id = r.site_id
    WHERE r.source_table = 'hydro.mesure_barrage'

    UNION ALL

    SELECT
        r.*,
        src.site_code,
        src.site_name,
        src.station_type,
        src.longitude,
        src.latitude,
        src.geom
    FROM all_rows r
    JOIN source_dim src
      ON src.site_id = r.site_id
    WHERE r.source_table = 'hydro.mesure_debit_source'
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
    r.site_id,
    r.site_code,
    r.site_name,
    r.station_type,
    r.date_obs,
    EXTRACT(YEAR FROM r.date_obs)::int AS year,
    EXTRACT(MONTH FROM r.date_obs)::int AS month,
    EXTRACT(DAY FROM r.date_obs)::int AS day,
    r.value_num,
    r.unit,
    TRUE AS has_data,
    r.source_table,
    r.data_quality_flag,
    r.longitude,
    r.latitude,
    r.geom
FROM resolved r
WHERE r.value_num IS NOT NULL;

CREATE UNIQUE INDEX idx_mv_dashboard_hydrologie_menu_uk
  ON analytics.mv_dashboard_hydrologie_menu (
    scenario_code,
    submenu_code,
    variable_code_nz,
    site_id,
    date_obs,
    source_table
  );

CREATE INDEX idx_mv_dashboard_hydrologie_menu_scenario
  ON analytics.mv_dashboard_hydrologie_menu (scenario_code);

CREATE INDEX idx_mv_dashboard_hydrologie_menu_submenu
  ON analytics.mv_dashboard_hydrologie_menu (submenu_code);

CREATE INDEX idx_mv_dashboard_hydrologie_menu_variable
  ON analytics.mv_dashboard_hydrologie_menu (variable_code);

CREATE INDEX idx_mv_dashboard_hydrologie_menu_site
  ON analytics.mv_dashboard_hydrologie_menu (site_id);

CREATE INDEX idx_mv_dashboard_hydrologie_menu_date
  ON analytics.mv_dashboard_hydrologie_menu (date_obs);

CREATE INDEX idx_mv_dashboard_hydrologie_menu_geom
  ON analytics.mv_dashboard_hydrologie_menu USING GIST (geom);

ANALYZE analytics.mv_dashboard_hydrologie_menu;

COMMIT;

