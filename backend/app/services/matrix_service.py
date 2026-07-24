from __future__ import annotations

import csv
import json
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from functools import lru_cache
from pathlib import Path
from typing import Any


MATRIX_DIR = Path(__file__).resolve().parents[1] / "resources" / "matrices"
MATRIX_CSV = MATRIX_DIR / "nh4_dar_el_arssa_v1.csv"
MATRIX_METADATA = MATRIX_DIR / "nh4_dar_el_arssa_v1.metadata.json"

INPUT_FIELDS = (
    "Crejet_mg_L",
    "QRejet_m3_s",
    "QSebou_m3_s",
    "QInnaouen_m3_s",
    "QOuergha_m3_s",
)

OUTPUT_FIELDS = (
    "C_SidiAllalTazi_mg_L",
    "C_BgGarde_mg_L",
)

AXIS_TO_FIELD = {
    "SEBOU": "QSebou_m3_s",
    "INNAOUEN": "QInnaouen_m3_s",
    "OUERGHA": "QOuergha_m3_s",
}


class MatrixServiceError(Exception):
    def __init__(
        self,
        *,
        code: str,
        message: str,
        http_status: int = 422,
        user_action: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.http_status = http_status
        self.user_action = user_action
        self.details = details or {}


@dataclass(frozen=True)
class MatrixScenario:
    scenario_id: str
    segment_rejet: str
    Crejet_mg_L: Decimal
    QRejet_m3_s: Decimal
    QSebou_m3_s: Decimal
    QInnaouen_m3_s: Decimal
    QOuergha_m3_s: Decimal
    C_SidiAllalTazi_mg_L: Decimal
    C_BgGarde_mg_L: Decimal
    Statut: str

    @property
    def input_key(self) -> tuple[str, str, str, str, str]:
        return tuple(_decimal_key(getattr(self, field)) for field in INPUT_FIELDS)

    def input_vector(self) -> dict[str, float]:
        return {field: float(getattr(self, field)) for field in INPUT_FIELDS}

    def output_vector(self) -> dict[str, float | str]:
        return {
            "C_SidiAllalTazi_mg_L": float(self.C_SidiAllalTazi_mg_L),
            "C_BgGarde_mg_L": float(self.C_BgGarde_mg_L),
            "statut_global": self.Statut,
        }


@dataclass(frozen=True)
class MatrixEvaluationResult:
    matrix_id: str
    matrix_version: str
    source_point_id: str
    scenario_id: str | None
    exact_match: bool
    method_used: str
    input_vector: dict[str, float]
    output_vector: dict[str, float | str]
    C_SidiAllalTazi_mg_L: float
    C_BgGarde_mg_L: float
    statut_sidi_allal_tazi: str
    statut_bg_garde: str
    statut_global: str
    confidence_level: str
    out_of_domain: bool
    warnings: list[str]
    nearest_neighbor_distance: float | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "matrix_id": self.matrix_id,
            "matrix_version": self.matrix_version,
            "source_point_id": self.source_point_id,
            "scenario_id": self.scenario_id,
            "exact_match": self.exact_match,
            "pollutant": "NH4",
            "input_vector": self.input_vector,
            "output_vector": self.output_vector,
            "C_SidiAllalTazi_mg_L": self.C_SidiAllalTazi_mg_L,
            "C_BgGarde_mg_L": self.C_BgGarde_mg_L,
            "statut_sidi_allal_tazi": self.statut_sidi_allal_tazi,
            "statut_bg_garde": self.statut_bg_garde,
            "statut_global": self.statut_global,
            "out_of_domain": self.out_of_domain,
            "confidence_level": self.confidence_level,
            "method_used": self.method_used,
            "warnings": self.warnings,
            "nearest_neighbor_distance": self.nearest_neighbor_distance,
        }


def _to_decimal(value: Any, field: str) -> Decimal:
    try:
        return Decimal(str(value).strip())
    except (InvalidOperation, AttributeError) as exc:
        raise MatrixServiceError(
            code="MATRIX_VARIABLE_MISSING",
            message=f"La variable {field} est invalide pour la matrice.",
            http_status=400,
            user_action="Verifier les valeurs de rejet et de debit.",
            details={"field": field, "value": value},
        ) from exc


def _decimal_key(value: Decimal) -> str:
    normalized = value.normalize()
    return format(normalized, "f")


