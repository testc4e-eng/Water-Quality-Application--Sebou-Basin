from typing import Any, Literal
from pydantic import BaseModel, Field
from datetime import date


class BusinessMapAvailabilityItem(BaseModel):
    support_type: str
    domain: str
    subdomain: str | None = None
    parameter_code: str
    parameter_label: str
    unit: str | None = None
    object_count: int
    measure_count: int
    date_count: int | None = None
    date_min: date | None = None
    date_max: date | None = None
    has_geometry: bool
    has_timeseries: bool
    has_thresholds: bool
    recommended_v1: bool
    authorized_basin: str | None = None
    source_table: str | None = None
    data_family: str | None = None
    measurement_context: str | None = None
    data_temporality: str | None = None


class AvailableOptions(BaseModel):
    supports: list[str]
    domains: list[str]
    parameters: list[str]


class BusinessMapAvailabilityResponse(BaseModel):
    items: list[BusinessMapAvailabilityItem]
    total: int
    available_options: AvailableOptions


class FeatureProperties(BaseModel):
    object_id: str
    object_name: str
    object_code: str | None = None
    support_type: str
    bassin_nom: str | None = None
    sous_bassin_nom: str | None = None
    attributes: dict[str, Any] = Field(default_factory=dict)
    latest_values: dict[str, Any] | None = None
    recommended_v1: bool


class Feature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: str
    geometry: dict[str, Any]
    properties: FeatureProperties


class BusinessMapFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[Feature]
    metadata: dict[str, Any]


class AnalyticalSeriesValue(BaseModel):
    date: str
    value: float | None
    quality_flag: str | None = None


class AnalyticalSeries(BaseModel):
    id: str
    support_type: str
    support_id: str
    support_name: str | None = None
    domain: str
    subdomain: str | None = None
    parameter_code: str
    parameter_label: str | None = None
    unit: str | None = None
    date_from: date | None = None
    date_to: date | None = None
    aggregation: Literal["raw", "daily", "monthly", "annual"] | None = None
    series_type: Literal["TIME_SERIES", "POINT_MEASURE"] = "TIME_SERIES"
    data_family: str | None = None
    measurement_context: str | None = None
    source_table: str | None = None
    values: list[AnalyticalSeriesValue]


class BusinessMapLayer(BaseModel):
    layer_id: str
    label: str
    category: str
    visible: bool = True
    min_zoom: int = 0
    max_zoom: int = 22
    style: dict[str, Any] = Field(default_factory=dict)

class BusinessMapLayersResponse(BaseModel):
    layers: list[BusinessMapLayer]
