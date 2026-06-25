import time
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

sql_file = "c:/dev/WQDSS/repo_git/backend/sql/bloc4_schema_qualite_unifiee.sql"

def main():
    print("--- DEBUT DE L'EXECUTION DDL ---")
    start_time = time.time()
    
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    try:
        conn = psycopg2.connect(host="127.0.0.1", port=5432, dbname="abh_sebou_070426", user="postgres", password="c4e@test@2025")
        # Ensure extensions can be created outside a wrapping transaction block if needed
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Execute the entire script
        cur.execute(sql_content)
        
        elapsed = time.time() - start_time
        print(f"Statut global: SUCCES (temps: {elapsed:.3f} sec)\n")
        
        # 1. Vérifie Extensions
        print("--- EXTENSIONS INSTALLEES ---")
        cur.execute("SELECT extname, extversion FROM pg_extension WHERE extname IN ('uuid-ossp', 'postgis')")
        for r in cur.fetchall():
            print(f"- {r[0]} (v{r[1]})")
            
        print("\n--- TABLES DANS LE SCHEMA 'qualite' ---")
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='qualite' AND table_type='BASE TABLE'")
        tables = [r[0] for r in cur.fetchall()]
        for t in tables:
            print(f"- {t}")

        # Les tables requêtés pour détails
        tables_to_describe = ['ref_parametre', 'prelevement', 'mesure_qualite_unifiee', 'audit_integration_qualite']
        for t in tables_to_describe:
            print(f"\n--- STRUCTURE DE: qualite.{t} ---")
            cur.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema='qualite' AND table_name='{t}' 
                ORDER BY ordinal_position
            """)
            cols = cur.fetchall()
            for c in cols:
                print(f"   {c[0].ljust(30)} : {c[1]}")

        # Index
        print("\n--- NOUVEAUX INDEX CREES ---")
        cur.execute("""
            SELECT indexname, indexdef 
            FROM pg_indexes 
            WHERE schemaname = 'qualite'
        """)
        for idx in cur.fetchall():
            print(f"- {idx[0]}: {idx[1]}")
            
        cur.close()
        conn.close()

    except Exception as e:
        print(f"ERREUR FATALE: {e}")

if __name__ == "__main__":
    main()
