from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import date
from io import StringIO
from typing import Any

import csv
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.qa_threshold_service import ensure_thresholds_table


StatusType = str  # "CRITIQUE" | "AVERTISSEMENT" | "INFO"


@dataclass(frozen=True)
class Threshold:
    min_value: float | None = None
    max_value: float | None = None
    warn_z_info: float = 2.0
    warn_z_avertissement: float = 3.0


@dataclass(frozen=True)
class QaFilters:
    variable: str | None = None
    entity_id: int | None = None
    date_from: str | None = None
    date_to: str | None = None
    statut: str | None = None


SWAT_THRESHOLDS: dict[str, Threshold] = {
    "precip": Threshold(min_value=0.0, max_value=500.0),
    "surq": Threshold(min_value=0.0, max_value=300.0),
    "gw_q": Threshold(min_value=0.0, max_value=300.0),
    "wyld": Threshold(min_value=0.0, max_value=400.0),
    "sedp": Threshold(min_value=0.0, max_value=50.0),
    "orgn": Threshold(min_value=0.0, max_value=10.0),
    "solp": Threshold(min_value=0.0, max_value=0.5),
}


WASP_DEFAULT_THRESHOLD = Threshold(min_value=0.0, max_value=20.0)


def _is_critical(value: float, threshold: Threshold) -> bool:
    if threshold.min_value is not None and value < threshold.min_value:
        return True
    if threshold.max_value is not None and value > threshold.max_value:
        return True
    return False


def _build_stat_window(values: list[float]) -> tuple[float, float]:
    if not values:
        return 0.0, 0.0
    n = len(values)
    mean = sum(values) / n
    variance = sum((v - mean) ** 2 for v in values) / n if n > 1 else 0.0
    std = variance ** 0.5
    return mean, std


def _atypical_status(value: float, mean: float, std: float, threshold: Threshold) -> StatusType | None:
    if std <= 0:
        return None
    z = abs((value - mean) / std)
    if z >= threshold.warn_z_avertissement:
        return "AVERTISSEMENT"
    if z >= threshold.warn_z_info:
        return "INFO"
    return None


def _build_global_status(total_errors: int) -> tuple[str, str]:
    if total_errors == 0:
        return "VALIDE", "Donnees conformes"
    return "ERREURS DETECTEES", f"{total_errors} anomalies detectees"


def _date_to_str(value: date | None) -> str | None:
    if value is None:
        return None
    return value.isoformat()


def _load_threshold_overrides(db: Session, model: str, scenario_id: int) -> dict[str, Threshold]:
    ensure_thresholds_table(db)
    rows = db.execute(
        text(
            """
            SELECT variable_name, scenario_id, min_value, max_value, warn_z_info, warn_z_avertissement
            FROM qa.variable_thresholds
            WHERE model = :model
              AND is_active IS TRUE
              AND (scenario_id IS NULL OR scenario_id = :sid)
            ORDER BY CASE WHEN scenario_id = :sid THEN 0 ELSE 1 END, variable_name
            """
        ),
        {"model": model, "sid": scenario_id},
    ).mappings().all()
    out: dict[str, Threshold] = {}
    for row in rows:
        key = str(row["variable_name"]).strip().lower()
        out[key] = Threshold(
            min_value=float(row["min_value"]) if row["min_value"] is not None else None,
            max_value=float(row["max_value"]) if row["max_value"] is not None else None,
            warn_z_info=float(row["warn_z_info"]) if row["warn_z_info"] is not None else 2.0,
            warn_z_avertissement=float(row["warn_z_avertissement"]) if row["warn_z_avertissement"] is not None else 3.0,
        )
    return out


def _resolve_wasp_threshold(variable_name: str, overrides: dict[str, Threshold]) -> Threshold:
    name = (variable_name or "").strip().lower()
    if name in overrides:
        return overrides[name]
    if "dissolved oxygen" in name:
        return Threshold(min_value=4.0, max_value=14.0)
    if "ph" in name:
        return Threshold(min_value=6.0, max_value=9.0)
    if "temperature" in name:
        return Threshold(min_value=0.0, max_value=35.0)
    return WASP_DEFAULT_THRESHOLD


def _build_swat_dataset(db: Session, scenario_id: int, filters: QaFilters) -> tuple[list[dict[str, Any]], int]:
    sql = """
        SELECT subbasin, date, precip, surq, gw_q, wyld, sedp, orgn, solp
        FROM swat_sebou.swat_subbasin_results
        WHERE scenario_id = :sid
    """
    params: dict[str, Any] = {"sid": scenario_id}
    if filters.entity_id is not None:
        sql += " AND subbasin = :entity_id"
        params["entity_id"] = filters.entity_id
    if filters.date_from:
        sql += " AND date >= :date_from"
        params["date_from"] = filters.date_from
    if filters.date_to:
        sql += " AND date <= :date_to"
        params["date_to"] = filters.date_to
    sql += " ORDER BY date, subbasin"
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows], len(rows)