def _scenario_from_row(row: dict[str, str]) -> MatrixScenario:
    return MatrixScenario(
        scenario_id=row["scenario_id"],
        segment_rejet=row["Segment_rejet"],
        Crejet_mg_L=_to_decimal(row["Crejet_mg_L"], "Crejet_mg_L"),
        QRejet_m3_s=_to_decimal(row["QRejet_m3_s"], "QRejet_m3_s"),
        QSebou_m3_s=_to_decimal(row["QSebou_m3_s"], "QSebou_m3_s"),
        QInnaouen_m3_s=_to_decimal(row["QInnaouen_m3_s"], "QInnaouen_m3_s"),
        QOuergha_m3_s=_to_decimal(row["QOuergha_m3_s"], "QOuergha_m3_s"),
        C_SidiAllalTazi_mg_L=_to_decimal(row["C_SidiAllalTazi_mg_L"], "C_SidiAllalTazi_mg_L"),
        C_BgGarde_mg_L=_to_decimal(row["C_BgGarde_mg_L"], "C_BgGarde_mg_L"),
        Statut=row["Statut"].strip().upper(),
    )


class MatrixService:
    def __init__(self) -> None:
        self.metadata = json.loads(MATRIX_METADATA.read_text(encoding="utf-8"))
        with MATRIX_CSV.open("r", encoding="utf-8", newline="") as handle:
            self.scenarios = [_scenario_from_row(row) for row in csv.DictReader(handle)]
        self.by_key = {scenario.input_key: scenario for scenario in self.scenarios}
        if len(self.by_key) != len(self.scenarios):
            raise RuntimeError("Matrice NH4 v1 invalide: cles d'entree dupliquees.")
        if len(self.scenarios) != int(self.metadata["scenario_count"]):
            raise RuntimeError("Matrice NH4 v1 invalide: scenario_count incoherent.")
        self.domain = {
            field: (
                Decimal(str(self.metadata["validity_domain"][field]["min"])),
                Decimal(str(self.metadata["validity_domain"][field]["max"])),
            )
            for field in INPUT_FIELDS
        }

    @property
    def matrix_id(self) -> str:
        return self.metadata["matrix_id"]

    @property
    def matrix_version(self) -> str:
        return self.metadata["matrix_version"]

    def evaluate(self, input_payload: dict[str, Any], *, allow_nearest_neighbor: bool = True) -> dict[str, Any]:
        vector = self._input_vector(input_payload)
        self._assert_in_domain(vector)
        key = tuple(_decimal_key(vector[field]) for field in INPUT_FIELDS)
        scenario = self.by_key.get(key)
        if scenario is not None:
            return self._result_from_scenario(
                scenario,
                input_vector=vector,
                exact_match=True,
                method_used="EXACT_MATCH",
                confidence_level="HIGH",
                warnings=[],
            ).to_dict()

        if not allow_nearest_neighbor:
            raise MatrixServiceError(
                code="MATRIX_EXACT_MATCH_NOT_FOUND",
                message="Aucun scenario exact n'existe dans la matrice NH4 v1 pour les valeurs saisies.",
                http_status=422,
                user_action="Utiliser un scenario couvert par la matrice ou valider une methode d'interpolation.",
                details={"input_vector": {k: float(v) for k, v in vector.items()}},
            )

        nearest, distance = self._nearest_neighbor(vector)
        return self._result_from_scenario(
            nearest,
            input_vector=vector,
            exact_match=False,
            method_used="NEAREST_NEIGHBOR",
            confidence_level="MEDIUM",
            warnings=[
                "Aucune correspondance exacte dans la matrice NH4 v1 : scenario le plus proche utilise, sans extrapolation.",
            ],
            nearest_neighbor_distance=distance,
        ).to_dict()

    def recommend_axis_strategies(self, input_payload: dict[str, Any]) -> list[dict[str, Any]]:
        vector = self._input_vector(input_payload)
        self._assert_in_domain(vector)
        source = self.by_key.get(tuple(_decimal_key(vector[field]) for field in INPUT_FIELDS))
        source_scenario_id = source.scenario_id if source else None
        strategies: list[dict[str, Any]] = []
        for axis, field in AXIS_TO_FIELD.items():
            unchanged = [item for item in ("QSebou_m3_s", "QInnaouen_m3_s", "QOuergha_m3_s") if item != field]
            candidates = [
                scenario
                for scenario in self.scenarios
                if scenario.Statut == "SUFFISANT"
                and scenario.Crejet_mg_L == vector["Crejet_mg_L"]
                and scenario.QRejet_m3_s == vector["QRejet_m3_s"]
                and all(getattr(scenario, item) == vector[item] for item in unchanged)
                and getattr(scenario, field) > vector[field]
            ]
            candidates.sort(key=lambda scenario: getattr(scenario, field) - vector[field])
            if not candidates:
                strategies.append(
                    {
                        "axis": axis,
                        "feasible": False,
                        "source_scenario_id": source_scenario_id,
                        "target_scenario_id": None,
                        "method_used": "MATRIX_SEARCH",
                        "warning": "Aucun scenario suffisant trouve pour cet axe dans la matrice NH4 v1.",
                    }
                )
                continue
            target = candidates[0]
            current = vector[field]
            proposed = getattr(target, field)
            delta = proposed - current
            strategies.append(
                {
                    "axis": axis,
                    "feasible": True,
                    "source_scenario_id": source_scenario_id,
                    "target_scenario_id": target.scenario_id,
                    "field": field,
                    "current_value": float(current),
                    "proposed_value": float(proposed),
                    "delta_value": float(delta),
                    "expected_matrix_result": {
                        "C_SidiAllalTazi_mg_L": float(target.C_SidiAllalTazi_mg_L),
                        "C_BgGarde_mg_L": float(target.C_BgGarde_mg_L),
                        "statut_global": target.Statut,
                    },
                    "matrix_version": self.matrix_version,
                    "method_used": "MATRIX_SEARCH",
                }
            )
        feasible = [item for item in strategies if item.get("feasible")]
        feasible.sort(key=lambda item: (item["delta_value"], item["axis"]))
        non_feasible = [item for item in strategies if not item.get("feasible")]
        return feasible + non_feasible

    def _input_vector(self, input_payload: dict[str, Any]) -> dict[str, Decimal]:
        missing = [field for field in INPUT_FIELDS if input_payload.get(field) is None]
        if missing:
            raise MatrixServiceError(
                code="MATRIX_VARIABLE_MISSING",
                message="Une variable obligatoire pour l'evaluation de la matrice est manquante.",
                http_status=400,
                user_action="Completer les donnees hydrologiques et de rejet.",
                details={"missing_fields": missing},
            )
        return {field: _to_decimal(input_payload[field], field) for field in INPUT_FIELDS}

    def _assert_in_domain(self, vector: dict[str, Decimal]) -> None:
        out = []
        for field, value in vector.items():
            low, high = self.domain[field]
            if value < low or value > high:
                out.append({"field": field, "value": float(value), "min": float(low), "max": float(high)})
        if out:
            raise MatrixServiceError(
                code="MATRIX_OUT_OF_DOMAIN",
                message="Les valeurs saisies sortent du domaine couvert par la matrice NH4 v1.",
                http_status=422,
                user_action="Utiliser des valeurs couvertes par la matrice ou valider une extension scientifique.",
                details={"out_of_domain": out},
            )

    def _nearest_neighbor(self, vector: dict[str, Decimal]) -> tuple[MatrixScenario, float]:
        def distance(scenario: MatrixScenario) -> float:
            total = 0.0
            for field in INPUT_FIELDS:
                low, high = self.domain[field]
                span = high - low
                if span == 0:
                    continue
                delta = (getattr(scenario, field) - vector[field]) / span
                total += float(delta * delta)
            return total ** 0.5

        nearest = min(self.scenarios, key=distance)
        return nearest, distance(nearest)

    def _result_from_scenario(
        self,
        scenario: MatrixScenario,
        *,
        input_vector: dict[str, Decimal],
        exact_match: bool,
        method_used: str,
        confidence_level: str,
        warnings: list[str],
        nearest_neighbor_distance: float | None = None,
    ) -> MatrixEvaluationResult:
        output_vector = scenario.output_vector()
        return MatrixEvaluationResult(
            matrix_id=self.matrix_id,
            matrix_version=self.matrix_version,
            source_point_id="POINT_SOURCE_MATRICE_NH4_DAR_EL_ARSSA_A_VALIDER",
            scenario_id=scenario.scenario_id,
            exact_match=exact_match,
            method_used=method_used,
            input_vector={field: float(value) for field, value in input_vector.items()},
            output_vector=output_vector,
            C_SidiAllalTazi_mg_L=float(scenario.C_SidiAllalTazi_mg_L),
            C_BgGarde_mg_L=float(scenario.C_BgGarde_mg_L),
            statut_sidi_allal_tazi="A_VALIDER",
            statut_bg_garde="A_VALIDER",
            statut_global=scenario.Statut,
            confidence_level=confidence_level,
            out_of_domain=False,
            warnings=warnings,
            nearest_neighbor_distance=nearest_neighbor_distance,
        )


@lru_cache(maxsize=1)
def get_matrix_service() -> MatrixService:
    return MatrixService()


matrix_service = get_matrix_service()
