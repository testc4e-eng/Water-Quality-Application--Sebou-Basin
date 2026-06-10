from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class DataAdminChangeRequestActionRequest(BaseModel):
    comments: str | None = None


class DataAdminChangeRequestCreateRequest(BaseModel):
    comments: str | None = None


class DataAdminChangeRequestSummary(BaseModel):
    change_request_id: str
    run_id: str
    class_code: str
    request_status: str
    promotion_mode: str
    requested_by: str
    requested_at: datetime
    reviewed_by: str | None = None
    reviewed_at: datetime | None = None
    approved_by: str | None = None
    approved_at: datetime | None = None
    rejected_by: str | None = None
    rejected_at: datetime | None = None
    applied_by: str | None = None
    applied_at: datetime | None = None
    rollback_available: bool = False
    rollback_status: str = "NOT_PREPARED"
    rollback_reference: dict[str, Any] | None = None
    rollback_requested_by: str | None = None
    rollback_requested_at: datetime | None = None
    rollback_approved_by: str | None = None
    rollback_approved_at: datetime | None = None
    rollback_applied_by: str | None = None
    rollback_applied_at: datetime | None = None
    summary: dict[str, Any]
    comments: str | None = None


class DataAdminChangeRequestItem(BaseModel):
    item_id: str
    change_request_id: str
    staging_row_id: str
    item_status: str
    raw_payload: dict[str, Any]
    normalized_payload: dict[str, Any]
    validation_errors: list[dict[str, Any]]
    promotion_action: str
    target_schema: str
    target_table: str
    target_pk: dict[str, Any] | None = None
    applied_at: datetime | None = None
    error_message: str | None = None


class DataAdminChangeRequestDetail(BaseModel):
    request: DataAdminChangeRequestSummary
    items: list[DataAdminChangeRequestItem]


class DataAdminChangeRequestListResponse(BaseModel):
    status: str
    count: int
    data: list[DataAdminChangeRequestSummary]
    metadata: dict[str, Any]


class DataAdminChangeRequestDetailResponse(BaseModel):
    status: str
    data: DataAdminChangeRequestDetail
    metadata: dict[str, Any]


class DataAdminPromotionAuditLogEntry(BaseModel):
    audit_id: str
    change_request_id: str
    run_id: str
    class_code: str
    action: str
    target_schema: str | None = None
    target_table: str | None = None
    target_pk: dict[str, Any] | None = None
    payload: dict[str, Any]
    actor: str
    created_at: datetime
    metadata: dict[str, Any]


class DataAdminPromotionAuditLogResponse(BaseModel):
    status: str
    change_request_id: str
    count: int
    data: list[DataAdminPromotionAuditLogEntry]
    metadata: dict[str, Any]


class DataAdminRollbackStatusResponse(BaseModel):
    status: str
    data: DataAdminChangeRequestSummary
    metadata: dict[str, Any]
