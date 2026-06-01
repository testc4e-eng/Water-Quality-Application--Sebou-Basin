from __future__ import annotations

from fastapi import Query
from pydantic import BaseModel, Field


class ExposureFilters(BaseModel):
    date_start: str | None = None
    date_end: str | None = None
    support_type: str | None = None
    support_id: str | None = None
    code_parametre: str | None = None
    qa_status: str | None = None
    geo_status: str | None = None
    limit: int = Field(default=500, ge=1, le=5000)
    offset: int = Field(default=0, ge=0)
    include_geom: bool = False


def exposure_filters(
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    support_type: str | None = Query(None),
    support_id: str | None = Query(None),
    code_parametre: str | None = Query(None),
    qa_status: str | None = Query(None),
    geo_status: str | None = Query(None),
    limit: int = Query(500, ge=1, le=5000),
    offset: int = Query(0, ge=0),
    include_geom: bool = Query(False),
) -> ExposureFilters:
    return ExposureFilters(
        date_start=date_start,
        date_end=date_end,
        support_type=support_type,
        support_id=support_id,
        code_parametre=code_parametre,
        qa_status=qa_status,
        geo_status=geo_status,
        limit=limit,
        offset=offset,
        include_geom=include_geom,
    )
