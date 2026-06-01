import os
import psycopg2

backup_dir = "backups/topology_cleanup_20260514"
if not os.path.exists(backup_dir):
    os.makedirs(backup_dir)

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

tables = [
    "geo_work.reseau_hydro_edges_noded_preview",
    "geo_work.reseau_hydro_nodes"
]

for table in tables:
    filename = os.path.join(backup_dir, f"{table.split('.')[-1]}.csv")
    with open(filename, 'w') as f:
        cur.copy_expert(f"COPY {table} TO STDOUT WITH CSV HEADER", f)
    print(f"Exported {table} to {filename} ({os.path.getsize(filename)} bytes)")

conn.close()
