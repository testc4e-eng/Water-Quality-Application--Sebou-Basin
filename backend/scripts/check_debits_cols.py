import psycopg2
import os
pass_db = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
conn = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=pass_db)
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='mesures_debit_jr'")
print("JR:", [r[0] for r in cur.fetchall()])
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='mesures_debit_m'")
print("M:", [r[0] for r in cur.fetchall()])
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='mesures_debit_sources'")
print("SRC:", [r[0] for r in cur.fetchall()])
