from fastapi.testclient import TestClient

from app.main import app
from app.services.dashboard import home_service


client = TestClient(app)
_CACHED_HOME_PAYLOAD = None


ROOT_SECTIONS = {
    "status",
    "generated_at",
    "data_freshness",
    "hero",
    "map",
    "basin_status",
    "alerts",
    "recommended_actions",
    "trends",
    "secondary_kpis",
    "metadata",
}


class _DummyDb:
    def rollback(self):
        return None


def _get_cached_home_payload():
    global _CACHED_HOME_PAYLOAD
    if _CACHED_HOME_PAYLOAD is None:
        response = client.get("/api/v1/dashboard/home")
        assert response.status_code == 200
        _CACHED_HOME_PAYLOAD = response.json()
    return _CACHED_HOME_PAYLOAD


def _clear_backend_home_cache():
    home_service._clear_home_cache()


def test_dashboard_home_responds_200():
    response = client.get("/api/v1/dashboard/home")
    assert response.status_code == 200


def test_dashboard_home_contains_all_root_sections():
    payload = _get_cached_home_payload()
    assert ROOT_SECTIONS.issubset(payload.keys())


def test_dashboard_home_hero_contains_exactly_four_operational_cards():
    payload = _get_cached_home_payload()
    cards = payload["hero"]["cards"]
    assert len(cards) == 4
    assert [card["id"] for card in cards] == [
        "barrages_suivis",
        "donnees_pluie_disponibles",
        "stations_hydro_actives",
        "stations_sentinelles_qualite",
    ]


def test_dashboard_home_hero_excludes_secondary_dg_kpis():
    payload = _get_cached_home_payload()
    card_ids = {card["id"] for card in payload["hero"]["cards"]}
    forbidden = {"iqgb", "ifd", "icd", "ich", "ipp", "isr"}
    assert card_ids.isdisjoint(forbidden)


def test_dashboard_home_secondary_kpis_contains_all_dg_kpis():
    payload = _get_cached_home_payload()
    expected = {"iqgb", "ifd", "icd", "ich", "ipp", "isr"}
    assert expected.issubset(payload["secondary_kpis"].keys())


def test_dashboard_home_metadata_rules_are_present():
    payload = _get_cached_home_payload()
    assert payload["metadata"]["temperature_rule"] == "AIR_TEMPERATURE != WATER_TEMPERATURE"
    assert payload["metadata"]["quality_scope"] == "6 stations sentinelles qualité"
    assert payload["metadata"]["rainfall_typology_status"] == "TO_CONSOLIDATE"


def test_dashboard_home_basin_labels_are_correct():
    payload = _get_cached_home_payload()
    assert payload["basin_status"]["rainfall"]["label"] == "Données pluie disponibles"
    assert payload["basin_status"]["quality"]["label"] == "Stations sentinelles qualité"


def test_dashboard_home_map_default_layers_are_correct():
    payload = _get_cached_home_payload()
    assert payload["map"]["default_layers"] == ["barrages", "hydro", "pluvio", "quality_daily"]


def test_dashboard_home_keeps_payload_when_section_builder_fails(monkeypatch):
    _clear_backend_home_cache()

    def _boom(_db):
        raise RuntimeError("boom")

    monkeypatch.setattr(home_service, "_build_trends", _boom)
    response = client.get("/api/v1/dashboard/home")
    payload = response.json()
    assert response.status_code == 200
    assert payload["status"] == "partial"
    assert "trends" in payload
    assert payload["trends"]["hydro_30d"]["points"] == []


def test_dashboard_home_uses_sentinel_wording():
    payload = _get_cached_home_payload()
    hero_labels = [card["label"] for card in payload["hero"]["cards"]]
    assert "Stations sentinelles qualité" in hero_labels
    assert "Seulement 6 stations qualité" not in hero_labels


def test_dashboard_home_cache_returns_same_structure(monkeypatch):
    _clear_backend_home_cache()
    monkeypatch.setenv("SAD_DASHBOARD_HOME_CACHE_SECONDS", "300")

    monkeypatch.setattr(home_service, "_build_data_freshness", lambda _db: home_service._fallback_data_freshness())
    monkeypatch.setattr(home_service, "_build_hero", lambda _db: {"cards": []})
    monkeypatch.setattr(home_service, "_build_map", lambda _db: {"default_layers": [], "secondary_layers": [], "layers": {}})
    monkeypatch.setattr(home_service, "_build_basin_status", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_alerts", lambda _db: [])
    monkeypatch.setattr(home_service, "_build_recommended_actions", lambda _db: [])
    monkeypatch.setattr(home_service, "_build_trends", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_secondary_kpis", lambda _db: {"iqgb": {}})
    monkeypatch.setattr(home_service, "_build_metadata", lambda _db: {"mode": "OPERATIONAL_HOME_V2"})

    payload_1 = home_service.get_dashboard_home(_DummyDb())
    payload_2 = home_service.get_dashboard_home(_DummyDb())

    assert payload_1.keys() == payload_2.keys()
    assert payload_1["generated_at"] == payload_2["generated_at"]


def test_dashboard_home_cache_preserves_partial_status(monkeypatch):
    _clear_backend_home_cache()
    monkeypatch.setenv("SAD_DASHBOARD_HOME_CACHE_SECONDS", "300")

    monkeypatch.setattr(home_service, "_build_data_freshness", lambda _db: home_service._fallback_data_freshness())
    monkeypatch.setattr(home_service, "_build_hero", lambda _db: {"cards": []})
    monkeypatch.setattr(home_service, "_build_map", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_basin_status", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_alerts", lambda _db: [])
    monkeypatch.setattr(home_service, "_build_recommended_actions", lambda _db: [])
    monkeypatch.setattr(home_service, "_build_trends", lambda _db: (_ for _ in ()).throw(RuntimeError("boom")))
    monkeypatch.setattr(home_service, "_build_secondary_kpis", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_metadata", lambda _db: {})

    payload_1 = home_service.get_dashboard_home(_DummyDb())
    payload_2 = home_service.get_dashboard_home(_DummyDb())

    assert payload_1["status"] == "partial"
    assert payload_2["status"] == "partial"
    assert "trends" in payload_2


def test_dashboard_home_cache_can_be_disabled_by_env(monkeypatch):
    _clear_backend_home_cache()
    monkeypatch.setenv("SAD_DASHBOARD_HOME_CACHE_SECONDS", "0")

    call_counter = {"count": 0}

    def _counted_metadata(_db):
        call_counter["count"] += 1
        return {}

    monkeypatch.setattr(home_service, "_build_data_freshness", lambda _db: home_service._fallback_data_freshness())
    monkeypatch.setattr(home_service, "_build_hero", lambda _db: {"cards": []})
    monkeypatch.setattr(home_service, "_build_map", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_basin_status", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_alerts", lambda _db: [])
    monkeypatch.setattr(home_service, "_build_recommended_actions", lambda _db: [])
    monkeypatch.setattr(home_service, "_build_trends", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_secondary_kpis", lambda _db: {})
    monkeypatch.setattr(home_service, "_build_metadata", _counted_metadata)

    home_service.get_dashboard_home(_DummyDb())
    home_service.get_dashboard_home(_DummyDb())

    assert call_counter["count"] == 2
