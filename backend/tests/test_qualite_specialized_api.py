from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.v1.qualite_specialized import router


def _client() -> TestClient:
    app = FastAPI()
    app.include_router(router, prefix="/api/v1")
    return TestClient(app)


def test_p0_qualite_openapi_paths_are_exposed():
    client = _client()
    paths = client.get("/openapi.json").json()["paths"]

    assert "/api/v1/qualite/metaux" in paths
    assert "/api/v1/qualite/chimie-minerale" in paths
    assert "/api/v1/qualite/physicochimie" in paths
    assert "/api/v1/qualite/pollution-organique" in paths


def test_p0_qualite_endpoints_return_standard_response():
    client = _client()
    for path in (
        "/api/v1/qualite/metaux",
        "/api/v1/qualite/chimie-minerale",
        "/api/v1/qualite/physicochimie",
        "/api/v1/qualite/pollution-organique",
    ):
        response = client.get(path, params={"limit": 1})
        payload = response.json()

        assert response.status_code == 200
        assert payload["status"] == "success"
        assert "count" in payload
        assert len(payload["data"]) <= 1
        assert payload["metadata"]["source_view"].startswith("api.v_qualite_")


def test_p0_business_rules_mo_and_mo_are_distinct():
    client = _client()

    metaux_mo_trace = client.get("/api/v1/qualite/metaux", params={"code_parametre": "Mo", "limit": 5}).json()
    metaux_matiere_organique = client.get("/api/v1/qualite/metaux", params={"code_parametre": "MO", "limit": 5}).json()
    pollution_matiere_organique = client.get(
        "/api/v1/qualite/pollution-organique",
        params={"code_parametre": "MO", "limit": 5},
    ).json()
    pollution_mo_trace = client.get(
        "/api/v1/qualite/pollution-organique",
        params={"code_parametre": "Mo", "limit": 5},
    ).json()

    assert metaux_mo_trace["count"] == 11
    assert metaux_matiere_organique["count"] == 0
    assert pollution_matiere_organique["count"] > 0
    assert pollution_mo_trace["count"] == 0


def test_p0_excluded_parameters_are_not_exposed():
    client = _client()

    for path in (
        "/api/v1/qualite/metaux",
        "/api/v1/qualite/chimie-minerale",
        "/api/v1/qualite/physicochimie",
        "/api/v1/qualite/pollution-organique",
    ):
        for code in ("FM", "F_M_MES", "MO_METAL"):
            payload = client.get(path, params={"code_parametre": code, "limit": 5}).json()
            assert payload["count"] == 0
