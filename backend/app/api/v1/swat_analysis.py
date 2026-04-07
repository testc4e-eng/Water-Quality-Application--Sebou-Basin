# backend/app/api/v1/swat_analysis.py
from fastapi import APIRouter, Query
from sqlalchemy import text
from app.db.database import engine


import numpy as np

router = APIRouter(prefix="/api/v1/swat/analysis", tags=["SWAT-Analysis"])

def calc_nse(obs, sim):
    return 1 - np.sum((sim - obs) ** 2) / np.sum((obs - np.mean(obs)) ** 2)

def calc_r2(obs, sim):
    corr = np.corrcoef(obs, sim)[0, 1]
    return corr ** 2

def calc_pbias(obs, sim):
    return 100 * np.sum(sim - obs) / np.sum(obs)

@router.get("/compare")
def compare_swat_observed(
    reach_id: int = Query(..., description="ID du reach SWAT"),
    scenario_id: int = Query(..., description="ID du scénario SWAT"),
):
    """
    Compare les débits simulés SWAT et observés, calcule les indicateurs.
    """
    sql = """
        SELECT s.date, s.flow_out AS simulated, m.debit_jr AS observed
        FROM swat_sebou.swat_reach_results s
        JOIN public.mesures_debit_jr m
        ON s.date = m.date_jr
        WHERE s.reach = :reach_id AND s.scenario_id = :scenario_id
        AND m.debit_jr IS NOT NULL
        ORDER BY s.date
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql), {"reach_id": reach_id, "scenario_id": scenario_id}).mappings().all()
        data = [dict(r) for r in rows]

    if not data:
        return {"message": "Aucune donnée à comparer"}

    obs = np.array([d["observed"] for d in data])
    sim = np.array([d["simulated"] for d in data])

    metrics = {
        "NSE": round(calc_nse(obs, sim), 3),
        "R2": round(calc_r2(obs, sim), 3),
        "PBIAS": round(calc_pbias(obs, sim), 2),
    }

    return {"metrics": metrics, "data": data}
