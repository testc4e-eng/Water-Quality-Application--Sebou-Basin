-- ATTENTION : SCRIPT READ-ONLY PROPOSE, NON EXECUTE
-- Objectif : rattacher les lignes IDP 2024 par coordonnees X/Y avec buffer strict <= 2 m
-- Hypothese metier : les coordonnees source IDP sont exprimees dans le SRID 26191

-- 1. Construire le pool de candidats geographiques
WITH candidates AS (
  SELECT 'infra.stations' AS source_table, id_station::text AS entity_id,
         COALESCE(nom_station, ire_station::text) AS entity_name,
         'station' AS entity_class,
         CASE
           WHEN ST_SRID(geom)=4326 THEN ST_Transform(geom,26191)
           WHEN ST_SRID(geom)=0 THEN ST_SetSRID(geom,26191)
           ELSE geom
         END AS geom
  FROM infra.stations WHERE geom IS NOT NULL
  UNION ALL
  SELECT 'infra.stations_mesure', id::text, COALESCE(nom, code_station), 'station',
         CASE
           WHEN ST_SRID(geom)=4326 THEN ST_Transform(geom,26191)
           WHEN ST_SRID(geom)=0 THEN ST_SetSRID(geom,26191)
           ELSE geom
         END
  FROM infra.stations_mesure WHERE geom IS NOT NULL
  UNION ALL
  SELECT 'infra.point_eau', id::text, COALESCE(nom_pt_eau, code_pt_eau), 'point_eau',
         CASE
           WHEN ST_SRID(geom)=4326 THEN ST_Transform(geom,26191)
           WHEN ST_SRID(geom)=0 THEN ST_SetSRID(geom,26191)
           ELSE geom
         END
  FROM infra.point_eau WHERE geom IS NOT NULL
  UNION ALL
  SELECT 'qualite.source_pollution_prelevement', id::text, point_prelevement, 'point_pollution',
         CASE
           WHEN ST_SRID(geom)=4326 THEN ST_Transform(geom,26191)
           WHEN ST_SRID(geom)=0 THEN ST_SetSRID(geom,26191)
           ELSE geom
         END
  FROM qualite.source_pollution_prelevement WHERE geom IS NOT NULL
)
SELECT COUNT(*) FROM candidates;

-- 2. Audit de rattachement pour une table IDP
WITH idp AS (
  SELECT id_pts::text AS id_ligne, date_jr_prelevement, ire, pts_prelevement, coord_x, coord_y,
         ST_SetSRID(ST_MakePoint(coord_x, coord_y), 26191) AS geom
  FROM staging.raw_idp_2024_mesures_qualite_globale
)
SELECT i.id_ligne, i.ire, i.pts_prelevement,
       c.source_table, c.entity_id, c.entity_name, c.entity_class,
       ST_Distance(i.geom, c.geom) AS distance_m
FROM idp i
JOIN candidates c ON ST_DWithin(i.geom, c.geom, 2)
ORDER BY i.id_ligne, distance_m;

-- 3. Compter les statuts GEO_MATCH_XY_2M / GEO_AMBIGUOUS_XY_2M / GEO_ORPHAN_XY_2M
WITH hits AS (
  SELECT i.id_pts::text AS id_ligne
  FROM staging.raw_idp_2024_mesures_qualite_globale i
  JOIN candidates c
    ON ST_DWithin(ST_SetSRID(ST_MakePoint(i.coord_x, i.coord_y), 26191), c.geom, 2)
),
agg AS (
  SELECT i.id_pts::text AS id_ligne, COUNT(h.id_ligne) AS candidate_count
  FROM staging.raw_idp_2024_mesures_qualite_globale i
  LEFT JOIN hits h ON h.id_ligne = i.id_pts::text
  GROUP BY i.id_pts::text
)
SELECT
  COUNT(*) FILTER (WHERE candidate_count = 1) AS geo_match_xy_2m,
  COUNT(*) FILTER (WHERE candidate_count > 1) AS geo_ambiguous_xy_2m,
  COUNT(*) FILTER (WHERE candidate_count = 0) AS geo_orphan_xy_2m
FROM agg;

-- 4. Liste priorisee des stations proches (<20 m)
SELECT a.id_station, a.ire_station, a.nom_station,
       b.id_station AS id_station_b, b.ire_station AS ire_station_b, b.nom_station AS nom_station_b,
       ST_Distance(
         CASE WHEN ST_SRID(a.geom)=4326 THEN ST_Transform(a.geom,26191) ELSE a.geom END,
         CASE WHEN ST_SRID(b.geom)=4326 THEN ST_Transform(b.geom,26191) ELSE b.geom END
       ) AS distance_m
FROM infra.stations a
JOIN infra.stations b
  ON a.id_station < b.id_station
 AND ST_DWithin(
       CASE WHEN ST_SRID(a.geom)=4326 THEN ST_Transform(a.geom,26191) ELSE a.geom END,
       CASE WHEN ST_SRID(b.geom)=4326 THEN ST_Transform(b.geom,26191) ELSE b.geom END,
       20
     )
ORDER BY distance_m, a.nom_station, b.nom_station;
