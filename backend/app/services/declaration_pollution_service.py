from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import UTC, datetime
from threading import Lock
from typing import Any
from uuid import uuid4

from app.models.pollution_declaration_models import (
    DeclarationTransitionRecord,
    DischargeOverride,
    GeoJsonPoint,
    HydrologyOverride,
    PollutionDeclarationCreateRequest,
    PollutionDeclarationEvaluateRequest,
    PollutionDeclarationListResponse,
    PollutionDeclarationReportResponse,
    PollutionDeclarationResponse,
    PollutionDeclarationTransitionRequest,
)
from app.services.propagation import propagation_pollution_service
from app.services.matrix_service import MatrixServiceError, matrix_service
from app.services.topology_adapter import adapt_topology_result
from app.services.travel_time_service import evaluate_travel_time

DECLARATION_REQUIRED_FIELDS = (
    "point_declaration",
    "polluant",
    "Crejet_mg_L",
    "QRejet_m3_s",
    "QSebou_m3_s",
    "QInnaouen_m3_s",
    "QOuergha_m3_s",
)
SNAP_WARNING_DISTANCE_M = 1000.0
SNAP_BLOCKING_DISTANCE_M = 2000.0
MATRIX_RECOMMENDATION_METHOD = "MATRIX_SEARCH"
logger = logging.getLogger(__name__)


class DeclarationServiceError(Exception):
    def __init__(
        self,
        *,
        code: str,
        message: str,
        http_status: int,
        workflow_status: str | None = None,
        user_action: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.http_status = http_status
        self.workflow_status = workflow_status
        self.user_action = user_action
        self.details = details or {}


@dataclass
class StoredDeclaration:
    data: dict[str, Any]
    transitions: list[dict[str, Any]]
    snapshots: list[dict[str, Any]]
    current_snapshot_id: str | None = None
    report_payload: dict[str, Any] | None = None


def _utcnow() -> datetime:
    return datetime.now(UTC)


def _new_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:12]}"


def _normalize_name(value: str | None) -> str:
    return (value or "").strip().lower()


def _build_transition_model(item: dict[str, Any]) -> DeclarationTransitionRecord:
    return DeclarationTransitionRecord(**item)


def _ensure_point(point: GeoJsonPoint | dict[str, Any] | None) -> dict[str, Any]:
    if point is None:
        raise DeclarationServiceError(
            code="DECLARATION_POINT_REQUIRED",
            message="Le point de declaration est obligatoire pour lancer l'analyse.",
            http_status=400,
            workflow_status="BROUILLON",
            user_action="Saisir ou corriger le point de declaration.",
        )
    if isinstance(point, GeoJsonPoint):
        return point.model_dump()
    return point


