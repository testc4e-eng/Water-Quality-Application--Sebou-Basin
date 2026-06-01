import psycopg2
import networkx as nx

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

# A. Micro-segments à supprimer
print("=== A. Micro-segments à supprimer (< 1m) ===")
cur.execute("SELECT edge_id, length_m FROM geo_work.reseau_hydro_edges_noded_preview WHERE length_m < 1.0 ORDER BY length_m")
rows = cur.fetchall()
print("| edge_id | longueur |")
for r in rows:
    print(f"| {r[0]} | {r[1]:.4f}m |")

# B. Cycle artificiel
print("\n=== B. Cycle artificiel détecté ===")
cur.execute("SELECT edge_id, ST_AsBinary(ST_StartPoint(geom)), ST_AsBinary(ST_EndPoint(geom)), length_m FROM geo_work.reseau_hydro_edges_noded_preview")
edges = cur.fetchall()
G = nx.Graph()
for eid, s, e, l in edges: G.add_edge(s, e, id=eid, len=l)
cycles = nx.cycle_basis(G)
for i, c in enumerate(cycles):
    print(f"Cycle {i}: Nodes={len(c)}, Edges={[G[c[j]][c[(j+1)%len(c)]]['id'] for j in range(len(c))]}")
    total_len = sum(G[c[j]][c[(j+1)%len(c)]]['len'] for j in range(len(c)))
    print(f"Longueur totale: {total_len:.2f}m")

conn.close()
