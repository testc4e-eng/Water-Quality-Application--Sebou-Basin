import psycopg2
conn = psycopg2.connect('host=127.0.0.1 dbname=abh_sebou_070426 user=postgres password=c4e@test@2025')
cur = conn.cursor()
cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='infra_stations_abhs'")
print(cur.fetchall())
