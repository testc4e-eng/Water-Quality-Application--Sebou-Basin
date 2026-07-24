from __future__ import annotations

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.v1.pollution_declarations import router as declarations_router
from app.services.declaration_pollution_service import (
    DeclarationServiceError,
    declaration_pollution_service,
)
from app.services.propagation import propagation_pollution_service
from app.services.topology_adapter import adapt_topology_result, infer_garde_reached, is_sidi_allal_tazi_station


api_test_app = FastAPI()
api_test_app.include_router(declarations_router, prefix="/api/v1")
client = TestClient(api_test_app)


def _create_payload() -> dict:
    return {
        "date_declaration": "2026-07-09T10:00:00Z",
        "point_declaration": {
            "type": "Point",
            "coordinates": [-5.102, 34.221],
        },
        "polluant": "NH4",
        "Crejet_mg_L": 250.0,
        "QRejet_m3_s": 0.277777778,
        "QSebou_m3_s": 7.5,
        "QInnaouen_m3_s": 10.0,
        "QOuergha_m3_s": 10.0,
        "commentaire": "Cas nominal de test",
    }


def _topology_result() -> dict:
    return {
        "snapped_point": {"type": "Point", "coordinates": [-5.1015, 34.2205]},
        "snap_distance_m": 42.0,
        "parcours_geojson": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [[-5.102, 34.221], [-5.09, 34.25]],
                    },
                    "properties": {"edge_id": 1},
                }
            ],
        },
        "longueur_km": 12.5,
        "stations_detectees": [
            {"station_id": "sat-1", "station_name": "Sidi Allal Tazi", "reachable": True},
            {"station_id": "garde-1", "station_name": "Barrage de Garde", "reachable": True},
        ],
        "sidi_allal_tazi_detectee": True,
        "barrage_garde_atteint": True,
        "exutoire_atteint": True,
        "affluents_detectes": ["Sebou", "Innaouen", "Ouergha"],
        "diagnostic_messages": ["topology ok"],
        "confidence_level": "HIGH",
        "warnings": [],
    }


def _travel_time_result() -> dict:
    return {
        "reference_id": "TC_STATIONS_V1",
        "reference_version": "1.0.0",
        "reference_time": "2026-07-09T10:00:00Z",
        "reference_time_source": "DETECTION_TIME",
        "targets": [
            {
                "target_station_code": "1355/8",
                "target_legacy_station_id": 341,
                "target_station_label": "P29 a allal tazi",
                "topology_distance_km": 328.078,
                "travel_time_h": 78.32,
                "method_used": "AVERAGE_VELOCITY_FALLBACK",
                "confidence_level": "LOW",
                "estimated_arrival_at": "2026-07-12T16:19:12Z",
                "warnings": [],
            },
            {
                "target_station_code": "3738/8",
                "target_legacy_station_id": 94,
                "target_station_label": "amont barrage de garde",
                "reference_distance_km": 343.5,
                "topology_distance_km": 341.717,
                "travel_time_h": 82.0,
                "method_used": "TC_OBSERVED_DIRECT",
                "confidence_level": "MEDIUM",
                "estimated_arrival_at": "2026-07-12T20:00:00Z",
                "warnings": [],
            },
        ],
        "warnings": ["Temps de transfert estimatif."],
        "scientific_limitations": [],
    }


def _garde_payload(*, reached=None, distance=5.58, features=None, target_type="garde") -> dict:
    return {
        "status": "success",
        "source": {
            "source_type": "coordinates",
            "source_id": "demo-source",
            "input_mode": "coordinates",
        },
        "snap": {
            "edge_id": 123,
            "start_node": 456,
            "distance_to_network_m": 32.4,
            "snap_confidence": "HIGH",
        },
        "propagation": {
            "target_type": target_type,
            "reachable_nodes": 193,
            "reachable_edges": 210,
            "distance_to_garde_km": distance,
            "transfer_time_hours": 0.56,
            "transfer_time_label": "+0h34m",
            "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
            **({"reached": reached} if reached is not None else {}),
        },
        "path_geojson": {
            "type": "FeatureCollection",
            "features": features if features is not None else [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [[-6.30, 34.51], [-6.29, 34.50]],
                    },
                    "properties": {},
                }
            ],
        },
        "metadata": {
            "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
            "scientific_mode": False,
            "warning": "Temps indicatif non scientifique",
        },
    }


