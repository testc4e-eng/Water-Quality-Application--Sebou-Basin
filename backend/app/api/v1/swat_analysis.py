# backend/app/api/v1/swat_analysis.py
# Comparaison simulations SWAT/WASP vs mesures observées.
#
# Corrections 2026-04-14 :
#   - swat_sebou.swat_reach_results : table VIDE (0 lignes), ETL non exécuté.
#     → Route /compare réécrite pour utiliser WASP (wasp_sebou.wasp_results) + hydro observé.
#   - public.mesures_debit_jr : table inexistante dans le schéma public.
#     → Remplacée par hydro.mesure_debit (521 433 lignes) + infra.stations_mesure pour le mapping.
#
# Note d'architecture : quand l'ETL swat_output sera exécuté, cette route pourra être
# mise à jour pour utiliser swat_output.mesure_qualite_subbasin_ts (Option B différée).

from fastapi import APIRouter, Query, HTTPException
from sqlalchemy import text
from app.db.database import engine

router = APIRouter(prefix="/swat/analysis", tags=["SWAT-Analysis"])


def _calc_nse(obs: list[float], sim: list[float]) -> float:
    obs_mean = sum(obs) / len(obs)
    denom = sum((value - obs_mean) ** 2 for value in obs)
    if denom == 0:
        return float("nan")
    return float(1 - sum((sim_value - obs_value) ** 2 for obs_value, sim_value in zip(obs, sim)) / denom)


def _calc_r2(obs: list[float], sim: list[float]) -> float:
    if len(obs) < 2:
        return float("nan")
    obs_mean = sum(obs) / len(obs)
    sim_mean = sum(sim) / len(sim)
    numerator = sum((obs_value - obs_mean) * (sim_value - sim_mean) for obs_value, sim_value in zip(obs, sim))
    obs_var = sum((obs_value - obs_mean) ** 2 for obs_value in obs)
    sim_var = sum((sim_value - sim_mean) ** 2 for sim_value in sim)
    if obs_var == 0 or sim_var == 0:
        return float("nan")
    corr = numerator / ((obs_var * sim_var) ** 0.5)
    return float(corr ** 2)


def _calc_pbias(obs: list[float], sim: list[float]) -> float:
    denom = sum(obs)
    if denom == 0:
        return float("nan")
    return float(100 * sum(sim_value - obs_value for obs_value, sim_value in zip(obs, sim)) / denom)


