-- ============================================================================
-- MV Performance Pack (Observatory + Carto)
-- Objectif: accélérer listes déroulantes + chargement cartographique
-- Compatible réexécution (idempotent)
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS api;
CREATE SCHEMA IF NOT EXISTS metadata;

-- ----------------------------------------------------------------------------
-- 1) Materialized views pour catalogues observatory (dropdowns / hiérarchie)
-- ----------------------------------------------------------------------------

DROP MATERIALIZED VIEW IF EXISTS api.mv_hierarchie_metier_listing;
CREATE MATERIALIZED VIEW api.mv_hierarchie_metier_listing AS
SELECT *
FROM api.v_hierarchie_metier_listing;

CREATE INDEX IF NOT EXISTS idx_mv_hierarchie_theme
  ON api.mv_hierarchie_metier_listing(theme);
CREATE INDEX IF NOT EXISTS idx_mv_hierarchie_theme_sous_menu
  ON api.mv_hierarchie_metier_listing(theme, sous_menu);
CREATE INDEX IF NOT EXISTS idx_mv_hierarchie_param
  ON api.mv_hierarchie_metier_listing(param_code, source_table, entity_type);

DROP MATERIALIZED VIEW IF EXISTS metadata.mv_obs_referentiel_parametre;
CREATE MATERIALIZED VIEW metadata.mv_obs_referentiel_parametre AS
SELECT *
FROM metadata.obs_referentiel_parametre;

CREATE INDEX IF NOT EXISTS idx_mv_obs_ref_param_theme
  ON metadata.mv_obs_referentiel_parametre(theme, sous_theme);
CREATE INDEX IF NOT EXISTS idx_mv_obs_ref_param_code
  ON metadata.mv_obs_referentiel_parametre(parametre_code);

DROP MATERIALIZED VIEW IF EXISTS metadata.mv_obs_parametre_entite_compat;
CREATE MATERIALIZED VIEW metadata.mv_obs_parametre_entite_compat AS
SELECT *
FROM metadata.obs_parametre_entite_compat;

CREATE INDEX IF NOT EXISTS idx_mv_obs_compat_param_entity
  ON metadata.mv_obs_parametre_entite_compat(parametre_code, entity_type);

DROP MATERIALIZED VIEW IF EXISTS metadata.mv_obs_parametre_coverage;
CREATE MATERIALIZED VIEW metadata.mv_obs_parametre_coverage AS
SELECT *
FROM metadata.obs_parametre_coverage;

CREATE INDEX IF NOT EXISTS idx_mv_obs_cov_param_entity
  ON metadata.mv_obs_parametre_coverage(parametre_code, entity_type);

-- ----------------------------------------------------------------------------
-- 2) Materialized views cartographiques (couches lourdes/frequentes)
-- ----------------------------------------------------------------------------

DROP MATERIALIZED VIEW IF EXISTS api.mv_bassin_geojson;
CREATE MATERIALIZED VIEW api.mv_bassin_geojson AS
SELECT * FROM api.v_bassin_geojson;
CREATE INDEX IF NOT EXISTS idx_mv_bassin_geojson_id ON api.mv_bassin_geojson(id);

DROP MATERIALIZED VIEW IF EXISTS api.mv_sous_bassin_geojson;
CREATE MATERIALIZED VIEW api.mv_sous_bassin_geojson AS
SELECT * FROM api.v_sous_bassin_geojson;
CREATE INDEX IF NOT EXISTS idx_mv_sous_bassin_geojson_id ON api.mv_sous_bassin_geojson(id);

DROP MATERIALIZED VIEW IF EXISTS api.mv_sous_bassin_swat_geojson;
CREATE MATERIALIZED VIEW api.mv_sous_bassin_swat_geojson AS
SELECT * FROM api.v_sous_bassin_swat_geojson;
CREATE INDEX IF NOT EXISTS idx_mv_sous_bassin_swat_geojson_id ON api.mv_sous_bassin_swat_geojson(id);
CREATE INDEX IF NOT EXISTS idx_mv_sous_bassin_swat_geojson_sub ON api.mv_sous_bassin_swat_geojson(subbasin_id);

DROP MATERIALIZED VIEW IF EXISTS api.mv_nappes_geojson;
CREATE MATERIALIZED VIEW api.mv_nappes_geojson AS
SELECT * FROM api.v_nappes_geojson;
CREATE INDEX IF NOT EXISTS idx_mv_nappes_geojson_id ON api.mv_nappes_geojson(id);

