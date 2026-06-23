from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, HTTPException

from app.db.climate_database import get_climate_db
from sqlalchemy.orm import Session
from app.models.business_map_models import (
    AnalyticalSeries,
    BusinessMapAvailabilityResponse,
    BusinessMapFeatureCollection,
    BusinessMapLayersResponse,
)
from app.services import business_map_service

router = APIRouter(tags=["business-map"])


@router.get("/availability", response_model=BusinessMapAvailabilityResponse)
def get_business_map_availability(
    support_type: str | None = None,
    domain: str | None = None,
    subdomain: str | None = None,
    parameter_code: str | None = None,
    bassin_nom: str | None = None,
    recommended_v1: bool | None = None,
    data_temporality: str | None = None,
    data_family: str | None = None,
    measurement_context: str | None = None,
    db: Session = Depends(get_climate_db),
):
    result = business_map_service.get_availability(
        db=db,
        support_type=support_type,
        domain=domain,
        subdomain=subdomain,
        parameter_code=parameter_code,
        bassin_nom=bassin_nom,
        recommended_v1=recommended_v1,
        data_temporality=data_temporality,
        data_family=data_family,
        measurement_context=measurement_context,
    )
    return BusinessMapAvailabilityResponse(**result)


@router.get("/features", response_model=BusinessMapFeatureCollection)
def get_business_map_features(
    support_type: str | None = None,
    domain: str | None = None,
    subdomain: str | None = None,
    parameter_code: str | None = None,
    bassin_nom: str | None = None,
    bbox: str | None = Query(None, description="Format: minx,miny,maxx,maxy (obligatoire pour SOURCE_POLLUTION)"),
    limit: int = Query(1000, ge=1, le=5000),
    offset: int = Query(0, ge=0),
    data_temporality: str | None = None,
    data_family: str | None = None,
    measurement_context: str | None = None,
    db: Session = Depends(get_climate_db),
):
    try:
        return business_map_service.get_features(
            db=db,
            support_type=support_type,
            domain=domain,
            subdomain=subdomain,
            parameter_code=parameter_code,
            bassin_nom=bassin_nom,
            bbox=bbox,
            limit=limit,
            offset=offset,
            data_temporality=data_temporality,
            data_family=data_family,
            measurement_context=measurement_context,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/series", response_model=AnalyticalSeries)
def get_business_map_series(
    support_type: str,
    object_id: str,
    parameter_code: str,
    date_from: date | None = None,
    date_to: date | None = None,
    aggregation: str = Query("raw", regex="^(raw|daily|monthly|annual)$"),
    db: Session = Depends(get_climate_db),
):
    try:
        return business_map_service.get_series(
            db=db,
            support_type=support_type,
            object_id=object_id,
            parameter_code=parameter_code,
            date_from=date_from,
            date_to=date_to,
            aggregation=aggregation,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/object/{support_type}/{object_id}")
def get_business_map_object(
    support_type: str,
    object_id: str,
    db: Session = Depends(get_climate_db),
) -> dict[str, Any]:
    obj = business_map_service.get_object(db=db, support_type=support_type, object_id=object_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Objet non trouvé")
    return obj


@router.get("/layers", response_model=BusinessMapLayersResponse)
def get_business_map_layers() -> BusinessMapLayersResponse:
    layers = business_map_service.get_layers()
    return BusinessMapLayersResponse(layers=layers)
