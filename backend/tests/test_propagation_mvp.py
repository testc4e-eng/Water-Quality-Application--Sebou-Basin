from fastapi.testclient import TestClient

from app.main import app
from app.services.propagation import propagation_pollution_service


client = TestClient(app)


def _payload(input_mode: str) -> dict:
    return {
        "status": "success",
        "source": {
            "source_type": "pollution_site" if input_mode != "coordinates" else "coordinates",
            "source_id": "demo-source",
            "input_mode": input_mode,
        },
        "snap": {
            "edge_id": 123,
            "start_node": 456,
            "distance_to_network_m": 32.4,
            "snap_confidence": "HIGH",
        },
        "propagation": {
            "target_type": "garde",
            "reachable_nodes": 193,
            "reachable_edges": 210,
            "distance_to_garde_km": 123.45,
            "transfer_time_hours": 12.34,
            "transfer_time_label": "+12h20m",
            "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
        },
        "path_geojson": {
            "type": "FeatureCollection",
            "features": [],
        },
        "metadata": {
            "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
            "scientific_mode": False,
            "warning": "Temps indicatif non scientifique",
        },
    }


def _snap_payload(input_mode: str) -> dict:
    return {
        "status": "success",
        "source": {
            "source_type": "pollution_site" if input_mode != "coordinates" else "coordinates",
            "source_id": "demo-source",
            "input_mode": input_mode,
        },
        "snap": {
            "edge_id": 123,
            "start_node": 456,
            "distance_to_network_m": 32.4,
            "snap_confidence": "HIGH",
            "network_component": 1,
        },
        "metadata": {
            "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
            "scientific_mode": False,
            "warning": "Temps indicatif non scientifique",
        },
    }


def _stations_payload(input_mode: str) -> dict:
    return {
        "status": "success",
        "source": {
            "source_type": "pollution_site" if input_mode != "coordinates" else "coordinates",
            "source_id": "demo-source",
            "input_mode": input_mode,
        },
        "snap": {
            "edge_id": 123,
            "start_node": 456,
            "distance_to_network_m": 32.4,
            "snap_confidence": "HIGH",
            "network_component": 1,
        },
        "propagation": {
            "target_type": "stations",
            "reachable_nodes": 193,
            "reachable_edges": 210,
            "targets_total_considered": 41,
            "targets_returned": 1,
        },
        "targets": [
            {
                "station_id": "station-1",
                "legacy_station_id": 123,
                "station_name": "Station Demo",
                "station_type": "hydrologique",
                "target_node": 789,
                "target_snap_distance_m": 45.6,
                "target_snap_confidence": "HIGH",
                "reachable": True,
                "distance_to_source_km": 12.34,
                "transfer_time_hours": 1.23,
                "transfer_time_label": "+1h14m",
            }
        ],
        "metadata": {
            "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
            "targets_source": "api.v_station_dimension",
            "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
            "scientific_mode": False,
            "warning": "Temps indicatif non scientifique",
        },
    }


def _barrages_payload(input_mode: str) -> dict:
    return {
        "status": "success",
        "source": {
            "source_type": "pollution_site" if input_mode != "coordinates" else "coordinates",
            "source_id": "demo-source",
            "input_mode": input_mode,
        },
        "snap": {
            "edge_id": 123,
            "start_node": 456,
            "distance_to_network_m": 32.4,
            "snap_confidence": "HIGH",
            "network_component": 1,
        },
        "propagation": {
            "target_type": "barrages",
            "reachable_nodes": 193,
            "reachable_edges": 210,
            "targets_total_considered": 11,
            "targets_returned": 1,
        },
        "targets": [
            {
                "barrage_id": "barrage-1",
                "legacy_barrage_id": 8,
                "barrage_name": "Barrage Demo",
                "target_node": 654,
                "target_snap_distance_m": 120.0,
                "target_snap_confidence": "MEDIUM",
                "reachable": True,
                "distance_to_source_km": 45.67,
                "transfer_time_hours": 4.57,
                "transfer_time_label": "+4h34m",
                "includes_garde": False,
            }
        ],
        "metadata": {
            "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
            "targets_source": "api.v_barrage_dimension",
            "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
            "scientific_mode": False,
            "warning": "Temps indicatif non scientifique",
        },
    }


