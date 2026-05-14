# backend/app/routers/analytics.py

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Optional
from app.db.climate_database import get_climate_db
from app.core.logger import get_logger
from app.util_dbmeta import table_exists

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

CLIMATE_FALLBACK_SCENARIO = {"code": "actuel", "label": "Actuel"}


def _normalize_variable(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    v = value.strip()
    if not v or v.lower() in {"null", "none", "__none__"}:
        return None
    return v


def _normalize_aggregation(value: Optional[str]) -> str:
    key = (value or "").strip().lower()
    mapping = {
        "raw": "raw",
        "brut": "raw",
        "donnees_brutes": "raw",
        "day": "day",
        "daily": "day",
        "journaliere": "day",
        "journalier": "day",
        "month": "month",
        "monthly": "month",
        "mensuelle": "month",
        "mensuel": "month",
        "year": "year",
        "yearly": "year",
        "annuelle": "year",
        "annuel": "year",
    }
    return mapping.get(key, "day")


def _climate_analytics_has_data(db: Session) -> bool:
    q = text(
        """
        SELECT EXISTS (
            SELECT 1
            FROM analytics.mv_dashboard_climat_meteo_menu
            WHERE value_num IS NOT NULL
        ) AS has_data
        """
    )
    return bool(db.execute(q).scalar())


def _climate_fallback_catalog(db: Session) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []

    if table_exists("staging.raw_mesures_precipitations_jr_traitees"):
        has_precip = bool(
            db.execute(
                text(
                    """
                    SELECT EXISTS (
                        SELECT 1
                        FROM staging.raw_mesures_precipitations_jr_traitees s
                        JOIN api.v_station_dimension d
                          ON d.legacy_code_station = s.ire_station
                          OR d.code_station = s.ire_station
                        WHERE s.val_remplies IS NOT NULL
                    )
                    """
                )
            ).scalar()
        )
        if has_precip:
            items.append(
                {
                    "code": "precipitation",
                    "label": "Precipitation",
                    "unit": "mm",
                    "source_table": "staging.raw_mesures_precipitations_jr_traitees",
                }
            )

    if table_exists("staging.raw_mesures_evaporation_jr"):
        has_evap = bool(
            db.execute(
                text(
                    """
                    SELECT EXISTS (
                        SELECT 1
                        FROM staging.raw_mesures_evaporation_jr s
                        JOIN api.v_station_dimension d
                          ON d.legacy_code_station = s.ire_station
                          OR d.code_station = s.ire_station
                        WHERE s.val_evaporation IS NOT NULL
                    )
                    """
                )
            ).scalar()
        )
        if has_evap:
            items.append(
                {
                    "code": "evaporation",
                    "label": "Evaporation",
                    "unit": "mm",
                    "source_table": "staging.raw_mesures_evaporation_jr",
                }
            )

    if table_exists("api.v_meteo_temperature_journalier"):
        has_temp = bool(
            db.execute(
                text(
                    """
                    SELECT EXISTS (
                        SELECT 1
                        FROM api.v_meteo_temperature_journalier
                        WHERE val_moy IS NOT NULL
                    )
                    """
                )
            ).scalar()
        )
        if has_temp:
            items.append(
                {
                    "code": "temperature",
                    "label": "Temperature",
                    "unit": "C",
                    "source_table": "api.v_meteo_temperature_journalier",
                }
            )

    return items


def _climate_fallback_item(
    db: Session,
    submenu: Optional[str],
    variable: Optional[str],
) -> Optional[dict[str, str]]:
    sub = (submenu or "").strip().lower()
    var = (variable or "").strip().lower()
    if not sub:
        return None
    for item in _climate_fallback_catalog(db):
        if item["code"] != sub:
            continue
        if var and item["code"] != var:
            continue
        return item
    return None


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
    if not _climate_analytics_has_data(db):
        fallback_catalog = _climate_fallback_catalog(db)
        submenus = [
            {
                "code": item["code"],
                "label": item["label"],
                "variable_enabled": True,
                "variables": [
                    {
                        "code": item["code"],
                        "label": item["label"],
                        "unit": item["unit"],
                        "source_schema": item["source_table"].split(".", 1)[0],
                        "source_table": item["source_table"].split(".", 1)[1],
                    }
                ],
            }
            for item in fallback_catalog
        ]
        log.info(
            "GET /analytics/climat-meteo/options | fallback=staging/api | submenu=%s | variable=%s | submenus=%s",
            submenu,
            norm_variable,
            len(submenus),
        )
        return {"scenarios": [CLIMATE_FALLBACK_SCENARIO], "submenus": submenus, "sites": []}

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


@router.get("/climat-meteo/scenarios")
def get_climat_meteo_scenarios(
    submenu: str = Query(...),
    variable: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    norm_variable = _normalize_variable(variable)

    if not _climate_analytics_has_data(db):
        item = _climate_fallback_item(db, submenu, norm_variable)
        scenarios = [CLIMATE_FALLBACK_SCENARIO] if item else []
        log.info(
            "GET /analytics/climat-meteo/scenarios | fallback=staging/api | submenu=%s | variable=%s | scenarios=%s",
            submenu,
            norm_variable,
            len(scenarios),
        )
        return scenarios

    rows = db.execute(
        text(
            """
            SELECT DISTINCT scenario_code AS code, scenario_label AS label
            FROM analytics.mv_dashboard_climat_meteo_menu
            WHERE submenu_code = :submenu
              AND (:variable IS NULL OR variable_code = :variable)
              AND value_num IS NOT NULL
            ORDER BY scenario_code
            """
        ),
        {"submenu": submenu, "variable": norm_variable},
    ).mappings().all()
    log.info(
        "GET /analytics/climat-meteo/scenarios | submenu=%s | variable=%s | scenarios=%s",
        submenu,
        norm_variable,
        len(rows),
    )
    return [dict(r) for r in rows]


@router.get("/climat-meteo/date-range")
def get_climat_meteo_date_range(
    submenu: str = Query(...),
    scenario: str = Query("actuel"),
    aggregation: Optional[str] = Query("day"),
    variable: Optional[str] = Query(None),
    db: Session = Depends(get_climate_db),
):
    norm_variable = _normalize_variable(variable)
    agg = _normalize_aggregation(aggregation)

    if not _climate_analytics_has_data(db):
        item = _climate_fallback_item(db, submenu, norm_variable)
        if item is None or scenario != "actuel":
            return {"minDate": None, "maxDate": None, "count": 0}

        if item["code"] == "precipitation":
            date_expr = "s.date_jr"
            source_from = "staging.raw_mesures_precipitations_jr_traitees s"
            value_filter = "s.val_remplies IS NOT NULL"
        elif item["code"] == "evaporation":
            date_expr = "s.date_mesure"
            source_from = "staging.raw_mesures_evaporation_jr s"
            value_filter = "s.val_evaporation IS NOT NULL"
        else:
            date_expr = "s.bucket_day"
            source_from = "api.v_meteo_temperature_journalier s"
            value_filter = "s.val_moy IS NOT NULL"

        if agg in {"raw", "day"}:
            bucket_expr = f"{date_expr}::date"
        elif agg == "month":
            bucket_expr = f"date_trunc('month', {date_expr})::date"
        else:
            bucket_expr = f"date_trunc('year', {date_expr})::date"

        q = text(
            f"""
            WITH series AS (
                SELECT {bucket_expr} AS bucket_date
                FROM {source_from}
                WHERE {value_filter}
            )
            SELECT
                MIN(bucket_date)::date AS min_date,
                MAX(bucket_date)::date AS max_date,
                COUNT(*)::int AS n
            FROM series
            """
        )
        row = db.execute(q).mappings().first()
        return {
            "minDate": str(row["min_date"]) if row and row["min_date"] else None,
            "maxDate": str(row["max_date"]) if row and row["max_date"] else None,
            "count": int(row["n"]) if row else 0,
        }

    has_vars = _submenu_has_variables(db, scenario=scenario, submenu=submenu)
    if has_vars and norm_variable is None:
        raise HTTPException(status_code=422, detail="variable est obligatoire pour ce sous-menu")

    if agg in {"raw", "day"}:
        bucket_expr = "date_obs::date"
    elif agg == "month":
        bucket_expr = "date_trunc('month', date_obs)::date"
    else:
        bucket_expr = "date_trunc('year', date_obs)::date"

    q = text(
        f"""
        WITH series AS (
            SELECT {bucket_expr} AS bucket_date
            FROM analytics.mv_dashboard_climat_meteo_menu
            WHERE scenario_code = :scenario
              AND submenu_code = :submenu
              AND value_num IS NOT NULL
              AND (
                    (:has_vars = FALSE AND variable_code IS NULL)
                    OR (:has_vars = TRUE AND variable_code = :variable)
                  )
        )
        SELECT
            MIN(bucket_date)::date AS min_date,
            MAX(bucket_date)::date AS max_date,
            COUNT(*)::int AS n
        FROM series
        """
    )
    row = db.execute(
        q,
        {
            "scenario": scenario,
            "submenu": submenu,
            "variable": norm_variable,
            "has_vars": has_vars,
        },
    ).mappings().first()
    return {
        "minDate": str(row["min_date"]) if row and row["min_date"] else None,
        "maxDate": str(row["max_date"]) if row and row["max_date"] else None,
        "count": int(row["n"]) if row else 0,
    }


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
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    db: Session = Depends(get_climate_db),
):
    """
    Retourne uniquement les stations ayant réellement des valeurs
    pour la combinaison (scenario, submenu, variable éventuelle).
    """
    norm_variable = _normalize_variable(variable)
    if not _climate_analytics_has_data(db):
        item = _climate_fallback_item(db, submenu, norm_variable)
        if item is None or scenario != "actuel":
            log.info(
                "GET /analytics/climat-meteo/sites | fallback=staging/api | submenu=%s | variable=%s | scenario=%s | sites=0",
                submenu,
                norm_variable,
                scenario,
            )
            return []

        if item["code"] == "precipitation":
            query = text(
                """
                WITH station_codes AS (
                    SELECT DISTINCT ire_station
                    FROM staging.raw_mesures_precipitations_jr_traitees
                    WHERE val_remplies IS NOT NULL
                      AND (:date_start IS NULL OR date_jr >= CAST(:date_start AS date))
                      AND (:date_end IS NULL OR date_jr <= CAST(:date_end AS date))
                )
                SELECT DISTINCT
                    d.station_id::text AS site_id,
                    d.code_station AS site_code,
                    COALESCE(NULLIF(d.station_nom, ''), NULLIF(d.code_station, ''), sc.ire_station) AS site_name,
                    COALESCE(d.type_station, 'meteo') AS station_type
                FROM station_codes sc
                JOIN api.v_station_dimension d
                  ON d.legacy_code_station = sc.ire_station
                  OR d.code_station = sc.ire_station
                ORDER BY site_name
                """
            )
        elif item["code"] == "evaporation":
            query = text(
                """
                WITH station_codes AS (
                    SELECT DISTINCT ire_station
                    FROM staging.raw_mesures_evaporation_jr
                    WHERE val_evaporation IS NOT NULL
                      AND (:date_start IS NULL OR date_mesure >= CAST(:date_start AS date))
                      AND (:date_end IS NULL OR date_mesure <= CAST(:date_end AS date))
                )
                SELECT DISTINCT
                    d.station_id::text AS site_id,
                    d.code_station AS site_code,
                    COALESCE(NULLIF(d.station_nom, ''), NULLIF(d.code_station, ''), sc.ire_station) AS site_name,
                    COALESCE(d.type_station, 'meteo') AS station_type
                FROM station_codes sc
                JOIN api.v_station_dimension d
                  ON d.legacy_code_station = sc.ire_station
                  OR d.code_station = sc.ire_station
                ORDER BY site_name
                """
            )
        else:
            query = text(
                """
                SELECT DISTINCT
                    station_id::text AS site_id,
                    station_code AS site_code,
                    station_name AS site_name,
                    COALESCE(station_type, 'meteo') AS station_type
                FROM api.v_meteo_temperature_journalier
                WHERE val_moy IS NOT NULL
                  AND (:date_start IS NULL OR bucket_day >= CAST(:date_start AS date))
                  AND (:date_end IS NULL OR bucket_day <= CAST(:date_end AS date))
                ORDER BY site_name
                """
            )

        rows = db.execute(
            query,
            {"date_start": date_start, "date_end": date_end},
        ).mappings().all()
        log.info(
            "GET /analytics/climat-meteo/sites | fallback=staging/api | submenu=%s | variable=%s | scenario=%s | sites=%s",
            submenu,
            norm_variable,
            scenario,
            len(rows),
        )
        return [dict(r) for r in rows]

    has_vars = _submenu_has_variables(db, scenario=scenario, submenu=submenu)

    query = text(
        """
        SELECT site_id::text AS site_id, site_code, site_name, station_type
        FROM analytics.mv_dashboard_climat_meteo_menu
        WHERE scenario_code = :scenario
          AND submenu_code = :submenu
          AND value_num IS NOT NULL
          AND (:date_start IS NULL OR date_obs >= CAST(:date_start AS date))
          AND (:date_end IS NULL OR date_obs <= CAST(:date_end AS date))
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
            "date_start": date_start,
            "date_end": date_end,
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
    if not _climate_analytics_has_data(db):
        item = _climate_fallback_item(db, submenu, norm_variable)
        if item is None or scenario != "actuel":
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

        if item["code"] == "precipitation":
            sql = text(
                """
                WITH station_ref AS (
                    SELECT legacy_code_station, code_station
                    FROM api.v_station_dimension
                    WHERE station_id::text = :site
                    LIMIT 1
                )
                SELECT
                    s.date_jr AS date_obs,
                    s.val_remplies::double precision AS value_num,
                    'mm'::text AS unit,
                    'precipitation'::text AS variable_code,
                    'Precipitation'::text AS variable_label,
                    'staging.raw_mesures_precipitations_jr_traitees'::text AS source_table,
                    NULL::text AS data_quality_flag
                FROM staging.raw_mesures_precipitations_jr_traitees s
                CROSS JOIN station_ref ref
                WHERE (s.ire_station = ref.legacy_code_station OR s.ire_station = ref.code_station)
                  AND s.val_remplies IS NOT NULL
                  AND (:date_start IS NULL OR s.date_jr >= CAST(:date_start AS date))
                  AND (:date_end IS NULL OR s.date_jr <= CAST(:date_end AS date))
                ORDER BY s.date_jr ASC
                """
            )
        elif item["code"] == "evaporation":
            sql = text(
                """
                WITH station_ref AS (
                    SELECT legacy_code_station, code_station
                    FROM api.v_station_dimension
                    WHERE station_id::text = :site
                    LIMIT 1
                )
                SELECT
                    s.date_mesure AS date_obs,
                    s.val_evaporation::double precision AS value_num,
                    'mm'::text AS unit,
                    'evaporation'::text AS variable_code,
                    'Evaporation'::text AS variable_label,
                    'staging.raw_mesures_evaporation_jr'::text AS source_table,
                    NULL::text AS data_quality_flag
                FROM staging.raw_mesures_evaporation_jr s
                CROSS JOIN station_ref ref
                WHERE (s.ire_station = ref.legacy_code_station OR s.ire_station = ref.code_station)
                  AND s.val_evaporation IS NOT NULL
                  AND (:date_start IS NULL OR s.date_mesure >= CAST(:date_start AS date))
                  AND (:date_end IS NULL OR s.date_mesure <= CAST(:date_end AS date))
                ORDER BY s.date_mesure ASC
                """
            )
        else:
            sql = text(
                """
                SELECT
                    bucket_day AS date_obs,
                    val_moy::double precision AS value_num,
                    'C'::text AS unit,
                    'temperature'::text AS variable_code,
                    'Temperature'::text AS variable_label,
                    'api.v_meteo_temperature_journalier'::text AS source_table,
                    NULL::text AS data_quality_flag
                FROM api.v_meteo_temperature_journalier
                WHERE station_id::text = :site
                  AND val_moy IS NOT NULL
                  AND (:date_start IS NULL OR bucket_day >= CAST(:date_start AS date))
                  AND (:date_end IS NULL OR bucket_day <= CAST(:date_end AS date))
                ORDER BY bucket_day ASC
                """
            )

        rows = db.execute(
            sql,
            {
                "site": site,
                "date_start": date_start,
                "date_end": date_end,
            },
        ).mappings().all()
        log.info(
            "GET /analytics/climat-meteo/series | fallback=staging/api | submenu=%s | variable=%s | scenario=%s | site=%s | rows=%s",
            submenu,
            norm_variable,
            scenario,
            site,
            len(rows),
        )
        if not rows:
            return {
                "metadata": {
                    "scenario": scenario,
                    "submenu": submenu,
                    "variable": norm_variable,
                    "site": site,
                    "unit": item["unit"],
                },
                "kpis": {
                    "min": None,
                    "max": None,
                    "mean": None,
                    "count": 0,
                    "status": "no_data",
                    "unit": item["unit"],
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
