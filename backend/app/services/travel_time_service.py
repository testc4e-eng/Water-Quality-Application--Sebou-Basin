from __future__ import annotations

import csv
import json
import math
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from app.services.propagation.propagation_pollution_service import route_source_to_station_code

REFERENCE_ID = "TC_STATIONS_V1"
REFERENCE_VERSION = "1.0.0"
SOURCE_POINT_ID = "SEGMENT_POLLUTION_BASE"
SOURCE_POINT_LABEL = "Point source matrice NH4 - secteur amont de Dar Al Arsa"
REFERENCE_ORIGIN_CODE = "2263/15"
REFERENCE_ORIGIN_LABEL = "Dar Al Arsa"
P29_CODE = "1355/8"
GARDE_CODE = "3738/8"
SOURCE_OFFSET_STATUS = "NOT_QUANTIFIED"
AVERAGE_VELOCITY_KMH = 4.1890243902439028
GARDE_REFERENCE_DISTANCE_KM = 343.5
GARDE_REFERENCE_TRAVEL_TIME_H = 82.0
CASABLANCA_TZ = ZoneInfo("Africa/Casablanca")
RESOURCE_DIR = Path(__file__).resolve().parents[1] / "resources" / "travel_time"


@dataclass(frozen=True)
class TravelTimeReference:
    metadata: dict[str, Any]
    rows: list[dict[str, str]]


def _load_reference() -> TravelTimeReference:
    metadata_path = RESOURCE_DIR / "tc_stations_v1.metadata.json"
    csv_path = RESOURCE_DIR / "tc_stations_v1.csv"
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    return TravelTimeReference(metadata=metadata, rows=rows)


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


def _iso_utc(value: datetime) -> str:
    return _as_utc(value).isoformat().replace("+00:00", "Z")


def _iso_casablanca(value: datetime) -> str:
    return _as_utc(value).astimezone(CASABLANCA_TZ).isoformat()


def _alignment(topology_distance_km: float | None, reference_distance_km: float | None) -> tuple[str, float | None, float | None]:
    if topology_distance_km is None or reference_distance_km is None or reference_distance_km <= 0:
        return "NOT_CHECKED", None, None
    difference = abs(float(topology_distance_km) - float(reference_distance_km))
    percent = difference / float(reference_distance_km) * 100.0
    if percent <= 10.0:
        status = "ALIGNED"
    elif percent <= 25.0:
        status = "PARTIALLY_ALIGNED"
    else:
        status = "NOT_ALIGNED"
    return status, round(difference, 3), round(percent, 2)


def _target_result(
    *,
    route: dict[str, Any],
    target_code: str,
    reference_time: datetime,
    reference_distance_km: float | None,
    reference_travel_time_h: float | None,
    method_used: str,
    confidence_level: str,
) -> dict[str, Any]:
    target = route.get("target") or {}
    topology_distance_km = route.get("distance_km")
    if reference_travel_time_h is not None:
        travel_time_h = reference_travel_time_h
    elif topology_distance_km is not None:
        travel_time_h = round(float(topology_distance_km) / AVERAGE_VELOCITY_KMH, 2)
    else:
        travel_time_h = None

    estimated_arrival_at = (
        _as_utc(reference_time) + timedelta(hours=float(travel_time_h))
        if travel_time_h is not None
        else None
    )
    alignment_status, diff_km, diff_pct = _alignment(topology_distance_km, reference_distance_km)
    warnings = list(route.get("warnings") or [])
    if target_code == P29_CODE:
        warnings.append("Temps P29 estime par vitesse moyenne du corridor, sans Tc direct Dar Al Arsa -> P29.")

    return {
        "target_station_code": target.get("target_station_code") or target_code,
        "target_station_label": target.get("target_station_name"),
        "target_legacy_station_id": target.get("target_legacy_station_id"),
        "target_station_id": target.get("target_station_id"),
        "reference_distance_km": reference_distance_km,
        "topology_distance_km": topology_distance_km,
        "distance_difference_km": diff_km,
        "distance_difference_percent": diff_pct,
        "distance_alignment_status": alignment_status,
        "velocity_kmh": round(AVERAGE_VELOCITY_KMH, 3),
        "reference_travel_time_h": reference_travel_time_h,
        "travel_time_h": travel_time_h,
        "estimated_arrival_at": _iso_utc(estimated_arrival_at) if estimated_arrival_at else None,
        "estimated_arrival_at_local": _iso_casablanca(estimated_arrival_at) if estimated_arrival_at else None,
        "method_used": method_used,
        "confidence_level": confidence_level,
        "source_node": route.get("source_node"),
        "target_node": route.get("target_node"),
        "edge_count": route.get("edge_count"),
        "warnings": warnings,
    }


def evaluate_travel_time(
    *,
    point_declaration: dict[str, Any],
    detected_at: datetime | None,
    declaration_detected_at: datetime | None,
    analysis_started_at: datetime,
) -> dict[str, Any]:
    reference = _load_reference()
    if detected_at is not None:
        reference_time = _as_utc(detected_at)
        reference_time_source = "USER_PROVIDED_TIME"
    elif declaration_detected_at is not None:
        reference_time = _as_utc(declaration_detected_at)
        reference_time_source = "DETECTION_TIME"
    else:
        reference_time = _as_utc(analysis_started_at)
        reference_time_source = "ANALYSIS_START_TIME"

    lon, lat = point_declaration["coordinates"]
    p29_route = route_source_to_station_code(
        longitude=float(lon),
        latitude=float(lat),
        target_station_code=P29_CODE,
    )
    garde_route = route_source_to_station_code(
        longitude=float(lon),
        latitude=float(lat),
        target_station_code=GARDE_CODE,
    )

    targets = [
        _target_result(
            route=p29_route,
            target_code=P29_CODE,
            reference_time=reference_time,
            reference_distance_km=None,
            reference_travel_time_h=None,
            method_used="AVERAGE_VELOCITY_FALLBACK",
            confidence_level="LOW",
        ),
        _target_result(
            route=garde_route,
            target_code=GARDE_CODE,
            reference_time=reference_time,
            reference_distance_km=GARDE_REFERENCE_DISTANCE_KM,
            reference_travel_time_h=GARDE_REFERENCE_TRAVEL_TIME_H,
            method_used="TC_OBSERVED_DIRECT",
            confidence_level="MEDIUM",
        ),
    ]
    warnings = [
        "Le point source exact en amont de Dar Al Arsa reste a quantifier.",
        "Les temps de transfert sont des estimations issues du referentiel Tc Stations v1.",
    ]
    for target in targets:
        warnings.extend(target.get("warnings") or [])

    return {
        "reference_id": REFERENCE_ID,
        "reference_version": reference.metadata.get("reference_version", REFERENCE_VERSION),
        "source_point_id": SOURCE_POINT_ID,
        "source_point_label": SOURCE_POINT_LABEL,
        "reference_origin_code": REFERENCE_ORIGIN_CODE,
        "reference_origin_label": REFERENCE_ORIGIN_LABEL,
        "source_offset_status": SOURCE_OFFSET_STATUS,
        "reference_time": _iso_utc(reference_time),
        "reference_time_local": _iso_casablanca(reference_time),
        "reference_time_source": reference_time_source,
        "timezone": "Africa/Casablanca",
        "targets": targets,
        "scientific_limitations": reference.metadata.get("limitations") or warnings,
        "warnings": list(dict.fromkeys(warnings)),
    }