def _exutoires_payload(input_mode: str) -> dict:
    return {
        "status": "success",
        "source": {
            "source_type": "pollution_site" if input_mode != "coordinates" else "coordinates",
            "source_id": "demo-source",
            "input_mode": input_mode,
        },
        "snap": {
            "edge_id": 123,
            "start_node": 456,
            "distance_to_network_m": 32.4,
            "snap_confidence": "HIGH",
            "network_component": 1,
        },
        "propagation": {
            "target_type": "exutoires",
            "reachable_nodes": 193,
            "reachable_edges": 210,
            "targets_total_considered": 19,
            "targets_returned": 1,
        },
        "targets": [
            {
                "node_id": 464,
                "node_type": "exutoire",
                "component_id": 5,
                "reachable": True,
                "distance_to_source_km": 210.5,
                "transfer_time_hours": 21.05,
                "transfer_time_label": "+21h03m",
            }
        ],
        "metadata": {
            "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
            "targets_source": "geo_work.reseau_hydro_nodes_final_candidate_20260602",
            "exutoire_rule": "eout=0 AND ein>=1",
            "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
            "scientific_mode": False,
            "warning": "Temps indicatif non scientifique",
        },
    }


def test_source_to_garde_rejects_no_input():
    response = client.get("/api/v1/propagation/source-to-garde")
    assert response.status_code == 400
    assert "exactement un mode d'entrée" in response.json()["detail"]


def test_source_to_garde_rejects_multiple_inputs():
    response = client.get(
        "/api/v1/propagation/source-to-garde",
        params={"site_id": "abc", "prelevement_id": "def"},
    )
    assert response.status_code == 400
    assert "Un seul mode d'entrée" in response.json()["detail"]


def test_source_to_garde_accepts_coordinates(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_source_to_garde",
        lambda **_: _payload("coordinates"),
    )
    response = client.get(
        "/api/v1/propagation/source-to-garde",
        params={"lng": -5.0, "lat": 34.0},
    )
    payload = response.json()
    assert response.status_code == 200
    assert payload["source"]["input_mode"] == "coordinates"
    assert payload["snap"]["snap_confidence"] == "HIGH"
    assert payload["metadata"]["scientific_mode"] is False


def test_source_to_garde_accepts_site_id(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_source_to_garde",
        lambda **_: _payload("site_id"),
    )
    response = client.get(
        "/api/v1/propagation/source-to-garde",
        params={"site_id": "site-123"},
    )
    payload = response.json()
    assert response.status_code == 200
    assert payload["source"]["input_mode"] == "site_id"
    assert "snap_confidence" in payload["snap"]


def test_source_to_garde_accepts_prelevement_id(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_source_to_garde",
        lambda **_: _payload("prelevement_id"),
    )
    response = client.get(
        "/api/v1/propagation/source-to-garde",
        params={"prelevement_id": "prel-123"},
    )
    payload = response.json()
    assert response.status_code == 200
    assert payload["source"]["input_mode"] == "prelevement_id"
    assert payload["metadata"]["scientific_mode"] is False


def test_snap_diagnostic_rejects_no_input():
    response = client.get("/api/v1/propagation/snap-diagnostic")
    assert response.status_code == 400
    assert "exactement un mode d'entrée" in response.json()["detail"]


def test_snap_diagnostic_rejects_multiple_inputs():
    response = client.get(
        "/api/v1/propagation/snap-diagnostic",
        params={"site_id": "abc", "prelevement_id": "def"},
    )
    assert response.status_code == 400
    assert "Un seul mode d'entrée" in response.json()["detail"]