DROP MATERIALIZED VIEW IF EXISTS api.mv_sources_geojson;
CREATE MATERIALIZED VIEW api.mv_sources_geojson AS
SELECT * FROM api.v_sources_geojson;
CREATE INDEX IF NOT EXISTS idx_mv_sources_geojson_id ON api.mv_sources_geojson(id);

DROP MATERIALIZED VIEW IF EXISTS api.mv_station_dimension;
CREATE MATERIALIZED VIEW api.mv_station_dimension AS
SELECT * FROM api.v_station_dimension;
CREATE INDEX IF NOT EXISTS idx_mv_station_dimension_station_id ON api.mv_station_dimension(station_id);
CREATE INDEX IF NOT EXISTS idx_mv_station_dimension_code_station ON api.mv_station_dimension(code_station);
CREATE INDEX IF NOT EXISTS idx_mv_station_dimension_geom_gist ON api.mv_station_dimension USING GIST(geom);

DROP MATERIALIZED VIEW IF EXISTS api.mv_barrage_dimension;
CREATE MATERIALIZED VIEW api.mv_barrage_dimension AS
SELECT * FROM api.v_barrage_dimension;
CREATE INDEX IF NOT EXISTS idx_mv_barrage_dimension_barrage_id ON api.mv_barrage_dimension(barrage_id);
CREATE INDEX IF NOT EXISTS idx_mv_barrage_dimension_geom_gist ON api.mv_barrage_dimension USING GIST(geom);

DROP MATERIALIZED VIEW IF EXISTS api.mv_points_eau;
CREATE MATERIALIZED VIEW api.mv_points_eau AS
SELECT * FROM api.v_points_eau;
CREATE INDEX IF NOT EXISTS idx_mv_points_eau_point_eau_id ON api.mv_points_eau(point_eau_id);
CREATE INDEX IF NOT EXISTS idx_mv_points_eau_geom_gist ON api.mv_points_eau USING GIST(geom);

DROP MATERIALIZED VIEW IF EXISTS api.mv_reseau_hydrographique;
CREATE MATERIALIZED VIEW api.mv_reseau_hydrographique AS
SELECT *
FROM geo.reseau_hydrographique
WHERE geom IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mv_reseau_hydrographique_geom_gist
  ON api.mv_reseau_hydrographique USING GIST(geom);

-- ----------------------------------------------------------------------------
-- 3) Tracking refresh + refresh function
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS metadata.mv_refresh_status (
    mv_name text PRIMARY KEY,
    refreshed_at timestamptz NOT NULL DEFAULT now(),
    row_count bigint,
    note text
);

CREATE OR REPLACE FUNCTION metadata.refresh_perf_mviews(p_note text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    r record;
    v_count bigint;
BEGIN
    FOR r IN
        SELECT unnest(ARRAY[
            'api.mv_hierarchie_metier_listing',
            'metadata.mv_obs_referentiel_parametre',
            'metadata.mv_obs_parametre_entite_compat',
            'metadata.mv_obs_parametre_coverage',
            'api.mv_bassin_geojson',
            'api.mv_sous_bassin_geojson',
            'api.mv_sous_bassin_swat_geojson',
            'api.mv_nappes_geojson',
            'api.mv_sources_geojson',
            'api.mv_station_dimension',
            'api.mv_barrage_dimension',
            'api.mv_points_eau',
            'api.mv_reseau_hydrographique'
        ]) AS mv_name
    LOOP
        EXECUTE format('REFRESH MATERIALIZED VIEW %s', r.mv_name);
        EXECUTE format('SELECT count(*) FROM %s', r.mv_name) INTO v_count;

        INSERT INTO metadata.mv_refresh_status(mv_name, refreshed_at, row_count, note)
        VALUES (r.mv_name, now(), v_count, p_note)
        ON CONFLICT (mv_name) DO UPDATE
          SET refreshed_at = EXCLUDED.refreshed_at,
              row_count = EXCLUDED.row_count,
              note = EXCLUDED.note;
    END LOOP;
END;
$$;

-- Initial refresh tracking update
SELECT metadata.refresh_perf_mviews('initial setup');

COMMIT;

