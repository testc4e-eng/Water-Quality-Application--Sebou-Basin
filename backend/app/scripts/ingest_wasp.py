# backend/app/scripts/ingest_wasp.py
import os
import sys
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import text, delete

# Path configuration
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
load_dotenv()

from app.db.climate_database import ClimateSessionLocal, engine_climate
from app.models.wasp import WaspScenario, WaspVariable, WaspResult

WASP_FILE = r"C:\dev\WQDSS\data\processed\result_WASP\SAD\wasp_long.csv"

def excel_date_to_date(serial):
    # Excel serial date: 1 = 1899-12-30 (actually 1899-12-31 but Excel has a leap year bug)
    return datetime(1899, 12, 30) + timedelta(days=float(serial))

def ingest_wasp():
    if not os.path.exists(WASP_FILE):
        print(f"🚫 WASP file {WASP_FILE} not found.")
        return

    print(f"📂 Processing WASP file: {WASP_FILE}")
    db = ClimateSessionLocal()
    try:
        # 1. Ensure Scenario exists (Default Baseline for now)
        scenario_name = "Baseline_Innaouen"
        scenario = db.query(WaspScenario).filter(WaspScenario.name == scenario_name).first()
        if not scenario:
            scenario = WaspScenario(name=scenario_name, description="Default WASP Baseline Innaouen")
            db.add(scenario)
            db.commit()
            db.refresh(scenario)
        
        scenario_id = scenario.id
        print(f"✅ Target Scenario: {scenario_name} (ID: {scenario_id})")

        # 2. Load Data
        print("📊 Loading WASP CSV data...")
        df = pd.read_csv(WASP_FILE)
        
        # 3. Ensure Variables exist
        variables = df['sheet_name'].unique().tolist()
        var_map = {}
        for var_name in variables:
            code = var_name.upper().replace(" ", "_")
            v = db.query(WaspVariable).filter(WaspVariable.code == code).first()
            if not v:
                v = WaspVariable(name=var_name, code=code)
                db.add(v)
                db.commit()
                db.refresh(v)
            var_map[var_name] = v.id
        print(f"✅ Registered {len(var_map)} variables.")

        # 4. Transform
        print("🛠 Transforming data...")
        df['scenario_id'] = scenario_id
        df['variable_id'] = df['sheet_name'].map(var_map)
        df['date'] = df['date_serial'].apply(excel_date_to_date).dt.date
        df['segment_id'] = df['segment_local_id']
        df['value'] = df['valeur']
        
        final_cols = ['scenario_id', 'variable_id', 'segment_id', 'date', 'value']
        data_to_load = df[final_cols].copy()

        # 5. Clean existing results
        print(f"🧹 Cleaning old results for scenario {scenario_id}...")
        db.execute(delete(WaspResult).where(WaspResult.scenario_id == scenario_id))
        db.commit()

        # 6. Bulk Insert
        print(f"🚀 Inserting {len(data_to_load)} rows...")
        data_to_load.to_sql(
            "wasp_results", 
            con=engine_climate, 
            schema="wasp_sebou", 
            if_exists="append", 
            index=False,
            method="multi",
            chunksize=5000
        )
        print(f"✨ Successfully ingested WASP data.")

    except Exception as e:
        print(f"❌ Error during WASP ingestion: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    ingest_wasp()
