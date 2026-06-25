import os
import io
import sys
import psycopg2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def lookup_tables():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    
    keywords = ["%idp%", "%pollution%", "%rejet%", "%inventaire%", "%ponctuel%"]
    
    print("--- SANDBOX ---")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    cur_src = conn_src.cursor()
    
    for k in keywords:
        cur_src.execute(f"SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name ILIKE '{k}'")
        for r in cur_src.fetchall():
            print(f"SRC : {r[0]}")
            
    print("\n--- PROD ---")
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    cur_tgt = conn_tgt.cursor()
    
    for schema in ['public', 'qualite', 'infra', 'geo']:
        for k in keywords:
            cur_tgt.execute(f"SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='{schema}' AND table_name ILIKE '{k}'")
            for r in cur_tgt.fetchall():
                print(f"TGT : {r[0]}.{r[1]}")

def main():
    lookup_tables()

if __name__ == "__main__":
    main()
