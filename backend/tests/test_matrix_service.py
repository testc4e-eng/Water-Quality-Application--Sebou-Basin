from __future__ import annotations

import hashlib
from pathlib import Path

import pytest

from app.services.matrix_service import MatrixServiceError, matrix_service


RESOURCE = Path(__file__).resolve().parents[1] / "app" / "resources" / "matrices" / "nh4_dar_el_arssa_v1.csv"
SHA_FILE = RESOURCE.with_suffix(".sha256")


SUFFICIENT_INPUT = {
    "polluant": "NH4",
    "Crejet_mg_L": 100,
    "QRejet_m3_s": 0.055555556,
    "QSebou_m3_s": 7.5,
    "QInnaouen_m3_s": 10,
    "QOuergha_m3_s": 10,
}

INSUFFICIENT_INPUT = {
    "polluant": "NH4",
    "Crejet_mg_L": 250,
    "QRejet_m3_s": 0.277777778,
    "QSebou_m3_s": 7.5,
    "QInnaouen_m3_s": 10,
    "QOuergha_m3_s": 10,
}


def test_matrix_v1_loads_1575_scenarios():
    assert len(matrix_service.scenarios) == 1575
    assert matrix_service.metadata["sufficient_count"] == 1188
    assert matrix_service.metadata["insufficient_count"] == 387


def test_matrix_v1_checksum_matches_resource():
    expected = SHA_FILE.read_text(encoding="utf-8").split()[0]
    actual = hashlib.sha256(RESOURCE.read_bytes()).hexdigest()
    assert actual == expected


def test_scenario_ids_are_unique():
    ids = [scenario.scenario_id for scenario in matrix_service.scenarios]
    assert len(ids) == len(set(ids))


def test_exact_match_sufficient_returns_excel_values():
    result = matrix_service.evaluate(SUFFICIENT_INPUT, allow_nearest_neighbor=False)
    assert result["scenario_id"] == "SC_QR01_C01_QS01_QI01_QO01"
    assert result["method_used"] == "EXACT_MATCH"
    assert result["exact_match"] is True
    assert result["C_SidiAllalTazi_mg_L"] == pytest.approx(0.035751168)
    assert result["C_BgGarde_mg_L"] == pytest.approx(0.046694335)
    assert result["statut_global"] == "SUFFISANT"


def test_exact_match_insufficient_returns_excel_values():
    result = matrix_service.evaluate(INSUFFICIENT_INPUT, allow_nearest_neighbor=False)
    assert result["scenario_id"] == "SC_QR02_C04_QS01_QI01_QO01"
    assert result["method_used"] == "EXACT_MATCH"
    assert result["exact_match"] is True
    assert result["C_SidiAllalTazi_mg_L"] == pytest.approx(0.420350283)
    assert result["C_BgGarde_mg_L"] == pytest.approx(0.563962579)
    assert result["statut_global"] == "INSUFFISANT"


def test_out_of_domain_is_rejected():
    with pytest.raises(MatrixServiceError) as exc:
        matrix_service.evaluate({**SUFFICIENT_INPUT, "Crejet_mg_L": 1.2})
    assert exc.value.code == "MATRIX_OUT_OF_DOMAIN"


def test_exact_match_not_found_without_nearest_neighbor():
    with pytest.raises(MatrixServiceError) as exc:
        matrix_service.evaluate({**SUFFICIENT_INPUT, "QSebou_m3_s": 8}, allow_nearest_neighbor=False)
    assert exc.value.code == "MATRIX_EXACT_MATCH_NOT_FOUND"


def test_nearest_neighbor_stays_inside_domain():
    result = matrix_service.evaluate({**SUFFICIENT_INPUT, "QSebou_m3_s": 8}, allow_nearest_neighbor=True)
    assert result["exact_match"] is False
    assert result["method_used"] == "NEAREST_NEIGHBOR"
    assert result["scenario_id"]


def test_recommendations_use_real_matrix_lines():
    strategies = matrix_service.recommend_axis_strategies(INSUFFICIENT_INPUT)
    feasible = [item for item in strategies if item["feasible"]]
    assert [item["axis"] for item in feasible] == ["INNAOUEN", "OUERGHA", "SEBOU"]
    assert feasible[0]["target_scenario_id"] == "SC_QR02_C04_QS01_QI02_QO01"
    assert feasible[1]["target_scenario_id"] == "SC_QR02_C04_QS01_QI01_QO02"
    assert feasible[2]["target_scenario_id"] == "SC_QR02_C04_QS03_QI01_QO01"