# ---------------------------------------------------------------------------
# Comparaison WASP simulé vs débit observé (hydro.mesure_debit)
# ---------------------------------------------------------------------------
@router.get("/compare")
def compare_wasp_observed(
    segment_id: int = Query(..., description="ID du segment WASP (wasp_sebou.wasp_results.segment_id)"),
    scenario_id: int = Query(..., description="ID du scénario WASP (wasp_sebou.wasp_scenarios.id)"),
    station_id: str = Query(
        ...,
        description="UUID de la station hydrologique (infra.stations_mesure.id) pour les mesures observées",
    ),
    variable_code: str = Query(
        "FLOW",
        description="Code variable WASP à comparer (ex: FLOW, DO, BOD). Défaut : FLOW",
    ),
    date_start: str = Query("", description="Date début ISO (YYYY-MM-DD), optionnel"),
    date_end: str = Query("", description="Date fin ISO (YYYY-MM-DD), optionnel"),
):
    """
    Compare les valeurs simulées WASP et les débits/mesures observés pour un segment et une station.

    Sources :
    - Simulé  : wasp_sebou.wasp_results + wasp_sebou.wasp_variables (931 770 lignes actives)
    - Observé : hydro.mesure_debit (521 433 lignes) via infra.stations_mesure

    Retourne les séries appariées par date et les indicateurs statistiques NSE, R², PBIAS.
    Si les deux séries n'ont pas de dates en commun, retourne un message explicatif.
    """
    sql = """
        WITH simule AS (
            SELECT
                r.date                          AS dt,
                r.value                         AS val_sim
            FROM wasp_sebou.wasp_results r
            JOIN wasp_sebou.wasp_variables v
                ON v.id = r.variable_id AND v.code = :variable_code
            WHERE r.scenario_id = :scenario_id
              AND r.segment_id  = :segment_id
              AND (:date_start = '' OR r.date >= :date_start::date)
              AND (:date_end   = '' OR r.date <= :date_end::date)
        ),
        observe AS (
            SELECT
                m.temps::date                   AS dt,
                m.valeur                        AS val_obs
            FROM hydro.mesure_debit m
            WHERE m.station_id = :station_id::uuid
              AND m.est_valide  = true
              AND (:date_start = '' OR m.temps::date >= :date_start::date)
              AND (:date_end   = '' OR m.temps::date <= :date_end::date)
        )
        SELECT
            s.dt    AS date,
            s.val_sim AS simulated,
            o.val_obs AS observed
        FROM simule s
        JOIN observe o ON o.dt = s.dt
        ORDER BY s.dt;
    """

    params = {
        "scenario_id":   scenario_id,
        "segment_id":    segment_id,
        "station_id":    station_id,
        "variable_code": variable_code,
        "date_start":    date_start or "",
        "date_end":      date_end or "",
    }

    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()
        data = [dict(r) for r in rows]

    if not data:
        # Fournir un message diagnostic utile
        return {
            "status": "no_overlap",
            "message": (
                "Aucune date commune entre la simulation WASP et les mesures observées. "
                "Vérifiez que le segment WASP et la station hydrologique couvrent la même période "
                "et que station_id est un UUID valide présent dans infra.stations_mesure."
            ),
            "params": {
                "segment_id":    segment_id,
                "scenario_id":   scenario_id,
                "station_id":    station_id,
                "variable_code": variable_code,
            },
            "metrics": None,
            "data":    [],
        }

    obs = [float(d["observed"]) for d in data]
    sim = [float(d["simulated"]) for d in data]

    metrics = {
        "NSE":   round(_calc_nse(obs, sim), 4),
        "R2":    round(_calc_r2(obs, sim), 4),
        "PBIAS": round(_calc_pbias(obs, sim), 2),
        "n_points": len(data),
        "date_min": str(data[0]["date"]),
        "date_max": str(data[-1]["date"]),
    }

    return {
        "status":  "ok",
        "metrics": metrics,
        "data":    data,
    }


# ---------------------------------------------------------------------------
# Statut de disponibilité SWAT (diagnostic rapide)
# ---------------------------------------------------------------------------
@router.get("/status")
def swat_status():
    """
    Retourne l'état de disponibilité des données SWAT/WASP.
    Utile pour le frontend pour savoir quelles sources sont actives.
    """
    sql = """
        SELECT
            (SELECT COUNT(*) FROM wasp_sebou.wasp_results)              AS wasp_results_count,
            (SELECT COUNT(*) FROM wasp_sebou.wasp_scenarios)            AS wasp_scenarios_count,
            (SELECT COUNT(*) FROM wasp_sebou.wasp_variables)            AS wasp_variables_count,
            (SELECT COUNT(*) FROM swat_sebou.swat_reach_results)        AS swat_reach_count,
            (SELECT COUNT(*) FROM swat_sebou.swat_subbasin_results)     AS swat_subbasin_count,
            (SELECT COUNT(*) FROM swat_output.stg_swat_qualite_long)    AS swat_stg_long_count,
            (SELECT COUNT(*) FROM hydro.mesure_debit)                   AS hydro_debit_count;
    """
    with engine.connect() as conn:
        row = dict(conn.execute(text(sql)).mappings().first())

    return {
        "sources": {
            "wasp_actif": {
                "wasp_results":   row["wasp_results_count"],
                "wasp_scenarios": row["wasp_scenarios_count"],
                "wasp_variables": row["wasp_variables_count"],
                "statut": "actif" if row["wasp_results_count"] > 0 else "vide",
            },
            "swat_legacy": {
                "swat_reach_results":    row["swat_reach_count"],
                "swat_subbasin_results": row["swat_subbasin_count"],
                "statut": "vide — ETL non exécuté",
            },
            "swat_staging": {
                "stg_swat_qualite_long": row["swat_stg_long_count"],
                "statut": "staging brut — ETL différé (Option B)",
            },
            "hydro_observe": {
                "mesure_debit": row["hydro_debit_count"],
                "statut": "actif" if row["hydro_debit_count"] > 0 else "vide",
            },
        }
    }
