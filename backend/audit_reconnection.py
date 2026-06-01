import psycopg2

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

print("=== Audit Exhaustif des Gaps (Phase D.1) ===")

# A. Intersections géométriques sans nœuds topologiques
print("\n[A] Intersections sans nœuds (Croisements)")
cur.execute("""
    SELECT e1.edge_id, e2.edge_id, ST_AsText(ST_Intersection(e1.geom, e2.geom))
    FROM geo_work.reseau_hydro_edges_raw e1, geo_work.reseau_hydro_edges_raw e2
    WHERE e1.edge_id < e2.edge_id
      AND ST_Intersects(e1.geom, e2.geom)
      AND NOT ST_Touches(e1.geom, e2.geom)
      AND ST_Dimension(ST_Intersection(e1.geom, e2.geom)) = 0 -- Point intersection
    LIMIT 10;
""")
rows = cur.fetchall()
if rows:
    print("| edge_a | edge_b | intersection_point |")
    for r in rows:
        print(f"| {r[0]} | {r[1]} | {r[2]} |")
else:
    print("  Aucun croisement sans nœud détecté.")

# B. Endpoints proches de segments (Undershoots)
print("\n[B] Endpoints proches de segments (Undershoots)")
cur.execute("""
    WITH endpoints AS (
        SELECT edge_id, ST_StartPoint(geom) as p_start, ST_EndPoint(geom) as p_end
        FROM geo_work.reseau_hydro_edges_raw
    ),
    undershoots AS (
        SELECT 
            pts.edge_id as edge_p,
            line.edge_id as edge_l,
            ST_Distance(pts.p_end, line.geom) as dist,
            'END_TO_LINE' as type
        FROM endpoints pts, geo_work.reseau_hydro_edges_raw line
        WHERE pts.edge_id != line.edge_id
          AND ST_DWithin(pts.p_end, line.geom, 10)
          AND ST_Distance(pts.p_end, ST_StartPoint(line.geom)) > 0.1
          AND ST_Distance(pts.p_end, ST_EndPoint(line.geom)) > 0.1
    )
    SELECT edge_p, edge_l, dist, type FROM undershoots ORDER BY dist LIMIT 20;
""")
rows = cur.fetchall()
print("| edge_p | edge_l | distance_m | type |")
for r in rows:
    print(f"| {r[0]} | {r[1]} | {float(r[2]):.2f} | {r[3]} |")

# C. Endpoints entre eux (Gaps aux nœuds)
print("\n[C] Endpoints entre eux (Gaps aux nœuds)")
cur.execute("""
    WITH endpoints AS (
        SELECT edge_id, ST_StartPoint(geom) as p1, ST_EndPoint(geom) as p2
        FROM geo_work.reseau_hydro_edges_raw
    ),
    pts AS (
        SELECT edge_id, p1 as p, 'START' as t FROM endpoints
        UNION ALL
        SELECT edge_id, p2 as p, 'END' as t FROM endpoints
    )
    SELECT 
        a.edge_id, b.edge_id, ST_Distance(a.p, b.p) as dist,
        a.t || '_TO_' || b.t as type
    FROM pts a, pts b
    WHERE a.edge_id < b.edge_id
      AND ST_DWithin(a.p, b.p, 10)
      AND ST_Distance(a.p, b.p) > 0.001
    ORDER BY dist LIMIT 20;
""")
rows = cur.fetchall()
print("| edge_a | edge_b | distance_m | type |")
for r in rows:
    print(f"| {r[0]} | {r[1]} | {float(r[2]):.2f} | {r[3]} |")

conn.close()
