from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.v1.data_admin.rbac_guard import (
    CAPABILITY_APPLY_ROLLBACK,
    CAPABILITY_APPLY_CHANGE_REQUEST,
    CAPABILITY_APPROVE_CHANGE_REQUEST,
    CAPABILITY_CREATE_CHANGE_REQUEST,
    CAPABILITY_SUBMIT_CHANGE_REQUEST,
    CAPABILITY_VIEW_AUDIT,
    DataAdminAccessContext,
    require_data_admin_capability,
)
from app.db.session import SessionLocal
from app.schemas.data_admin.change_requests import (
    DataAdminChangeRequestActionRequest,
    DataAdminChangeRequestCreateRequest,
    DataAdminChangeRequestDetailResponse,
    DataAdminChangeRequestListResponse,
    DataAdminPromotionAuditLogResponse,
    DataAdminRollbackStatusResponse,
)
from app.services.data_admin.change_request_service import ChangeRequestService
from app.services.data_admin.rollback_service import RollbackService


router = APIRouter(prefix="/data-admin", tags=["data-admin-change-requests"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/ingestion/runs/{run_id}/change-request", response_model=DataAdminChangeRequestDetailResponse)
def create_change_request(
    run_id: str,
    payload: DataAdminChangeRequestCreateRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_CREATE_CHANGE_REQUEST)),
):
    service = ChangeRequestService(db)
    try:
        return service.create_change_request(run_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/change-requests", response_model=DataAdminChangeRequestListResponse)
def list_change_requests(
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ChangeRequestService(db)
    return service.list_change_requests(limit=limit)


@router.get("/change-requests/{change_request_id}", response_model=DataAdminChangeRequestDetailResponse)
def get_change_request(
    change_request_id: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ChangeRequestService(db)
    try:
        return service.get_change_request(change_request_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/submit", response_model=DataAdminChangeRequestDetailResponse)
def submit_change_request(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_SUBMIT_CHANGE_REQUEST)),
):
    service = ChangeRequestService(db)
    try:
        return service.submit_change_request(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/approve", response_model=DataAdminChangeRequestDetailResponse)
def approve_change_request(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_APPROVE_CHANGE_REQUEST)),
):
    service = ChangeRequestService(db)
    try:
        return service.approve_change_request(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/reject", response_model=DataAdminChangeRequestDetailResponse)
def reject_change_request(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_APPROVE_CHANGE_REQUEST)),
):
    service = ChangeRequestService(db)
    try:
        return service.reject_change_request(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/apply", response_model=DataAdminChangeRequestDetailResponse)
def apply_change_request(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_APPLY_ROLLBACK)),
):
    service = ChangeRequestService(db)
    try:
        return service.apply_change_request(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/change-requests/{change_request_id}/audit-log", response_model=DataAdminPromotionAuditLogResponse)
def get_change_request_audit_log(
    change_request_id: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ChangeRequestService(db)
    try:
        return service.get_audit_log(change_request_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/rollback/prepare", response_model=DataAdminRollbackStatusResponse)
def prepare_change_request_rollback(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = RollbackService(db)
    try:
        return service.prepare_rollback(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/rollback/request", response_model=DataAdminRollbackStatusResponse)
def request_change_request_rollback(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_APPROVE_CHANGE_REQUEST)),
):
    service = RollbackService(db)
    try:
        return service.request_rollback(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/rollback/approve", response_model=DataAdminRollbackStatusResponse)
def approve_change_request_rollback(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_APPROVE_CHANGE_REQUEST)),
):
    service = RollbackService(db)
    try:
        return service.approve_rollback(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/change-requests/{change_request_id}/rollback/apply", response_model=DataAdminRollbackStatusResponse)
def apply_change_request_rollback(
    change_request_id: str,
    payload: DataAdminChangeRequestActionRequest,
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_APPLY_CHANGE_REQUEST)),
):
    service = RollbackService(db)
    try:
        return service.apply_rollback(change_request_id, actor=access.actor, comments=payload.comments)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/change-requests/{change_request_id}/rollback/status", response_model=DataAdminRollbackStatusResponse)
def get_change_request_rollback_status(
    change_request_id: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = RollbackService(db)
    try:
        return service.get_rollback_status(change_request_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
