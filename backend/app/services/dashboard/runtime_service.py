from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime
from statistics import mean
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.regulatory_quality import classify_measurement, load_regulatory_context


HOME_QUALITY_STATION_LIMIT = 6

QUALITY_PARAM_REGULATORY_MAP: dict[str, tuple[str, str, str | None]] = {
    "ammonium": ("NH4", "Ammonium", "mg/L"),
    "dbo5": ("DBO5", "DBO5", "mg/L"),
    "dco": ("DCO", "DCO", "mg/L"),
    "nitrates": ("NO3", "Nitrates", "mg/L"),
    "o2_dissous": ("O2_DISS", "O2 dissous", "mg/L"),
    "ph": ("pH", "pH", None),
    "conductivité": ("Cond", "Conductivité", "µS/cm"),
    "conductivite": ("Cond", "Conductivité", "µS/cm"),
    "t_eau": ("T_EAU", "Température eau", "°C"),
}


def _rows(db: Session, sql: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    return [dict(row) for row in db.execute(text(sql), params or {}).mappings().all()]


def _row(db: Session, sql: str, params: dict[str, Any] | None = None) -> dict[str, Any] | None:
    result = db.execute(text(sql), params or {}).mappings().first()
    return dict(result) if result else None


def _iso_date(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return str(value)


def _quality_status_from_values(latest_values: list[dict[str, Any]]) -> tuple[str, str]:
    classified = [
        value
        for value in latest_values
        if isinstance(value.get("classification"), dict) and value["classification"].get("status") == "CLASSIFIED"
    ]
    if not classified:
        return "INCONNU", "Aucune classification réglementaire exploitable sur les derniers paramètres."

    worst = max(classified, key=lambda item: int(item["classification"].get("severity_order") or 0))
    severity = int(worst["classification"].get("severity_order") or 0)
    class_label = worst["classification"].get("class_label") or worst["classification"].get("class_code") or "n/a"
    parameter = worst.get("parameter") or worst.get("parameter_label") or worst.get("parameter_code") or "paramètre"

    if severity >= 4:
        return "CRITIQUE", f"Classe la plus pénalisante : {class_label} sur {parameter}."
    if severity >= 3:
        return "SURVEILLANCE", f"Surveillance requise : {class_label} sur {parameter}."
    return "BON", f"Lecture dominante favorable : {class_label}."


def _quality_latest_values(db: Session, station_ids: list[str]) -> dict[str, list[dict[str, Any]]]:
    if not station_ids:
        return {}

    rows = _rows(
        db,
        """
        WITH ranked AS (
            SELECT
                m.station_id::text AS station_id,
                trim(m.parametre_qualite) AS raw_parameter,
                m.valeur,
                m.temps::date AS sample_date,
                row_number() OVER (
                    PARTITION BY m.station_id, trim(m.parametre_qualite)
                    ORDER BY m.temps DESC, m.created_at DESC NULLS LAST
                ) AS rn
            FROM qualite.mesure_qualite_sebou m
            WHERE m.station_id::text = ANY(:station_ids)
              AND m.valeur IS NOT NULL
              AND coalesce(m.est_valide, true) = true
        )
        SELECT station_id, raw_parameter, valeur, sample_date
        FROM ranked
        WHERE rn = 1
        ORDER BY station_id, raw_parameter
        """,
        {"station_ids": station_ids},
    )

    regulatory_context = load_regulatory_context(db)
    latest_by_station: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        raw_parameter = str(row["raw_parameter"] or "").strip()
        canonical = QUALITY_PARAM_REGULATORY_MAP.get(raw_parameter.lower())
        parameter_code = canonical[0] if canonical else raw_parameter
        parameter_label = canonical[1] if canonical else raw_parameter
        unit = canonical[2] if canonical else None
        value = {
            "parameter": parameter_label,
            "parameter_code": parameter_code,
            "parameter_label": parameter_label,
            "value": float(row["valeur"]) if row["valeur"] is not None else None,
            "value_numeric": float(row["valeur"]) if row["valeur"] is not None else None,
            "unit": unit,
            "date": _iso_date(row["sample_date"]),
            "sample_date": _iso_date(row["sample_date"]),
        }
        if canonical and canonical[0] in {"NH4", "DBO5", "DCO", "NO3", "O2_DISS", "pH", "Cond"}:
            classification = classify_measurement(
                regulatory_context,
                parameter_code=canonical[0],
                value_numeric=value["value_numeric"],
                unit=unit,
            )
            value["classification"] = classification
            value["class"] = classification.get("class_label")
        latest_by_station[str(row["station_id"])].append(value)

    return latest_by_station


def list_quality_stations_with_timeseries(db: Session, limit: int = HOME_QUALITY_STATION_LIMIT) -> list[dict[str, Any]]:
    safe_limit = max(1, min(limit, 50))
    stations = _rows(
        db,
        """
        WITH station_rollup AS (
            SELECT
                m.station_id::text AS station_id,
                coalesce(
                    nullif(trim(sd.station_nom), ''),
                    nullif(trim(sm.nom), ''),
                    nullif(trim(sd.code_station), ''),
                    nullif(trim(sm.code_station), ''),
                    m.station_id::text
                ) AS station_name,
                coalesce(
                    nullif(trim(sd.code_station), ''),
                    nullif(trim(sm.code_station), ''),
                    nullif(trim(sd.legacy_code_station), ''),
                    m.ire_station,
                    m.station_id::text
                ) AS station_code,
                coalesce(sd.type_station, sm.type_station) AS station_type,
                sd.bassin_nom AS bassin,
                sd.sous_bassin_nom AS sous_bassin,
                sd.longitude AS lon,
                sd.latitude AS lat,
                count(*)::int AS measure_count,
                count(distinct trim(m.parametre_qualite))::int AS parameter_count,
                min(m.temps)::date AS date_min,
                max(m.temps)::date AS date_max
            FROM qualite.mesure_qualite_sebou m
            LEFT JOIN api.v_station_dimension sd
              ON sd.station_id = m.station_id
            LEFT JOIN infra.stations_mesure sm
              ON sm.id = m.station_id
            WHERE m.station_id IS NOT NULL
              AND coalesce(m.est_valide, true) = true
            GROUP BY
                m.station_id,
                coalesce(
                    nullif(trim(sd.station_nom), ''),
                    nullif(trim(sm.nom), ''),
                    nullif(trim(sd.code_station), ''),
                    nullif(trim(sm.code_station), ''),
                    m.station_id::text
                ),
                coalesce(
                    nullif(trim(sd.code_station), ''),
                    nullif(trim(sm.code_station), ''),
                    nullif(trim(sd.legacy_code_station), ''),
                    m.ire_station,
                    m.station_id::text
                ),
                coalesce(sd.type_station, sm.type_station),
                sd.bassin_nom,
                sd.sous_bassin_nom,
                sd.longitude,
                sd.latitude,
                coalesce(sd.geom, sm.geom)
        )
        SELECT
            sr.*,
            admin_loc.commune_fr AS commune,
            admin_loc.province_fr AS province
        FROM station_rollup sr
        LEFT JOIN LATERAL (
            SELECT c.commune_fr, c.province_fr
            FROM admin.communes c
            WHERE sr.lon IS NOT NULL
              AND sr.lat IS NOT NULL
              AND ST_Contains(
                    ST_Transform(c.geom, 4326),
                    ST_SetSRID(ST_MakePoint(sr.lon, sr.lat), 4326)
                  )
            LIMIT 1
        ) admin_loc ON true
        ORDER BY sr.date_max DESC, sr.measure_count DESC, sr.station_name
        LIMIT :limit
        """,
        {"limit": safe_limit},
    )

    latest_by_station = _quality_latest_values(db, [str(station["station_id"]) for station in stations])
    for station in stations:
        latest_values = latest_by_station.get(str(station["station_id"]), [])
        status, status_reason = _quality_status_from_values(latest_values)
        station["last_measure_date"] = _iso_date(station.get("date_max"))
        station["status"] = status
        station["status_reason"] = status_reason
        station["latest_values"] = latest_values
        station["source_table"] = "qualite.mesure_qualite_sebou"
    return stations


def _series_payload(
    *,
    label: str,
    unit: str,
    source: str,
    rows: list[dict[str, Any]],
    empty_message: str,
) -> dict[str, Any]:
    points = [
        {"date": _iso_date(row.get("dt")), "value": round(float(row["value"]), 2)}
        for row in rows
        if row.get("value") is not None
    ]
    return {
        "label": label,
        "unit": unit,
        "points": points,
        "count": len(points),
        "date_min": points[0]["date"] if points else None,
        "date_max": points[-1]["date"] if points else None,
        "source": source,
        "message": None if points else empty_message,
    }


def _trend_rows(
    db: Session,
    *,
    source_table: str,
    value_sql: str,
    latest_date_sql: str,
    date_column: str = "temps",
    days: int = 30,
) -> list[dict[str, Any]]:
    latest_row = _row(db, latest_date_sql)
    latest_date = latest_row["latest_date"] if latest_row else None
    if latest_date is None:
        return []
    return _rows(
        db,
        f"""
        SELECT {date_column}::date AS dt, {value_sql} AS value
        FROM {source_table}
        WHERE {date_column}::date > CAST(:latest_date AS date) - (:days * INTERVAL '1 day')
          AND {date_column}::date <= CAST(:latest_date AS date)
        GROUP BY {date_column}::date
        ORDER BY {date_column}::date
        """,
        {"latest_date": latest_date, "days": days},
    )


def _quality_trend_rows(db: Session, days: int) -> list[dict[str, Any]]:
    latest_row = _row(
        db,
        """
        SELECT max(temps)::date AS latest_date
        FROM qualite.mesure_qualite_sebou
        WHERE valeur IS NOT NULL
          AND coalesce(est_valide, true) = true
        """,
    )
    latest_date = latest_row["latest_date"] if latest_row else None
    if latest_date is None:
        return []

    raw_rows = _rows(
        db,
        """
        SELECT temps::date AS dt, trim(parametre_qualite) AS raw_parameter, valeur
        FROM qualite.mesure_qualite_sebou
        WHERE temps::date > CAST(:latest_date AS date) - (:days * INTERVAL '1 day')
          AND temps::date <= CAST(:latest_date AS date)
          AND valeur IS NOT NULL
          AND coalesce(est_valide, true) = true
        ORDER BY temps::date
        """,
        {"latest_date": latest_date, "days": days},
    )
    regulatory_context = load_regulatory_context(db)
    daily_scores: dict[str, list[float]] = defaultdict(list)
    for row in raw_rows:
        canonical = QUALITY_PARAM_REGULATORY_MAP.get(str(row["raw_parameter"] or "").lower())
        if not canonical or canonical[0] not in {"NH4", "DBO5", "DCO", "NO3", "O2_DISS", "pH", "Cond"}:
            continue
        result = classify_measurement(
            regulatory_context,
            parameter_code=canonical[0],
            value_numeric=row.get("valeur"),
            unit=canonical[2],
        )
        if result.get("status") != "CLASSIFIED":
            continue
        severity = int(result.get("severity_order") or 0)
        if severity <= 0:
            continue
        daily_scores[_iso_date(row["dt"])].append(max(0, 100 - ((severity - 1) * 20)))

    return [{"dt": dt_key, "value": mean(values)} for dt_key, values in sorted(daily_scores.items())]


def get_dashboard_trends(db: Session, days: int = 30) -> dict[str, Any]:
    rainfall_rows = _trend_rows(
        db,
        source_table="meteo.mesure_precipitation",
        value_sql="avg(coalesce(val_remplies, val_observees, val_power_nasa))::double precision",
        latest_date_sql="""
            SELECT max(temps)::date AS latest_date
            FROM meteo.mesure_precipitation
            WHERE coalesce(val_remplies, val_observees, val_power_nasa) IS NOT NULL
        """,
        days=days,
    )
    flow_rows = _trend_rows(
        db,
        source_table="hydro.mesure_debit",
        value_sql="avg(valeur)::double precision",
        latest_date_sql="""
            SELECT max(temps)::date AS latest_date
            FROM hydro.mesure_debit
            WHERE valeur IS NOT NULL
        """,
        days=days,
    )
    temperature_rows = _trend_rows(
        db,
        source_table="meteo.mesure_temperature",
        value_sql="avg(val_moy)::double precision",
        latest_date_sql="""
            SELECT max(temps)::date AS latest_date
            FROM meteo.mesure_temperature
            WHERE val_moy IS NOT NULL
        """,
        days=days,
    )
    quality_rows = _quality_trend_rows(db, days)

    return {
        "rainfall": _series_payload(
            label="Pluie",
            unit="mm",
            source="meteo.mesure_precipitation",
            rows=rainfall_rows,
            empty_message="Série pluie indisponible",
        ),
        "flow": _series_payload(
            label="Débit",
            unit="m3/s",
            source="hydro.mesure_debit",
            rows=flow_rows,
            empty_message="Série débit indisponible",
        ),
        "temperature": _series_payload(
            label="Température",
            unit="°C",
            source="meteo.mesure_temperature",
            rows=temperature_rows,
            empty_message="Température non disponible en base",
        ),
        "quality": _series_payload(
            label="Qualité",
            unit="score",
            source="qualite.mesure_qualite_sebou",
            rows=quality_rows,
            empty_message="Série qualité indisponible",
        ),
    }
