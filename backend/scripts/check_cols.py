import psycopg2
from psycopg2.extras import RealDictCursor

conn_src = psycopg2.connect("host=127.0.0.1 dbname=abh_sebou_070426 user=postgres password=c4e@test@2025", cursor_factory=RealDictCursor)
cur = conn_src.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='infra_barrages_abhs'")
print("SRC infra_barrages_abhs:", [r['column_name'] for r in cur.fetchall()])
conn_src.close()

conn_tgt = psycopg2.connect("host=127.0.0.1 dbname=abh_sad user=postgres password=c4e@test@2025", cursor_factory=RealDictCursor)
cur_tgt = conn_tgt.cursor()
cur_tgt.execute("SELECT column_name FROM information_schema.columns WHERE table_name='barrages'")
print("TGT barrages:", [r['column_name'] for r in cur_tgt.fetchall()])
conn_tgt.close()