class DeclarationPollutionService:
    def __init__(self) -> None:
        self._lock = Lock()
        self._store: dict[str, StoredDeclaration] = {}

    def list_declarations(self) -> PollutionDeclarationListResponse:
        items = [self._build_response(record) for record in self._store.values()]
        items.sort(key=lambda item: item.created_at, reverse=True)
        return PollutionDeclarationListResponse(items=items, total=len(items))

    def create_declaration(self, payload: PollutionDeclarationCreateRequest) -> PollutionDeclarationResponse:
        now = _utcnow()
        declaration_id = _new_id("decl")
        reference = f"DECL-{now.strftime('%Y%m%d')}-{declaration_id[-4:].upper()}"
        data = {
            "declaration_id": declaration_id,
            "reference": reference,
            "status": "BROUILLON",
            "date_declaration": payload.date_declaration,
            "detected_at": payload.detected_at or payload.date_declaration,
            "point_declaration": payload.point_declaration.model_dump(),
            "polluant": payload.polluant,
            "Crejet_mg_L": payload.Crejet_mg_L,
            "QRejet_m3_s": payload.QRejet_m3_s,
            "QSebou_m3_s": payload.QSebou_m3_s,
            "QInnaouen_m3_s": payload.QInnaouen_m3_s,
            "QOuergha_m3_s": payload.QOuergha_m3_s,
            "commentaire": payload.commentaire,
            "created_at": now,
            "updated_at": now,
        }
        transition = self._new_transition(
            from_status=None,
            to_status="BROUILLON",
            trigger="create",
            actor="system",
            reason="Creation de la declaration",
        )
        self._store[declaration_id] = StoredDeclaration(
            data=data,
            transitions=[transition],
            snapshots=[],
        )
        return self._build_response(self._store[declaration_id])

    def get_declaration(self, declaration_id: str) -> PollutionDeclarationResponse:
        return self._build_response(self._get_record(declaration_id))

    def submit_declaration(
        self,
        declaration_id: str,
        payload: PollutionDeclarationTransitionRequest,
    ) -> PollutionDeclarationResponse:
        record = self._get_record(declaration_id)
        self._assert_status(record, {"BROUILLON"})
        self._validate_required_inputs(record.data)
        self._transition(
            record,
            to_status="PRET_A_ANALYSER",
            trigger="submit",
            actor=payload.requested_by or "user",
            reason=payload.reason or payload.commentaire or "Declaration prete a analyser",
        )
        return self._build_response(record)

    def validate_declaration(
        self,
        declaration_id: str,
        payload: PollutionDeclarationTransitionRequest,
    ) -> PollutionDeclarationResponse:
        record = self._get_record(declaration_id)
        self._assert_status(record, {"RISQUE_FAIBLE", "RECOMMANDATION_PROPOSEE"})
        self._transition(
            record,
            to_status="VALIDE_METIER",
            trigger="validate",
            actor=payload.requested_by or "expert_metier",
            reason=payload.reason or payload.commentaire or "Validation metier",
        )
        return self._build_response(record)

    def reject_declaration(
        self,
        declaration_id: str,
        payload: PollutionDeclarationTransitionRequest,
    ) -> PollutionDeclarationResponse:
        record = self._get_record(declaration_id)
        self._assert_status(record, {"BROUILLON", "PRET_A_ANALYSER", "RISQUE_ELEVE", "RECOMMANDATION_PROPOSEE", "ERREUR_ANALYSE"})
        self._transition(
            record,
            to_status="REJETE",
            trigger="reject",
            actor=payload.requested_by or "expert_metier",
            reason=payload.reason or payload.commentaire or "Rejet declaration",
        )
        return self._build_response(record)

    def close_declaration(
        self,
        declaration_id: str,
        payload: PollutionDeclarationTransitionRequest,
    ) -> PollutionDeclarationResponse:
        record = self._get_record(declaration_id)
        self._assert_status(record, {"VALIDE_METIER"})
        self._transition(
            record,
            to_status="CLOTURE",
            trigger="close",
            actor=payload.requested_by or "expert_metier",
            reason=payload.reason or payload.commentaire or "Cloture du dossier",
        )
        return self._build_response(record)

    def get_report(self, declaration_id: str) -> PollutionDeclarationReportResponse:
        record = self._get_record(declaration_id)
        if not record.report_payload or not record.current_snapshot_id:
            raise DeclarationServiceError(
                code="DECLARATION_ANALYSIS_INTERNAL_ERROR",
                message="Le rapport n'est pas encore disponible pour cette declaration.",
                http_status=409,
                workflow_status=record.data["status"],
                user_action="Lancer l'analyse ou finaliser la declaration avant de consulter le rapport.",
            )
        return PollutionDeclarationReportResponse(
            declaration_id=record.data["declaration_id"],
            status=record.data["status"],
            report_id=record.report_payload["report_id"],
            generated_at=record.report_payload["generated_at"],
            report_payload=record.report_payload,
            snapshot_id=record.current_snapshot_id,
        )

    def evaluate_declaration(
        self,
        declaration_id: str,
        payload: PollutionDeclarationEvaluateRequest,
    ) -> dict[str, Any]:
        record = self._get_record(declaration_id)
        self._assert_status(record, {"PRET_A_ANALYSER", "RISQUE_FAIBLE", "RISQUE_ELEVE", "RECOMMANDATION_PROPOSEE", "ERREUR_ANALYSE"})
        self._validate_required_inputs(record.data)
        input_payload = self._build_input_payload(record.data, payload.override_hydrology, payload.override_discharge)
        self._transition(
            record,
            to_status="ANALYSE_EN_COURS",
            trigger="evaluate",
            actor=payload.requested_by or "user",
            reason=payload.commentaire_execution or "Lancement de l'analyse",
        )
        try:
            analysis_started_at = _utcnow()
            topology_result = self._evaluate_topology(input_payload["point_declaration"])
            travel_time_result = self._evaluate_travel_time(
                point_declaration=input_payload["point_declaration"],
                detected_at=payload.detected_at,
                declaration_detected_at=record.data.get("detected_at") or record.data.get("date_declaration"),
                analysis_started_at=analysis_started_at,
            )
            matrix_result = self._evaluate_matrix(input_payload)
            risk_result = self._evaluate_risk(matrix_result)
            recommendations = self._build_recommendations(input_payload, matrix_result, risk_result)
            decision_reasoning = self._build_decision_reasoning(matrix_result, risk_result, recommendations)
            snapshot = self._build_snapshot(
                declaration_id=declaration_id,
                input_payload=input_payload,
                topology_result=topology_result,
                travel_time_result=travel_time_result,
                matrix_result=matrix_result,
                risk_result=risk_result,
                recommendations=recommendations,
                decision_reasoning=decision_reasoning,
                requested_by=payload.requested_by,
            )
            record.snapshots.append(snapshot)
            record.current_snapshot_id = snapshot["snapshot_id"]
            self._transition(
                record,
                to_status="ANALYSE_TERMINEE",
                trigger="analysis-complete",
                actor="system",
                reason="Analyse complete",
            )
            final_status = "RISQUE_FAIBLE" if risk_result["risk_level"] == "LOW" else "RISQUE_ELEVE"
            self._transition(
                record,
                to_status=final_status,
                trigger="risk-evaluation",
                actor="system",
                reason=f"Qualification de risque: {risk_result['risk_level']}",
            )
            if final_status == "RISQUE_ELEVE" and recommendations:
                self._transition(
                    record,
                    to_status="RECOMMANDATION_PROPOSEE",
                    trigger="recommendations",
                    actor="system",
                    reason="Recommandations generees",
                )
            record.report_payload = self._build_report_payload(record, snapshot)
            return {
                "declaration_id": declaration_id,
                "status": record.data["status"],
                "topology_result": topology_result,
                "travel_time_result": travel_time_result,
                "matrix_result": matrix_result,
                "risk_result": risk_result,
                "recommendations": recommendations,
                "decision_reasoning": decision_reasoning,
                "warnings": snapshot["warnings"],
                "errors": [],
                "snapshot_id": snapshot["snapshot_id"],
                "report_available": True,
            }
        except DeclarationServiceError as exc:
            self._transition(
                record,
                to_status="ERREUR_ANALYSE",
                trigger="analysis-error",
                actor="system",
                reason=exc.message,
            )
            raise

    def _get_record(self, declaration_id: str) -> StoredDeclaration:
        record = self._store.get(declaration_id)
        if record is None:
            raise DeclarationServiceError(
                code="DECLARATION_NOT_FOUND",
                message="La declaration demandee est introuvable.",
                http_status=404,
                user_action="Verifier l'identifiant de la declaration.",
            )
        return record

    def _assert_status(self, record: StoredDeclaration, allowed_statuses: set[str]) -> None:
        current_status = record.data["status"]
        if current_status not in allowed_statuses:
            raise DeclarationServiceError(
                code="INVALID_TRANSITION",
                message="La transition demandee n'est pas autorisee dans l'etat courant.",
                http_status=409,
                workflow_status=current_status,
                user_action="Verifier l'etat du dossier avant de relancer cette action.",
                details={"allowed_statuses": sorted(allowed_statuses)},
            )

    def _validate_required_inputs(self, data: dict[str, Any]) -> None:
        _ensure_point(data.get("point_declaration"))
        missing = [field for field in DECLARATION_REQUIRED_FIELDS if data.get(field) in (None, "")]
        if missing:
            raise DeclarationServiceError(
                code="DECLARATION_INPUT_REQUIRED",
                message="Les donnees obligatoires de declaration sont incompletes.",
                http_status=400,
                workflow_status=data["status"],
                user_action="Completer les champs obligatoires avant de soumettre ou analyser la declaration.",
                details={"missing_fields": missing},
            )

    def _build_input_payload(
        self,
        data: dict[str, Any],
        hydrology_override: HydrologyOverride | None,
        discharge_override: DischargeOverride | None,
    ) -> dict[str, Any]:
        payload = {
            "point_declaration": data["point_declaration"],
            "polluant": data["polluant"],
            "Crejet_mg_L": data["Crejet_mg_L"],
            "QRejet_m3_s": data["QRejet_m3_s"],
            "QSebou_m3_s": data["QSebou_m3_s"],
            "QInnaouen_m3_s": data["QInnaouen_m3_s"],
            "QOuergha_m3_s": data["QOuergha_m3_s"],
        }
        if hydrology_override:
            for key, value in hydrology_override.model_dump(exclude_none=True).items():
                payload[key] = value
        if discharge_override:
            for key, value in discharge_override.model_dump(exclude_none=True).items():
                payload[key] = value
        return payload

    def _evaluate_topology(self, point_declaration: dict[str, Any]) -> dict[str, Any]:
        point = _ensure_point(point_declaration)
        lon, lat = point["coordinates"]
        try:
            garde = propagation_pollution_service.propagate_source_to_garde(lng=lon, lat=lat, vitesse_reference_kmh=10.0)
            stations = propagation_pollution_service.propagate_to_stations(
                lng=lon,
                lat=lat,
                vitesse_reference_kmh=10.0,
                station_type=None,
                max_target_snap_distance_m=1000.0,
                only_reachable=True,
                limit=100,
            )
        except LookupError as exc:
            raise DeclarationServiceError(
                code="TOPOLOGY_PATH_NOT_FOUND",
                message=str(exc),
                http_status=422,
                workflow_status="ERREUR_ANALYSE",
                user_action="Verifier le point de declaration et relancer l'analyse.",
            ) from exc
        except ValueError as exc:
            raise DeclarationServiceError(
                code="TOPOLOGY_POINT_OFF_NETWORK",
                message=str(exc),
                http_status=422,
                workflow_status="ERREUR_ANALYSE",
                user_action="Repositionner le point de declaration sur une zone raccordee au reseau hydrographique.",
            ) from exc
        except RuntimeError as exc:
            raise DeclarationServiceError(
                code="TOPOLOGY_ENGINE_UNAVAILABLE",
                message="Le moteur topologique est indisponible.",
                http_status=503,
                workflow_status="ERREUR_ANALYSE",
                user_action="Reessayer plus tard.",
                details={"internal_error": str(exc)},
            ) from exc
        except Exception as exc:
            logger.exception(
                "Unexpected topology engine failure during declaration evaluation",
                extra={"longitude": lon, "latitude": lat},
            )
            raise DeclarationServiceError(
                code="TOPOLOGY_ENGINE_UNAVAILABLE",
                message="Le moteur topologique n'est pas disponible pour l'analyse de declaration.",
                http_status=503,
                workflow_status="ERREUR_ANALYSE",
                user_action="Verifier la disponibilite du reseau hydrographique puis relancer l'analyse.",
                details={"internal_error": str(exc)},
            ) from exc

        topology_result = adapt_topology_result(
            point_declaration=point,
            garde_payload=garde,
            stations_payload=stations,
        )
        distance_to_network_m = float(topology_result["snap_distance_m"])
        warnings = list(topology_result.get("warnings") or [])
        if distance_to_network_m > SNAP_WARNING_DISTANCE_M:
            warnings.insert(
                0,
                f"Point eloigne du reseau ({distance_to_network_m:.0f} m) : resultat topologique moins fiable.",
            )
        if distance_to_network_m > SNAP_BLOCKING_DISTANCE_M:
            raise DeclarationServiceError(
                code="TOPOLOGY_SNAP_TOO_FAR",
                message="Le point est trop eloigne du reseau pour garantir un parcours fiable.",
                http_status=422,
                workflow_status="ERREUR_ANALYSE",
                user_action="Rapprocher le point du cours d'eau ou confirmer par expertise.",
                details={"snap_distance_m": distance_to_network_m},
            )

        if topology_result.get("parcours_features_count", 0) <= 0 and not topology_result["barrage_garde_atteint"]:
            raise DeclarationServiceError(
                code="TOPOLOGY_PATH_NOT_FOUND",
                message="Aucun parcours aval exploitable n'a ete trouve.",
                http_status=422,
                workflow_status="ERREUR_ANALYSE",
                user_action="Verifier le point de declaration et relancer l'analyse.",
            )

        if not topology_result["barrage_garde_atteint"]:
            raise DeclarationServiceError(
                code="TOPOLOGY_GARDE_NOT_REACHED",
                message="Le parcours n'atteint pas le Barrage de Garde dans le perimetre MVP.",
                http_status=422,
                workflow_status="ERREUR_ANALYSE",
                user_action="Verifier le point ou sortir du prototype MVP.",
            )

        if not topology_result["sidi_allal_tazi_detectee"]:
            raise DeclarationServiceError(
                code="TOPOLOGY_SAT_NOT_FOUND",
                message="La station Sidi Allal Tazi n'a pas ete detectee sur le parcours.",
                http_status=422,
                workflow_status="ERREUR_ANALYSE",
                user_action="Verifier le point, la topologie ou le referentiel de stations.",
            )

        topology_result["warnings"] = warnings
        topology_result.pop("parcours_features_count", None)
        return topology_result

    def _evaluate_travel_time(
        self,
        *,
        point_declaration: dict[str, Any],
        detected_at: datetime | None,
        declaration_detected_at: datetime | None,
        analysis_started_at: datetime,
    ) -> dict[str, Any] | None:
        try:
            return evaluate_travel_time(
                point_declaration=point_declaration,
                detected_at=detected_at,
                declaration_detected_at=declaration_detected_at,
                analysis_started_at=analysis_started_at,
            )
        except Exception as exc:
            logger.warning("Travel time V1 unavailable: %s", exc)
            return {
                "reference_id": "TC_STATIONS_V1",
                "reference_version": "1.0.0",
                "status": "UNAVAILABLE",
                "targets": [],
                "warnings": [
                    "Temps de transfert indisponible pour cette analyse.",
                    str(exc),
                ],
                "scientific_limitations": [
                    "Le calcul de temps de transfert est non bloquant pour Matrix V1.",
                ],
            }

    def _evaluate_matrix(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        if input_payload["polluant"].upper() != "NH4":
            raise DeclarationServiceError(
                code="MATRIX_UNAVAILABLE",
                message="La matrice scientifique est indisponible pour ce polluant.",
                http_status=503,
                workflow_status="ERREUR_ANALYSE",
                user_action="Limiter l'evaluation MVP au polluant NH4.",
            )

        try:
            return matrix_service.evaluate(input_payload, allow_nearest_neighbor=True)
        except MatrixServiceError as exc:
            raise DeclarationServiceError(
                code=exc.code,
                message=exc.message,
                http_status=exc.http_status,
                workflow_status="ERREUR_ANALYSE",
                user_action=exc.user_action,
                details=exc.details,
            ) from exc

    def _evaluate_risk(self, matrix_result: dict[str, Any]) -> dict[str, Any]:
        if matrix_result["statut_global"] == "SUFFISANT":
            return {
                "risk_level": "LOW",
                "label": "RISQUE_FAIBLE",
                "stations_insufficient": [],
            }
        stations_insufficient: list[str] = []
        if matrix_result["statut_sidi_allal_tazi"] != "SUFFISANT":
            stations_insufficient.append("Sidi Allal Tazi")
        if matrix_result["statut_bg_garde"] != "SUFFISANT":
            stations_insufficient.append("Barrage de Garde")
        return {
            "risk_level": "HIGH",
            "label": "RISQUE_ELEVE",
            "stations_insufficient": stations_insufficient,
        }

    def _build_recommendations(
        self,
        input_payload: dict[str, Any],
        matrix_result: dict[str, Any],
        risk_result: dict[str, Any],
    ) -> list[dict[str, Any]]:
        if risk_result["risk_level"] != "HIGH":
            return []

        try:
            strategies = matrix_service.recommend_axis_strategies(input_payload)
        except MatrixServiceError as exc:
            return [
                {
                    "recommendation_id": _new_id("rec"),
                    "type": "DILUTION_NOT_FEASIBLE",
                    "axis": "GLOBAL",
                    "title": "Aucune strategie calculee",
                    "description": exc.message,
                    "current_values": {},
                    "proposed_values": {},
                    "delta_values": {},
                    "expected_matrix_result": None,
                    "priority": 1,
                    "confidence": "LOW",
                    "method_used": MATRIX_RECOMMENDATION_METHOD,
                    "justification": exc.user_action or "Verifier le domaine de la matrice.",
                    "warnings": [exc.message],
                }
            ]

        recommendations: list[dict[str, Any]] = []
        base_values = {
            "QSebou_m3_s": float(input_payload["QSebou_m3_s"]),
            "QInnaouen_m3_s": float(input_payload["QInnaouen_m3_s"]),
            "QOuergha_m3_s": float(input_payload["QOuergha_m3_s"]),
        }
        for idx, strategy in enumerate(strategies, start=1):
            axis = strategy["axis"]
            if not strategy.get("feasible"):
                recommendations.append(
                    {
                        "recommendation_id": _new_id("rec"),
                        "type": "DILUTION_NO_FEASIBLE_SCENARIO",
                        "axis": axis,
                        "title": f"Aucun scenario suffisant sur l'axe {axis}",
                        "description": strategy.get("warning", "Aucun scenario suffisant trouve dans la matrice."),
                        "current_values": base_values,
                        "proposed_values": base_values,
                        "delta_values": {},
                        "expected_matrix_result": None,
                        "priority": idx,
                        "confidence": "LOW",
                        "method_used": MATRIX_RECOMMENDATION_METHOD,
                        "source_scenario_id": strategy.get("source_scenario_id"),
                        "target_scenario_id": None,
                        "matrix_version": matrix_result["matrix_version"],
                        "justification": "Aucune ligne SUFFISANT compatible n'existe dans la matrice NH4 v1 pour cet axe.",
                        "warnings": [strategy.get("warning", "Aucun scenario suffisant trouve.")],
                    }
                )
                continue
            field = strategy["field"]
            proposed = dict(base_values)
            proposed[field] = strategy["proposed_value"]
            deltas = {field: strategy["delta_value"]}
            recommendations.append(
                {
                    "recommendation_id": _new_id("rec"),
                    "type": "DILUTION_FLOW_INCREASE",
                    "axis": axis,
                    "title": f"Augmenter le debit sur l'axe {axis}",
                    "description": f"Scenario de dilution propose sur l'axe {axis} depuis une ligne SUFFISANT de la matrice NH4 v1.",
                    "current_values": base_values,
                    "proposed_values": proposed,
                    "delta_values": deltas,
                    "expected_matrix_result": strategy["expected_matrix_result"],
                    "priority": idx,
                    "confidence": matrix_result["confidence_level"],
                    "method_used": MATRIX_RECOMMENDATION_METHOD,
                    "source_scenario_id": strategy.get("source_scenario_id"),
                    "target_scenario_id": strategy.get("target_scenario_id"),
                    "matrix_version": matrix_result["matrix_version"],
                    "justification": (
                        f"Ligne cible {strategy.get('target_scenario_id')} : plus petit debit superieur trouve "
                        f"sur l'axe {axis} avec les autres debits constants."
                    ),
                    "warnings": [
                        "Recommandation indicative : contraintes operationnelles barrage non integrees.",
                    ],
                }
            )
        return recommendations

    def _build_decision_reasoning(
        self,
        matrix_result: dict[str, Any],
        risk_result: dict[str, Any],
        recommendations: list[dict[str, Any]],
    ) -> dict[str, Any]:
        reasons = [
            (
                "Le scenario est insuffisant."
                if risk_result["risk_level"] == "HIGH"
                else "Le scenario reste dans le domaine suffisant du MVP."
            ),
            f"Concentration estimee a Sidi Allal Tazi : {matrix_result['C_SidiAllalTazi_mg_L']} mg/L.",
            f"Concentration estimee au Barrage de Garde : {matrix_result['C_BgGarde_mg_L']} mg/L.",
        ]
        if recommendations:
            primary = recommendations[0]
            reasons.append(
                f"La recommandation principale mobilise l'axe {primary['axis']} avec un effort hydraulique total de "
                f"{round(sum(primary['delta_values'].values()), 4)} m3/s."
            )
        reasons.extend(matrix_result.get("warnings", []))
        return {
            "summary": " ".join(reasons),
            "reasons": reasons,
            "human_validation_required": True,
        }

    def _build_snapshot(
        self,
        *,
        declaration_id: str,
        input_payload: dict[str, Any],
        topology_result: dict[str, Any],
        travel_time_result: dict[str, Any] | None,
        matrix_result: dict[str, Any],
        risk_result: dict[str, Any],
        recommendations: list[dict[str, Any]],
        decision_reasoning: dict[str, Any],
        requested_by: str | None,
    ) -> dict[str, Any]:
        warnings = list(topology_result.get("warnings") or [])
        if travel_time_result:
            warnings.extend(travel_time_result.get("warnings") or [])
        warnings.extend(matrix_result.get("warnings") or [])
        warnings.extend(item for recommendation in recommendations for item in recommendation.get("warnings", []))
        return {
            "snapshot_id": _new_id("snap"),
            "declaration_id": declaration_id,
            "input_payload": input_payload,
            "topology_payload": topology_result,
            "travel_time_payload": travel_time_result,
            "matrix_payload": matrix_result,
            "risk_payload": risk_result,
            "recommendation_payload": recommendations,
            "decision_reasoning": decision_reasoning,
            "matrix_version": matrix_result["matrix_version"],
            "topology_engine_version": "propagation_pollution_service_v1",
            "travel_time_reference_version": (travel_time_result or {}).get("reference_version"),
            "recommendation_engine_version": MATRIX_RECOMMENDATION_METHOD,
            "method_used": matrix_result["method_used"],
            "warnings": warnings,
            "executed_at": _utcnow(),
            "executed_by": requested_by or "user",
        }

    def _build_report_payload(self, record: StoredDeclaration, snapshot: dict[str, Any]) -> dict[str, Any]:
        return {
            "report_id": _new_id("report"),
            "generated_at": _utcnow(),
            "declaration": {
                key: record.data[key]
                for key in (
                    "declaration_id",
                    "reference",
                    "date_declaration",
                    "detected_at",
                    "polluant",
                    "Crejet_mg_L",
                    "QRejet_m3_s",
                    "QSebou_m3_s",
                    "QInnaouen_m3_s",
                    "QOuergha_m3_s",
                )
            },
            "topology_result": snapshot["topology_payload"],
            "travel_time_result": snapshot.get("travel_time_payload"),
            "matrix_result": snapshot["matrix_payload"],
            "risk_result": snapshot["risk_payload"],
            "recommendations": snapshot["recommendation_payload"],
            "decision_reasoning": snapshot["decision_reasoning"],
            "warnings": snapshot["warnings"],
            "snapshot_id": snapshot["snapshot_id"],
            "limitations": [
                "Topologie reelle consommee depuis le moteur propagation existant.",
                "Matrice NH4 v1 issue de la ressource versionnee Excel.",
                "Recommandations indicatives : contraintes operationnelles non integrees.",
            ],
        }

    def _new_transition(
        self,
        *,
        from_status: str | None,
        to_status: str,
        trigger: str,
        actor: str | None,
        reason: str | None,
    ) -> dict[str, Any]:
        return {
            "transition_id": _new_id("tr"),
            "from_status": from_status,
            "to_status": to_status,
            "trigger": trigger,
            "actor": actor,
            "reason": reason,
            "created_at": _utcnow(),
        }

    def _transition(
        self,
        record: StoredDeclaration,
        *,
        to_status: str,
        trigger: str,
        actor: str | None,
        reason: str | None,
    ) -> None:
        transition = self._new_transition(
            from_status=record.data["status"],
            to_status=to_status,
            trigger=trigger,
            actor=actor,
            reason=reason,
        )
        record.transitions.append(transition)
        record.data["status"] = to_status
        record.data["updated_at"] = transition["created_at"]

    def _build_response(self, record: StoredDeclaration) -> PollutionDeclarationResponse:
        return PollutionDeclarationResponse(
            declaration_id=record.data["declaration_id"],
            reference=record.data["reference"],
            status=record.data["status"],
            date_declaration=record.data["date_declaration"],
            detected_at=record.data.get("detected_at"),
            point_declaration=GeoJsonPoint(**record.data["point_declaration"]),
            polluant=record.data["polluant"],
            Crejet_mg_L=record.data["Crejet_mg_L"],
            QRejet_m3_s=record.data["QRejet_m3_s"],
            QSebou_m3_s=record.data["QSebou_m3_s"],
            QInnaouen_m3_s=record.data["QInnaouen_m3_s"],
            QOuergha_m3_s=record.data["QOuergha_m3_s"],
            commentaire=record.data.get("commentaire"),
            current_snapshot_id=record.current_snapshot_id,
            report_available=record.report_payload is not None,
            created_at=record.data["created_at"],
            updated_at=record.data["updated_at"],
            transitions=[_build_transition_model(item) for item in record.transitions],
        )


declaration_pollution_service = DeclarationPollutionService()

