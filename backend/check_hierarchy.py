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
            
            print("\n--- Submenus for Climat ---")
            res = conn.execute(text("select sous_menu, count(*) from api.v_hierarchie_metier_listing where theme = 'Climat' group by sous_menu"))
            for r in res:
                print(r)
                
            print("\n--- All Themes in View ---")
            res = conn.execute(text("select distinct theme from api.v_hierarchie_metier_listing"))
            for r in res:
                print(r)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
