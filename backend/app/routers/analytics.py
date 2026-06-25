# backend/app/routers/analytics.py

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Optional
from app.db.climate_database import get_climate_db
from app.core.logger import get_logger

log = get_logger("ANALYTICS_API")

router = APIRouter(tags=["analytics"])

SUBMENU_ORDER = ["evaporation", "precipitation", "temperature"]
SUBMENU_LABELS = {
    "evaporation": "Evaporation",
    "precipitation": "Précipitation",
    "temperature": "Température",
}

HYDRO_SUBMENU_ORDER = ["debit", "barrage"]
HYDRO_SUBMENU_LABELS = {
    "debit": "Débit",
    "barrage": "Barrage",
}
POLLUTION_SUBMENU_ORDER = ["inventaire", "ponctuelle", "diffuse"]
POLLUTION_SUBMENU_LABELS = {
    "inventaire": "Inventaire",
    "ponctuelle": "Pollution ponctuelle",
    "diffuse": "Pollution diffuse",
}
HYDRO_VARIABLE_ORDER = {
    "debit_journalier": 1,
    "debit_mensuel": 2,
    "debit_source": 3,
    "niveau_barrage": 1,
    "volume_barrage": 2,
    "lacher_barrage": 3,
    "apport": 4,
    "apports_hm3": 4,
    "transfert": 5,
}


