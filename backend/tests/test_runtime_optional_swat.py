from fastapi.testclient import TestClient


def test_global_runtime_starts_with_optional_scientific_routers_disabled(monkeypatch):
    monkeypatch.delenv("SAD_ENABLE_SWAT_ANALYSIS", raising=False)
    monkeypatch.delenv("SAD_ENABLE_INGESTION_API", raising=False)

    from app.api.api_v1 import INGESTION_API_AVAILABLE, SWAT_ANALYSIS_AVAILABLE
    from app.main import app

    client = TestClient(app)

    assert SWAT_ANALYSIS_AVAILABLE is False
    assert INGESTION_API_AVAILABLE is False
    assert client.get("/health").status_code == 200
    assert client.get("/docs").status_code == 200

    openapi_response = client.get("/openapi.json")
    assert openapi_response.status_code == 200
    paths = openapi_response.json()["paths"]
    assert "/api/v1/qualite/metaux" in paths
    assert "/api/v1/swat/analysis/status" not in paths
    assert "/api/v1/ingestion/upload" not in paths


def test_p0_endpoint_available_in_global_app(monkeypatch):
    monkeypatch.delenv("SAD_ENABLE_SWAT_ANALYSIS", raising=False)
    monkeypatch.delenv("SAD_ENABLE_INGESTION_API", raising=False)

    from app.main import app

    client = TestClient(app)
    response = client.get("/api/v1/qualite/metaux", params={"limit": 1})
    payload = response.json()

    assert response.status_code == 200
    assert payload["status"] == "success"
    assert payload["count"] == 8565
    assert len(payload["data"]) == 1
