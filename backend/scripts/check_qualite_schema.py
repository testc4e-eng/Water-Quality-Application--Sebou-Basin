import os, psycopg2

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    
    print("--- SOURCE PLATFORM : ABH_SEBOU (Sandbox) ---")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    cur_src = conn_src.cursor()
    cur_src.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND (table_name ILIKE '%qualit%' OR table_name ILIKE '%param%' OR table_name ILIKE '%unite%')")
    for r in cur_src.fetchall():
        tname = r[0]
        cur_src.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='{tname}'")
        cols = [c[0] for c in cur_src.fetchall()]
        print(f"SRC Table: public.{tname} | Cols: {cols}")

    print("\n--- TARGET PLATFORM : ABH_SAD (Production) ---")
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    cur_tgt = conn_tgt.cursor()
    cur_tgt.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'qualite' OR (table_schema='public' AND table_name ILIKE '%qualit%')")
    for r in cur_tgt.fetchall():
        sname, tname = r[0], r[1]
        cur_tgt.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='{sname}' AND table_name='{tname}'")
        cols = [c[0] for c in cur_tgt.fetchall()]
        print(f"TGT Table: {sname}.{tname} | Cols: {cols}")

if __name__ == "__main__":
    main()
