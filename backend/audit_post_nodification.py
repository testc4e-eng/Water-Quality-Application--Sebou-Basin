import psycopg2
import networkx as nx
import json

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

print("=== Audit Post-Nodification (Phase D.1C) ===")

# 1. Audit des Micro-segments
print("\n[1] Micro-segments (< 5m)")
cur.execute("""
    SELECT edge_id, length_m
    FROM geo_work.reseau_hydro_edges_noded_preview
    WHERE length_m < 5.0
    ORDER BY length_m;
""")
rows = cur.fetchall()
print(f"  Total micro-segments found: {len(rows)}")
print("| edge_id | length_m | classe |")
print("|---:|---:|:---|")
for r in rows[:15]:
    classe = "MICRO" if r[1] < 1.0 else "MINI"
    print(f"| {r[0]} | {float(r[1]):.2f} | {classe} |")

# 2. Détection des Cycles (via NetworkX)
print("\n[2] Détection des Cycles Artificiels")
# Note: On a besoin d'une topologie simplifiée pour NetworkX ici
# Puisqu'on n'a pas encore fait le pgr_createTopology sur le noded_preview, 
# on va utiliser les coordonnées des points terminaux comme proxy de nœuds.
cur.execute("""
    SELECT edge_id, ST_AsBinary(ST_StartPoint(geom)), ST_AsBinary(ST_EndPoint(geom)), length_m
    FROM geo_work.reseau_hydro_edges_noded_preview
""")
edges = cur.fetchall()
G = nx.Graph()
for eid, start, end, length in edges:
    G.add_edge(start, end, edge_id=eid, length=length)

cycles = list(nx.cycle_basis(G))
print(f"  Total cycles détectés: {len(cycles)}")
print("| cycle_id | nb_edges | longueur_totale |")
print("|---:|---:|---:|")
for i, cycle in enumerate(cycles[:10]):
    total_len = 0
    for j in range(len(cycle)):
        u, v = cycle[j], cycle[(j+1)%len(cycle)]
        total_len += G[u][v]['length']
    print(f"| {i} | {len(cycle)} | {total_len:.2f} |")

# 3. Audit des Doublons Géométriques
print("\n[3] Doublons Géométriques (ST_Equals)")
cur.execute("""
    SELECT e1.edge_id, e2.edge_id
    FROM geo_work.reseau_hydro_edges_noded_preview e1, geo_work.reseau_hydro_edges_noded_preview e2
    WHERE e1.edge_id < e2.edge_id
      AND ST_Equals(e1.geom, e2.geom)
""")
rows = cur.fetchall()
print(f"  Total doublons trouvés: {len(rows)}")
for r in rows[:10]:
    print(f"  - Doublon: {r[0]} == {r[1]}")

conn.close()
