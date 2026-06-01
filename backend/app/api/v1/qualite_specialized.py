from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.repositories.api_views_repository import ApiViewsRepository, EXCLUDED_PARAMETER_CODES
from app.schemas.exposure import ExposureResponse
from app.schemas.filters import ExposureFilters, exposure_filters


router = APIRouter(prefix="/qualite", tags=["Qualite specialisee"])

SOURCE_VERSION = "2026-05-13"
BUSINESS_RULES = [
    "MO = matieres organiques",
    "Mo = molybdene",
    "MO != Mo",
    "FM/F_M_MES/MO_METAL excluded",
]


def _response_for_view(
    *,
    view_key: str,
    filters: ExposureFilters,
    db: Session,
) -> ExposureResponse:
    repository = ApiViewsRepository(db)
    view_name = repository.resolve_view(view_key)
    result = repository.query_view(
        view_key,
        date_start=filters.date_start,
        date_end=filters.date_end,
        support_type=filters.support_type,
        support_id=filters.support_id,
        code_parametre=filters.code_parametre,
        qa_status=filters.qa_status,
        geo_status=filters.geo_status,
        limit=filters.limit,
        offset=filters.offset,
        include_geom=filters.include_geom,
    )
    if hasattr(filters, "model_dump"):
        applied_filters = filters.model_dump(exclude_none=True)
    else:
        applied_filters = filters.dict(exclude_none=True)
    return ExposureResponse(
        status="success",
        count=result.total_count,
        filters=applied_filters,
        data=result.rows,
        metadata={
            "source_view": view_name,
            "source_version": SOURCE_VERSION,
            "total_count": result.total_count,
            "returned_count": len(result.rows),
            "limit": filters.limit,
            "offset": filters.offset,
            "has_more": filters.offset + len(result.rows) < result.total_count,
            "excluded_parameters": list(EXCLUDED_PARAMETER_CODES),
            "business_rules": BUSINESS_RULES,
            "elapsed_ms": result.elapsed_ms,
        },
    )


@router.get("/metaux", response_model=ExposureResponse)
def get_qualite_metaux(
    filters: ExposureFilters = Depends(exposure_filters),
    db: Session = Depends(get_climate_db),
) -> ExposureResponse:
    return _response_for_view(view_key="metaux", filters=filters, db=db)


@router.get("/chimie-minerale", response_model=ExposureResponse)
def get_qualite_chimie_minerale(
    filters: ExposureFilters = Depends(exposure_filters),
    db: Session = Depends(get_climate_db),
) -> ExposureResponse:
    return _response_for_view(view_key="chimie_minerale", filters=filters, db=db)


@router.get("/physicochimie", response_model=ExposureResponse)
def get_qualite_physicochimie(
    filters: ExposureFilters = Depends(exposure_filters),
    db: Session = Depends(get_climate_db),
) -> ExposureResponse:
    return _response_for_view(view_key="physicochimie", filters=filters, db=db)


@router.get("/pollution-organique", response_model=ExposureResponse)
def get_qualite_pollution_organique(
    filters: ExposureFilters = Depends(exposure_filters),
    db: Session = Depends(get_climate_db),
) -> ExposureResponse:
    return _response_for_view(view_key="pollution_organique", filters=filters, db=db)
