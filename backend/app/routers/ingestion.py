# backend/app/routers/ingestion.py
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import text
import os
import shutil
from pathlib import Path
from app.db.climate_database import get_climate_db

router = APIRouter(prefix="/ingestion", tags=["Ingestion"])

UPLOAD_DIR = Path("data/uploads")

@router.post("/upload")
async def upload_files(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_climate_db)
):
    """
    Handle multi-file upload for SWAT/WASP results.
    Detection of scenarios is done automatically in the background.
    """
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    saved_paths = []
    for file in files:
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_paths.append(str(file_path))
    
    # Trigger background ingestion task (to be implemented)
    # background_tasks.add_task(process_ingestion_batch, saved_paths)
    
    return {
        "message": f"Successfully uploaded {len(files)} files.",
        "files": [f.filename for f in files],
        "status": "Processing in background..."
    }

@router.get("/scenarios")
def get_ingested_scenarios(db: Session = Depends(get_climate_db)):
    """
    Retrieve all available scenarios across SWAT and WASP.
    """
    swat_scenarios = db.execute(text("SELECT id, name, description FROM swat_sebou.swat_scenarios")).mappings().all()
    wasp_scenarios = db.execute(text("SELECT id, name, description FROM wasp_sebou.wasp_scenarios")).mappings().all()
    
    return {
        "swat": swat_scenarios,
        "wasp": wasp_scenarios
    }

@router.get("/validation/anomalies")
def get_data_anomalies(
    scenario_id: int, 
    model: str = Query("swat", enum=["swat", "wasp"]),
    db: Session = Depends(get_climate_db)
):
    """
    Check for values exceeding thresholds (QA Rules).
    """
    if model == "swat":
        # Simplified example: ORGN > 10.0 is critical
        query = text("""
            SELECT subbasin, date, orgn, surq, solp 
            FROM swat_sebou.swat_subbasin_results 
            WHERE scenario_id = :sid AND (orgn > 10.0 OR solp > 0.5)
            LIMIT 100
        """)
    else:
        # WASP critical thresholds
        query = text("""
            SELECT segment_id, date, value, v.name as variable
            FROM wasp_sebou.wasp_results r
            JOIN wasp_sebou.wasp_variables v ON v.id = r.variable_id
            WHERE scenario_id = :sid AND r.value > 20.0
            LIMIT 100
        """)
        
    results = db.execute(query, {"sid": scenario_id}).mappings().all()
    return {
        "scenario_id": scenario_id,
        "model": model,
        "anomalies_count": len(results),
        "alerts": results
    }
