from __future__ import annotations

from datetime import UTC, datetime

from app.services import travel_time_service


POINT = {"type": "Point", "coordinates": [-4.908418523493339, 34.16528818110318]}


def _route_payload(code: str) -> dict:
    if code == "1355/8":
        return {
            "status": "success",
            "target": {
                "target_station_code": "1355/8",
                "target_station_id": "station-p29",
                "target_legacy_station_id": 341,
                "target_station_name": "P29 a allal tazi",
            },
            "distance_km": 328.078,
            "source_node": 547,
            "target_node": 464,
            "edge_count": 63,
            "warnings": [],
        }
    if code == "3738/8":
        return {
            "status": "success",
            "target": {
                "target_station_code": "3738/8",
                "target_station_id": "station-garde",
                "target_legacy_station_id": 94,
                "target_station_name": "amont barrage de garde",
            },
            "distance_km": 341.717,
            "source_node": 547,
            "target_node": 98,
            "edge_count": 66,
            "warnings": [],
        }
    raise AssertionError(f"Unexpected target code {code}")


def test_travel_time_uses_explicit_station_codes_and_excludes_legacy_52(monkeypatch):
    requested_codes: list[str] = []

    def fake_route(*, longitude: float, latitude: float, target_station_code: str) -> dict:
        requested_codes.append(target_station_code)
        return _route_payload(target_station_code)

    monkeypatch.setattr(travel_time_service, "route_source_to_station_code", fake_route)

    result = travel_time_service.evaluate_travel_time(
        point_declaration=POINT,
        detected_at=datetime(2026, 7, 15, 10, 0, tzinfo=UTC),
        declaration_detected_at=None,
        analysis_started_at=datetime(2026, 7, 15, 11, 0, tzinfo=UTC),
    )

    assert requested_codes == ["1355/8", "3738/8"]
    legacy_ids = {target["target_legacy_station_id"] for target in result["targets"]}
    assert 341 in legacy_ids
    assert 94 in legacy_ids
    assert 52 not in legacy_ids


def test_travel_time_values_for_garde_and_p29(monkeypatch):
    monkeypatch.setattr(
        travel_time_service,
        "route_source_to_station_code",
        lambda **kwargs: _route_payload(kwargs["target_station_code"]),
    )

    result = travel_time_service.evaluate_travel_time(
        point_declaration=POINT,
        detected_at=datetime(2026, 7, 15, 10, 0, tzinfo=UTC),
        declaration_detected_at=None,
        analysis_started_at=datetime(2026, 7, 15, 11, 0, tzinfo=UTC),
    )
    by_code = {target["target_station_code"]: target for target in result["targets"]}

    assert by_code["3738/8"]["travel_time_h"] == 82.0
    assert by_code["3738/8"]["method_used"] == "TC_OBSERVED_DIRECT"
    assert by_code["3738/8"]["confidence_level"] == "MEDIUM"
    assert by_code["3738/8"]["distance_alignment_status"] == "ALIGNED"
    assert by_code["1355/8"]["travel_time_h"] == 78.32
    assert by_code["1355/8"]["method_used"] == "AVERAGE_VELOCITY_FALLBACK"
    assert by_code["1355/8"]["confidence_level"] == "LOW"


def test_detected_at_has_priority_over_analysis_started_at(monkeypatch):
    monkeypatch.setattr(
        travel_time_service,
        "route_source_to_station_code",
        lambda **kwargs: _route_payload(kwargs["target_station_code"]),
    )

    result = travel_time_service.evaluate_travel_time(
        point_declaration=POINT,
        detected_at=datetime(2026, 7, 15, 8, 30, tzinfo=UTC),
        declaration_detected_at=datetime(2026, 7, 15, 9, 30, tzinfo=UTC),
        analysis_started_at=datetime(2026, 7, 15, 10, 30, tzinfo=UTC),
    )

    assert result["reference_time_source"] == "USER_PROVIDED_TIME"
    assert result["reference_time"] == "2026-07-15T08:30:00Z"
    garde = next(target for target in result["targets"] if target["target_station_code"] == "3738/8")
    assert garde["estimated_arrival_at"] == "2026-07-18T18:30:00Z"
