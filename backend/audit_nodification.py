import psycopg2

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

print("=== Audit des Intersections Non Nodées (Phase D.1B) ===")
cur.execute("""
    SELECT 
        e1.edge_id, 
        e2.edge_id,
        CASE 
            WHEN ST_Intersects(e1.geom, e2.geom) AND NOT ST_Touches(e1.geom, e2.geom) THEN 'CROSSING'
            WHEN ST_DWithin(e1.geom, e2.geom, 0.1) AND NOT ST_Intersects(e1.geom, e2.geom) THEN 'MICRO_GAP'
            ELSE 'OTHER'
        END as type,
        (SELECT COUNT(*) FROM geo_work.reseau_hydro_nodes n WHERE ST_DWithin(n.geom, ST_Intersection(e1.geom, e2.geom), 0.1)) as nodes_at_intersection
    FROM geo_work.reseau_hydro_edges_raw e1, geo_work.reseau_hydro_edges_raw e2
    WHERE e1.edge_id < e2.edge_id
      AND ST_Intersects(e1.geom, e2.geom)
      AND NOT ST_Touches(e1.geom, e2.geom)
      AND ST_Dimension(ST_Intersection(e1.geom, e2.geom)) = 0
    LIMIT 20;
""")
rows = cur.fetchall()
print("| edge_a | edge_b | intersection_type | nodes_at_int | impact |")
print("|---:|---:|:---|---:|:---|")
for r in rows:
    impact = "BLOCKED_ROUTING" if r[3] == 0 else "PARTIAL"
    print(f"| {r[0]} | {r[1]} | {r[2]} | {r[3]} | {impact} |")

conn.close()
