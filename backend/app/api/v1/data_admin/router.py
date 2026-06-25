from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.api.v1.data_admin.rbac_guard import (
    CAPABILITY_VIEW_AUDIT,
    require_data_admin_capability,
)
from app.schemas.data_admin.classes import (
    DataAdminClassCountResponse,
    DataAdminClassDetailResponse,
    DataAdminClassListResponse,
    DataAdminClassRecordsResponse,
    DataAdminClassSchemaResponse,
)
from app.schemas.data_admin.validation_rules import DataAdminValidationRulesResponse
from app.services.data_admin.dynamic_validation_service import DynamicValidationService
from app.services.data_admin.class_registry_service import ClassRegistryService


router = APIRouter(prefix="/data-admin", tags=["data-admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/classes", response_model=DataAdminClassListResponse)
def list_classes(
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ClassRegistryService(db)
    return service.list_classes()


@router.get("/classes/{class_code}", response_model=DataAdminClassDetailResponse)
def get_class(
    class_code: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ClassRegistryService(db)
    try:
        return service.get_class(class_code)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/classes/{class_code}/schema", response_model=DataAdminClassSchemaResponse)
def get_class_schema(
    class_code: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ClassRegistryService(db)
    try:
        return service.get_class_schema(class_code)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/classes/{class_code}/records", response_model=DataAdminClassRecordsResponse)
def get_class_records(
    class_code: str,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ClassRegistryService(db)
    try:
        return service.get_class_records(class_code, limit=limit, offset=offset, filters={})
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/classes/{class_code}/count", response_model=DataAdminClassCountResponse)
def get_class_count(
    class_code: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = ClassRegistryService(db)
    try:
        return service.get_class_count(class_code)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/validation-rules", response_model=DataAdminValidationRulesResponse)
def list_validation_rules(
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = DynamicValidationService(db)
    return service.list_rules()


@router.get("/classes/{class_code}/validation-rules", response_model=DataAdminValidationRulesResponse)
def get_class_validation_rules(
    class_code: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = DynamicValidationService(db)
    return service.list_rules(class_code=class_code)
