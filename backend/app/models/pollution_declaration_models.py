from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


WorkflowStatus = Literal[
    "BROUILLON",
    "PRET_A_ANALYSER",
    "ANALYSE_EN_COURS",
    "ANALYSE_TERMINEE",
    "RISQUE_FAIBLE",
    "RISQUE_ELEVE",
    "RECOMMANDATION_PROPOSEE",
    "VALIDE_METIER",
    "CLOTURE",
    "REJETE",
    "ERREUR_ANALYSE",
]


class GeoJsonPoint(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: tuple[float, float] = Field(..., description="[lon, lat] in WGS84")


class PollutionDeclarationCreateRequest(BaseModel):
    date_declaration: datetime
    detected_at: datetime | None = None
    point_declaration: GeoJsonPoint
    polluant: str = Field(..., min_length=1)
    Crejet_mg_L: float = Field(..., gt=0)
    QRejet_m3_s: float = Field(..., gt=0)
    QSebou_m3_s: float = Field(..., gt=0)
    QInnaouen_m3_s: float = Field(..., gt=0)
    QOuergha_m3_s: float = Field(..., gt=0)
    commentaire: str | None = None


class PollutionDeclarationTransitionRequest(BaseModel):
    reason: str | None = None
    commentaire: str | None = None
    requested_by: str | None = None


class HydrologyOverride(BaseModel):
    QSebou_m3_s: float | None = Field(None, gt=0)
    QInnaouen_m3_s: float | None = Field(None, gt=0)
    QOuergha_m3_s: float | None = Field(None, gt=0)


class DischargeOverride(BaseModel):
    Crejet_mg_L: float | None = Field(None, gt=0)
    QRejet_m3_s: float | None = Field(None, gt=0)


class PollutionDeclarationEvaluateRequest(BaseModel):
    use_saved_values: bool = True
    detected_at: datetime | None = None
    override_hydrology: HydrologyOverride | None = None
    override_discharge: DischargeOverride | None = None
    commentaire_execution: str | None = None
    requested_by: str | None = None


class DeclarationTransitionRecord(BaseModel):
    transition_id: str
    from_status: str | None = None
    to_status: str
    trigger: str
    reason: str | None = None
    actor: str | None = None
    created_at: datetime


class PollutionDeclarationResponse(BaseModel):
    declaration_id: str
    reference: str
    status: WorkflowStatus
    date_declaration: datetime
    detected_at: datetime | None = None
    point_declaration: GeoJsonPoint
    polluant: str
    Crejet_mg_L: float
    QRejet_m3_s: float
    QSebou_m3_s: float
    QInnaouen_m3_s: float
    QOuergha_m3_s: float
    commentaire: str | None = None
    current_snapshot_id: str | None = None
    report_available: bool = False
    created_at: datetime
    updated_at: datetime
    transitions: list[DeclarationTransitionRecord] = Field(default_factory=list)


class PollutionDeclarationListResponse(BaseModel):
    items: list[PollutionDeclarationResponse]
    total: int
    page: int = 1
    page_size: int = 100


class ApiErrorResponse(BaseModel):
    code: str
    message: str
    http_status: int
    workflow_status: str | None = None
    details: dict[str, Any] | None = None
    user_action: str | None = None
    trace_id: str | None = None


class PollutionDeclarationEvaluationResponse(BaseModel):
    declaration_id: str
    status: WorkflowStatus
    topology_result: dict[str, Any]
    travel_time_result: dict[str, Any] | None = None
    matrix_result: dict[str, Any]
    risk_result: dict[str, Any]
    recommendations: list[dict[str, Any]]
    decision_reasoning: dict[str, Any] | None = None
    warnings: list[str] = Field(default_factory=list)
    errors: list[dict[str, Any]] = Field(default_factory=list)
    snapshot_id: str
    report_available: bool = False


class PollutionDeclarationReportResponse(BaseModel):
    declaration_id: str
    status: WorkflowStatus
    report_id: str
    generated_at: datetime
    report_payload: dict[str, Any]
    snapshot_id: str
