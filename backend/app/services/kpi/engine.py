from __future__ import annotations

from collections import defaultdict
from statistics import mean
import threading
import time
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.propagation import propagation_pollution_service
from app.services.regulatory_quality import classify_measurement, load_regulatory_context


NETWORK_TABLE = "geo_work.reseau_hydro_edges_final_candidate_20260602"
NODE_TABLE = "geo_work.reseau_hydro_nodes_final_candidate_20260602"
QUALITY_TYPE_EAU = "surface_generale"
STATION_PARAMETER_UNITS = {
    "DBO5": "mg/L",
    "DCO": "mg/L",
    "NO3": "mg/L",
    "MES": "mg/L",
    "O2_DISSOUS": "mg/L",
    "pH": "",
}
_CACHE_TTL_SECONDS = 60
_CACHE_LOCK = threading.Lock()
_CACHE: dict[str, tuple[float, dict[str, Any]]] = {}


def _cache_get(key: str) -> dict[str, Any] | None:
    now = time.time()
    with _CACHE_LOCK:
        cached = _CACHE.get(key)
        if not cached:
            return None
        expires_at, payload = cached
        if expires_at < now:
            _CACHE.pop(key, None)
            return None
        return payload


def _cache_set(key: str, payload: dict[str, Any]) -> dict[str, Any]:
    with _CACHE_LOCK:
        _CACHE[key] = (time.time() + _CACHE_TTL_SECONDS, payload)
    return payload


def _freshness_score(days: int | None) -> int | None:
    if days is None:
        return None
    if days <= 7:
        return 95
    if days <= 30:
        return 75
    if days <= 90:
        return 55
    if days <= 180:
        return 35
    return 15


def _days_since(date_value) -> int | None:
    if date_value is None:
        return None
    delta = (date.today() - date_value).days
    return max(0, int(delta))


from datetime import date


def _quality_stations_latest(db: Session) -> list[dict[str, Any]]:
    query = text(
        """
        WITH normalized AS (
            SELECT
                COALESCE(mqr.station_id::text, mqr.ire_station) AS station_key,
                COALESCE(
                    NULLIF(TRIM(sd.station_nom), ''),
                    NULLIF(TRIM(sd.code_station), ''),
                    COALESCE(mqr.station_id::text, mqr.ire_station)
                ) AS station_name,
                COALESCE(sd.sous_bassin_nom, 'Sous-bassin non renseigne') AS sous_bassin_nom,
                mqr.temps::date AS sample_date,
                mqr.valeur::float8 AS value_numeric,
                CASE
                    WHEN mqr.parametre_qualite ILIKE 'DBO%' THEN 'DBO5'
                    WHEN mqr.parametre_qualite ILIKE 'DCO%' THEN 'DCO'
                    WHEN mqr.parametre_qualite ILIKE 'NO3%' THEN 'NO3'
                    WHEN mqr.parametre_qualite ILIKE 'MES%' THEN 'MES'
                    WHEN mqr.parametre_qualite ILIKE 'O2%' THEN 'O2_DISSOUS'
                    WHEN mqr.parametre_qualite ILIKE 'ph%' THEN 'pH'
                    ELSE NULL
                END AS parameter_code
            FROM qualite.mesure_qualite_riviere mqr
            LEFT JOIN api.v_station_dimension sd
                ON sd.station_id::text = mqr.station_id::text
                OR sd.legacy_code_station = mqr.ire_station
                OR sd.code_station = mqr.ire_station
            WHERE COALESCE(mqr.ire_station, mqr.station_id::text) IS NOT NULL
              AND TRIM(COALESCE(mqr.ire_station, mqr.station_id::text)) <> ''
              AND mqr.valeur IS NOT NULL
              AND COALESCE(mqr.est_valide, true) = true
              AND COALESCE(mqr.qa_flag_null_value, false) = false
              AND COALESCE(mqr.qa_flag_negative, false) = false
              AND COALESCE(mqr.qa_flag_param_missing, false) = false
              AND COALESCE(mqr.qa_flag_station_unmapped, false) = false
        ),
        latest AS (
            SELECT DISTINCT ON (station_key, parameter_code)
                station_key,
                station_name,
                sous_bassin_nom,
                parameter_code,
                sample_date,
                value_numeric
            FROM normalized
            WHERE parameter_code IS NOT NULL
            ORDER BY station_key, parameter_code, sample_date DESC
        )
        SELECT *
        FROM latest
        ORDER BY station_name, parameter_code
        """
    )
    return [dict(row) for row in db.execute(query).mappings().all()]