def _normalize_variable(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    v = value.strip()
    if not v or v.lower() in {"null", "none", "__none__"}:
        return None
    return v


def _submenu_has_variables(db: Session, scenario: str, submenu: str) -> bool:
    q = text(
        """
        SELECT EXISTS (
            SELECT 1
            FROM analytics.mv_dashboard_climat_meteo_menu
            WHERE scenario_code = :scenario
              AND submenu_code = :submenu
              AND variable_enabled = TRUE
              AND variable_code IS NOT NULL
        ) AS has_vars
        """
    )
    return bool(db.execute(q, {"scenario": scenario, "submenu": submenu}).scalar())


def _submenu_has_variables_mv(db: Session, mv_name: str, scenario: str, submenu: str) -> bool:
    q = text(
        f"""
        SELECT EXISTS (
            SELECT 1
            FROM {mv_name}
            WHERE scenario_code = :scenario
              AND submenu_code = :submenu
              AND variable_enabled = TRUE
              AND variable_code IS NOT NULL
        ) AS has_vars
        """
    )
    return bool(db.execute(q, {"scenario": scenario, "submenu": submenu}).scalar())


@router.get("/climat-meteo/options")
def get_climat_meteo_options(
    scenario: str = Query("actuel"),
    submenu: Optional[str] = Query(None),
    variable: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne les options hiérarchiques du panneau Climat & Météo:
    - scénarios
    - sous-menus fixes (Evaporation / Précipitation / Température)
    - variables par sous-menu
    - sites (optionnel, si submenu est fourni)
    """
    norm_variable = _normalize_variable(variable)

    scenarios_rows = db.execute(
        text(
            """
            SELECT DISTINCT scenario_code AS code, scenario_label AS label
            FROM analytics.mv_dashboard_climat_meteo_menu
            ORDER BY scenario_code
            """
        )
    ).mappings().all()
    scenarios = [{"code": "actuel", "label": "Actuel"}] if not scenarios_rows else [dict(r) for r in scenarios_rows]

    vars_rows = db.execute(
        text(
            """
            SELECT submenu_code, submenu_label, variable_code, variable_label
            FROM analytics.mv_dashboard_climat_meteo_menu
            WHERE scenario_code = :scenario
              AND variable_enabled = TRUE
              AND variable_code IS NOT NULL
              AND value_num IS NOT NULL
            GROUP BY submenu_code, submenu_label, variable_code, variable_label
            ORDER BY submenu_code, variable_label
            """
        ),
        {"scenario": scenario},
    ).mappings().all()

    vars_by_submenu: dict[str, list[dict[str, str]]] = {k: [] for k in SUBMENU_ORDER}
    submenu_label_from_data: dict[str, str] = {}
    for row in vars_rows:
        sub = str(row["submenu_code"])
        submenu_label_from_data[sub] = str(row["submenu_label"])
        vars_by_submenu.setdefault(sub, [])
        vars_by_submenu[sub].append({"code": row["variable_code"], "label": row["variable_label"]})

    submenus = []
    for sub in SUBMENU_ORDER:
        variables = vars_by_submenu.get(sub, [])
        submenus.append(
            {
                "code": sub,
                "label": submenu_label_from_data.get(sub, SUBMENU_LABELS[sub]),
                "variable_enabled": len(variables) > 0,
                "variables": variables,
            }
        )

    sites: list[dict[str, str]] = []
    if submenu:
        has_vars = _submenu_has_variables(db, scenario=scenario, submenu=submenu)
        q = text(
            """
            SELECT site_id::text AS site_id, site_code, site_name, station_type
            FROM analytics.mv_dashboard_climat_meteo_menu
            WHERE scenario_code = :scenario
              AND submenu_code = :submenu
              AND value_num IS NOT NULL
              AND (
                    (:has_vars = FALSE AND variable_code IS NULL)
                    OR (:has_vars = TRUE AND (:variable IS NULL OR variable_code = :variable))
                  )
            GROUP BY site_id, site_code, site_name, station_type
            ORDER BY site_name
            """
        )
        sites = [dict(r) for r in db.execute(
            q,
            {
                "scenario": scenario,
                "submenu": submenu,
                "variable": norm_variable,
                "has_vars": has_vars,
            },
        ).mappings().all()]

    return {"scenarios": scenarios, "submenus": submenus, "sites": sites}


@router.get("/hydrologie/options")
def get_hydrologie_options(
    scenario: str = Query("actuel"),
    submenu: Optional[str] = Query(None),
    variable: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne les options hiérarchiques du panneau Hydrologie:
    - scénarios
    - sous-menus fixes (Débit / Barrage)
    - variables par sous-menu
    - sites (optionnel, si submenu est fourni)
    """
    norm_variable = _normalize_variable(variable)
    mv = "analytics.mv_dashboard_hydrologie_menu"

    scenarios_rows = db.execute(
        text(
            f"""
            SELECT DISTINCT scenario_code AS code, scenario_label AS label
            FROM {mv}
            ORDER BY scenario_code
            """
        )
    ).mappings().all()
    scenarios = [{"code": "actuel", "label": "Actuel"}] if not scenarios_rows else [dict(r) for r in scenarios_rows]

    vars_rows = db.execute(
        text(
            f"""
            SELECT submenu_code, submenu_label, variable_code, variable_label, unit
            FROM {mv}
            WHERE scenario_code = :scenario
              AND variable_enabled = TRUE
              AND variable_code IS NOT NULL
              AND value_num IS NOT NULL
            GROUP BY submenu_code, submenu_label, variable_code, variable_label, unit
            ORDER BY submenu_code, variable_code
            """
        ),
        {"scenario": scenario},
    ).mappings().all()

    vars_by_submenu: dict[str, list[dict[str, str]]] = {k: [] for k in HYDRO_SUBMENU_ORDER}
    submenu_label_from_data: dict[str, str] = {}
    for row in vars_rows:
        sub = str(row["submenu_code"])
        submenu_label_from_data[sub] = str(row["submenu_label"])
        vars_by_submenu.setdefault(sub, [])
        vars_by_submenu[sub].append(
            {"code": row["variable_code"], "label": row["variable_label"], "unit": row.get("unit")}
        )

    for sub in list(vars_by_submenu.keys()):
        vars_by_submenu[sub] = sorted(
            vars_by_submenu[sub],
            key=lambda v: (
                HYDRO_VARIABLE_ORDER.get(str(v.get("code") or ""), 999),
                str(v.get("label") or ""),
            ),
        )

    submenus = []
    for sub in HYDRO_SUBMENU_ORDER:
        variables = vars_by_submenu.get(sub, [])
        submenus.append(
            {
                "code": sub,
                "label": submenu_label_from_data.get(sub, HYDRO_SUBMENU_LABELS[sub]),
                "variable_enabled": len(variables) > 0,
                "variables": variables,
            }
        )

    sites: list[dict[str, str]] = []
    if submenu:
        has_vars = _submenu_has_variables_mv(db, mv, scenario=scenario, submenu=submenu)
        q = text(
            f"""
            SELECT site_id, site_code, site_name, station_type
            FROM (
                SELECT DISTINCT ON (site_id)
                    site_id::text AS site_id,
                    site_code,
                    site_name,
                    station_type
                FROM {mv}
                WHERE scenario_code = :scenario
                  AND submenu_code = :submenu
                  AND value_num IS NOT NULL
                  AND (
                        (:has_vars = FALSE AND variable_code IS NULL)
                        OR (:has_vars = TRUE AND (:variable IS NULL OR variable_code = :variable))
                      )
                ORDER BY site_id, site_name, station_type
            ) s
            ORDER BY site_name
            """
        )
        sites = [
            dict(r)
            for r in db.execute(
                q,
                {
                    "scenario": scenario,
                    "submenu": submenu,
                    "variable": norm_variable,
                    "has_vars": has_vars,
                },
            )
            .mappings()
            .all()
        ]

    return {"scenarios": scenarios, "submenus": submenus, "sites": sites}


@router.get("/pollution/options")
def get_pollution_options(
    scenario: str = Query("actuel"),
    submenu: Optional[str] = Query(None),
    variable: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne les options hiérarchiques du panneau Pollution:
    - scénarios
    - sous-menus fixes (Inventaire / Pollution ponctuelle / Pollution diffuse)
    - variables par sous-menu
    - sites (optionnel, si submenu est fourni)
    """
    norm_variable = _normalize_variable(variable)
    mv = "analytics.mv_dashboard_pollution_menu"

    scenarios_rows = db.execute(
        text(
            f"""
            SELECT DISTINCT scenario_code AS code, scenario_label AS label
            FROM {mv}
            ORDER BY scenario_code
            """
        )
    ).mappings().all()
    scenarios = [{"code": "actuel", "label": "Actuel"}] if not scenarios_rows else [dict(r) for r in scenarios_rows]

    vars_rows = db.execute(
        text(
            f"""
            SELECT submenu_code, submenu_label, variable_code, variable_label, unit
            FROM {mv}
            WHERE scenario_code = :scenario
              AND variable_enabled = TRUE
              AND variable_code IS NOT NULL
              AND value_num IS NOT NULL
            GROUP BY submenu_code, submenu_label, variable_code, variable_label, unit
            ORDER BY submenu_code, variable_label
            """
        ),
        {"scenario": scenario},
    ).mappings().all()

    vars_by_submenu: dict[str, list[dict[str, str]]] = {k: [] for k in POLLUTION_SUBMENU_ORDER}
    submenu_label_from_data: dict[str, str] = {}
    for row in vars_rows:
        sub = str(row["submenu_code"])
        submenu_label_from_data[sub] = str(row["submenu_label"])
        vars_by_submenu.setdefault(sub, [])
        vars_by_submenu[sub].append(
            {"code": row["variable_code"], "label": row["variable_label"], "unit": row.get("unit")}
        )

    submenus = []
    for sub in POLLUTION_SUBMENU_ORDER:
        variables = vars_by_submenu.get(sub, [])
        submenus.append(
            {
                "code": sub,
                "label": submenu_label_from_data.get(sub, POLLUTION_SUBMENU_LABELS[sub]),
                "variable_enabled": len(variables) > 0,
                "variables": variables,
            }
        )

    sites: list[dict[str, str]] = []
    if submenu:
        has_vars = _submenu_has_variables_mv(db, mv, scenario=scenario, submenu=submenu)
        q = text(
            f"""
            SELECT site_id::text AS site_id, site_code, site_name, station_type
            FROM {mv}
            WHERE scenario_code = :scenario
              AND submenu_code = :submenu
              AND value_num IS NOT NULL
              AND (
                    (:has_vars = FALSE AND variable_code IS NULL)
                    OR (:has_vars = TRUE AND (:variable IS NULL OR variable_code = :variable))
                  )
            GROUP BY site_id, site_code, site_name, station_type
            ORDER BY site_name
            """
        )
        sites = [
            dict(r)
            for r in db.execute(
                q,
                {
                    "scenario": scenario,
                    "submenu": submenu,
                    "variable": norm_variable,
                    "has_vars": has_vars,
                },
            )
            .mappings()
            .all()
        ]

    return {"scenarios": scenarios, "submenus": submenus, "sites": sites}


@router.get("/hydrologie/sites")
def get_hydrologie_sites(
    submenu: str,
    variable: Optional[str] = None,
    scenario: str = "actuel",
    db: Session = Depends(get_climate_db),
):
    """
    Retourne uniquement les entités ayant réellement des valeurs
    pour la combinaison (scenario, submenu, variable éventuelle).
    """
    norm_variable = _normalize_variable(variable)
    mv = "analytics.mv_dashboard_hydrologie_menu"
    has_vars = _submenu_has_variables_mv(db, mv, scenario=scenario, submenu=submenu)

    query = text(
        f"""
        SELECT site_id, site_code, site_name, station_type
        FROM (
            SELECT DISTINCT ON (site_id)
                site_id::text AS site_id,
                site_code,
                site_name,
                station_type
            FROM {mv}
            WHERE scenario_code = :scenario
              AND submenu_code = :submenu
              AND value_num IS NOT NULL
              AND (
                    (:has_vars = FALSE AND variable_code IS NULL)
                    OR (:has_vars = TRUE AND (:variable IS NULL OR variable_code = :variable))
                  )
            ORDER BY site_id, site_name, station_type
        ) s
        ORDER BY site_name
        """
    )
    rows = db.execute(
        query,
        {
            "scenario": scenario,
            "submenu": submenu,
            "variable": norm_variable,
            "has_vars": has_vars,
        },
    ).mappings().all()
    return [dict(r) for r in rows]


@router.get("/hydrologie/series")
def get_hydrologie_series(
    scenario: str = Query("actuel"),
    submenu: str = Query(...),
    site: str = Query(...),
    variable: Optional[str] = Query(None),
    date_start: Optional[str] = Query(None),
    date_end: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne les données analytiques Hydrologie:
    - metadata
    - KPI min/max/moyenne/statut
    - table historique
    - série temporelle
    """
    norm_variable = _normalize_variable(variable)
    mv = "analytics.mv_dashboard_hydrologie_menu"
    has_vars = _submenu_has_variables_mv(db, mv, scenario=scenario, submenu=submenu)
    if has_vars and norm_variable is None:
        raise HTTPException(status_code=422, detail="variable est obligatoire pour ce sous-menu")

    sql = text(
        f"""
        SELECT
            date_obs,
            value_num,
            unit,
            variable_code,
            variable_label,
            source_table,
            data_quality_flag
        FROM {mv}
        WHERE scenario_code = :scenario
          AND submenu_code = :submenu
          AND site_id::text = :site
          AND value_num IS NOT NULL
          AND (
                (:has_vars = FALSE AND variable_code IS NULL)
                OR (:has_vars = TRUE AND variable_code = :variable)
              )
          AND (:date_start IS NULL OR date_obs >= CAST(:date_start AS date))
          AND (:date_end IS NULL OR date_obs <= CAST(:date_end AS date))
        ORDER BY date_obs ASC
        """
    )
    rows = db.execute(
        sql,
        {
            "scenario": scenario,
            "submenu": submenu,
            "site": site,
            "variable": norm_variable,
            "has_vars": has_vars,
            "date_start": date_start,
            "date_end": date_end,
        },
    ).mappings().all()

    if not rows:
        return {
            "metadata": {
                "scenario": scenario,
                "submenu": submenu,
                "variable": norm_variable,
                "site": site,
                "unit": None,
            },
            "kpis": {
                "min": None,
                "max": None,
                "mean": None,
                "count": 0,
                "status": "no_data",
                "unit": None,
            },
            "table": [],
            "series": [],
        }

    values = [float(r["value_num"]) for r in rows if r["value_num"] is not None]
    unit = rows[0]["unit"]

    table_rows = [
        {
            "date_obs": str(r["date_obs"]),
            "value_num": float(r["value_num"]),
            "unit": r["unit"],
            "variable_code": r["variable_code"],
            "variable_label": r["variable_label"],
            "source_table": r["source_table"],
            "data_quality_flag": r["data_quality_flag"],
        }
        for r in rows
    ]

    series_rows = [{"datetime": str(r["date_obs"]), "value": float(r["value_num"])} for r in rows]

    return {
        "metadata": {
            "scenario": scenario,
            "submenu": submenu,
            "variable": norm_variable,
            "site": site,
            "unit": unit,
        },
        "kpis": {
            "min": min(values) if values else None,
            "max": max(values) if values else None,
            "mean": (sum(values) / len(values)) if values else None,
            "count": len(values),
            "status": "ok" if values else "no_data",
            "unit": unit,
        },
        "table": table_rows,
        "series": series_rows,
    }


@router.get("/climat-meteo/sites")
def get_climat_meteo_sites(
    submenu: str,
    variable: Optional[str] = None,
    scenario: str = "actuel",
    db: Session = Depends(get_climate_db),
):
    """
    Retourne uniquement les stations ayant réellement des valeurs
    pour la combinaison (scenario, submenu, variable éventuelle).
    """
    norm_variable = _normalize_variable(variable)
    has_vars = _submenu_has_variables(db, scenario=scenario, submenu=submenu)

    query = text(
        """
        SELECT site_id::text AS site_id, site_code, site_name, station_type
        FROM analytics.mv_dashboard_climat_meteo_menu
        WHERE scenario_code = :scenario
          AND submenu_code = :submenu
          AND value_num IS NOT NULL
          AND (
                (:has_vars = FALSE AND variable_code IS NULL)
                OR (:has_vars = TRUE AND (:variable IS NULL OR variable_code = :variable))
              )
        GROUP BY site_id, site_code, site_name, station_type
        ORDER BY site_name
        """
    )
    rows = db.execute(
        query,
        {
            "scenario": scenario,
            "submenu": submenu,
            "variable": norm_variable,
            "has_vars": has_vars,
        },
    ).mappings().all()
    return [dict(r) for r in rows]


@router.get("/pollution/sites")
def get_pollution_sites(
    submenu: str,
    variable: Optional[str] = None,
    scenario: str = "actuel",
    db: Session = Depends(get_climate_db),
):
    """
    Retourne uniquement les entités ayant réellement des valeurs
    pour la combinaison (scenario, submenu, variable éventuelle).
    """
    norm_variable = _normalize_variable(variable)
    mv = "analytics.mv_dashboard_pollution_menu"
    has_vars = _submenu_has_variables_mv(db, mv, scenario=scenario, submenu=submenu)

    query = text(
        f"""
        SELECT site_id::text AS site_id, site_code, site_name, station_type
        FROM {mv}
        WHERE scenario_code = :scenario
          AND submenu_code = :submenu
          AND value_num IS NOT NULL
          AND (
                (:has_vars = FALSE AND variable_code IS NULL)
                OR (:has_vars = TRUE AND (:variable IS NULL OR variable_code = :variable))
              )
        GROUP BY site_id, site_code, site_name, station_type
        ORDER BY site_name
        """
    )
    rows = db.execute(
        query,
        {
            "scenario": scenario,
            "submenu": submenu,
            "variable": norm_variable,
            "has_vars": has_vars,
        },
    ).mappings().all()
    return [dict(r) for r in rows]


@router.get("/climat-meteo/series")
def get_climat_meteo_series(
    scenario: str = Query("actuel"),
    submenu: str = Query(...),
    site: str = Query(...),
    variable: Optional[str] = Query(None),
    date_start: Optional[str] = Query(None),
    date_end: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne les données analytiques:
    - metadata
    - KPI min/max/moyenne/statut
    - table historique
    - série temporelle
    """
    norm_variable = _normalize_variable(variable)
    has_vars = _submenu_has_variables(db, scenario=scenario, submenu=submenu)
    if has_vars and norm_variable is None:
        raise HTTPException(status_code=422, detail="variable est obligatoire pour ce sous-menu")

    sql = text(
        """
        SELECT
            date_obs,
            value_num,
            unit,
            variable_code,
            variable_label,
            source_table,
            data_quality_flag
        FROM analytics.mv_dashboard_climat_meteo_menu
        WHERE scenario_code = :scenario
          AND submenu_code = :submenu
          AND site_id::text = :site
          AND value_num IS NOT NULL
          AND (
                (:has_vars = FALSE AND variable_code IS NULL)
                OR (:has_vars = TRUE AND variable_code = :variable)
              )
          AND (:date_start IS NULL OR date_obs >= CAST(:date_start AS date))
          AND (:date_end IS NULL OR date_obs <= CAST(:date_end AS date))
        ORDER BY date_obs ASC
        """
    )
    rows = db.execute(
        sql,
        {
            "scenario": scenario,
            "submenu": submenu,
            "site": site,
            "variable": norm_variable,
            "has_vars": has_vars,
            "date_start": date_start,
            "date_end": date_end,
        },
    ).mappings().all()

    if not rows:
        return {
            "metadata": {
                "scenario": scenario,
                "submenu": submenu,
                "variable": norm_variable,
                "site": site,
                "unit": None,
            },
            "kpis": {
                "min": None,
                "max": None,
                "mean": None,
                "count": 0,
                "status": "no_data",
                "unit": None,
            },
            "table": [],
            "series": [],
        }

    values = [float(r["value_num"]) for r in rows if r["value_num"] is not None]
    unit = rows[0]["unit"]

    table_rows = [
        {
            "date_obs": str(r["date_obs"]),
            "value_num": float(r["value_num"]),
            "unit": r["unit"],
            "variable_code": r["variable_code"],
            "variable_label": r["variable_label"],
            "source_table": r["source_table"],
            "data_quality_flag": r["data_quality_flag"],
        }
        for r in rows
    ]

    series_rows = [{"datetime": str(r["date_obs"]), "value": float(r["value_num"])} for r in rows]

    return {
        "metadata": {
            "scenario": scenario,
            "submenu": submenu,
            "variable": norm_variable,
            "site": site,
            "unit": unit,
        },
        "kpis": {
            "min": min(values) if values else None,
            "max": max(values) if values else None,
            "mean": (sum(values) / len(values)) if values else None,
            "count": len(values),
            "status": "ok" if values else "no_data",
            "unit": unit,
        },
        "table": table_rows,
        "series": series_rows,
    }


@router.get("/pollution/series")
def get_pollution_series(
    scenario: str = Query("actuel"),
    submenu: str = Query(...),
    site: str = Query(...),
    variable: Optional[str] = Query(None),
    date_start: Optional[str] = Query(None),
    date_end: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    """
    Retourne les données analytiques Pollution:
    - metadata
    - KPI min/max/moyenne/statut
    - table historique
    - série temporelle
    """
    norm_variable = _normalize_variable(variable)
    mv = "analytics.mv_dashboard_pollution_menu"
    has_vars = _submenu_has_variables_mv(db, mv, scenario=scenario, submenu=submenu)
    if has_vars and norm_variable is None:
        raise HTTPException(status_code=422, detail="variable est obligatoire pour ce sous-menu")

    sql = text(
        f"""
        SELECT
            date_obs,
            value_num,
            unit,
            variable_code,
            variable_label,
            source_table,
            data_quality_flag
        FROM {mv}
        WHERE scenario_code = :scenario
          AND submenu_code = :submenu
          AND site_id::text = :site
          AND value_num IS NOT NULL
          AND (
                (:has_vars = FALSE AND variable_code IS NULL)
                OR (:has_vars = TRUE AND variable_code = :variable)
              )
          AND (:date_start IS NULL OR date_obs >= CAST(:date_start AS date))
          AND (:date_end IS NULL OR date_obs <= CAST(:date_end AS date))
        ORDER BY date_obs ASC
        """
    )
    rows = db.execute(
        sql,
        {
            "scenario": scenario,
            "submenu": submenu,
            "site": site,
            "variable": norm_variable,
            "has_vars": has_vars,
            "date_start": date_start,
            "date_end": date_end,
        },
    ).mappings().all()

    if not rows:
        return {
            "metadata": {
                "scenario": scenario,
                "submenu": submenu,
                "variable": norm_variable,
                "site": site,
                "unit": None,
            },
            "kpis": {
                "min": None,
                "max": None,
                "mean": None,
                "count": 0,
                "status": "no_data",
                "unit": None,
            },
            "table": [],
            "series": [],
        }

    values = [float(r["value_num"]) for r in rows if r["value_num"] is not None]
    unit = rows[0]["unit"]

    table_rows = [
        {
            "date_obs": str(r["date_obs"]),
            "value_num": float(r["value_num"]),
            "unit": r["unit"],
            "variable_code": r["variable_code"],
            "variable_label": r["variable_label"],
            "source_table": r["source_table"],
            "data_quality_flag": r["data_quality_flag"],
        }
        for r in rows
    ]

    series_rows = [{"datetime": str(r["date_obs"]), "value": float(r["value_num"])} for r in rows]

    return {
        "metadata": {
            "scenario": scenario,
            "submenu": submenu,
            "variable": norm_variable,
            "site": site,
            "unit": unit,
        },
        "kpis": {
            "min": min(values) if values else None,
            "max": max(values) if values else None,
            "mean": (sum(values) / len(values)) if values else None,
            "count": len(values),
            "status": "ok" if values else "no_data",
            "unit": unit,
        },
        "table": table_rows,
        "series": series_rows,
    }
