-- Performance pack SWAT subbasins:
-- Build a geometry-native MV (EPSG:4326) with spatial index.
-- Goal: avoid ST_GeomFromGeoJSON on every /layers call.

DROP MATERIALIZED VIEW IF EXISTS api.mv_sous_bassin_swat_geom_4326;

CREATE MATERIALIZED VIEW api.mv_sous_bassin_swat_geom_4326 AS
SELECT
  t.id::bigint AS id,
  t.bassin_nom::text AS name,
  t.subbasin::integer AS subbasin_id,
  ST_Multi(ST_Transform(ST_SetSRID(t.geom, 32630), 4326))::geometry(MultiPolygon, 4326) AS geom
FROM geo.sous_bassin_swat_bas_sebou t

UNION ALL
SELECT
  t.id::bigint AS id,
  t.bassin_nom::text AS name,
  t.subbasin::integer AS subbasin_id,
  ST_Multi(ST_Transform(ST_SetSRID(t.geom, 32630), 4326))::geometry(MultiPolygon, 4326) AS geom
FROM geo.sous_bassin_swat_bassin_cotier t

UNION ALL
SELECT
  t.id::bigint AS id,
  t.bassin_nom::text AS name,
  t.subbasin::integer AS subbasin_id,
  ST_Multi(ST_Transform(ST_SetSRID(t.geom, 32630), 4326))::geometry(MultiPolygon, 4326) AS geom
FROM geo.sous_bassin_swat_beht t

UNION ALL
SELECT
  t.id::bigint AS id,
  t.bassin_nom::text AS name,
  t.subbasin::integer AS subbasin_id,
  ST_Multi(ST_Transform(ST_SetSRID(t.geom, 32630), 4326))::geometry(MultiPolygon, 4326) AS geom
FROM geo.sous_bassin_swat_haut_sebou t

UNION ALL
SELECT
  t.id::bigint AS id,
  t.bassin_nom::text AS name,
  t."Subbasin"::integer AS subbasin_id,
  ST_Multi(ST_Transform(t.geom, 4326))::geometry(MultiPolygon, 4326) AS geom
FROM geo.sous_bassin_swat_leben_innaouen t

UNION ALL
SELECT
  t.id::bigint AS id,
  t.bassin_nom::text AS name,
  t.subbasin::integer AS subbasin_id,
  ST_Multi(ST_Transform(ST_SetSRID(t.geom, 32630), 4326))::geometry(MultiPolygon, 4326) AS geom
FROM geo.sous_bassin_swat_moyen_sebou t

UNION ALL
SELECT
  t.id::bigint AS id,
  t.bassin_nom::text AS name,
  t.subbasin::integer AS subbasin_id,
  ST_Multi(ST_Transform(ST_SetSRID(t.geom, 32630), 4326))::geometry(MultiPolygon, 4326) AS geom
FROM geo.sous_bassin_swat_ouergha t
;

CREATE INDEX IF NOT EXISTS idx_mv_sous_bassin_swat_geom_4326_geom
  ON api.mv_sous_bassin_swat_geom_4326
  USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx_mv_sous_bassin_swat_geom_4326_name
  ON api.mv_sous_bassin_swat_geom_4326 (name);

CREATE INDEX IF NOT EXISTS idx_mv_sous_bassin_swat_geom_4326_subbasin
  ON api.mv_sous_bassin_swat_geom_4326 (subbasin_id);

ANALYZE api.mv_sous_bassin_swat_geom_4326;

