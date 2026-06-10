from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class DataAdminValidationRule(BaseModel):
    rule_id: str
    class_code: str
    field_name: str | None = None
    rule_code: str
    rule_label: str
    severity: str
    rule_type: str
    reference_schema: str | None = None
    reference_table: str | None = None
    reference_column: str | None = None
    sql_template: str | None = None
    active: bool
    description: str | None = None
    created_at: datetime
    updated_at: datetime


class DataAdminValidationRulesResponse(BaseModel):
    status: str
    count: int
    data: list[DataAdminValidationRule]
    metadata: dict[str, object]
