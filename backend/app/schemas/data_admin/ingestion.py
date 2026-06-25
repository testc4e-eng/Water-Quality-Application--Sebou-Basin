from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class DataAdminIngestionError(BaseModel):
    error_id: str
    run_id: str
    row_number: int | None = None
    field_name: str | None = None
    error_scope: str
    severity: str
    error_code: str
    error_message: str
    raw_value: str | None = None
    expected_rule: str | None = None
    created_at: datetime


class DataAdminIngestionRunSummary(BaseModel):
    run_id: str
    class_code: str
    run_status: str
    file_name: str
    file_format: str
    row_count: int
    valid_row_count: int
    error_row_count: int
    warning_count: int
    created_by: str
    created_at: datetime
    validated_at: datetime | None = None
    staged_at: datetime | None = None
    metadata: dict[str, Any]


class DataAdminIngestionFileSummary(BaseModel):
    file_id: str
    run_id: str
    file_name: str
    file_format: str
    mime_type: str
    file_size_bytes: int
    sha256: str
    stored_path: str | None = None
    raw_preview: list[dict[str, Any]]
    created_at: datetime


class DataAdminIngestionUploadResponse(BaseModel):
    status: str
    run: DataAdminIngestionRunSummary
    file: DataAdminIngestionFileSummary
    errors: list[DataAdminIngestionError]
    staging_row_count: int
    metadata: dict[str, Any]


class DataAdminIngestionRunsResponse(BaseModel):
    status: str
    count: int
    data: list[DataAdminIngestionRunSummary]
    metadata: dict[str, Any]


class DataAdminIngestionRunDetailResponse(BaseModel):
    status: str
    run: DataAdminIngestionRunSummary
    file: DataAdminIngestionFileSummary | None = None
    metadata: dict[str, Any]


class DataAdminIngestionErrorsResponse(BaseModel):
    status: str
    run_id: str
    count: int
    data: list[DataAdminIngestionError]
    metadata: dict[str, Any]


class DataAdminIngestionStagingPreviewRow(BaseModel):
    staging_row_id: str
    run_id: str
    class_code: str
    row_number: int
    row_status: str
    raw_payload: dict[str, Any]
    normalized_payload: dict[str, Any]
    validation_errors: list[dict[str, Any]]
    created_at: datetime


class DataAdminIngestionStagingPreviewResponse(BaseModel):
    status: str
    run_id: str
    count: int
    data: list[DataAdminIngestionStagingPreviewRow]
    metadata: dict[str, Any]