def test_snap_diagnostic_accepts_coordinates(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "snap_diagnostic",
        lambda **_: _snap_payload("coordinates"),
    )
    response = client.get(
        "/api/v1/propagation/snap-diagnostic",
        params={"lng": -5.0, "lat": 34.0},
    )
    payload = response.json()
    assert response.status_code == 200
    assert payload["source"]["input_mode"] == "coordinates"
    assert payload["snap"]["snap_confidence"] == "HIGH"
    assert payload["snap"]["network_component"] == 1
    assert payload["metadata"]["scientific_mode"] is False


def test_source_to_stations_rejects_no_input():
    response = client.get("/api/v1/propagation/source-to-stations")
    assert response.status_code == 400
    assert "exactement un mode d'entrée" in response.json()["detail"]


def test_source_to_stations_rejects_multiple_inputs():
    response = client.get(
        "/api/v1/propagation/source-to-stations",
        params={"site_id": "abc", "prelevement_id": "def"},
    )
    assert response.status_code == 400
    assert "Un seul mode d'entrée" in response.json()["detail"]


def test_source_to_stations_accepts_coordinates(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_to_stations",
        lambda **_: _stations_payload("coordinates"),
    )
    response = client.get(
        "/api/v1/propagation/source-to-stations",
        params={"lng": -5.0, "lat": 34.0},
    )
    payload = response.json()
    assert response.status_code == 200
    assert payload["source"]["input_mode"] == "coordinates"
    assert "targets" in payload
    if payload["targets"]:
        assert "target_snap_confidence" in payload["targets"][0]
    assert payload["metadata"]["scientific_mode"] is False


def test_source_to_barrages_rejects_no_input():
    response = client.get("/api/v1/propagation/source-to-barrages")
    assert response.status_code == 400
    assert "exactement un mode d'entrée" in response.json()["detail"]


def test_source_to_barrages_rejects_multiple_inputs():
    response = client.get(
        "/api/v1/propagation/source-to-barrages",
        params={"site_id": "abc", "prelevement_id": "def"},
    )
    assert response.status_code == 400
    assert "Un seul mode d'entrée" in response.json()["detail"]


def test_source_to_barrages_accepts_coordinates(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_to_barrages",
        lambda **_: _barrages_payload("coordinates"),
    )
    response = client.get(
        "/api/v1/propagation/source-to-barrages",
        params={"lng": -5.0, "lat": 34.0},
    )
    payload = response.json()
    assert response.status_code == 200
    assert payload["source"]["input_mode"] == "coordinates"
    assert "targets" in payload
    if payload["targets"]:
        assert "target_snap_confidence" in payload["targets"][0]
        assert payload["targets"][0]["includes_garde"] is False
    assert payload["metadata"]["scientific_mode"] is False


def test_source_to_exutoires_rejects_no_input():
    response = client.get("/api/v1/propagation/source-to-exutoires")
    assert response.status_code == 400
    assert "exactement un mode d'entrée" in response.json()["detail"]


def test_source_to_exutoires_rejects_multiple_inputs():
    response = client.get(
        "/api/v1/propagation/source-to-exutoires",
        params={"site_id": "abc", "prelevement_id": "def"},
    )
    assert response.status_code == 400
    assert "Un seul mode d'entrée" in response.json()["detail"]


def test_source_to_exutoires_accepts_coordinates(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_to_exutoires",
        lambda **_: _exutoires_payload("coordinates"),
    )
    response = client.get(
        "/api/v1/propagation/source-to-exutoires",
        params={"lng": -5.0, "lat": 34.0},
    )
    payload = response.json()
    assert response.status_code == 200
    assert payload["source"]["input_mode"] == "coordinates"
    assert "targets" in payload
    assert payload["metadata"]["scientific_mode"] is False