def _station_status_payload(db: Session) -> dict[str, Any]:
    rows = _quality_stations_latest(db)
    regulatory_context = load_regulatory_context(db, type_eau_code=QUALITY_TYPE_EAU)
    station_map: dict[str, dict[str, Any]] = {}

    for row in rows:
        station = station_map.setdefault(
            row["station_key"],
            {
                "station_id": row["station_key"],
                "station_name": row["station_name"],
                "sous_bassin_nom": row["sous_bassin_nom"],
                "parameters": [],
                "latest_date": row["sample_date"],
            },
        )
        if row["sample_date"] and (station["latest_date"] is None or row["sample_date"] > station["latest_date"]):
            station["latest_date"] = row["sample_date"]

        classification = classify_measurement(
            regulatory_context,
            parameter_code=row["parameter_code"],
            value_numeric=row["value_numeric"],
            unit=STATION_PARAMETER_UNITS.get(row["parameter_code"], "mg/L"),
        )
        station["parameters"].append(
            {
                "parameter_code": row["parameter_code"],
                "value_numeric": row["value_numeric"],
                "sample_date": row["sample_date"],
                "classification": classification,
            }
        )

    counts = {"conforme": 0, "surveillance": 0, "critique": 0, "inconnu": 0}
    stations_out: list[dict[str, Any]] = []

    for station in station_map.values():
        classified = [
            item["classification"]
            for item in station["parameters"]
            if item["classification"].get("status") == "CLASSIFIED"
        ]
        severity = max((int(item.get("severity_order") or 0) for item in classified), default=0)
        freshness_days = _days_since(station["latest_date"])
        freshness_score = _freshness_score(freshness_days)

        if severity == 0:
            status = "inconnu"
        elif severity <= 2:
            status = "conforme"
        elif severity == 3:
            status = "surveillance"
        else:
            status = "critique"

        counts[status] += 1
        stations_out.append(
            {
                "station_id": station["station_id"],
                "station_name": station["station_name"],
                "sous_bassin_nom": station["sous_bassin_nom"],
                "status": status,
                "severity_order": severity if severity > 0 else None,
                "latest_date": station["latest_date"].isoformat() if station["latest_date"] else None,
                "freshness_days": freshness_days,
                "freshness_score": freshness_score,
            }
        )

    stations_out.sort(
        key=lambda item: (
            {"critique": 0, "surveillance": 1, "conforme": 2, "inconnu": 3}[item["status"]],
            -(item["freshness_days"] or 0),
            item["station_name"] or "",
        )
    )
    return {"counts": counts, "stations": stations_out}


def _quality_data_confidence(db: Session) -> int | None:
    totals = db.execute(
        text(
            """
            SELECT
                count(*)::int AS total_rows,
                count(*) FILTER (WHERE COALESCE(est_valide, true) = true)::int AS valid_rows,
                count(*) FILTER (
                    WHERE COALESCE(qa_flag_null_value, false) = false
                      AND COALESCE(qa_flag_negative, false) = false
                      AND COALESCE(qa_flag_param_missing, false) = false
                      AND COALESCE(qa_flag_station_unmapped, false) = false
                )::int AS clean_rows
            FROM qualite.mesure_qualite_riviere
            """
        )
    ).mappings().first()
    if not totals or not totals["total_rows"]:
        return None

    regulatory_context = load_regulatory_context(db, type_eau_code=QUALITY_TYPE_EAU)
    parameter_total = len({key for key in regulatory_context.parameters_by_alias.keys()})
    classifiable = len(
        {
            value["code_reglementaire"]
            for value in regulatory_context.parameters_by_alias.values()
            if value.get("classifiable") is True
        }
    )
    classifiable_ratio = classifiable / parameter_total if parameter_total else 0
    valid_ratio = totals["valid_rows"] / totals["total_rows"]
    clean_ratio = totals["clean_rows"] / totals["total_rows"]
    score = round((classifiable_ratio * 0.45 + valid_ratio * 0.25 + clean_ratio * 0.30) * 100)
    return max(0, min(100, score))


def _hydraulic_confidence(db: Session) -> int:
    stats = db.execute(
        text(
            f"""
            SELECT
                count(*)::int AS edges,
                count(*) FILTER (WHERE COALESCE(flow_status, '') = 'VALIDATED_METIER')::int AS validated_edges,
                count(distinct component_id)::int AS components
            FROM {NETWORK_TABLE}
            """
        )
    ).mappings().first()
    nodes = db.execute(
        text(
            f"""
            SELECT
                count(*) FILTER (WHERE eout = 0 AND ein >= 1)::int AS exutoires,
                count(*) FILTER (WHERE ein = 0 AND eout >= 1)::int AS sources
            FROM {NODE_TABLE}
            """
        )
    ).mappings().first()
    if not stats:
        return 0

    edges = int(stats["edges"] or 0)
    validated = int(stats["validated_edges"] or 0)
    components = int(stats["components"] or 0)
    exutoires = int((nodes or {}).get("exutoires") or 0)
    sources = int((nodes or {}).get("sources") or 0)

    score = 55
    if edges >= 700:
        score += 15
    if validated >= 100:
        score += 10
    if exutoires > 0:
        score += 8
    if sources > 0:
        score += 7
    if components <= 10:
        score += 5
    return min(95, score)


