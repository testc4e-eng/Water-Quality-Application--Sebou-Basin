-- ==============================================================================
-- SCRIPT : 07_sql_audit_gaps_readonly.sql
-- PHASE D.1 : Audit de connectivité et détection des gaps
-- ==============================================================================

-- 1. Détection des intersections sans nœuds (Croisements)
-- Ces points d'intersection géométriques ne sont pas des nœuds topologiques.
SELECT 
    e1.edge_id as edge_a, 
    e2.edge_id as edge_b, 
    ST_AsText(ST_Intersection(e1.geom, e2.geom)) as intersection_point
FROM geo_work.reseau_hydro_edges_raw e1, geo_work.reseau_hydro_edges_raw e2
WHERE e1.edge_id < e2.edge_id
  AND ST_Intersects(e1.geom, e2.geom)
  AND NOT ST_Touches(e1.geom, e2.geom)
  AND ST_Dimension(ST_Intersection(e1.geom, e2.geom)) = 0;

-- 2. Détection des undershoots (Extrémités proches d'un segment)
WITH endpoints AS (
    SELECT edge_id, ST_EndPoint(geom) as p_end
    FROM geo_work.reseau_hydro_edges_raw
)
SELECT 
    pts.edge_id as edge_source,
    line.edge_id as edge_target,
    ST_Distance(pts.p_end, line.geom) as distance_m
FROM endpoints pts, geo_work.reseau_hydro_edges_raw line
WHERE pts.edge_id != line.edge_id
  AND ST_DWithin(pts.p_end, line.geom, 5.0) -- Tolérance 5m
  AND ST_Distance(pts.p_end, ST_StartPoint(line.geom)) > 0.1
  AND ST_Distance(pts.p_end, ST_EndPoint(line.geom)) > 0.1
ORDER BY distance_m;

-- 3. Détection des micro-gaps entre nœuds (< 1m)
WITH endpoints AS (
    SELECT edge_id, ST_StartPoint(geom) as p1, ST_EndPoint(geom) as p2
    FROM geo_work.reseau_hydro_edges_raw
),
pts AS (
    SELECT edge_id, p1 as p FROM endpoints
    UNION ALL
    SELECT edge_id, p2 as p FROM endpoints
)
SELECT 
    a.edge_id as edge_a, b.edge_id as edge_b, 
    ST_Distance(a.p, b.p) as dist_m
FROM pts a, pts b
WHERE a.edge_id < b.edge_id
  AND ST_DWithin(a.p, b.p, 1.0)
  AND ST_Distance(a.p, b.p) > 0.001
ORDER BY dist_m;

-- 4. Analyse des cycles (Potentiels erreurs de topologie)
-- (Nécessite pgRouting ou NetworkX pour une analyse exhaustive,
-- ici on cherche les auto-boucles ou doublons d'arêtes source/target)
SELECT source, target, COUNT(*)
FROM geo_work.reseau_hydro_edges_raw
GROUP BY source, target
HAVING COUNT(*) > 1;
