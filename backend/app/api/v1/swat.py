# backend/app/api/v1/swat.py
from fastapi import APIRouter, Query
from sqlalchemy import text
from app.db.database import engine


router = APIRouter(prefix="/swat", tags=["SWAT"])

# --- 1. Liste des scénarios SWAT ---
@router.get("/scenarios")
def list_scenarios():
    """Retourne la liste des scénarios disponibles"""
    sql = "SELECT id, name, description FROM swat_sebou.swat_scenarios ORDER BY id;"
    with engine.connect() as conn:
        rows = conn.execute(text(sql)).mappings().all()
    return [dict(r) for r in rows]

# --- 2. Moyennes par sous-bassin ---
@router.get("/subbasins")
def list_subbasins(scenario_id: int = Query(...), param: str = Query("surq")):
    sql = f"""
        SELECT subbasin, AVG({param}) AS value
        FROM swat_sebou.swat_subbasin_results
        WHERE scenario_id = :sid
        GROUP BY subbasin
        ORDER BY subbasin
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql), {"sid": scenario_id}).mappings().all()
    return [dict(r) for r in rows]

# --- 3. Série temporelle d’un sous-bassin ---
@router.get("/subbasins/{id}")
def get_timeseries(id: int, scenario_id: int = Query(...)):
    sql = """
        SELECT date, precip, surq, gw_q, wyld, sedp, orgn, solp
        FROM swat_sebou.swat_subbasin_results
        WHERE subbasin = :id AND scenario_id = :sid
        ORDER BY date
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql), {"id": id, "sid": scenario_id}).mappings().all()
    return [dict(r) for r in rows]