def _build_wasp_dataset(db: Session, scenario_id: int, filters: QaFilters) -> tuple[list[dict[str, Any]], int]:
    sql = """
        SELECT r.segment_id, r.date, r.value, v.name AS variable
        FROM wasp_sebou.wasp_results r
        JOIN wasp_sebou.wasp_variables v ON v.id = r.variable_id
        WHERE r.scenario_id = :sid
    """
    params: dict[str, Any] = {"sid": scenario_id}
    if filters.entity_id is not None:
        sql += " AND r.segment_id = :entity_id"
        params["entity_id"] = filters.entity_id
    if filters.date_from:
        sql += " AND r.date >= :date_from"
        params["date_from"] = filters.date_from
    if filters.date_to:
        sql += " AND r.date <= :date_to"
        params["date_to"] = filters.date_to
    if filters.variable:
        sql += " AND LOWER(v.name) LIKE :variable"
        params["variable"] = f"%{filters.variable.lower().strip()}%"
    sql += " ORDER BY r.date, r.segment_id"
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows], len(rows)


def _qa_swat(rows: list[dict[str, Any]], threshold_overrides: dict[str, Threshold], filters: QaFilters) -> list[dict[str, Any]]:
    values_by_variable: dict[str, list[float]] = defaultdict(list)
    variables = list(SWAT_THRESHOLDS.keys())
    if filters.variable:
        requested = filters.variable.lower().strip()
        variables = [v for v in variables if requested in v]

    for row in rows:
        for var in variables:
            value = row.get(var)
            if isinstance(value, (int, float)):
                values_by_variable[var].append(float(value))

    stats = {v: _build_stat_window(vals) for v, vals in values_by_variable.items()}
    anomalies: list[dict[str, Any]] = []

    for row in rows:
        for variable in variables:
            raw_value = row.get(variable)
            if not isinstance(raw_value, (int, float)):
                continue
            value = float(raw_value)
            threshold = threshold_overrides.get(variable, SWAT_THRESHOLDS[variable])
            status: StatusType | None = None
            if _is_critical(value, threshold):
                status = "CRITIQUE"
            else:
                mean, std = stats.get(variable, (0.0, 0.0))
                status = _atypical_status(value, mean, std, threshold)

            if status is None:
                continue
            if filters.statut and status != filters.statut:
                continue

            anomalies.append(
                {
                    "entite": row.get("subbasin"),
                    "bassin": f"Subbasin {row.get('subbasin')}" if row.get("subbasin") is not None else None,
                    "date": _date_to_str(row.get("date")),
                    "variable": variable,
                    "valeur": value,
                    "seuil_min": threshold.min_value,
                    "seuil_max": threshold.max_value,
                    "statut": status,
                }
            )
    return anomalies


def _qa_wasp(rows: list[dict[str, Any]], threshold_overrides: dict[str, Threshold], filters: QaFilters) -> list[dict[str, Any]]:
    values_by_variable: dict[str, list[float]] = defaultdict(list)
    for row in rows:
        value = row.get("value")
        variable = row.get("variable")
        if isinstance(value, (int, float)) and isinstance(variable, str):
            values_by_variable[variable].append(float(value))

    stats = {v: _build_stat_window(vals) for v, vals in values_by_variable.items()}
    anomalies: list[dict[str, Any]] = []

    for row in rows:
        raw_value = row.get("value")
        variable = row.get("variable")
        if not isinstance(raw_value, (int, float)) or not isinstance(variable, str):
            continue

        value = float(raw_value)
        threshold = _resolve_wasp_threshold(variable, threshold_overrides)
        status: StatusType | None = None
        if _is_critical(value, threshold):
            status = "CRITIQUE"
        else:
            mean, std = stats.get(variable, (0.0, 0.0))
            status = _atypical_status(value, mean, std, threshold)

        if status is None:
            continue
        if filters.statut and status != filters.statut:
            continue

        anomalies.append(
            {
                "entite": row.get("segment_id"),
                "bassin": f"Segment {row.get('segment_id')}" if row.get("segment_id") is not None else None,
                "date": _date_to_str(row.get("date")),
                "variable": variable,
                "valeur": value,
                "seuil_min": threshold.min_value,
                "seuil_max": threshold.max_value,
                "statut": status,
            }
        )
    return anomalies


def validate_scenario_qa(
    db: Session,
    scenario_id: int,
    model: str,
    *,
    filters: QaFilters | None = None,
    limit: int = 5000,
) -> dict[str, Any]:
    model_key = model.lower().strip()
    if model_key not in {"swat", "wasp"}:
        raise ValueError("model must be one of: swat, wasp")

    filters = filters or QaFilters()
    threshold_overrides = _load_threshold_overrides(db, model_key, scenario_id)

    if model_key == "swat":
        rows, total_rows = _build_swat_dataset(db, scenario_id, filters)
        anomalies_all = _qa_swat(rows, threshold_overrides, filters)
    else:
        rows, total_rows = _build_wasp_dataset(db, scenario_id, filters)
        anomalies_all = _qa_wasp(rows, threshold_overrides, filters)

    total_critiques = sum(1 for a in anomalies_all if a["statut"] == "CRITIQUE")
    total_avertissements = sum(1 for a in anomalies_all if a["statut"] == "AVERTISSEMENT")
    total_infos = sum(1 for a in anomalies_all if a["statut"] == "INFO")
    total_errors = len(anomalies_all)
    statut_global, message = _build_global_status(total_errors)

    return {
        "scenario_id": scenario_id,
        "model": model_key,
        "total_lignes": total_rows,
        "total_erreurs": total_errors,
        "total_critiques": total_critiques,
        "total_avertissements": total_avertissements,
        "total_infos": total_infos,
        "statut_global": statut_global,
        "message": message if total_errors == 0 else None,
        "anomalies": anomalies_all[: max(1, min(limit, 20000))],
    }


