import psycopg2
from psycopg2.extras import RealDictCursor

conn_src = psycopg2.connect("host=127.0.0.1 dbname=abh_sebou_070426 user=postgres password=c4e@test@2025", cursor_factory=RealDictCursor)
conn_tgt = psycopg2.connect("host=127.0.0.1 dbname=abh_sad user=postgres password=c4e@test@2025", cursor_factory=RealDictCursor)

def get_tables_with_col(conn, col_substrings):
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema IN ('public', 'qualite', 'infra')
    """)
    rows = cur.fetchall()
    results = {}
    for r in rows:
        c_lower = r['column_name'].lower()
        t_name = r['table_name']
        for sub in col_substrings:
            if sub in c_lower:
                if t_name not in results: results[t_name] = []
                results[t_name].append(r['column_name'])
                break
    cur.close()
    return results

print("=== SOURCE SANDBOX: Champs Stations ===")
res_src = get_tables_with_col(conn_src, ['station', 'ire', 'code'])
for t, cols in res_src.items():
    print(f"- {t}: {cols}")

print("\n=== TARGET SAD: Recherche de la table infra ===")
cur_tgt = conn_tgt.cursor()
cur_tgt.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='infra'")
for r in cur_tgt.fetchall():
    print(r)
cur_tgt.execute("SELECT column_name FROM information_schema.columns WHERE table_schema='infra' AND table_name='stations_mesure'")
print("Columns in infra.stations_mesure:")
print([r['column_name'] for r in cur_tgt.fetchall()])

