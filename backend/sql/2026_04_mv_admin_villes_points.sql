-- Villes points dérivées depuis admin.localite (1 point par commune)
-- Objectif: alimenter la couche adm_villes_abhs avec une géométrie point stable.

CREATE SCHEMA IF NOT EXISTS api;

DROP MATERIALIZED VIEW IF EXISTS api.mv_admin_villes_points;

CREATE MATERIALIZED VIEW api.mv_admin_villes_points AS
WITH grouped AS (
  SELECT
    COALESCE(NULLIF(code_commu, ''), md5(COALESCE(commune_fr, ''))::text) AS code_commune,
    COALESCE(NULLIF(commune_fr, ''), 'Commune sans nom') AS commune_fr,
    COUNT(*)::integer AS localite_count,
    ST_Centroid(ST_Collect(ST_Transform(geom, 4326))) AS geom
  FROM admin.localite
  WHERE geom IS NOT NULL
    AND ST_IsValid(geom)
  GROUP BY 1, 2
)
SELECT
  row_number() OVER ()::bigint AS id,
  code_commune,
  commune_fr,
  localite_count,
  geom
FROM grouped
WHERE geom IS NOT NULL
  AND ST_IsValid(geom);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_admin_villes_points_id
  ON api.mv_admin_villes_points (id);

CREATE INDEX IF NOT EXISTS idx_mv_admin_villes_points_code_commune
  ON api.mv_admin_villes_points (code_commune);

CREATE INDEX IF NOT EXISTS idx_mv_admin_villes_points_geom_gist
  ON api.mv_admin_villes_points USING GIST (geom);

ANALYZE api.mv_admin_villes_points;

