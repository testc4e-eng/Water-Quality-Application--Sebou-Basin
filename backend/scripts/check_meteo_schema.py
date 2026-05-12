import os, psycopg2

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    cur_tgt = conn_tgt.cursor()

    print("--- TARGET SAD ---")
    cur_tgt.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('meteo', 'hydro', 'public') AND (table_name ILIKE '%precip%' OR table_name ILIKE '%evap%' OR table_name ILIKE '%meteo%')")
    for r in cur_tgt.fetchall():
        cur_tgt.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='{r[0]}' AND table_name='{r[1]}'")
        cols = [c[0] for c in cur_tgt.fetchall()]
        print(f"Table: {r[0]}.{r[1]} | Cols: {cols}")
        
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    cur_src = conn_src.cursor()
    print("\n--- SOURCE SANDBOX ---")
    cur_src.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name ILIKE '%precip%' OR table_name ILIKE '%evap%')")
    for r in cur_src.fetchall():
        cur_src.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='{r[0]}'")
        cols = [c[0] for c in cur_src.fetchall()]
        print(f"Table: public.{r[0]} | Cols: {cols}")

if __name__ == "__main__":
    main()
