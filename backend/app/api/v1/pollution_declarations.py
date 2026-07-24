from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.pollution_declaration_models import (
    ApiErrorResponse,
    PollutionDeclarationCreateRequest,
    PollutionDeclarationEvaluateRequest,
    PollutionDeclarationEvaluationResponse,
    PollutionDeclarationListResponse,
    PollutionDeclarationReportResponse,
    PollutionDeclarationResponse,
    PollutionDeclarationTransitionRequest,
)
from app.services.declaration_pollution_service import (
    DeclarationServiceError,
    declaration_pollution_service,
)


router = APIRouter(prefix="/pollution/declarations", tags=["Pollution Declaration MVP"])


def _error_response(exc: DeclarationServiceError) -> JSONResponse:
    payload = ApiErrorResponse(
        code=exc.code,
        message=exc.message,
        http_status=exc.http_status,
        workflow_status=exc.workflow_status,
        details=exc.details,
        user_action=exc.user_action,
    )
    return JSONResponse(status_code=exc.http_status, content=payload.model_dump(mode="json"))


@router.post("", response_model=PollutionDeclarationResponse)
def create_declaration(payload: PollutionDeclarationCreateRequest):
    try:
        return declaration_pollution_service.create_declaration(payload)
    except DeclarationServiceError as exc:
        return _error_response(exc)


@router.get("", response_model=PollutionDeclarationListResponse)
def list_declarations():
    return declaration_pollution_service.list_declarations()


@router.get("/{declaration_id}", response_model=PollutionDeclarationResponse)
def get_declaration(declaration_id: str):
    try:
        return declaration_pollution_service.get_declaration(declaration_id)
    except DeclarationServiceError as exc:
        return _error_response(exc)


@router.post("/{declaration_id}/submit", response_model=PollutionDeclarationResponse)
def submit_declaration(declaration_id: str, payload: PollutionDeclarationTransitionRequest):
    try:
        return declaration_pollution_service.submit_declaration(declaration_id, payload)
    except DeclarationServiceError as exc:
        return _error_response(exc)


@router.post("/{declaration_id}/evaluate", response_model=PollutionDeclarationEvaluationResponse)
def evaluate_declaration(declaration_id: str, payload: PollutionDeclarationEvaluateRequest):
    try:
        return declaration_pollution_service.evaluate_declaration(declaration_id, payload)
    except DeclarationServiceError as exc:
        return _error_response(exc)


@router.post("/{declaration_id}/validate", response_model=PollutionDeclarationResponse)
def validate_declaration(declaration_id: str, payload: PollutionDeclarationTransitionRequest):
    try:
        return declaration_pollution_service.validate_declaration(declaration_id, payload)
    except DeclarationServiceError as exc:
        return _error_response(exc)


@router.post("/{declaration_id}/reject", response_model=PollutionDeclarationResponse)
def reject_declaration(declaration_id: str, payload: PollutionDeclarationTransitionRequest):
    try:
        return declaration_pollution_service.reject_declaration(declaration_id, payload)
    except DeclarationServiceError as exc:
        return _error_response(exc)


@router.post("/{declaration_id}/close", response_model=PollutionDeclarationResponse)
def close_declaration(declaration_id: str, payload: PollutionDeclarationTransitionRequest):
    try:
        return declaration_pollution_service.close_declaration(declaration_id, payload)
    except DeclarationServiceError as exc:
        return _error_response(exc)


@router.get("/{declaration_id}/report", response_model=PollutionDeclarationReportResponse)
def get_report(declaration_id: str):
    try:
        return declaration_pollution_service.get_report(declaration_id)
    except DeclarationServiceError as exc:
        return _error_response(exc)
