from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.map_business_service import (
    catalog,
    entities_geojson,
    entity_detail,
    entity_parameters,
    latest_values,
)
from app.services.regulatory_quality import classify_measurement, load_regulatory_context


router = APIRouter(prefix="/map", tags=["Carte metier P0"])


@router.get("/catalog")
def get_map_catalog() -> dict[str, Any]:
    return catalog()


@router.get("/entities")
def get_map_entities(
    support: str | None = Query(None, description="Legacy support code"),
    group_code: str | None = Query(None),
    support_code: str | None = Query(None),
    parameter_code: str | None = Query(None),
    commune: str | None = Query(None),
    bbox: str | None = Query(None, description="minx,miny,maxx,maxy EPSG:4326"),
    limit: int = Query(1000, ge=1, le=5000),
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    try:
        return entities_geojson(
            db,
            support=support or "idp_pollution",
            group_code=group_code,
            support_code=support_code,
            parameter_code=parameter_code,
            commune=commune,
            bbox=bbox,
            limit=limit,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("/entities/{entity_id}")
def get_map_entity(
    entity_id: str,
    support: str = Query("idp_pollution"),
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    try:
        result = entity_detail(db, support=support, entity_id=entity_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    if not result:
        raise HTTPException(status_code=404, detail="Entite introuvable")
    return result


@router.get("/entities/{entity_id}/parameters")
def get_map_entity_parameters(
    entity_id: str,
    support: str = Query("idp_pollution"),
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    try:
        return entity_parameters(db, support=support, entity_id=entity_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("/entities/{entity_id}/timeseries")
def get_map_entity_timeseries(
    entity_id: str,
    support: str = Query("idp_pollution"),
    parameter_code: str | None = Query(None),
) -> dict[str, Any]:
    return {
        "status": "not_implemented_p1",
        "support": support,
        "entity_id": entity_id,
        "parameter_code": parameter_code,
        "message": "Series temporelles prevues en P1 pour eviter un contrat incomplet en P0.",
    }


@router.get("/latest-values")
def get_map_latest_values(
    support: str = Query("idp_pollution"),
    parameter_code: str | None = Query(None),
    limit: int = Query(1000, ge=1, le=5000),
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    return latest_values(db, support=support, parameter_code=parameter_code, limit=limit)


@router.get("/classification")
def get_map_classification(
    parameter_code: str,
    value: float | None = None,
    unit: str | None = None,
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    context = load_regulatory_context(db)
    return classify_measurement(context, parameter_code=parameter_code, value_numeric=value, unit=unit)


@router.get("/layers")
def get_map_layers() -> dict[str, Any]:
    return {
        "status": "success",
        "layers": [
            {"key": "bassin_sebou", "endpoint": "/api/v1/layers/bassin_sebou", "role": "context"},
            {"key": "sous_bassin_sebou", "endpoint": "/api/v1/layers/sous_bassin_sebou", "role": "context"},
            {"key": "reseau_hydro_abhs", "endpoint": "/api/v1/layers/reseau_hydro_abhs", "role": "network"},
            {"key": "barrages_abhs", "endpoint": "/api/v1/layers/barrages_abhs", "role": "support"},
            {"key": "step_abhs", "endpoint": "/api/v1/layers/step_abhs", "role": "pollution_source"},
            {"key": "rejets_industriels_abhs", "endpoint": "/api/v1/layers/rejets_industriels_abhs", "role": "pollution_source"},
            {"key": "rejets_domestiques_abhs", "endpoint": "/api/v1/layers/rejets_domestiques_abhs", "role": "pollution_source"},
        ],
    }
