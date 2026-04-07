# backend/app/scripts/ingest_swat.py
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
from app.models.swat import SwatScenario, SwatSubbasinResult

DATA_DIRS = [
    r"C:\dev\WQDSS\data\processed\result_SWATOutput",
    r"C:\dev\WQDSS\data\processed\SWATOutput_mdbf"
]

def parse_julian(value):
    s = str(value).strip()
    if len(s) < 7: return None
    year = int(s[:4])
    day = int(s[4:])
    return datetime(year, 1, 1) + timedelta(days=day - 1)

def ingest_directory(path):
    print(f"📂 Processing directory: {path}")
    scenario_name = os.path.basename(path)
    csv_file = os.path.join(path, "SWAT_outputs.csv")
    
    if not os.path.exists(csv_file):
        print(f"⚠️ No SWAT_outputs.csv found in {path}. Skipping.")
        return

    db = ClimateSessionLocal()
    try:
        # 1. Ensure Scenario exists
        scenario = db.query(SwatScenario).filter(SwatScenario.name == scenario_name).first()
        if not scenario:
            scenario = SwatScenario(name=scenario_name, description=f"Ingested from {path}")
            db.add(scenario)
            db.commit()
            db.refresh(scenario)
        
        scenario_id = scenario.id
        print(f"✅ Target Scenario: {scenario_name} (ID: {scenario_id})")

        # 2. Load and Transform Data
        print("📊 Loading CSV data...")
        df = pd.read_csv(csv_file)
        
        # Mapping column names (from extract_swat_parameter_tables.py)
        # Assuming table sub parameters
        param_map = {
            "ORGNkg_ha": "orgn",
            "ORGPhg_ha": "orgp_out", # Note: orgp in models is orgp_out in reach, but orgp is orgp in subbasin?
            "NSURQkg_ha": "surq",
            "SOLPkg_ha": "solp",
            "SEDPkg_ha": "sedp",
            "PRECIPmm": "precip",
            "GW_Qmm": "gw_q",
            "WYLDmm": "wyld"
        }
        
        # Check available columns
        cols = df.columns.tolist()
        df['date'] = df['YYYYDDD'].apply(parse_julian)
        df['scenario_id'] = scenario_id
        df['subbasin'] = df['SUB']
        
        # Filter and rename
        renames = {k: v for k, v in param_map.items() if k in df.columns}
        df = df.rename(columns=renames)
        
        final_cols = ['scenario_id', 'subbasin', 'date'] + list(renames.values())
        data_to_load = df[final_cols].copy()
        
        # 3. Clean existing results for this scenario to avoid duplicates (Replace-style ingestion)
        print(f"🧹 Cleaning old results for scenario {scenario_id}...")
        db.execute(delete(SwatSubbasinResult).where(SwatSubbasinResult.scenario_id == scenario_id))
        db.commit()

        # 4. Bulk Insert
        print(f"🚀 Inserting {len(data_to_load)} rows...")
        data_to_load.to_sql(
            "swat_subbasin_results", 
            con=engine_climate, 
            schema="swat_sebou", 
            if_exists="append", 
            index=False,
            method="multi",
            chunksize=5000
        )
        print(f"✨ Successfully ingested {scenario_name}")

    except Exception as e:
        print(f"❌ Error during ingestion of {path}: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    for d in DATA_DIRS:
        if os.path.exists(d):
            ingest_directory(d)
        else:
            print(f"🚫 Directory {d} not found.")