def _scenario_name(db: Session, model_key: str, scenario_id: int) -> str:
    if model_key == "swat":
        row = db.execute(
            text("SELECT name FROM swat_sebou.swat_scenarios WHERE id = :sid"),
            {"sid": scenario_id},
        ).mappings().first()
    else:
        row = db.execute(
            text("SELECT name FROM wasp_sebou.wasp_scenarios WHERE id = :sid"),
            {"sid": scenario_id},
        ).mappings().first()
    return str(row["name"]) if row and row.get("name") else f"Scenario_{scenario_id}"


def _closest_threshold_and_ecart_pct(value: float, min_v: float | None, max_v: float | None) -> tuple[float | None, float]:
    closest: float | None = None
    if min_v is not None and value < min_v:
        closest = min_v
    if max_v is not None and value > max_v:
        if closest is None:
            closest = max_v
        else:
            dist_min = abs(value - min_v) if min_v is not None else float("inf")
            dist_max = abs(value - max_v)
            closest = min_v if dist_min <= dist_max else max_v

    if closest is None:
        return None, 0.0

    denom = abs(closest) if abs(closest) > 1e-12 else 1.0
    ecart_pct = ((value - closest) / denom) * 100.0
    return closest, round(ecart_pct, 2)


def _raison_depassement(value: float, min_v: float | None, max_v: float | None, ecart_pct: float) -> str:
    if max_v is not None and value > max_v:
        return f"Valeur {value:.4f} depasse le seuil maximum de {max_v:.4f} de +{abs(ecart_pct):.2f}%"
    if min_v is not None and value < min_v:
        return f"Valeur {value:.4f} est inferieure au seuil minimum de {min_v:.4f} de -{abs(ecart_pct):.2f}%"
    return "Valeur critique selon regles QA"


def build_qa_critical_csv_export(
    db: Session,
    *,
    scenario_id: int,
    model: str,
) -> tuple[str, str]:
    model_key = model.lower().strip()
    if model_key not in {"swat", "wasp"}:
        raise ValueError("model must be one of: swat, wasp")

    qa = validate_scenario_qa(
        db=db,
        scenario_id=scenario_id,
        model=model_key,
        filters=QaFilters(statut="CRITIQUE"),
        limit=20000,
    )
    critical_rows = [a for a in qa.get("anomalies", []) if a.get("statut") == "CRITIQUE"]

    def _sort_key(item: dict[str, Any]) -> tuple[str, str]:
        d = str(item.get("date") or "")
        e = str(item.get("entite") if item.get("entite") is not None else "")
        return (d, e)

    critical_rows_sorted = sorted(critical_rows, key=_sort_key)
    scenario_name = _scenario_name(db, model_key, scenario_id)
    export_date = date.today().isoformat()
    date_tag = export_date.replace("-", "")
    file_name = f"QA_erreurs_{model_key}_{scenario_id}_{date_tag}.csv"

    buf = StringIO()
    writer = csv.writer(buf, delimiter="|")
    writer.writerow(["nom_scenario", "date_export", "nb_total_erreurs", "modele"])
    writer.writerow([scenario_name, export_date, len(critical_rows_sorted), model_key.upper()])
    writer.writerow([])
    writer.writerow([
        "scenario_id",
        "type_modele",
        "entite",
        "bassin",
        "date",
        "variable",
        "valeur_observee",
        "seuil_min",
        "seuil_max",
        "ecart_pct",
        "statut",
        "raison_depassement",
    ])

    for row in critical_rows_sorted:
        value = float(row.get("valeur"))
        seuil_min = row.get("seuil_min")
        seuil_max = row.get("seuil_max")
        _, ecart_pct = _closest_threshold_and_ecart_pct(
            value=value,
            min_v=float(seuil_min) if seuil_min is not None else None,
            max_v=float(seuil_max) if seuil_max is not None else None,
        )
        raison = _raison_depassement(
            value=value,
            min_v=float(seuil_min) if seuil_min is not None else None,
            max_v=float(seuil_max) if seuil_max is not None else None,
            ecart_pct=ecart_pct,
        )
        writer.writerow([
            scenario_id,
            model_key.upper(),
            row.get("entite"),
            row.get("bassin"),
            row.get("date"),
            row.get("variable"),
            value,
            seuil_min,
            seuil_max,
            ecart_pct,
            row.get("statut"),
            raison,
        ])

    return buf.getvalue(), file_name
