from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel


class DataAdminTemplateFieldSpec(BaseModel):
    field_name: str
    field_label: str
    data_type: str
    required: bool = False
    editable: bool = False
    ingestable: bool = False
    validation_rule: str | None = None
    reference_source: str | None = None
    example_value: str | None = None
    unit_expected: str | None = None
    allowed_values_source: str | None = None
    description: str | None = None
    display_order: int = 0


class DataAdminTemplateSheetSpec(BaseModel):
    sheet_name: str
    purpose: str
    columns: list[str]


class DataAdminTemplateSpecData(BaseModel):
    class_code: str
    class_label: str
    domain: str
    target_schema: str
    target_table: str
    staging_schema: str | None = None
    staging_table: str | None = None
    template_version: str
    file_formats: list[str]
    field_source: str
    field_registry_incomplete: bool
    fields: list[DataAdminTemplateFieldSpec]
    sheets: list[DataAdminTemplateSheetSpec]
    instructions: list[str]
    metadata_rows: list[dict[str, str]]
    warnings: list[str]


class DataAdminTemplateSpecResponse(BaseModel):
    status: str
    class_code: str
    data: DataAdminTemplateSpecData
    metadata: dict[str, Any]


class DataAdminTemplateGenerateRequest(BaseModel):
    format: Literal["xlsx", "csv"] = "xlsx"
    generated_by: str | None = "data_admin_ui"