def _load_pollution_site_rows(db: Session, limit: int = 50) -> list[dict[str, Any]]:
    query = text(
        """
        SELECT
            s.site_id::text AS site_id,
            s.site_code,
            s.site_name,
            s.commune,
            s.bassin,
            s.validation_status,
            s.source_type_label,
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'parameter_code', r.parameter_code,
                        'parameter_label', r.parameter_label,
                        'value_numeric', r.value_numeric,
                        'value_text', r.value_text,
                        'unit', r.unit,
                        'sample_date', r.sample_date,
                        'quality_flag', r.quality_flag
                    )
                    ORDER BY r.parameter_code
                )
                FROM api.v_pollution_latest_results r
                WHERE r.site_id = s.site_id
            ) AS latest_results
        FROM api.v_pollution_sites s
        WHERE s.longitude IS NOT NULL
          AND s.latitude IS NOT NULL
        ORDER BY s.validation_status, s.site_name NULLS LAST
        LIMIT :limit
        """
    )
    return [dict(row) for row in db.execute(query, {"limit": limit}).mappings().all()]


def _enrich_pollution_rows(db: Session, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    regulatory_context = load_regulatory_context(db, type_eau_code=QUALITY_TYPE_EAU)
    enriched = []
    for row in rows:
        latest_results = row.get("latest_results") or []
        enriched_results = []
        highest_severity = 0
        for result in latest_results:
            result_dict = dict(result)
            classification = classify_measurement(
                regulatory_context,
                parameter_code=result_dict.get("parameter_code"),
                value_numeric=result_dict.get("value_numeric"),
                unit=result_dict.get("unit"),
            )
            severity_order = int(classification.get("severity_order") or 0)
            highest_severity = max(highest_severity, severity_order)
            result_dict.update(
                {
                    "regulatory_status": classification.get("status"),
                    "class_code": classification.get("class_code"),
                    "class_label": classification.get("class_label"),
                    "color": classification.get("color"),
                    "severity_order": severity_order or None,
                }
            )
            enriched_results.append(result_dict)
        row["latest_results"] = enriched_results
        row["pollution_severity"] = highest_severity or (2 if row.get("validation_status") == "TO_VALIDATE" else 1)
        enriched.append(row)
    return enriched


def _pollution_risk_index(site: dict[str, Any], propagation_summary: dict[str, Any] | None) -> int:
    severity_score = min(40, int(site.get("pollution_severity", 0)) * 10)
    snap_confidence = propagation_summary.get("snap_confidence") if propagation_summary else None
    snap_score = 25 if snap_confidence == "HIGH" else 16 if snap_confidence == "MEDIUM" else 8 if snap_confidence == "LOW" else 10
    distance_to_garde = propagation_summary.get("distance_to_garde_km") if propagation_summary else None
    if distance_to_garde is None:
        distance_score = 10
    elif distance_to_garde <= 25:
        distance_score = 20
    elif distance_to_garde <= 100:
        distance_score = 14
    else:
        distance_score = 8
    asset_score = min(
        15,
        int(propagation_summary.get("reachable_stations", 0)) + int(propagation_summary.get("reachable_barrages", 0)) * 2
        if propagation_summary
        else 0,
    )
    return max(0, min(100, severity_score + snap_score + distance_score + asset_score))


def get_station_kpis(db: Session) -> dict[str, Any]:
    cached = _cache_get("station_kpis")
    if cached is not None:
        return cached
    station_payload = _station_status_payload(db)
    top_stations = station_payload["stations"][:10]
    return _cache_set("station_kpis", {
        **station_payload["counts"],
        "total": sum(station_payload["counts"].values()),
        "top_stations": top_stations,
    })


def get_subbasin_kpis(db: Session) -> dict[str, Any]:
    cached = _cache_get("subbasin_kpis")
    if cached is not None:
        return cached
    station_payload = _station_status_payload(db)
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for station in station_payload["stations"]:
        grouped[station["sous_bassin_nom"]].append(station)

    subbasins = []
    for subbasin_name, items in grouped.items():
        total = len(items)
        critical = sum(1 for item in items if item["status"] == "critique")
        surveillance = sum(1 for item in items if item["status"] == "surveillance")
        freshness_scores = [item["freshness_score"] for item in items if item["freshness_score"] is not None]
        avg_freshness = round(mean(freshness_scores), 1) if freshness_scores else None
        risk_score = round(
            min(
                100,
                critical * 25 + surveillance * 12 + max(0, 60 - int(avg_freshness or 0)),
            )
        )
        subbasins.append(
            {
                "subbasin_name": subbasin_name,
                "stations_total": total,
                "critical": critical,
                "surveillance": surveillance,
                "freshness_score": avg_freshness,
                "risk_score": risk_score,
            }
        )
    subbasins.sort(key=lambda item: (-item["risk_score"], item["subbasin_name"]))
    return _cache_set("subbasin_kpis", {
        "subbasins_total": len(subbasins),
        "top_subbasins": subbasins[:10],
    })


def get_pollution_kpis(db: Session) -> dict[str, Any]:
    cached = _cache_get("pollution_kpis")
    if cached is not None:
        return cached
    rows = _enrich_pollution_rows(db, _load_pollution_site_rows(db, limit=20))
    rows.sort(key=lambda item: (-int(item.get("pollution_severity") or 0), item.get("site_name") or ""))

    top_sites = []
    ipps = []
    for row in rows[:6]:
        garde = propagation_pollution_service.propagate_source_to_garde(site_id=row["site_id"])
        stations = propagation_pollution_service.propagate_to_stations(site_id=row["site_id"], only_reachable=True, limit=5)
        barrages = propagation_pollution_service.propagate_to_barrages(site_id=row["site_id"], only_reachable=True, limit=5)
        propagation_summary = {
            "snap_confidence": garde["snap"]["snap_confidence"],
            "distance_to_garde_km": garde["propagation"]["distance_to_garde_km"],
            "reachable_stations": len(stations["targets"]),
            "reachable_barrages": len(barrages["targets"]),
        }
        ipp = _pollution_risk_index(row, propagation_summary)
        ipps.append(ipp)
        top_sites.append(
            {
                "site_id": row["site_id"],
                "site_name": row.get("site_name"),
                "commune": row.get("commune"),
                "bassin": row.get("bassin"),
                "validation_status": row.get("validation_status"),
                "pollution_severity": row.get("pollution_severity"),
                "snap_confidence": garde["snap"]["snap_confidence"],
                "distance_to_garde_km": garde["propagation"]["distance_to_garde_km"],
                "reachable_stations": len(stations["targets"]),
                "reachable_barrages": len(barrages["targets"]),
                "ipp": ipp,
            }
        )

    active_sites = sum(1 for row in rows if row.get("validation_status") in {"VALIDATED", "TO_VALIDATE"})
    return _cache_set("pollution_kpis", {
        "active_sites": active_sites,
        "sites_considered": len(rows),
        "ipp": round(mean(ipps), 1) if ipps else None,
        "top_sites": top_sites,
    })


def get_overview_kpis(db: Session) -> dict[str, Any]:
    cached = _cache_get("overview_kpis")
    if cached is not None:
        return cached
    station_kpis = get_station_kpis(db)
    subbasin_kpis = get_subbasin_kpis(db)
    pollution_kpis = get_pollution_kpis(db)

    known_station_total = station_kpis["conforme"] + station_kpis["surveillance"] + station_kpis["critique"]
    if known_station_total:
        iqgb = round(
            (
                station_kpis["conforme"] * 1.0
                + station_kpis["surveillance"] * 0.6
                + station_kpis["critique"] * 0.2
            )
            / known_station_total
            * 100
        )
    else:
        iqgb = 0

    freshness_scores = [item["freshness_score"] for item in station_kpis["top_stations"] if item.get("freshness_score") is not None]
    ifd = round(mean(freshness_scores), 1) if freshness_scores else 0
    icd = _quality_data_confidence(db) or 0
    ich = _hydraulic_confidence(db)
    ipp = float(pollution_kpis["ipp"] or 0)
    top_subbasins = subbasin_kpis["top_subbasins"]
    isr = round(mean(item["risk_score"] for item in top_subbasins[:5]), 1) if top_subbasins else 0

    return _cache_set("overview_kpis", {
        "iqgb": iqgb,
        "ifd": ifd,
        "icd": icd,
        "ich": ich,
        "ipp": ipp,
        "isr": isr,
        "metadata": {
            "quality_type_eau": QUALITY_TYPE_EAU,
            "hydraulic_mode": "validated_network_read_only",
            "pollution_mode": "topological_mvp_non_scientific",
        },
    })
