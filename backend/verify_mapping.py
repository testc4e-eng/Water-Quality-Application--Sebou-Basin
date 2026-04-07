import sys
import os
from dotenv import load_dotenv

# Charger .env
load_dotenv()

# Add the backend to sys.path
sys.path.append(os.path.abspath('.'))

from app.db.climate_database import engine_climate, text

def check_db():
    try:
        with engine_climate.connect() as conn:
            print("--- Themes ---")
            res = conn.execute(text("select theme, count(*) from api.v_hierarchie_metier_listing group by theme"))
            for r in res:
                print(r)
            
            themes = ['Climat & meteo', 'Hydrologie', 'Pollution']
            for theme in themes:
                print(f"\n--- Submenus for {theme} ---")
                res = conn.execute(text("select sous_menu, count(*) from api.v_hierarchie_metier_listing where lower(theme) = lower(:theme) group by sous_menu"), {"theme": theme})
                for r in res:
                    print(r)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
