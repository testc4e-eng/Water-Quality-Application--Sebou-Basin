import psycopg2
import sys

# use raw connection since sqlalchemy might not be loaded if there's no poetry in the global path
# the .env is in backend dir, it's easier to just read CLIMATE_DB_URL
import os

from dotenv import load_dotenv
load_dotenv(".env")
url = os.environ.get("CLIMATE_DB_URL")

try:
    conn = psycopg2.connect(url)
    cur = conn.cursor()
    cur.execute("""
        SELECT n.nspname, c.relname 
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind IN ('r','v','m') 
          AND c.relname ILIKE '%bassin%' 
          AND n.nspname IN ('public', 'api')
    """)
    print("--- BASSIN ---")
    for r in cur.fetchall():
        print(f"{r[0]}.{r[1]}")

    cur.execute("""
        SELECT n.nspname, c.relname 
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind IN ('r','v','m') 
          AND c.relname ILIKE '%reseau%' 
          AND n.nspname IN ('public', 'api')
    """)
    print("--- RESEAU ---")
    for r in cur.fetchall():
        print(f"{r[0]}.{r[1]}")
        
    # Also dump geometry configuration of api.v_bassin_sebou or whatever exists
    cur.execute("""
        SELECT table_schema, table_name, column_name, data_type, udt_name 
        FROM information_schema.columns 
        WHERE table_schema IN ('public', 'api') AND table_name ILIKE '%bassin%'
    """)
    print("--- COLUMNS ---")
    for r in cur.fetchall():
         if 'geom' in r[2] or 'geography' in r[2] or r[3] == 'USER-DEFINED':
             print(f"{r[0]}.{r[1]} -> {r[2]} ({r[3]}/{r[4]})")

except Exception as e:
    print(f"Error: {e}")
