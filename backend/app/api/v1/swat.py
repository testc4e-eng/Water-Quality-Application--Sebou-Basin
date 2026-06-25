# backend/app/api/v1/swat.py
# LEGACY SWAT — Routes de consultation des résultats SWAT.
#
# Corrections 2026-04-14 :
#   - swat_sebou.swat_subbasin_results : table VIDE (0 lignes) — routes redirigées
#     vers wasp_sebou.wasp_results (931k lignes, seule source SWAT/WASP active).
#   - swat_sebou.swat_scenarios    : 1 ligne (scénario fantôme) — conservé mais annoté.
#   - swat_sebou.swat_reach_results : table VIDE — supprimé de ce fichier (voir swat_analysis.py).
#
# Architecture cible : les routes /subbasins et /subbasins/{id} retournent désormais
# des données WASP (segments) qui sont l'équivalent fonctionnel des sous-bassins SWAT.
# Un ETL swat_output complet est différé (Option B, non planifié).

from fastapi import APIRouter, Query, HTTPException
from sqlalchemy import text
from app.db.database import engine

router = APIRouter(prefix="/swat", tags=["SWAT"])


# ---------------------------------------------------------------------------
# 1. Scénarios disponibles (toutes sources : SWAT legacy + WASP actif)
# ---------------------------------------------------------------------------
@router.get("/scenarios")
def list_scenarios():
    """
    Retourne la liste des scénarios de simulation disponibles.
    Inclut les scénarios SWAT legacy (swat_sebou) et les scénarios WASP actifs (wasp_sebou).
    """
    sql = """
        SELECT
            'wasp' AS model_type,
            id::text AS id,
            name,
            description,
            model_version AS version,
            start_date,
            end_date
        FROM wasp_sebou.wasp_scenarios
        WHERE id IS NOT NULL

        UNION ALL

        SELECT
            'swat_legacy' AS model_type,
            id::text AS id,
            name,
            description,
            NULL AS version,
            start_date,
            end_date
        FROM swat_sebou.swat_scenarios

        ORDER BY model_type, id;
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql)).mappings().all()
    return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# 2. Variables / paramètres disponibles
# ---------------------------------------------------------------------------
@router.get("/variables")
def list_variables():
    """
    Retourne la liste des variables WASP disponibles (équivalent des paramètres SWAT).
    Source : wasp_sebou.wasp_variables (seule source active).
    """
    sql = """
        SELECT id, code, name, unit
        FROM wasp_sebou.wasp_variables
        ORDER BY code;
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql)).mappings().all()
    return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# 3. Moyennes par segment WASP (remplace l'ancienne route /subbasins SWAT vide)
# ---------------------------------------------------------------------------
@router.get("/subbasins")
def list_subbasins(
    scenario_id: int = Query(..., description="ID du scénario WASP"),
    param: str = Query("DO", description="Code variable WASP (ex: DO, BOD, NO3, FLOW)"),
):
    """
    Retourne les moyennes par segment WASP pour un scénario et une variable donnés.
    Ancienne route : swat_sebou.swat_subbasin_results (table vide, ETL non exécuté).
    Nouvelle source : wasp_sebou.wasp_results (931 770 lignes actives).
    """
    sql = """
        SELECT
            r.segment_id AS subbasin,
            AVG(r.value) AS value,
            v.code       AS param_code,
            v.name       AS param_name,
            v.unit       AS unit
        FROM wasp_sebou.wasp_results r
        JOIN wasp_sebou.wasp_variables v
            ON v.id = r.variable_id
            AND v.code = :param_code
        WHERE r.scenario_id = :sid
        GROUP BY r.segment_id, v.code, v.name, v.unit
        ORDER BY r.segment_id;
    """
    with engine.connect() as conn:
        rows = conn.execute(
            text(sql), {"sid": scenario_id, "param_code": param}
        ).mappings().all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Aucune donnée pour le scénario {scenario_id} et la variable '{param}'. "
                "Vérifiez l'ID de scénario via GET /swat/scenarios et le code variable via GET /swat/variables."
            ),
        )
    return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# 4. Série temporelle d'un segment WASP (remplace /subbasins/{id} SWAT vide)
# ---------------------------------------------------------------------------
@router.get("/subbasins/{segment_id}")
def get_timeseries(
    segment_id: int,
    scenario_id: int = Query(..., description="ID du scénario WASP"),
    param: str = Query("DO", description="Code variable WASP (ex: DO, BOD, NO3, FLOW)"),
    date_start: str = Query("", description="Date début ISO (YYYY-MM-DD), optionnel"),
    date_end: str = Query("", description="Date fin ISO (YYYY-MM-DD), optionnel"),
):
    """
    Retourne la série temporelle d'un segment WASP pour un scénario et une variable.
    Ancienne route : swat_sebou.swat_subbasin_results (table vide, ETL non exécuté).
    Nouvelle source : wasp_sebou.wasp_results (931 770 lignes actives).
    """
    sql = """
        SELECT
            r.date,
            r.value,
            v.code AS param_code,
            v.name AS param_name,
            v.unit AS unit
        FROM wasp_sebou.wasp_results r
        JOIN wasp_sebou.wasp_variables v
            ON v.id = r.variable_id
            AND v.code = :param_code
        WHERE r.scenario_id  = :sid
          AND r.segment_id   = :seg_id
          AND (:date_start = '' OR r.date >= :date_start::date)
          AND (:date_end   = '' OR r.date <= :date_end::date)
        ORDER BY r.date;
    """
    with engine.connect() as conn:
        rows = conn.execute(
            text(sql),
            {
                "sid": scenario_id,
                "seg_id": segment_id,
                "param_code": param,
                "date_start": date_start or "",
                "date_end": date_end or "",
            },
        ).mappings().all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Aucune donnée pour segment {segment_id}, scénario {scenario_id}, variable '{param}'. "
                "Consultez GET /swat/scenarios et GET /swat/variables pour les valeurs disponibles."
            ),
        )
    return [dict(r) for r in rows]
