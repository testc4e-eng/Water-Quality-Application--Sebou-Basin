from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator

HEX_COLOR_PATTERN = r"^#[0-9A-Fa-f]{6}$"


class PointStyle(BaseModel):
    color: str = Field(pattern=HEX_COLOR_PATTERN)
    radius: int = Field(ge=1, le=50)
    opacity: float = Field(ge=0, le=1)
    strokeColor: str = Field(pattern=HEX_COLOR_PATTERN)
    strokeWidth: int = Field(ge=0, le=10)


class LineStyle(BaseModel):
    color: str = Field(pattern=HEX_COLOR_PATTERN)
    width: int = Field(ge=1, le=20)
    opacity: float = Field(ge=0, le=1)


class PolygonStyle(BaseModel):
    fillColor: str = Field(pattern=HEX_COLOR_PATTERN)
    fillOpacity: float = Field(ge=0, le=1)
    strokeColor: str = Field(pattern=HEX_COLOR_PATTERN)
    strokeWidth: int = Field(ge=0, le=10)


class StyleConfig(BaseModel):
    type: Literal["simple"] = "simple"
    point: PointStyle | None = None
    line: LineStyle | None = None
    polygon: PolygonStyle | None = None


class PopupField(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    alias: str = Field(min_length=1, max_length=150)
    order: int = Field(ge=1)
    visible: bool = True
    format: Literal["date", "number"] | None = None
    formatOptions: dict[str, Any] | None = None


class PopupConfig(BaseModel):
    fields: list[PopupField] = Field(default_factory=list)

    @field_validator("fields")
    @classmethod
    def validate_unique_order_and_name(cls, fields: list[PopupField]) -> list[PopupField]:
        orders = [field.order for field in fields]
        if len(orders) != len(set(orders)):
            raise ValueError("Duplicate order values")

        names = [field.name for field in fields]
        if len(names) != len(set(names)):
            raise ValueError("Duplicate field names")
        return fields


class LayerConfigCreate(BaseModel):
    layer_name: str = Field(min_length=1, max_length=100)
    geometry_type: Literal["point", "line", "polygon"]
    style_config: StyleConfig
    popup_config: PopupConfig

    @model_validator(mode="after")
    def validate_style_matches_geometry(self) -> "LayerConfigCreate":
        style = self.style_config
        by_geom = {
            "point": style.point,
            "line": style.line,
            "polygon": style.polygon,
        }
        if by_geom[self.geometry_type] is None:
            raise ValueError(f"style_config.{self.geometry_type} is required for geometry_type '{self.geometry_type}'")
        return self


class LayerConfigUpdate(BaseModel):
    geometry_type: Literal["point", "line", "polygon"]
    style_config: StyleConfig
    popup_config: PopupConfig

    @model_validator(mode="after")
    def validate_style_matches_geometry(self) -> "LayerConfigUpdate":
        style = self.style_config
        by_geom = {
            "point": style.point,
            "line": style.line,
            "polygon": style.polygon,
        }
        if by_geom[self.geometry_type] is None:
            raise ValueError(f"style_config.{self.geometry_type} is required for geometry_type '{self.geometry_type}'")
        return self


class LayerConfigResponse(BaseModel):
    id: int
    layer_name: str
    geometry_type: Literal["point", "line", "polygon"]
    style_config: StyleConfig
    popup_config: PopupConfig
    is_active: bool
    created_by: str | None = None
    created_at: datetime
    updated_at: datetime

