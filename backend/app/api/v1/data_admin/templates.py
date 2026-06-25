from __future__ import annotations

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.v1.data_admin.rbac_guard import (
    CAPABILITY_GENERATE_TEMPLATE,
    CAPABILITY_VIEW_AUDIT,
    DataAdminAccessContext,
    require_data_admin_capability,
)
from app.db.session import SessionLocal
from app.schemas.data_admin.templates import (
    DataAdminTemplateGenerateRequest,
    DataAdminTemplateSpecResponse,
)
from app.services.data_admin.template_generation_service import TemplateGenerationService


router = APIRouter(prefix="/data-admin", tags=["data-admin-templates"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/classes/{class_code}/template/spec", response_model=DataAdminTemplateSpecResponse)
def get_template_spec(
    class_code: str,
    db: Session = Depends(get_db),
    _=Depends(require_data_admin_capability(CAPABILITY_VIEW_AUDIT)),
):
    service = TemplateGenerationService(db)
    try:
        return service.get_template_spec(class_code)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/classes/{class_code}/template/generate")
def generate_template(
    class_code: str,
    payload: DataAdminTemplateGenerateRequest = Body(default=DataAdminTemplateGenerateRequest()),
    db: Session = Depends(get_db),
    access: DataAdminAccessContext = Depends(require_data_admin_capability(CAPABILITY_GENERATE_TEMPLATE)),
):
    service = TemplateGenerationService(db)
    try:
        generated = service.generate_template(
            class_code,
            file_format=payload.format,
            generated_by=access.actor,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return StreamingResponse(
        iter([generated.content]),
        media_type=generated.media_type,
        headers={"Content-Disposition": f'attachment; filename="{generated.filename}"'},
    )
