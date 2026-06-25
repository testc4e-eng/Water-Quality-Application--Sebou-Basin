from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.schemas.layer_config import LayerConfigCreate, LayerConfigResponse, LayerConfigUpdate
from app.security.deps import require_roles
from app.security.models import SecurityUser
from app.services.layer_config_service import LayerConfigService

router = APIRouter(prefix="/layers/configs", tags=["layer-configs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_service(db: Session = Depends(get_db)) -> LayerConfigService:
    return LayerConfigService(db)


@router.get("", response_model=list[LayerConfigResponse])
def list_configs(
    active_only: bool = True,
    service: LayerConfigService = Depends(get_service),
):
    return service.get_all(active_only=active_only)


@router.get("/{layer_name}", response_model=LayerConfigResponse)
def get_config(
    layer_name: str,
    service: LayerConfigService = Depends(get_service),
):
    config = service.get_by_name(layer_name)
    if not config:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail=f"Layer '{layer_name}' not found")
    return config


@router.post("", response_model=LayerConfigResponse, status_code=status.HTTP_201_CREATED)
def create_config(
    config: LayerConfigCreate,
    current_user: SecurityUser = Depends(require_roles("admin")),
    service: LayerConfigService = Depends(get_service),
):
    creator = current_user.email if current_user else None
    return service.create(config, created_by=creator)


@router.put("/{layer_name}", response_model=LayerConfigResponse)
def update_config(
    layer_name: str,
    config: LayerConfigUpdate,
    _: SecurityUser = Depends(require_roles("admin")),
    service: LayerConfigService = Depends(get_service),
):
    return service.update(layer_name, config)


@router.delete("/{layer_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_config(
    layer_name: str,
    _: SecurityUser = Depends(require_roles("admin")),
    service: LayerConfigService = Depends(get_service),
):
    service.soft_delete(layer_name)
    return None