def _stations_payload(name: str = "P29 a allal tazi") -> dict:
    return {
        "status": "success",
        "source": {
            "source_type": "coordinates",
            "source_id": "demo-source",
            "input_mode": "coordinates",
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
                "station_name": name,
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


def setup_function() -> None:
    declaration_pollution_service._store.clear()


def test_create_and_submit_declaration():
    create_response = client.post("/api/v1/pollution/declarations", json=_create_payload())
    assert create_response.status_code == 200
    created = create_response.json()
    assert created["status"] == "BROUILLON"

    submit_response = client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/submit",
        json={"reason": "Pret pour analyse"},
    )
    assert submit_response.status_code == 200
    submitted = submit_response.json()
    assert submitted["status"] == "PRET_A_ANALYSER"
    assert len(submitted["transitions"]) >= 2


def test_garde_reached_accepts_distance_and_path_without_reached():
    assert infer_garde_reached(_garde_payload(reached=None, distance=5.58)) is True


def test_sat_alias_recognizes_p29_allal_tazi():
    assert is_sidi_allal_tazi_station("P29 a allal tazi") is True
    assert is_sidi_allal_tazi_station("Sidi-Allal-Tazi") is True
    assert is_sidi_allal_tazi_station("ALLAL TAZI") is True


def test_garde_reached_false_for_empty_geojson_without_alternative_proof():
    payload = _garde_payload(reached=None, distance=None, features=[], target_type="station")
    assert infer_garde_reached(payload) is False


def test_adapted_topology_path_starts_at_snapped_source_point():
    point = {"type": "Point", "coordinates": [-4.908418523493339, 34.16528818110318]}
    topology = adapt_topology_result(
        point_declaration=point,
        garde_payload=_garde_payload(reached=None, distance=328.08),
        stations_payload=_stations_payload("P29 a allal tazi"),
    )

    first_coordinate = topology["parcours_geojson"]["features"][0]["geometry"]["coordinates"][0]
    assert first_coordinate == point["coordinates"]


def test_evaluate_declaration_returns_snapshot_and_recommendations(monkeypatch):
    monkeypatch.setattr(declaration_pollution_service, "_evaluate_topology", lambda _: _topology_result())
    monkeypatch.setattr(declaration_pollution_service, "_evaluate_travel_time", lambda **_: _travel_time_result())
    created = client.post("/api/v1/pollution/declarations", json=_create_payload()).json()
    client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/submit",
        json={"reason": "Pret pour analyse"},
    )

    evaluate_response = client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/evaluate",
        json={"use_saved_values": True},
    )
    assert evaluate_response.status_code == 200
    payload = evaluate_response.json()
    assert payload["snapshot_id"].startswith("snap_")
    assert payload["status"] == "RECOMMANDATION_PROPOSEE"
    assert payload["matrix_result"]["matrix_version"] == "1.0.0"
    assert payload["matrix_result"]["method_used"] == "EXACT_MATCH"
    assert payload["recommendations"]
    assert payload["travel_time_result"]["reference_id"] == "TC_STATIONS_V1"
    assert {target["target_station_code"] for target in payload["travel_time_result"]["targets"]} == {"1355/8", "3738/8"}
    assert payload["decision_reasoning"]["human_validation_required"] is True

    report_response = client.get(f"/api/v1/pollution/declarations/{created['declaration_id']}/report")
    assert report_response.status_code == 200
    report = report_response.json()
    assert report["report_payload"]["travel_time_result"]["reference_id"] == "TC_STATIONS_V1"


