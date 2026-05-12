import psycopg2
import os

pass_db = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
conn = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=pass_db)
cur = conn.cursor()

# Find schemas matching hydro or mesure
cur.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('hydro', 'public') AND table_name ILIKE '%debit%'")
print("Target SAD Debit tables:")
tables = cur.fetchall()
res = []
for r in tables:
    cur.execute(f"SELECT COUNT(*) FROM {r[0]}.{r[1]}")
    c = cur.fetchone()[0]
    cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='{r[0]}' AND table_name='{r[1]}'")
    cols = [col[0] for col in cur.fetchall()]
    res.append(f"- {r[0]}.{r[1]}: {c} lignes | Cols: {cols}")

for r in res:
    print(r)
