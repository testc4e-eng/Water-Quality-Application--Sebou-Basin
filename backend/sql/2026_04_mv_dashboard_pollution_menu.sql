-- analytics.mv_dashboard_pollution_menu
-- Vue matérialisée dédiée Dashboard analytique (Pollution):
-- - sous-menus: inventaire / pollution ponctuelle / pollution diffuse
-- - options de filtre (scenario/sous-menu/variable/site)
-- - KPI/table/chart via série temporelle
--
-- Note perf:
-- - diffusion SWAT/WASP agrégée au mois (date_obs = 1er du mois)
-- - colonne geom volontairement exclue (dashboard analytique non carto)

BEGIN;

CREATE SCHEMA IF NOT EXISTS analytics;

DROP MATERIALIZED VIEW IF EXISTS analytics.mv_dashboard_pollution_menu;

CREATE MATERIALIZED VIEW analytics.mv_dashboard_pollution_menu AS
WITH inventaire_presence AS (
    -- Inventaire "présence" (value_num=1) sans variable détaillée.
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'pollution'::text AS theme_code,
        'Pollution'::text AS theme_label,
        'inventaire'::text AS submenu_code,
        'Inventaire'::text AS submenu_label,
        NULL::text AS variable_code,
        NULL::text AS variable_label,
        FALSE AS variable_enabled,
        t.site_id,
        t.site_code,
        t.site_name,
        t.station_type,
        t.date_obs,
        1.0::double precision AS value_num,
        'count'::text AS unit,
        t.source_table,
        t.data_quality_flag,
        t.longitude,
        t.latitude,
        t.source_row_uid
    FROM (
        SELECT
            d.id::text AS site_id,
            COALESCE(d.code_decharge, d.nom_decharge, d.id::text) AS site_code,
            COALESCE(d.nom_decharge, d.nom_site, d.id::text) AS site_name,
            'decharge'::text AS station_type,
            COALESCE(d.date_enquete, d.created_at::date) AS date_obs,
            'api.v_inventaire_pollution_decharges_detail'::text AS source_table,
            CASE
                WHEN COALESCE(d.qa_flag_invalid_geom, FALSE)
                  OR COALESCE(d.qa_flag_missing_geom, FALSE)
                  OR COALESCE(d.qa_flag_missing_commune, FALSE)
                  OR COALESCE(d.qa_flag_unmapped_decharge, FALSE)
                THEN 'qa_flagged'
                ELSE 'ok'
            END::text AS data_quality_flag,
            d.longitude::double precision AS longitude,
            d.latitude::double precision AS latitude,
            d.id::text AS source_row_uid
        FROM api.v_inventaire_pollution_decharges_detail d
        WHERE d.id IS NOT NULL

        UNION ALL

        SELECT
            h.id::text,
            COALESCE(h.code_huilerie_reference, h.code_huilerie_source, h.id::text),
            COALESCE(h.nom_huilerie_reference, h.nom_huilerie_source, h.id::text),
            'huilerie',
            COALESCE(h.date_enquete, h.created_at::date),
            'api.v_inventaire_pollution_huileries_detail',
            CASE
                WHEN COALESCE(h.qa_flag_invalid_geom, FALSE)
                  OR COALESCE(h.qa_flag_missing_geom, FALSE)
                  OR COALESCE(h.qa_flag_missing_commune, FALSE)
                  OR COALESCE(h.qa_flag_unmapped_huilerie, FALSE)
                THEN 'qa_flagged'
                ELSE 'ok'
            END,
            h.longitude::double precision,
            h.latitude::double precision,
            h.id::text
        FROM api.v_inventaire_pollution_huileries_detail h
        WHERE h.id IS NOT NULL

        UNION ALL

        SELECT
            m.id::text,
            COALESCE(m.mine_licence_reference, m.nom_mine_source, m.id::text),
            COALESCE(m.mine_nom_reference, m.nom_mine_source, m.id::text),
            'mine',
            COALESCE(m.created_at::date, CURRENT_DATE),
            'api.v_inventaire_pollution_mines_detail',
            CASE
                WHEN COALESCE(m.qa_flag_invalid_geom, FALSE)
                  OR COALESCE(m.qa_flag_missing_geom, FALSE)
                  OR COALESCE(m.qa_flag_missing_commune, FALSE)
                  OR COALESCE(m.qa_flag_unmapped_mine, FALSE)
                THEN 'qa_flagged'
                ELSE 'ok'
            END,
            m.longitude::double precision,
            m.latitude::double precision,
            m.id::text
        FROM api.v_inventaire_pollution_mines_detail m
        WHERE m.id IS NOT NULL

        UNION ALL

        SELECT
            r.id::text,
            COALESCE(r.code_abattoir, r.id::text),
            COALESCE(r.code_abattoir, r.id::text),
            'rejet_abattoir',
            COALESCE(r.created_at::date, CURRENT_DATE),
            'api.v_inventaire_pollution_rejet_abattoir_detail',
            CASE
                WHEN COALESCE(r.qa_flag_invalid_geom, FALSE)
                  OR COALESCE(r.qa_flag_missing_geom, FALSE)
                  OR COALESCE(r.qa_flag_missing_commune, FALSE)
                  OR COALESCE(r.qa_flag_unmapped_rejet_abattoir, FALSE)
                THEN 'qa_flagged'
                ELSE 'ok'
            END,
            r.longitude::double precision,
            r.latitude::double precision,
            r.id::text
        FROM api.v_inventaire_pollution_rejet_abattoir_detail r
        WHERE r.id IS NOT NULL

        UNION ALL

        SELECT
            rb.id::text,
            COALESCE(rb.code_rejet, rb.id::text),
            COALESCE(rb.code_rejet, rb.id::text),
            'rejet_domestique',
            COALESCE(rb.date_enquete, rb.created_at::date),
            'api.v_inventaire_pollution_rejets_bruts_detail',
            CASE
                WHEN COALESCE(rb.qa_flag_invalid_geom, FALSE)
                  OR COALESCE(rb.qa_flag_missing_geom, FALSE)
                  OR COALESCE(rb.qa_flag_missing_commune, FALSE)
                  OR COALESCE(rb.qa_flag_unmapped_rejet_domestique, FALSE)
                THEN 'qa_flagged'
                ELSE 'ok'
            END,
            rb.longitude::double precision,
            rb.latitude::double precision,
            rb.id::text
        FROM api.v_inventaire_pollution_rejets_bruts_detail rb
        WHERE rb.id IS NOT NULL

        UNION ALL

        SELECT
            s.id::text,
            COALESCE(s.code_step, s.id::text),
            COALESCE(s.code_step, s.id::text),
            'step',
            COALESCE(s.date_enquete, s.created_at::date),
            'api.v_inventaire_pollution_steps_detail',
            CASE
                WHEN COALESCE(s.qa_flag_invalid_geom, FALSE)
                  OR COALESCE(s.qa_flag_missing_geom, FALSE)
                  OR COALESCE(s.qa_flag_missing_commune, FALSE)
                  OR COALESCE(s.qa_flag_unmapped_step, FALSE)
                THEN 'qa_flagged'
                ELSE 'ok'
            END,
            s.longitude::double precision,
            s.latitude::double precision,
            s.id::text
        FROM api.v_inventaire_pollution_steps_detail s
        WHERE s.id IS NOT NULL

        UNION ALL

        SELECT
            st.id::text,
            COALESCE(st.code_stm, st.id::text),
            COALESCE(st.nom_stm, st.code_stm, st.id::text),
            'stm',
            COALESCE(st.created_at::date, CURRENT_DATE),
            'api.v_inventaire_pollution_stms_detail',
            CASE
                WHEN COALESCE(st.qa_flag_invalid_geom, FALSE)
                  OR COALESCE(st.qa_flag_missing_geom, FALSE)
                  OR COALESCE(st.qa_flag_missing_commune, FALSE)
                  OR COALESCE(st.qa_flag_missing_code_stm, FALSE)
                THEN 'qa_flagged'
                ELSE 'ok'
            END,
            st.longitude::double precision,
            st.latitude::double precision,
            st.id::text
        FROM api.v_inventaire_pollution_stms_detail st
        WHERE st.id IS NOT NULL
    ) t
    WHERE t.date_obs IS NOT NULL
),
ponctuelle_mesures AS (
    -- Pollution ponctuelle: valeurs mesurées et compteurs.
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        'pollution'::text AS theme_code,
        'Pollution'::text AS theme_label,
        'ponctuelle'::text AS submenu_code,
        'Pollution ponctuelle'::text AS submenu_label,
        COALESCE(r.parametre_code_canonique, r.parametre_qualite, 'param_inconnu')::text AS variable_code,
        COALESCE(r.parametre_libelle, r.parametre_qualite, r.parametre_code_canonique, 'Paramètre inconnu')::text AS variable_label,
        TRUE AS variable_enabled,
        r.station_id::text AS site_id,
        COALESCE(r.legacy_code_station, r.legacy_station_id::text, r.station_id::text) AS site_code,
        COALESCE(r.station_nom, r.station_id::text) AS site_name,
        COALESCE(r.type_station, 'station')::text AS station_type,
        COALESCE(r.bucket_day, (r.temps AT TIME ZONE 'UTC')::date) AS date_obs,
        r.valeur::double precision AS value_num,
        NULLIF(r.parametre_unite, '')::text AS unit,
        'api.v_qualite_riviere_mesures'::text AS source_table,
        CASE
            WHEN COALESCE(r.qa_flag_negative, FALSE)
              OR COALESCE(r.qa_flag_null_value, FALSE)
              OR COALESCE(r.qa_flag_param_missing, FALSE)
              OR COALESCE(r.qa_flag_station_unmapped, FALSE)
              OR COALESCE(NOT r.est_valide, FALSE)
            THEN 'qa_flagged'
            ELSE 'ok'
        END::text AS data_quality_flag,
        r.longitude::double precision AS longitude,
        r.latitude::double precision AS latitude,
        md5(
            concat_ws(
                '|',
                r.station_id::text,
                COALESCE(r.parametre_code_canonique, r.parametre_qualite, 'param_inconnu'),
                COALESCE(r.bucket_day::text, (r.temps AT TIME ZONE 'UTC')::date::text),
                COALESCE(r.created_at::text, ''),
                COALESCE(r.source_system, '')
            )
        ) AS source_row_uid
    FROM api.v_qualite_riviere_mesures r
    WHERE r.station_id IS NOT NULL
      AND r.valeur IS NOT NULL
      AND COALESCE(r.parametre_code_canonique, r.parametre_qualite, 'param_inconnu') NOT IN ('H_G', 'PTD', 'PTP', 'MD', 'FM', 'F_M_MES')

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'pollution', 'Pollution',
        'ponctuelle', 'Pollution ponctuelle',
        COALESCE(s.parametre_code_canonique, s.parametre_qualite, 'param_inconnu')::text,
        COALESCE(s.parametre_libelle, s.parametre_qualite, s.parametre_code_canonique, 'Paramètre inconnu')::text,
        TRUE,
        s.station_id::text,
        COALESCE(s.legacy_code_station, s.legacy_station_id::text, s.station_id::text),
        COALESCE(s.station_nom, s.station_id::text),
        COALESCE(s.type_station, 'station')::text,
        COALESCE(s.bucket_day, (s.temps AT TIME ZONE 'UTC')::date),
        s.valeur::double precision,
        NULLIF(s.parametre_unite, '')::text,
        'api.v_qualite_sebou_mesures',
        CASE
            WHEN COALESCE(s.qa_flag_negative, FALSE)
              OR COALESCE(s.qa_flag_null_value, FALSE)
              OR COALESCE(s.qa_flag_param_missing, FALSE)
              OR COALESCE(s.qa_flag_station_unmapped, FALSE)
              OR COALESCE(NOT s.est_valide, FALSE)
            THEN 'qa_flagged'
            ELSE 'ok'
        END,
        s.longitude::double precision,
        s.latitude::double precision,
        md5(
            concat_ws(
                '|',
                s.station_id::text,
                COALESCE(s.parametre_code_canonique, s.parametre_qualite, 'param_inconnu'),
                COALESCE(s.bucket_day::text, (s.temps AT TIME ZONE 'UTC')::date::text),
                COALESCE(s.created_at::text, ''),
                COALESCE(s.source_system, '')
            )
        )
    FROM api.v_qualite_sebou_mesures s
    WHERE s.station_id IS NOT NULL
      AND s.valeur IS NOT NULL
      AND COALESCE(s.parametre_code_canonique, s.parametre_qualite, 'param_inconnu') NOT IN ('H_G', 'PTD', 'PTP', 'MD', 'FM', 'F_M_MES')

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'pollution', 'Pollution',
        'ponctuelle', 'Pollution ponctuelle',
        COALESCE(b.parametre_code_canonique, b.parametre_qualite, 'param_inconnu')::text,
        COALESCE(b.parametre_libelle, b.parametre_qualite, b.parametre_code_canonique, 'Paramètre inconnu')::text,
        TRUE,
        COALESCE(b.barrage_id::text, b.station_id::text),
        COALESCE(b.legacy_code_station, b.legacy_station_id::text, b.barrage_id::text, b.station_id::text),
        COALESCE(b.station_nom, b.barrage_id::text, b.station_id::text),
        COALESCE(b.type_station, 'barrage')::text,
        COALESCE(b.bucket_day, (b.temps AT TIME ZONE 'UTC')::date),
        b.valeur::double precision,
        NULLIF(b.parametre_unite, '')::text,
        'api.v_suivi_qualite_barrage_garde_hebdo',
        CASE
            WHEN COALESCE(b.qa_flag_negative, FALSE)
              OR COALESCE(b.qa_flag_null_value, FALSE)
              OR COALESCE(b.qa_flag_param_missing, FALSE)
              OR COALESCE(b.qa_flag_station_unmapped, FALSE)
              OR COALESCE(b.qa_flag_barrage_unmapped, FALSE)
              OR COALESCE(NOT b.est_valide, FALSE)
            THEN 'qa_flagged'
            ELSE 'ok'
        END,
        b.longitude::double precision,
        b.latitude::double precision,
        md5(
            concat_ws(
                '|',
                COALESCE(b.barrage_id::text, b.station_id::text),
                COALESCE(b.parametre_code_canonique, b.parametre_qualite, 'param_inconnu'),
                COALESCE(b.bucket_day::text, (b.temps AT TIME ZONE 'UTC')::date::text),
                COALESCE(b.created_at::text, ''),
                COALESCE(b.source_system, '')
            )
        )
    FROM api.v_suivi_qualite_barrage_garde_hebdo b
    WHERE COALESCE(b.barrage_id::text, b.station_id::text) IS NOT NULL
      AND b.valeur IS NOT NULL
      AND COALESCE(b.parametre_code_canonique, b.parametre_qualite, 'param_inconnu') NOT IN ('H_G', 'PTD', 'PTP', 'MD', 'FM', 'F_M_MES')

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'pollution', 'Pollution',
        'ponctuelle', 'Pollution ponctuelle',
        COALESCE(sm.parametre_code_canonique, sm.param_code_legacy, 'param_inconnu')::text,
        COALESCE(sm.parametre_libelle, sm.parametre_code_canonique, sm.param_code_legacy, 'Paramètre inconnu')::text,
        TRUE,
        sm.prelevement_id::text,
        COALESCE(sm.point_prelevement, sm.prelevement_id::text),
        COALESCE(sm.point_prelevement, sm.prelevement_id::text),
        COALESCE(sm.entite_type, 'point_prelevement')::text,
        COALESCE(sm.date_prelevement, sm.date_reception, sm.created_at::date),
        sm.valeur_num::double precision,
        NULLIF(sm.parametre_unite, '')::text,
        'api.v_inventaire_pollution_sources_mesures_detail',
        CASE
            WHEN COALESCE(sm.qa_flag_value_missing, FALSE)
              OR COALESCE(sm.qa_flag_value_non_numeric, FALSE)
              OR COALESCE(sm.qa_flag_param_unmapped, FALSE)
              OR COALESCE(sm.qa_flag_missing_geom, FALSE)
              OR COALESCE(sm.qa_flag_missing_commune, FALSE)
            THEN 'qa_flagged'
            ELSE 'ok'
        END,
        sm.longitude::double precision,
        sm.latitude::double precision,
        COALESCE(
            sm.mesure_id::text,
            md5(
                concat_ws(
                    '|',
                    sm.prelevement_id::text,
                    COALESCE(sm.param_code_legacy, ''),
                    COALESCE(sm.date_prelevement::text, ''),
                    COALESCE(sm.valeur_num::text, '')
                )
            )
        )
    FROM api.v_inventaire_pollution_sources_mesures_detail sm
    WHERE sm.prelevement_id IS NOT NULL
      AND sm.valeur_num IS NOT NULL
      AND COALESCE(sm.parametre_code_canonique, sm.param_code_legacy, 'param_inconnu') NOT IN ('H_G', 'PTD', 'PTP', 'MD', 'FM', 'F_M_MES')

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'pollution', 'Pollution',
        'ponctuelle', 'Pollution ponctuelle',
        'nb_mesures'::text,
        'Nombre de mesures'::text,
        TRUE,
        p.id::text,
        COALESCE(p.point_prelevement, p.id::text),
        COALESCE(p.point_prelevement, p.id::text),
        'point_prelevement'::text,
        COALESCE(p.date_prelevement, p.date_reception, p.created_at::date),
        p.n_mesures_parametres::double precision,
        'count'::text,
        'api.v_source_pollution_prelevement',
        CASE
            WHEN COALESCE(p.qa_flag_missing_geom, FALSE)
              OR COALESCE(p.qa_flag_missing_commune, FALSE)
            THEN 'qa_flagged'
            ELSE 'ok'
        END,
        p.coord_x::double precision,
        p.coord_y::double precision,
        concat_ws('|', p.id::text, 'nb_mesures')
    FROM api.v_source_pollution_prelevement p
    WHERE p.id IS NOT NULL
      AND p.n_mesures_parametres IS NOT NULL

    UNION ALL

    SELECT
        'actuel', 'Actuel', 'pollution', 'Pollution',
        'ponctuelle', 'Pollution ponctuelle',
        'nb_param_non_mappes'::text,
        'Nombre de paramètres non mappés'::text,
        TRUE,
        p.id::text,
        COALESCE(p.point_prelevement, p.id::text),
        COALESCE(p.point_prelevement, p.id::text),
        'point_prelevement'::text,
        COALESCE(p.date_prelevement, p.date_reception, p.created_at::date),
        p.n_mesures_param_unmapped::double precision,
        'count'::text,
        'api.v_source_pollution_prelevement',
        CASE
            WHEN COALESCE(p.qa_flag_missing_geom, FALSE)
              OR COALESCE(p.qa_flag_missing_commune, FALSE)
            THEN 'qa_flagged'
            ELSE 'ok'
        END,
        p.coord_x::double precision,
        p.coord_y::double precision,
        concat_ws('|', p.id::text, 'nb_param_non_mappes')
    FROM api.v_source_pollution_prelevement p
    WHERE p.id IS NOT NULL
      AND p.n_mesures_param_unmapped IS NOT NULL
),
swat_monthly AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        sw.subbasin_uid::text AS site_id,
        sw.subbasin_uid::text AS site_code,
        'Sous-bassin SWAT ' || sw.subbasin_uid::text AS site_name,
        'sous_bassin_swat'::text AS station_type,
        date_trunc('month', sw.temps::timestamp)::date AS date_obs,
        COALESCE(sw.param_code, 'param_inconnu')::text AS variable_code,
        COALESCE(sw.param_code, 'param_inconnu')::text AS variable_label,
        AVG(sw.valeur)::double precision AS value_num,
        NULL::text AS unit,
        BOOL_OR(
            COALESCE(sw.qa_flag_null, FALSE)
            OR COALESCE(sw.qa_flag_non_numeric, FALSE)
            OR COALESCE(sw.qa_flag_outlier, FALSE)
        ) AS has_qa_issue,
        NULL::double precision AS longitude,
        NULL::double precision AS latitude
    FROM swat_output.mesure_qualite_subbasin_ts sw
    WHERE sw.subbasin_uid IS NOT NULL
      AND sw.valeur IS NOT NULL
      AND sw.temps IS NOT NULL
    GROUP BY
        sw.subbasin_uid,
        date_trunc('month', sw.temps::timestamp)::date,
        COALESCE(sw.param_code, 'param_inconnu')
),
wasp_monthly AS (
    SELECT
        'actuel'::text AS scenario_code,
        'Actuel'::text AS scenario_label,
        COALESCE(w.segment_local_id::text, w.reseau_id::text) AS site_id,
        COALESCE(w.segment_local_id::text, w.reseau_id::text) AS site_code,
        'Segment ' || COALESCE(w.segment_local_id::text, w.reseau_id::text) AS site_name,
        'segment_hydro'::text AS station_type,
        date_trunc('month', COALESCE(w.bucket_day::timestamp, (w.ts_utc AT TIME ZONE 'UTC')))::date AS date_obs,
        COALESCE(w.code_parametre, 'param_inconnu')::text AS variable_code,
        COALESCE(w.code_parametre, 'param_inconnu')::text AS variable_label,
        AVG(w.valeur)::double precision AS value_num,
        NULL::text AS unit,
        BOOL_OR(w.qa_flags IS NOT NULL AND cardinality(w.qa_flags) > 0) AS has_qa_issue,
        NULL::double precision AS longitude,
        NULL::double precision AS latitude
    FROM wasp_output.mesure_qualite_segment_ts w
    WHERE COALESCE(w.segment_local_id::text, w.reseau_id::text) IS NOT NULL
      AND w.valeur IS NOT NULL
      AND COALESCE(w.bucket_day::timestamp, (w.ts_utc AT TIME ZONE 'UTC')) IS NOT NULL
    GROUP BY
        COALESCE(w.segment_local_id::text, w.reseau_id::text),
        date_trunc('month', COALESCE(w.bucket_day::timestamp, (w.ts_utc AT TIME ZONE 'UTC')))::date,
        COALESCE(w.code_parametre, 'param_inconnu')
),
diffuse_mesures AS (
    SELECT
        s.scenario_code,
        s.scenario_label,
        'pollution'::text AS theme_code,
        'Pollution'::text AS theme_label,
        'diffuse'::text AS submenu_code,
        'Pollution diffuse'::text AS submenu_label,
        s.variable_code,
        s.variable_label,
        TRUE AS variable_enabled,
        s.site_id,
        s.site_code,
        s.site_name,
        s.station_type,
        s.date_obs,
        s.value_num,
        s.unit,
        'api.v_swat_qualite_subbasin_consolide'::text AS source_table,
        CASE WHEN s.has_qa_issue THEN 'qa_flagged' ELSE 'ok' END::text AS data_quality_flag,
        s.longitude,
        s.latitude,
        md5(concat_ws('|', s.scenario_code, s.site_id, s.variable_code, s.date_obs::text, 'swat')) AS source_row_uid
    FROM swat_monthly s

    UNION ALL

    SELECT
        w.scenario_code,
        w.scenario_label,
        'pollution'::text,
        'Pollution'::text,
        'diffuse'::text,
        'Pollution diffuse'::text,
        w.variable_code,
        w.variable_label,
        TRUE,
        w.site_id,
        w.site_code,
        w.site_name,
        w.station_type,
        w.date_obs,
        w.value_num,
        w.unit,
        'api.v_wasp_qualite_segment_consolide'::text,
        CASE WHEN w.has_qa_issue THEN 'qa_flagged' ELSE 'ok' END::text,
        w.longitude,
        w.latitude,
        md5(concat_ws('|', w.scenario_code, w.site_id, w.variable_code, w.date_obs::text, 'wasp')) AS source_row_uid
    FROM wasp_monthly w
),
all_rows AS (
    SELECT * FROM inventaire_presence
    UNION ALL
    SELECT * FROM ponctuelle_mesures
    UNION ALL
    SELECT * FROM diffuse_mesures
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
    r.source_row_uid,
    ROW_NUMBER() OVER (
        PARTITION BY
            r.scenario_code,
            r.submenu_code,
            COALESCE(r.variable_code, '__none__'),
            r.site_id,
            r.date_obs,
            r.source_table,
            r.source_row_uid
        ORDER BY r.value_num, r.site_name
    )::int AS source_seq
FROM all_rows r
WHERE r.value_num IS NOT NULL
  AND r.date_obs IS NOT NULL;

-- Unique key required for REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_dashboard_pollution_menu_uk
  ON analytics.mv_dashboard_pollution_menu (
    scenario_code,
    submenu_code,
    variable_code_nz,
    site_id,
    date_obs,
    source_table,
    source_row_uid,
    source_seq
  );

CREATE INDEX idx_mv_dashboard_pollution_menu_scenario
  ON analytics.mv_dashboard_pollution_menu (scenario_code);

CREATE INDEX idx_mv_dashboard_pollution_menu_submenu
  ON analytics.mv_dashboard_pollution_menu (submenu_code);

CREATE INDEX idx_mv_dashboard_pollution_menu_variable
  ON analytics.mv_dashboard_pollution_menu (variable_code);

CREATE INDEX idx_mv_dashboard_pollution_menu_site
  ON analytics.mv_dashboard_pollution_menu (site_id);

CREATE INDEX idx_mv_dashboard_pollution_menu_date
  ON analytics.mv_dashboard_pollution_menu (date_obs);

ANALYZE analytics.mv_dashboard_pollution_menu;

COMMIT;