def test_evaluate_declaration_accepts_realistic_topology_contract(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_source_to_garde",
        lambda **_: _garde_payload(reached=None, distance=5.58),
    )
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_to_stations",
        lambda **_: _stations_payload("P29 a allal tazi"),
    )
    created = client.post("/api/v1/pollution/declarations", json=_create_payload()).json()
    client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/submit",
        json={"reason": "Pret pour analyse"},
    )

    response = client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/evaluate",
        json={"use_saved_values": True},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["errors"] == []
    assert payload["snapshot_id"].startswith("snap_")
    assert payload["topology_result"]["barrage_garde_atteint"] is True
    assert payload["topology_result"]["sidi_allal_tazi_detectee"] is True
    assert payload["topology_result"]["parcours_geojson"]["features"]
    assert payload["report_available"] is True


def test_evaluate_declaration_keeps_success_when_travel_time_unavailable(monkeypatch):
    monkeypatch.setattr(declaration_pollution_service, "_evaluate_topology", lambda _: _topology_result())
    monkeypatch.setattr(
        declaration_pollution_service,
        "_evaluate_travel_time",
        lambda **_: {
            "reference_id": "TC_STATIONS_V1",
            "reference_version": "1.0.0",
            "status": "UNAVAILABLE",
            "targets": [],
            "warnings": ["Temps de transfert indisponible pour cette analyse."],
            "scientific_limitations": ["Le calcul de temps de transfert est non bloquant pour Matrix V1."],
        },
    )
    created = client.post("/api/v1/pollution/declarations", json=_create_payload()).json()
    client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/submit",
        json={"reason": "Pret pour analyse"},
    )

    response = client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/evaluate",
        json={"use_saved_values": True},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["travel_time_result"]["status"] == "UNAVAILABLE"
    assert "Temps de transfert indisponible pour cette analyse." in payload["warnings"]
    assert payload["snapshot_id"].startswith("snap_")


def test_evaluate_declaration_surfaces_topology_error(monkeypatch):
    def _raise(_: dict) -> dict:
        raise DeclarationServiceError(
            code="TOPOLOGY_GARDE_NOT_REACHED",
            message="Le parcours n'atteint pas le Barrage de Garde dans le perimetre MVP.",
            http_status=422,
            workflow_status="ERREUR_ANALYSE",
            user_action="Verifier le point ou sortir du prototype MVP.",
        )

    monkeypatch.setattr(declaration_pollution_service, "_evaluate_topology", _raise)
    created = client.post("/api/v1/pollution/declarations", json=_create_payload()).json()
    client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/submit",
        json={"reason": "Pret pour analyse"},
    )

    response = client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/evaluate",
        json={"use_saved_values": True},
    )
    assert response.status_code == 422
    error = response.json()
    assert error["code"] == "TOPOLOGY_GARDE_NOT_REACHED"
    detail = client.get(f"/api/v1/pollution/declarations/{created['declaration_id']}").json()
    assert detail["status"] == "ERREUR_ANALYSE"


def test_evaluate_declaration_keeps_path_not_found_for_empty_topology(monkeypatch):
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_source_to_garde",
        lambda **_: _garde_payload(reached=None, distance=None, features=[], target_type="station"),
    )
    monkeypatch.setattr(
        propagation_pollution_service,
        "propagate_to_stations",
        lambda **_: _stations_payload("Station Demo"),
    )
    created = client.post("/api/v1/pollution/declarations", json=_create_payload()).json()
    client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/submit",
        json={"reason": "Pret pour analyse"},
    )

    response = client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/evaluate",
        json={"use_saved_values": True},
    )
    assert response.status_code == 422
    assert response.json()["code"] == "TOPOLOGY_PATH_NOT_FOUND"


def test_report_available_after_evaluate(monkeypatch):
    monkeypatch.setattr(declaration_pollution_service, "_evaluate_topology", lambda _: _topology_result())
    created = client.post("/api/v1/pollution/declarations", json=_create_payload()).json()
    client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/submit",
        json={"reason": "Pret pour analyse"},
    )
    client.post(
        f"/api/v1/pollution/declarations/{created['declaration_id']}/evaluate",
        json={"use_saved_values": True},
    )

    report_response = client.get(f"/api/v1/pollution/declarations/{created['declaration_id']}/report")
    assert report_response.status_code == 200
    report = report_response.json()
    assert report["snapshot_id"].startswith("snap_")
    assert "matrix_result" in report["report_payload"]
