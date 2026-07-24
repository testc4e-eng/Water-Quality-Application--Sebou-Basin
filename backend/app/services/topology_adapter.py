from __future__ import annotations

import math
import re
import unicodedata
from copy import deepcopy
from typing import Any

SAT_ALIASES = {
    "sidi allal tazi",
    "p29 a allal tazi",
    "allal tazi",
}


def normalize_station_name(value: str | None) -> str:
    normalized = unicodedata.normalize("NFKD", value or "")
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    lowered = ascii_value.lower()
    cleaned = re.sub(r"[^a-z0-9]+", " ", lowered)
    return re.sub(r"\s+", " ", cleaned).strip()


def is_sidi_allal_tazi_station(name: str | None) -> bool:
    normalized = normalize_station_name(name)
    if not normalized:
        return False
    return any(alias in normalized for alias in SAT_ALIASES)


def _extract_path_features(path_geojson: dict[str, Any] | None) -> list[dict[str, Any]]:
    if not isinstance(path_geojson, dict):
        return []
    features = path_geojson.get("features")
    if not isinstance(features, list):
        return []
    return [feature for feature in features if isinstance(feature, dict)]


def _is_numeric(value: Any) -> bool:
    if isinstance(value, bool):
        return False
    if isinstance(value, (int, float)):
        return math.isfinite(float(value))
    try:
        return math.isfinite(float(value))
    except (TypeError, ValueError):
        return False


def _same_coordinate(left: Any, right: Any, tolerance: float = 1e-7) -> bool:
    if not isinstance(left, list) or not isinstance(right, list) or len(left) < 2 or len(right) < 2:
        return False
    try:
        return abs(float(left[0]) - float(right[0])) <= tolerance and abs(float(left[1]) - float(right[1])) <= tolerance
    except (TypeError, ValueError):
        return False


def ensure_path_starts_at_point(path_geojson: dict[str, Any], start_point: list[float]) -> dict[str, Any]:
    """Normalize the returned path so the visual trace starts at the official snapped source point."""
    normalized = deepcopy(path_geojson)
    features = _extract_path_features(normalized)
    if not features:
        return normalized

    first_geometry = features[0].get("geometry") or {}
    coordinates = first_geometry.get("coordinates")
    if first_geometry.get("type") != "LineString" or not isinstance(coordinates, list) or not coordinates:
        return normalized

    if not _same_coordinate(coordinates[0], start_point):
        coordinates.insert(0, start_point)

    return normalized


def infer_garde_reached(garde_payload: dict[str, Any]) -> bool:
    propagation = garde_payload.get("propagation") or {}
    if propagation.get("reached") is True:
        return True

    status = str(garde_payload.get("status") or "").strip().lower()
    distance_to_garde_km = propagation.get("distance_to_garde_km")
    if status == "success" and _is_numeric(distance_to_garde_km) and float(distance_to_garde_km) >= 0:
        return True

    if _extract_path_features(garde_payload.get("path_geojson")):
        return True

    target_candidates = [
        garde_payload.get("target"),
        garde_payload.get("target_name"),
        garde_payload.get("target_label"),
        propagation.get("target_type"),
        propagation.get("target_name"),
        propagation.get("target_label"),
    ]
    return any("garde" in normalize_station_name(value) for value in target_candidates if value)



def adapt_topology_result(
    *,
    point_declaration: dict[str, Any],
    garde_payload: dict[str, Any],
    stations_payload: dict[str, Any],
) -> dict[str, Any]:
    snap = garde_payload.get("snap") or {}
    propagation = garde_payload.get("propagation") or {}
    path_geojson = garde_payload.get("path_geojson") or {"type": "FeatureCollection", "features": []}
    detected_stations = stations_payload.get("targets") or []
    metadata_warning = (garde_payload.get("metadata") or {}).get("warning")
    distance_to_network_m = float(snap.get("distance_to_network_m") or 0.0)
    barrage_garde_atteint = infer_garde_reached(garde_payload)
    sidi_allal_tazi_detectee = any(
        is_sidi_allal_tazi_station(item.get("station_name")) for item in detected_stations if isinstance(item, dict)
    )

    warnings: list[str] = []
    if metadata_warning:
        warnings.append(str(metadata_warning))

    lon, lat = point_declaration.get("coordinates", [None, None])
    snapped_coordinates = [
        float(snap.get("snap_lon", lon)),
        float(snap.get("snap_lat", lat)),
    ]
    path_geojson = ensure_path_starts_at_point(path_geojson, snapped_coordinates)
    path_features = _extract_path_features(path_geojson)
    return {
        "snapped_point": {
            "type": "Point",
            "coordinates": snapped_coordinates,
        },
        "snap_distance_m": round(distance_to_network_m, 2),
        "parcours_geojson": path_geojson,
        "parcours_features_count": len(path_features),
        "longueur_km": propagation.get("distance_to_garde_km"),
        "stations_detectees": detected_stations,
        "sidi_allal_tazi_detectee": sidi_allal_tazi_detectee,
        "barrage_garde_atteint": barrage_garde_atteint,
        "exutoire_atteint": barrage_garde_atteint,
        "affluents_detectes": ["Sebou", "Innaouen", "Ouergha"],
        "diagnostic_messages": [
            f"Snap confidence: {snap.get('snap_confidence', 'UNKNOWN')}",
            f"Distance vers Garde: {propagation.get('distance_to_garde_km', 'N/A')} km",
            f"Path features: {len(path_features)}",
        ],
        "confidence_level": snap.get("snap_confidence", "UNKNOWN"),
        "warnings": warnings,
    }
