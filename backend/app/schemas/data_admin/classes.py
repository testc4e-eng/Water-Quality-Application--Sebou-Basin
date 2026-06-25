from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class DataAdminClassSummary(BaseModel):
    class_code: str
    class_label: str
    domain: str
    target_schema: str
    target_table: str
    exposure_view_schema: str | None = None
    exposure_view_name: str | None = None
    staging_schema: str | None = None
    staging_table: str | None = None
    geometry_required: bool = False
    temporal_required: bool = False
    validation_level: str = "STANDARD"
    editable: bool = False
    ingestable: bool = False
    realtime_capable: bool = False
    owner_role: str = "DATA_MANAGER"
    status: str = "ACTIVE"
    db_execution_pending: bool = False


class DataAdminFieldSchema(BaseModel):
    field_name: str
    field_label: str
    data_type: str
    required: bool = False
    editable: bool = False
    ingestable: bool = False
    validation_rule: str | None = None
    reference_source: str | None = None
    display_order: int = 0


class DataAdminClassListResponse(BaseModel):
    status: str
    count: int
    data: list[DataAdminClassSummary]
    metadata: dict[str, Any]


class DataAdminClassDetailResponse(BaseModel):
    status: str
    data: DataAdminClassSummary
    metadata: dict[str, Any]


class DataAdminClassSchemaResponse(BaseModel):
    status: str
    class_code: str
    count: int
    data: list[DataAdminFieldSchema]
    metadata: dict[str, Any]


class DataAdminClassRecordsResponse(BaseModel):
    status: str
    class_code: str
    count: int
    limit: int
    offset: int
    data: list[dict[str, Any]]
    metadata: dict[str, Any]


class DataAdminClassCountResponse(BaseModel):
    status: str
    class_code: str
    count: int = Field(ge=0)
    metadata: dict[str, Any]
