from __future__ import annotations

import copy
from contextvars import ContextVar
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date, datetime, timezone
import hashlib
import logging
import os
from statistics import mean
import threading
import time
from typing import Any, Callable

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.regulatory_quality import classify_measurement, load_regulatory_context


QUALITY_TYPE_EAU = "surface_generale"
QUALITY_PARAMETER_UNITS = {
    "DBO5": "mg/L",
    "DCO": "mg/L",
    "NO3": "mg/L",
    "MES": "mg/L",
    "O2_DISSOUS": "mg/L",
    "pH": "",
}
DEFAULT_MAP_LAYERS = ["barrages", "hydro", "pluvio", "quality_daily"]
SECONDARY_MAP_LAYERS = ["pollution", "campaigns", "swat", "wasp", "historical"]
HOME_CACHE_KEY = "dashboard_home_v2"
DEFAULT_HOME_CACHE_SECONDS = 120

log = logging.getLogger(__name__)


@dataclass
class HomeDashboardRuntime:
    latest_dates: dict[str, Any] | None = None
    layer_counts: dict[str, int] | None = None
    quality_regulatory_context: dict[str, Any] | None = None
    section_metrics: dict[str, dict[str, float | int | str]] = field(default_factory=dict)
    query_count: int = 0
    query_seconds: float = 0.0


_RUNTIME: ContextVar[HomeDashboardRuntime | None] = ContextVar("dashboard_home_runtime", default=None)
_HOME_CACHE_LOCK = threading.Lock()
_HOME_BUILD_LOCK = threading.Lock()
_HOME_CACHE: dict[str, dict[str, Any]] = {}
_HOME_WARM_LOCK = threading.Lock()
_HOME_WARMING = False

# Short-lived cross-request caches for raw dependencies (latest dates / counts / regulatory context)
_DEP_CACHE_LOCK = threading.Lock()
_DEP_CACHE: dict[str, dict[str, Any]] = {}


def get_dashboard_home(db: Session) -> dict[str, Any]:
    cached_payload = _cache_get(HOME_CACHE_KEY)
    if cached_payload is not None:
        return cached_payload

    with _HOME_BUILD_LOCK:
        cached_payload = _cache_get(HOME_CACHE_KEY)
        if cached_payload is not None:
            return cached_payload
        return _build_dashboard_home_payload(db)


def _build_dashboard_home_payload(db: Session) -> dict[str, Any]:
    generated_at = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    partial = {"value": False}
    runtime = HomeDashboardRuntime()
    token = _RUNTIME.set(runtime)
    total_started_at = time.perf_counter()
    try:
        data_freshness = _profiled_section(
            "data_freshness",
            _build_data_freshness,
            db,
            partial,
            _fallback_data_freshness(),
        )
        hero = _profiled_section("hero", _build_hero, db, partial, _fallback_hero(generated_at[:10], data_freshness))
        map_payload = _profiled_section("map", _build_map, db, partial, _fallback_map())
        basin_status = _profiled_section("basin_status", _build_basin_status, db, partial, _fallback_basin_status())
        alerts = _profiled_section("alerts", _build_alerts, db, partial, [])
        recommended_actions = _profiled_section(
            "recommended_actions",
            _build_recommended_actions,
            db,
            partial,
            [],
        )
        trends = _profiled_section("trends", _build_trends, db, partial, _fallback_trends())
        secondary_kpis = _profiled_section(
            "secondary_kpis",
            _build_secondary_kpis,
            db,
            partial,
            _fallback_secondary_kpis(),
        )
        metadata = _profiled_section("metadata", _build_metadata, db, partial, _fallback_metadata())

        payload = {
            "status": "partial" if partial["value"] else "success",
            "generated_at": generated_at,
            "data_freshness": data_freshness,
            "hero": hero,
            "map": map_payload,
            "basin_status": basin_status,
            "alerts": alerts,
            "recommended_actions": recommended_actions,
            "trends": trends,
            "secondary_kpis": secondary_kpis,
            "metadata": metadata,
        }
        _cache_set(HOME_CACHE_KEY, payload)
        total_ms = round((time.perf_counter() - total_started_at) * 1000, 2)
        log.info(
            "dashboard_home built in %s ms (status=%s, query_count=%s, query_time_ms=%s, sections=%s)",
            total_ms,
            payload["status"],
            runtime.query_count if runtime else 0,
            round(runtime.query_seconds * 1000, 2) if runtime else 0,
            runtime.section_metrics if runtime else {},
        )
        return payload
    finally:
        _RUNTIME.reset(token)


def _profiled_section(
    name: str,
    builder: Callable[[Session], Any],
    db: Session,
    partial: dict[str, bool],
    fallback: Any,
) -> Any:
    runtime = _get_runtime()
    query_count_before = runtime.query_count if runtime else 0
    query_seconds_before = runtime.query_seconds if runtime else 0.0
    started_at = time.perf_counter()
    result = _safe_section(name, builder, db, partial, fallback)
    duration_ms = round((time.perf_counter() - started_at) * 1000, 2)
    if runtime is not None:
        runtime.section_metrics[name] = {
            "duration_ms": duration_ms,
            "query_count": runtime.query_count - query_count_before,
            "query_time_ms": round((runtime.query_seconds - query_seconds_before) * 1000, 2),
            "status": "partial" if partial["value"] else "success",
        }
    return result


def _safe_section(
    name: str,
    builder: Callable[[Session], Any],
    db: Session,
    partial: dict[str, bool],
    fallback: Any,
) -> Any:
    try:
        return builder(db)
    except Exception:
        db.rollback()
        partial["value"] = True
        return fallback


