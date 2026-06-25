from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.api.v1.data_admin.rbac_guard import (
    CAPABILITY_UPLOAD_FILE,
    CAPABILITY_VIEW_AUDIT,
    DataAdminAccessContext,
    require_data_admin_capability,
)
from app.db.session import SessionLocal
from app.schemas.data_admin.ingestion import (
    DataAdminIngestionErrorsResponse,
    DataAdminIngestionRunDetailResponse,
    DataAdminIngestionRunsResponse,
    DataAdminIngestionStagingPreviewResponse,
    DataAdminIngestionUploadResponse,
)
from app.services.data_admin.ingestion_validation_service import DataAdminIngestionService


router = APIRouter(prefix="/data-admin", tags=["data-admin-ingestion"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/classes/{class_code}/ingestion/upload", response_model=DataAdminIngestionUploadResponse)
async def upload_ingestion_file(
    class_code: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_UPLOAD_FILE)),
):
    service = DataAdminIngestionService(db)
    try:
        content = await file.read()
        return service.upload_and_stage(
            class_code=class_code,
            file_name=file.filename or "upload.dat",
            mime_type=file.content_type or "application/octet-stream",
            content=content,
            created_by=access.actor,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/ingestion/runs", response_model=DataAdminIngestionRunsResponse)
def list_ingestion_runs(
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = DataAdminIngestionService(db)
    return service.list_runs(limit=limit)


@router.get("/ingestion/runs/{run_id}", response_model=DataAdminIngestionRunDetailResponse)
def get_ingestion_run(
    run_id: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = DataAdminIngestionService(db)
    try:
        return service.get_run(run_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/ingestion/runs/{run_id}/errors", response_model=DataAdminIngestionErrorsResponse)
def get_ingestion_run_errors(
    run_id: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = DataAdminIngestionService(db)
    return service.get_run_errors(run_id)


@router.get("/ingestion/runs/{run_id}/staging-preview", response_model=DataAdminIngestionStagingPreviewResponse)
def get_ingestion_staging_preview(
    run_id: str,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = DataAdminIngestionService(db)
    return service.get_staging_preview(run_id, limit=limit)
