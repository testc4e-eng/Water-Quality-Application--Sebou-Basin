# backend/test_analytics_psycopg2.py
import os
import psycopg2
from dotenv import load_dotenv

# Use the .env from the backend directory
load_dotenv("backend/.env")
DB_URL = os.environ.get("CLIMATE_DB_URL")

def test_options():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        print("Testing Climat-Meteo Options...")
        query = """
            SELECT DISTINCT 
                submenu_code, submenu_label, 
                variable_code, variable_label, variable_enabled
            FROM analytics.mv_dashboard_climat_meteo_menu
            ORDER BY submenu_label, variable_label
        """
        cur.execute(query)
        rows = cur.fetchall()
        print(f"Found {len(rows)} option rows.")
        for r in rows:
            print(f"  - {r[1]} ({r[0]}) | Variable: {r[3]} ({r[2]})")
        
        # Test sites also
        print("\nTesting Sites for Températeur/temperature_max...")
        cur.execute("""
            SELECT DISTINCT site_id, site_code, site_name, station_type
            FROM analytics.mv_dashboard_climat_meteo_menu
            WHERE scenario_code = 'actuel'
              AND (submenu_code = 'temperature' OR submenu_label ILIKE '%Tempé%')
              AND (variable_code = 'temperature_max' OR variable_label ILIKE '%max%')
            LIMIT 5
        """)
        sites = cur.fetchall()
        print(f"Found {len(sites)} sites for temp max.")
        for s in sites:
            print(f"  - {s[2]} ({s[1]})")

        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_options()