def _iso_date(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return str(value)


def _age_days(value: Any) -> int | None:
    if value is None:
        return None
    current = date.today()
    if isinstance(value, datetime):
        value = value.date()
    if isinstance(value, date):
        return max(0, (current - value).days)
    return None


def _freshness_status(latest_value: Any) -> str:
    age = _age_days(latest_value)
    if age is None:
        return "MISSING"
    if age <= 7:
        return "FRESH"
    return "STALE"


def _get_runtime() -> HomeDashboardRuntime | None:
    return _RUNTIME.get()


def _get_home_cache_seconds() -> int:
    raw_value = os.getenv("SAD_DASHBOARD_HOME_CACHE_SECONDS", str(DEFAULT_HOME_CACHE_SECONDS))
    try:
        return max(0, int(raw_value))
    except (TypeError, ValueError):
        return DEFAULT_HOME_CACHE_SECONDS


def _cache_get(key: str) -> dict[str, Any] | None:
    ttl_seconds = _get_home_cache_seconds()
    if ttl_seconds <= 0:
        return None
    now = time.time()
    with _HOME_CACHE_LOCK:
        entry = _HOME_CACHE.get(key)
        if not entry:
            return None
        if entry["expires_at"] <= now:
            _HOME_CACHE.pop(key, None)
            return None
        return copy.deepcopy(entry["payload"])


def _cache_set(key: str, payload: dict[str, Any]) -> None:
    ttl_seconds = _get_home_cache_seconds()
    if ttl_seconds <= 0:
        return
    with _HOME_CACHE_LOCK:
        _HOME_CACHE[key] = {
            "expires_at": time.time() + ttl_seconds,
            "payload": copy.deepcopy(payload),
        }


def _clear_home_cache() -> None:
    with _HOME_CACHE_LOCK:
        _HOME_CACHE.clear()


def _dep_cache_get(key: str) -> Any | None:
    ttl_seconds = _get_home_cache_seconds()
    if ttl_seconds <= 0:
        return None
    now = time.time()
    with _DEP_CACHE_LOCK:
        entry = _DEP_CACHE.get(key)
        if not entry:
            return None
        if entry["expires_at"] <= now:
            _DEP_CACHE.pop(key, None)
            return None
        return copy.deepcopy(entry["payload"])


def _dep_cache_set(key: str, payload: Any) -> None:
    ttl_seconds = _get_home_cache_seconds()
    if ttl_seconds <= 0:
        return
    with _DEP_CACHE_LOCK:
        _DEP_CACHE[key] = {
            "expires_at": time.time() + ttl_seconds,
            "payload": copy.deepcopy(payload),
        }


def _clear_dep_cache() -> None:
    with _DEP_CACHE_LOCK:
        _DEP_CACHE.clear()


def warm_dashboard_home_cache(session_factory: Callable[[], Session], *, force: bool = False) -> bool:
    global _HOME_WARMING
    if not force and _cache_get(HOME_CACHE_KEY) is not None:
        return False

    with _HOME_WARM_LOCK:
        if _HOME_WARMING:
            return False
        _HOME_WARMING = True

    try:
        db = session_factory()
        try:
            if force:
                _clear_home_cache()
                _clear_dep_cache()
            get_dashboard_home(db)
            return True
        finally:
            db.close()
    except Exception:
        return False
    finally:
        with _HOME_WARM_LOCK:
            _HOME_WARMING = False


def _query_scalar(db: Session, sql: str, params: dict[str, Any] | None = None) -> Any:
    runtime = _get_runtime()
    started_at = time.perf_counter()
    try:
        return db.execute(text(sql), params or {}).scalar()
    finally:
        if runtime is not None:
            runtime.query_count += 1
            runtime.query_seconds += time.perf_counter() - started_at


def _query_mapping(db: Session, sql: str, params: dict[str, Any] | None = None) -> dict[str, Any] | None:
    runtime = _get_runtime()
    started_at = time.perf_counter()
    try:
        row = db.execute(text(sql), params or {}).mappings().first()
        return dict(row) if row else None
    finally:
        if runtime is not None:
            runtime.query_count += 1
            runtime.query_seconds += time.perf_counter() - started_at


def _query_rows(db: Session, sql: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    runtime = _get_runtime()
    started_at = time.perf_counter()
    try:
        return [dict(row) for row in db.execute(text(sql), params or {}).mappings().all()]
    finally:
        if runtime is not None:
            runtime.query_count += 1
            runtime.query_seconds += time.perf_counter() - started_at


def _latest_dates(db: Session) -> dict[str, Any]:
    runtime = _get_runtime()
    if runtime is not None and runtime.latest_dates is not None:
        return runtime.latest_dates
    cached = _dep_cache_get("latest_dates")
    if cached is not None:
        if runtime is not None:
            runtime.latest_dates = cached
        return cached
    latest_dates = {
        "barrages": _query_scalar(db, "select max(bucket_day) from api.v_hydro_barrage_param_journalier"),
        "hydro": _query_scalar(db, "select max(bucket_day) from api.v_hydro_debit_journalier_qa"),
        "pluvio": _query_scalar(db, "select max(bucket_day) from api.v_meteo_precipitation_journalier_qa"),
        "quality_daily": _query_scalar(db, "select max(temps)::date from qualite.mesure_qualite_sebou"),
    }
    if runtime is not None:
        runtime.latest_dates = latest_dates
    _dep_cache_set("latest_dates", latest_dates)
    return latest_dates


def _layer_counts(db: Session) -> dict[str, int]:
    runtime = _get_runtime()
    if runtime is not None and runtime.layer_counts is not None:
        return runtime.layer_counts
    cached = _dep_cache_get("layer_counts")
    if cached is not None:
        if runtime is not None:
            runtime.layer_counts = cached
        return cached

    latest = _latest_dates(db)
    quality_latest = latest.get("quality_daily")
    quality_count_sql = """
        select count(distinct station_id)
        from qualite.mesure_qualite_sebou
        where temps::date >= current_date - interval '30 days'
    """
    if quality_latest is not None:
        quality_count_sql = """
            select count(distinct station_id)
            from qualite.mesure_qualite_sebou
            where temps::date = :latest_day
        """
    counts = {
        "barrages": int(_count_latest_distinct(db, "api.v_hydro_barrage_param_journalier", "barrage_id", latest["barrages"]) or 0),
        "hydro": int(_count_latest_distinct(db, "api.v_hydro_debit_journalier_qa", "station_id", latest["hydro"]) or 0),
        "pluvio": int(_count_latest_distinct(db, "api.v_meteo_precipitation_journalier_qa", "station_id", latest["pluvio"]) or 0),
        "quality_daily": int(_query_scalar(db, quality_count_sql, {"latest_day": quality_latest} if quality_latest is not None else {}) or 0),
    }
    if runtime is not None:
        runtime.layer_counts = counts
    _dep_cache_set("layer_counts", counts)
    return counts


def _count_latest_distinct(db: Session, table_name: str, id_column: str, latest_day: Any) -> int:
    if latest_day is None:
        return 0
    sql = f"""
    select count(distinct {id_column})
    from {table_name}
    where bucket_day = :latest_day
    """
    return int(_query_scalar(db, sql, {"latest_day": latest_day}) or 0)


def _quality_regulatory_context(db: Session) -> dict[str, Any]:
    runtime = _get_runtime()
    if runtime is not None and runtime.quality_regulatory_context is not None:
        return runtime.quality_regulatory_context
    cached = _dep_cache_get("quality_regulatory_context")
    if cached is not None:
        if runtime is not None:
            runtime.quality_regulatory_context = cached
        return cached
    regulatory_context = load_regulatory_context(db, type_eau_code=QUALITY_TYPE_EAU)
    if runtime is not None:
        runtime.quality_regulatory_context = regulatory_context
    _dep_cache_set("quality_regulatory_context", regulatory_context)
    return regulatory_context


def _build_data_freshness(db: Session) -> dict[str, Any]:
    latest = _latest_dates(db)
    return {
        "barrages": _freshness_payload(latest["barrages"], "Données barrages issues des paramètres journaliers."),
        "hydro": _freshness_payload(latest["hydro"], "Débits utiles issus de la vue journalière QA."),
        "pluvio": _freshness_payload(
            latest["pluvio"],
            "Données pluie disponibles ; typologie station à consolider.",
        ),
        "quality_daily": _freshness_payload(
            latest["quality_daily"],
            "Réseau qualité quotidien sur 6 stations sentinelles.",
        ),
    }


def _freshness_payload(latest_value: Any, note: str) -> dict[str, Any]:
    return {
        "latest_date": _iso_date(latest_value),
        "age_days": _age_days(latest_value),
        "status": _freshness_status(latest_value),
        "note": note,
    }


def _build_hero(db: Session) -> dict[str, Any]:
    latest = _latest_dates(db)
    counts = _layer_counts(db)
    hydro_latest = latest["hydro"]
    pluvio_latest = latest["pluvio"]
    barrages_latest = latest["barrages"]
    quality_latest = latest["quality_daily"]

    operational_date = max(
        [value for value in latest.values() if isinstance(value, date)],
        default=date.today(),
    ).isoformat()

    return {
        "title": "WaterQual Sebou",
        "subtitle": "Système d'Aide à la Décision pour la Qualité des Eaux du Bassin du Sebou",
        "operational_date": operational_date,
        "summary_label": "État opérationnel du bassin",
        "cards": [
            _hero_card(
                card_id="barrages_suivis",
                label="Barrages suivis",
                value=int(counts["barrages"]),
                unit="ouvrages",
                latest_value=barrages_latest,
                color_hint="blue",
                icon="dam",
                description="Barrages avec données journalières disponibles.",
            ),
            _hero_card(
                card_id="donnees_pluie_disponibles",
                label="Données pluie disponibles",
                value=int(counts["pluvio"]),
                unit="stations",
                latest_value=pluvio_latest,
                color_hint="green",
                icon="rain",
                description="Stations avec pluie disponible ; typologie métier non encore consolidée.",
            ),
            _hero_card(
                card_id="stations_hydro_actives",
                label="Stations hydro actives",
                value=int(counts["hydro"]),
                unit="stations",
                latest_value=hydro_latest,
                color_hint="blue",
                icon="river",
                description="Stations hydro présentes sur la dernière date utile.",
            ),
            _hero_card(
                card_id="stations_sentinelles_qualite",
                label="Stations sentinelles qualité",
                value=int(counts["quality_daily"]),
                unit="réseau",
                latest_value=quality_latest,
                color_hint="orange",
                icon="quality",
                description="Réseau qualité quotidien du Sebou.",
            ),
        ],
    }


def _hero_card(
    *,
    card_id: str,
    label: str,
    value: int,
    unit: str,
    latest_value: Any,
    color_hint: str,
    icon: str,
    description: str,
) -> dict[str, Any]:
    status = "UNKNOWN" if value == 0 else ("OK" if _freshness_status(latest_value) == "FRESH" else "SURVEILLANCE")
    return {
        "id": card_id,
        "label": label,
        "value": value,
        "unit": unit,
        "status": status,
        "trend": "STABLE" if value > 0 else "UNKNOWN",
        "description": description,
        "color_hint": color_hint,
        "icon": icon,
        "freshness": _freshness_payload(latest_value, description),
    }


def _build_map(db: Session) -> dict[str, Any]:
    counts = _layer_counts(db)

    return {
        "default_layers": DEFAULT_MAP_LAYERS,
        "secondary_layers": SECONDARY_MAP_LAYERS,
        "layers": {
            "barrages": {
                "label": "Barrages",
                "enabled": True,
                "count": int(counts["barrages"]),
                "symbology": {"shape": "marker", "color": "blue_dark", "size": "large"},
                "features_endpoint": "/api/v1/dashboard/map?layers=barrages",
            },
            "hydro": {
                "label": "Hydro",
                "enabled": True,
                "count": int(counts["hydro"]),
                "symbology": {"shape": "circle", "color": "blue", "size": "scaled_by_flow"},
                "features_endpoint": "/api/v1/dashboard/map?layers=hydro",
            },
            "pluvio": {
                "label": "Données pluie disponibles",
                "enabled": True,
                "count": int(counts["pluvio"]),
                "symbology": {"shape": "drop", "color": "green", "size": "medium"},
                "features_endpoint": "/api/v1/dashboard/map?layers=pluvio",
            },
            "quality_daily": {
                "label": "Stations sentinelles qualité",
                "enabled": True,
                "count": int(counts["quality_daily"]),
                "symbology": {"shape": "hexagon", "color": "orange", "size": "medium"},
                "features_endpoint": "/api/v1/dashboard/map?layers=quality_daily",
            },
        },
    }


def _build_basin_status(db: Session) -> dict[str, Any]:
    latest = _latest_dates(db)
    return {
        "hydrology": _build_hydrology_status(db, latest["hydro"]),
        "rainfall": _build_rainfall_status(db, latest["pluvio"]),
        "quality": _build_quality_status(db),
        "barrages": _build_barrage_status(db, latest["barrages"]),
    }


def _build_hydrology_status(db: Session, latest_day: Any) -> dict[str, Any]:
    if latest_day is None:
        return {
            "debit_moyen": None,
            "unit": "m3/s",
            "stations_hausse": 0,
            "stations_baisse": 0,
            "stations_stables": 0,
            "station_count": 0,
            "latest_date": None,
        }

    stats = _query_mapping(
        db,
        """
        select
            avg(valeur)::double precision as debit_moyen,
            count(distinct station_id)::int as station_count
        from api.v_hydro_debit_journalier_qa
        where bucket_day = :latest_day
          and valeur is not null
        """,
        {"latest_day": latest_day},
    ) or {}

    changes = _query_rows(
        db,
        """
        with ordered as (
            select
                station_id,
                bucket_day,
                valeur,
                lag(valeur) over (partition by station_id order by bucket_day) as previous_value
            from api.v_hydro_debit_journalier_qa
            where bucket_day >= cast(:latest_day as date) - interval '5 days'
              and bucket_day <= :latest_day
              and valeur is not null
        )
        select station_id::text as station_id, valeur, previous_value
        from ordered
        where bucket_day = :latest_day
        """,
        {"latest_day": latest_day},
    )
    stations_hausse = 0
    stations_baisse = 0
    stations_stables = 0
    for row in changes:
        current = row.get("valeur")
        previous = row.get("previous_value")
        if current is None or previous is None:
            stations_stables += 1
        elif current > previous:
            stations_hausse += 1
        elif current < previous:
            stations_baisse += 1
        else:
            stations_stables += 1

    return {
        "debit_moyen": round(float(stats.get("debit_moyen")), 2) if stats.get("debit_moyen") is not None else None,
        "unit": "m3/s",
        "stations_hausse": stations_hausse,
        "stations_baisse": stations_baisse,
        "stations_stables": stations_stables,
        "station_count": int(stats.get("station_count") or 0),
        "latest_date": _iso_date(latest_day),
    }


def _build_rainfall_status(db: Session, latest_day: Any) -> dict[str, Any]:
    if latest_day is None:
        return {
            "cumul_24h": None,
            "cumul_7j": None,
            "cumul_30j": None,
            "unit": "mm",
            "station_count": 0,
            "latest_date": None,
            "warning_typology_not_validated": True,
            "label": "Données pluie disponibles",
        }

    stats = _query_mapping(
        db,
        """
        select
            avg(val_remplies) filter (where bucket_day = :latest_day)::double precision as cumul_24h,
            avg(val_remplies) filter (where bucket_day > cast(:latest_day as date) - interval '7 days')::double precision as cumul_7j,
            avg(val_remplies) filter (where bucket_day > cast(:latest_day as date) - interval '30 days')::double precision as cumul_30j,
            count(distinct station_id) filter (where bucket_day = :latest_day)::int as station_count
        from api.v_meteo_precipitation_journalier_qa
        where bucket_day > cast(:latest_day as date) - interval '30 days'
          and bucket_day <= :latest_day
          and val_remplies is not null
        """,
        {"latest_day": latest_day},
    ) or {}

    return {
        "cumul_24h": round(float(stats.get("cumul_24h")), 2) if stats.get("cumul_24h") is not None else None,
        "cumul_7j": round(float(stats.get("cumul_7j")), 2) if stats.get("cumul_7j") is not None else None,
        "cumul_30j": round(float(stats.get("cumul_30j")), 2) if stats.get("cumul_30j") is not None else None,
        "unit": "mm",
        "station_count": int(stats.get("station_count") or 0),
        "latest_date": _iso_date(latest_day),
        "warning_typology_not_validated": True,
        "label": "Données pluie disponibles",
    }


def _build_quality_status(db: Session) -> dict[str, Any]:
    latest_day = _latest_dates(db)["quality_daily"]
    if latest_day is None:
        return {
            "sentinel_station_count": 0,
            "conformes": 0,
            "surveillance": 0,
            "critiques": 0,
            "unknown": 0,
            "latest_date": None,
            "label": "Stations sentinelles qualité",
        }

    regulatory_context = _quality_regulatory_context(db)
    rows = _query_rows(
        db,
        """
        with latest as (
            select distinct on (station_id, parametre_qualite)
                station_id,
                temps::date as sample_date,
                parametre_qualite,
                valeur
            from qualite.mesure_qualite_sebou
            where temps::date = :latest_day
              and valeur is not null
              and coalesce(est_valide, true) = true
            order by station_id, parametre_qualite, temps desc
        )
        select
            station_id::text as station_id,
            sample_date,
            parametre_qualite,
            valeur
        from latest
        order by station_id, parametre_qualite
        """,
        {"latest_day": latest_day},
    )

    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        parameter_code = _normalize_quality_parameter(row.get("parametre_qualite"))
        grouped[row["station_id"]].append(
            {
                "parameter_code": parameter_code,
                "value_numeric": row.get("valeur"),
                "sample_date": row.get("sample_date"),
            }
        )

    conformes = 0
    surveillance = 0
    critiques = 0
    unknown = 0

    for station_rows in grouped.values():
        severities = []
        for item in station_rows:
            if item["parameter_code"] is None:
                continue
            result = classify_measurement(
                regulatory_context,
                parameter_code=item["parameter_code"],
                value_numeric=item["value_numeric"],
                unit=QUALITY_PARAMETER_UNITS.get(item["parameter_code"], "mg/L"),
            )
            if result.get("status") == "CLASSIFIED":
                severities.append(int(result.get("severity_order") or 0))
        severity = max(severities, default=0)
        if severity == 0:
            unknown += 1
        elif severity <= 2:
            conformes += 1
        elif severity == 3:
            surveillance += 1
        else:
            critiques += 1

    sentinel_station_count = _layer_counts(db)["quality_daily"]
    return {
        "sentinel_station_count": int(sentinel_station_count),
        "conformes": conformes,
        "surveillance": surveillance,
        "critiques": critiques,
        "unknown": unknown,
        "latest_date": _iso_date(latest_day),
        "label": "Stations sentinelles qualité",
    }


def _normalize_quality_parameter(raw_value: Any) -> str | None:
    value = (str(raw_value or "")).strip().upper()
    if value.startswith("DBO"):
        return "DBO5"
    if value.startswith("DCO"):
        return "DCO"
    if value.startswith("NO3"):
        return "NO3"
    if value.startswith("MES"):
        return "MES"
    if value.startswith("O2"):
        return "O2_DISSOUS"
    if value == "PH":
        return "pH"
    return None


def _build_barrage_status(db: Session, latest_day: Any) -> dict[str, Any]:
    if latest_day is None:
        return {
            "barrage_count": 0,
            "apport_total": None,
            "lacher_total": None,
            "niveau_moyen": None,
            "unit_flow": "Mm3/j",
            "latest_date": None,
        }

    stats = _query_mapping(
        db,
        """
        select
            count(distinct barrage_id)::int as barrage_count,
            sum(case when parametre_code = 'APPORT' then valeur else 0 end)::double precision as apport_total,
            sum(case when parametre_code = 'LACHER' then valeur else 0 end)::double precision as lacher_total,
            avg(case when parametre_code = 'NIVEAU_EAU' then valeur end)::double precision as niveau_moyen
        from api.v_hydro_barrage_param_journalier
        where bucket_day = :latest_day
          and parametre_code in ('APPORT', 'LACHER', 'NIVEAU_EAU')
          and valeur is not null
        """,
        {"latest_day": latest_day},
    ) or {}

    return {
        "barrage_count": int(stats.get("barrage_count") or 0),
        "apport_total": round(float(stats.get("apport_total")), 2) if stats.get("apport_total") is not None else None,
        "lacher_total": round(float(stats.get("lacher_total")), 2) if stats.get("lacher_total") is not None else None,
        "niveau_moyen": round(float(stats.get("niveau_moyen")), 2) if stats.get("niveau_moyen") is not None else None,
        "unit_flow": "Mm3/j",
        "latest_date": _iso_date(latest_day),
    }


def _build_alerts(db: Session) -> list[dict[str, Any]]:
    latest = _latest_dates(db)
    normalized: list[dict[str, Any]] = []
    generated_at = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")

    pluvio_freshness = _freshness_payload(latest["pluvio"], "")
    if pluvio_freshness["status"] != "FRESH":
        normalized.append(
            {
                "id": _stable_id("PLUVIO:STALE"),
                "type": "PLUVIO",
                "severity": "SURVEILLANCE",
                "title": "Fraîcheur pluie à surveiller",
                "message": "Les données pluie sont disponibles mais la fraîcheur et la typologie métier doivent être consolidées.",
                "object_label": "Réseau pluie",
                "object_type": "station_network",
                "action_hint": "Valider la liste home-ready des stations pluie.",
                "created_at": generated_at,
                "source": "alert_engine",
            }
        )

    barrage_freshness = _freshness_payload(latest["barrages"], "")
    if barrage_freshness["status"] != "FRESH":
        normalized.append(
            {
                "id": _stable_id("BARRAGE:STALE"),
                "type": "BARRAGE",
                "severity": "SURVEILLANCE",
                "title": "Fraîcheur barrage à surveiller",
                "message": "Les paramètres barrages ne sont pas sur une fraîcheur temps quasi réel.",
                "object_label": "Barrages suivis",
                "object_type": "barrage_network",
                "action_hint": "Vérifier la chaîne d'alimentation des ouvrages.",
                "created_at": generated_at,
                "source": "alert_engine",
            }
        )

    severity_order = {"CRITIQUE": 0, "SURVEILLANCE": 1, "INFO": 2}
    normalized.sort(key=lambda item: (severity_order.get(item["severity"], 3), item["title"]))
    return normalized[:5]


def _normalize_alert_type(raw_type: Any) -> str | None:
    mapping = {
        "QUALITY": "QUALITE",
        "HYDRO": "HYDRO",
        "DATA": "DATA",
    }
    return mapping.get(str(raw_type or "").upper())


def _normalize_alert_severity(raw_severity: Any) -> str:
    mapping = {"HIGH": "CRITIQUE", "MEDIUM": "SURVEILLANCE", "LOW": "INFO"}
    return mapping.get(str(raw_severity or "").upper(), "INFO")


def _infer_object_type(alert_type: str, entity_name: Any) -> str | None:
    if alert_type == "QUALITE":
        return "station"
    if alert_type == "PLUVIO":
        return "station_network"
    if alert_type == "BARRAGE":
        return "barrage_network"
    if alert_type == "HYDRO":
        return "network"
    if alert_type == "DATA":
        return "data"
    return None


def _build_recommended_actions(db: Session) -> list[dict[str, Any]]:
    latest = _latest_dates(db)
    normalized: list[dict[str, Any]] = []

    freshness_checks = [
        ("data", "quality", "Stations sentinelles qualité", latest.get("quality_daily")),
        ("hydro", "hydro", "Réseau hydro", latest.get("hydro")),
        ("data", "pluvio", "Réseau pluie", latest.get("pluvio")),
        ("hydro", "barrages", "Barrages suivis", latest.get("barrages")),
    ]
    for domain, key, label, latest_value in freshness_checks:
        freshness = _freshness_payload(latest_value, "")
        if freshness["status"] == "FRESH":
            continue
        priority = "P1" if freshness["status"] == "STALE" else "P2"
        action = f"Vérifier la fraîcheur - {label}"
        why = freshness["note"] or f"Dernière donnée {key} à confirmer."
        normalized.append(
            {
                "id": _stable_id(f"{domain}:{key}:{action}"),
                "priority": priority,
                "title": action,
                "why": why,
                "action": action,
                "target_type": _recommendation_target_type(domain),
                "target_label": _recommendation_target_label(domain),
                "source": "recommendation_engine",
            }
        )

    if not normalized:
        normalized.append(
            {
                "id": _stable_id("home:surveillance:continue"),
                "priority": "P2",
                "title": "Maintenir la surveillance opérationnelle",
                "why": "Les indicateurs Home ne signalent pas d'anomalie bloquante sur les dernières données disponibles.",
                "action": "Poursuivre le suivi des couches qualité, hydro, pluie et barrages.",
                "target_type": "data_pipeline",
                "target_label": "Chaîne de données opérationnelles",
                "source": "recommendation_engine",
            }
        )

    order = {"P0": 0, "P1": 1, "P2": 2}
    normalized.sort(key=lambda item: (order.get(item["priority"], 3), item["title"]))
    return normalized[:5]


def _normalize_recommendation_priority(raw_priority: Any) -> str:
    mapping = {"HIGH": "P0", "MEDIUM": "P1", "LOW": "P2"}
    return mapping.get(str(raw_priority or "").upper(), "P2")


def _recommendation_target_type(domain: str) -> str | None:
    mapping = {
        "quality": "quality_network",
        "data": "data_pipeline",
        "pollution": "surveillance",
        "hydro": "barrage_network",
    }
    return mapping.get(domain) or domain or None


def _recommendation_target_label(domain: str) -> str | None:
    mapping = {
        "quality": "Stations sentinelles qualité",
        "data": "Chaîne de données opérationnelles",
        "pollution": "Surveillance aval",
        "hydro": "Barrages suivis",
    }
    return mapping.get(domain)


def _build_trends(db: Session) -> dict[str, Any]:
    latest = _latest_dates(db)
    return {
        "hydro_30d": {
            "label": "Débit moyen 30 jours",
            "unit": "m3/s",
            "points": _hydro_points(db, latest["hydro"]),
        },
        "rainfall_30d": {
            "label": "Précipitations 30 jours",
            "unit": "mm",
            "points": _rainfall_points(db, latest["pluvio"]),
        },
        "barrage_apport_30d": {
            "label": "Apports barrages 30 jours",
            "unit": "Mm3",
            "points": _barrage_points(db, latest["barrages"]),
        },
        "quality_30d": {
            "label": "Qualité sentinelle 30 jours",
            "unit": "score",
            "points": _quality_points(db),
        },
    }


def _hydro_points(db: Session, latest_day: Any) -> list[dict[str, Any]]:
    if latest_day is None:
        return []
    rows = _query_rows(
        db,
        """
        select bucket_day as dt, avg(valeur)::double precision as value
        from api.v_hydro_debit_journalier_qa
        where bucket_day > cast(:latest_day as date) - interval '30 days'
          and bucket_day <= :latest_day
          and valeur is not null
        group by bucket_day
        order by bucket_day
        """,
        {"latest_day": latest_day},
    )
    return [{"date": _iso_date(row["dt"]), "value": round(float(row["value"]), 2)} for row in rows if row.get("value") is not None]


def _rainfall_points(db: Session, latest_day: Any) -> list[dict[str, Any]]:
    if latest_day is None:
        return []
    rows = _query_rows(
        db,
        """
        select bucket_day as dt, avg(val_remplies)::double precision as value
        from api.v_meteo_precipitation_journalier_qa
        where bucket_day > cast(:latest_day as date) - interval '30 days'
          and bucket_day <= :latest_day
          and val_remplies is not null
        group by bucket_day
        order by bucket_day
        """,
        {"latest_day": latest_day},
    )
    return [{"date": _iso_date(row["dt"]), "value": round(float(row["value"]), 2)} for row in rows if row.get("value") is not None]


def _barrage_points(db: Session, latest_day: Any) -> list[dict[str, Any]]:
    if latest_day is None:
        return []
    rows = _query_rows(
        db,
        """
        select bucket_day as dt, sum(valeur)::double precision as value
        from api.v_hydro_barrage_param_journalier
        where bucket_day > cast(:latest_day as date) - interval '30 days'
          and bucket_day <= :latest_day
          and parametre_code = 'APPORT'
          and valeur is not null
        group by bucket_day
        order by bucket_day
        """,
        {"latest_day": latest_day},
    )
    return [{"date": _iso_date(row["dt"]), "value": round(float(row["value"]), 2)} for row in rows if row.get("value") is not None]


def _quality_points(db: Session) -> list[dict[str, Any]]:
    latest_day = _latest_dates(db)["quality_daily"]
    if latest_day is None:
        return []
    rows = _query_rows(
        db,
        """
        select temps::date as dt, station_id::text as station_id, parametre_qualite, valeur
        from qualite.mesure_qualite_sebou
        where temps::date > cast(:latest_day as date) - interval '30 days'
          and temps::date <= :latest_day
          and valeur is not null
          and coalesce(est_valide, true) = true
        order by temps::date
        """,
        {"latest_day": latest_day},
    )
    if not rows:
        return []

    regulatory_context = _quality_regulatory_context(db)
    daily_scores: dict[str, list[int]] = defaultdict(list)
    for row in rows:
        parameter_code = _normalize_quality_parameter(row.get("parametre_qualite"))
        if parameter_code is None:
            continue
        result = classify_measurement(
            regulatory_context,
            parameter_code=parameter_code,
            value_numeric=row.get("valeur"),
            unit=QUALITY_PARAMETER_UNITS.get(parameter_code, "mg/L"),
        )
        if result.get("status") != "CLASSIFIED":
            continue
        severity = int(result.get("severity_order") or 0)
        if severity <= 0:
            continue
        score = max(0, 100 - ((severity - 1) * 20))
        daily_scores[_iso_date(row["dt"])].append(score)

    points = []
    for dt_key in sorted(daily_scores.keys()):
        values = daily_scores[dt_key]
        points.append({"date": dt_key, "value": round(mean(values), 2) if values else None})
    return points


def _build_secondary_kpis(db: Session) -> dict[str, Any]:
    latest = _latest_dates(db)
    freshness_scores = {
        "barrages": _freshness_score(latest.get("barrages")),
        "hydro": _freshness_score(latest.get("hydro")),
        "pluvio": _freshness_score(latest.get("pluvio")),
        "quality_daily": _freshness_score(latest.get("quality_daily")),
    }
    score_values = [value for value in freshness_scores.values() if value is not None]
    freshness_index = round(mean(score_values), 2) if score_values else None
    data_confidence = freshness_index
    hydraulic_confidence = freshness_scores["hydro"]
    pollution_pressure = freshness_scores["quality_daily"]
    subbasin_risk = None if pollution_pressure is None else max(0, 100 - pollution_pressure)

    return {
        "iqgb": _secondary_kpi_payload(freshness_scores["quality_daily"], "IQGB", "Indice Qualité Global Bassin."),
        "ifd": _secondary_kpi_payload(freshness_index, "IFD", "Indice Fraîcheur Données."),
        "icd": _secondary_kpi_payload(data_confidence, "ICD", "Indice Confiance Données."),
        "ich": _secondary_kpi_payload(hydraulic_confidence, "ICH", "Indice Confiance Hydraulique."),
        "ipp": _secondary_kpi_payload(pollution_pressure, "IPP", "Indice Pression Pollution MVP topologique."),
        "isr": _secondary_kpi_payload(subbasin_risk, "ISR", "Indice Sous-Bassin à Risque."),
    }


def _freshness_score(latest_value: Any) -> float | None:
    age = _age_days(latest_value)
    if age is None:
        return None
    if age <= 7:
        return 100.0
    if age <= 30:
        return 80.0
    if age <= 90:
        return 55.0
    if age <= 180:
        return 35.0
    return 15.0


def _secondary_kpi_payload(value: Any, label: str, description: str) -> dict[str, Any]:
    numeric = float(value) if value is not None else None
    return {
        "value": round(numeric, 2) if numeric is not None else None,
        "label": label,
        "status": _secondary_kpi_status(numeric),
        "description": description,
        "source_endpoint": "/api/v1/kpi/overview",
    }


def _secondary_kpi_status(value: float | None) -> str:
    if value is None:
        return "UNKNOWN"
    if value >= 80:
        return "OK"
    if value >= 50:
        return "SURVEILLANCE"
    return "CRITIQUE"


def _build_metadata(_: Session) -> dict[str, Any]:
    return _fallback_metadata()


def _stable_id(raw_value: str) -> str:
    return hashlib.sha1(raw_value.encode("utf-8")).hexdigest()[:12]


def _fallback_data_freshness() -> dict[str, Any]:
    return {
        "barrages": _freshness_payload(None, "Données barrages indisponibles."),
        "hydro": _freshness_payload(None, "Données hydro indisponibles."),
        "pluvio": _freshness_payload(None, "Données pluie indisponibles."),
        "quality_daily": _freshness_payload(None, "Réseau qualité quotidien indisponible."),
    }


def _fallback_hero(operational_date: str, data_freshness: dict[str, Any]) -> dict[str, Any]:
    return {
        "title": "WaterQual Sebou",
        "subtitle": "Système d'Aide à la Décision pour la Qualité des Eaux du Bassin du Sebou",
        "operational_date": operational_date,
        "summary_label": "État opérationnel du bassin",
        "cards": [
            {
                "id": "barrages_suivis",
                "label": "Barrages suivis",
                "value": 0,
                "unit": "ouvrages",
                "status": "UNKNOWN",
                "trend": "UNKNOWN",
                "description": "Barrages avec données journalières disponibles.",
                "color_hint": "blue",
                "icon": "dam",
                "freshness": data_freshness["barrages"],
            },
            {
                "id": "donnees_pluie_disponibles",
                "label": "Données pluie disponibles",
                "value": 0,
                "unit": "stations",
                "status": "UNKNOWN",
                "trend": "UNKNOWN",
                "description": "Stations avec pluie disponible ; typologie métier non encore consolidée.",
                "color_hint": "green",
                "icon": "rain",
                "freshness": data_freshness["pluvio"],
            },
            {
                "id": "stations_hydro_actives",
                "label": "Stations hydro actives",
                "value": 0,
                "unit": "stations",
                "status": "UNKNOWN",
                "trend": "UNKNOWN",
                "description": "Stations hydro présentes sur la dernière date utile.",
                "color_hint": "blue",
                "icon": "river",
                "freshness": data_freshness["hydro"],
            },
            {
                "id": "stations_sentinelles_qualite",
                "label": "Stations sentinelles qualité",
                "value": 0,
                "unit": "réseau",
                "status": "UNKNOWN",
                "trend": "UNKNOWN",
                "description": "Réseau qualité quotidien du Sebou.",
                "color_hint": "orange",
                "icon": "quality",
                "freshness": data_freshness["quality_daily"],
            },
        ],
    }


def _fallback_map() -> dict[str, Any]:
    return {
        "default_layers": DEFAULT_MAP_LAYERS,
        "secondary_layers": SECONDARY_MAP_LAYERS,
        "layers": {
            "barrages": {
                "label": "Barrages",
                "enabled": True,
                "count": 0,
                "symbology": {"shape": "marker", "color": "blue_dark", "size": "large"},
                "features_endpoint": "/api/v1/dashboard/map?layers=barrages",
            },
            "hydro": {
                "label": "Hydro",
                "enabled": True,
                "count": 0,
                "symbology": {"shape": "circle", "color": "blue", "size": "scaled_by_flow"},
                "features_endpoint": "/api/v1/dashboard/map?layers=hydro",
            },
            "pluvio": {
                "label": "Données pluie disponibles",
                "enabled": True,
                "count": 0,
                "symbology": {"shape": "drop", "color": "green", "size": "medium"},
                "features_endpoint": "/api/v1/dashboard/map?layers=pluvio",
            },
            "quality_daily": {
                "label": "Stations sentinelles qualité",
                "enabled": True,
                "count": 0,
                "symbology": {"shape": "hexagon", "color": "orange", "size": "medium"},
                "features_endpoint": "/api/v1/dashboard/map?layers=quality_daily",
            },
        },
    }


def _fallback_basin_status() -> dict[str, Any]:
    return {
        "hydrology": {
            "debit_moyen": None,
            "unit": "m3/s",
            "stations_hausse": 0,
            "stations_baisse": 0,
            "stations_stables": 0,
            "station_count": 0,
            "latest_date": None,
        },
        "rainfall": {
            "cumul_24h": None,
            "cumul_7j": None,
            "cumul_30j": None,
            "unit": "mm",
            "station_count": 0,
            "latest_date": None,
            "warning_typology_not_validated": True,
            "label": "Données pluie disponibles",
        },
        "quality": {
            "sentinel_station_count": 0,
            "conformes": 0,
            "surveillance": 0,
            "critiques": 0,
            "unknown": 0,
            "latest_date": None,
            "label": "Stations sentinelles qualité",
        },
        "barrages": {
            "barrage_count": 0,
            "apport_total": None,
            "lacher_total": None,
            "niveau_moyen": None,
            "unit_flow": "Mm3/j",
            "latest_date": None,
        },
    }


def _fallback_trends() -> dict[str, Any]:
    return {
        "hydro_30d": {"label": "Débit moyen 30 jours", "unit": "m3/s", "points": []},
        "rainfall_30d": {"label": "Précipitations 30 jours", "unit": "mm", "points": []},
        "barrage_apport_30d": {"label": "Apports barrages 30 jours", "unit": "Mm3", "points": []},
        "quality_30d": {"label": "Qualité sentinelle 30 jours", "unit": "score", "points": []},
    }


def _fallback_secondary_kpis() -> dict[str, Any]:
    return {
        "iqgb": _secondary_kpi_payload(None, "IQGB", "Indice Qualité Global Bassin."),
        "ifd": _secondary_kpi_payload(None, "IFD", "Indice Fraîcheur Données."),
        "icd": _secondary_kpi_payload(None, "ICD", "Indice Confiance Données."),
        "ich": _secondary_kpi_payload(None, "ICH", "Indice Confiance Hydraulique."),
        "ipp": _secondary_kpi_payload(None, "IPP", "Indice Pression Pollution MVP topologique."),
        "isr": _secondary_kpi_payload(None, "ISR", "Indice Sous-Bassin à Risque."),
    }


def _fallback_metadata() -> dict[str, Any]:
    return {
        "mode": "OPERATIONAL_HOME_V2",
        "scientific_warning": "Les prévisions hydrologiques avancées ne sont pas encore activées.",
        "temperature_rule": "AIR_TEMPERATURE != WATER_TEMPERATURE",
        "quality_scope": "6 stations sentinelles qualité",
        "rainfall_typology_status": "TO_CONSOLIDATE",
        "excluded_from_home": ["swat", "wasp", "legacy", "historical_campaigns"],
    }
