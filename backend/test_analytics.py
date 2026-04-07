# backend/test_analytics.py
import os
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("CLIMATE_DB_USER")
DB_PASS = quote_plus(os.getenv("CLIMATE_DB_PASS", ""))
DB_HOST = os.getenv("CLIMATE_DB_HOST")
DB_PORT = os.getenv("CLIMATE_DB_PORT")
DB_NAME = os.getenv("CLIMATE_DB_NAME")

CLIMATE_DB_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(CLIMATE_DB_URL)

def test_options():
    with engine.connect() as conn:
        print("Testing Climat-Meteo Options...")
        query = text("""
            SELECT DISTINCT 
                submenu_code, submenu_label, 
                variable_code, variable_label, variable_enabled
            FROM analytics.mv_dashboard_climat_meteo_menu
            ORDER BY submenu_label, variable_label
        """)
        rows = conn.execute(query).mappings().all()
        print(f"Found {len(rows)} option rows.")
        for r in rows:
            print(f"  - {r['submenu_label']} ({r['submenu_code']}) | Variable: {r['variable_label']} ({r['variable_code']})")

if __name__ == "__main__":
    try:
        test_options()
    except Exception as e:
        print(f"ERROR: {e}")
