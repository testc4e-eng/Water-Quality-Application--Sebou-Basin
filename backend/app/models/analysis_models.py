from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal

class SeriesRequestItem(BaseModel):
    support_type: str
    object_id: str
    domain: str
    parameter_code: str

class BatchSeriesRequest(BaseModel):
    date_from: str
    date_to: str
    aggregation: Literal["raw", "daily", "monthly", "annual"]
    series: List[SeriesRequestItem] = Field(..., max_items=20)

class SeriesValue(BaseModel):
    date: str
    value: float | None
    quality_flag: Optional[str] = None

class SeriesSource(BaseModel):
    endpoint: str
    table: Optional[str] = None
    refreshed_at: Optional[str] = None

class AnalyticalSeries(BaseModel):
    id: str
    support_type: str
    object_id: str
    object_name: str
    domain: str
    subdomain: Optional[str] = None
    parameter_code: str
    parameter_label: str
    unit: Optional[str] = None
    aggregation: Optional[str] = None
    series_type: Optional[str] = "TIME_SERIES"
    data_family: Optional[str] = None
    measurement_context: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    values: List[SeriesValue]
    source: Optional[SeriesSource] = None

class BatchWarning(BaseModel):
    type: str
    series_ref: str
    message: str

class BatchStatus(BaseModel):
    requested: int
    returned: int
    empty: int
    failed: int

class BatchMeta(BaseModel):
    requested: int
    returned: int
    aggregation: str

class BatchSeriesResponse(BaseModel):
    series: List[AnalyticalSeries]
    warnings: List[BatchWarning]
    meta: BatchMeta
    status: BatchStatus


# ============================================================
# CORRELATION MODELS
# ============================================================

class CorrelationRequest(BaseModel):
    date_from: str
    date_to: str
    aggregation: Literal["raw", "daily", "monthly", "annual"]
    series: List[SeriesRequestItem] = Field(..., min_items=2, max_items=5)


class CorrelationSeriesOutput(BaseModel):
    object_id: str
    parameter_code: str
    domain: str
    support_type: str
    values: List[SeriesValue]


class AlignedPoint(BaseModel):
    date: str
    x: float
    y: float


class RegressionPoint(BaseModel):
    x: float
    y: float


class CorrelationStats(BaseModel):
    pearson_r: float
    r_squared: float
    slope: float
    intercept: float
    p_value: Optional[float] = None
    n_points: int


class CorrelationResponse(BaseModel):
    """Résultat d'une corrélation entre deux séries temporelles.

    En cas d'erreur métier, seuls les champs `error` et `message` sont renseignés.
    """
    error: Optional[str] = None
    message: Optional[str] = None
    series_x: Optional[CorrelationSeriesOutput] = None
    series_y: Optional[CorrelationSeriesOutput] = None
    aligned_data: Optional[List[AlignedPoint]] = None
    correlation: Optional[CorrelationStats] = None
    regression_line: Optional[List[RegressionPoint]] = None


class CorrelationMatrixItem(BaseModel):
    object_id: str
    parameter_code: str
    domain: str
    support_type: str


class CorrelationMatrixRequest(BaseModel):
    date_from: str
    date_to: str
    aggregation: Literal["raw", "daily", "monthly", "annual"]
    series: List[SeriesRequestItem] = Field(..., min_items=3, max_items=5)


class CorrelationMatrixResponse(BaseModel):
    error: Optional[str] = None
    message: Optional[str] = None
    series: Optional[List[CorrelationMatrixItem]] = None
    matrix: Optional[List[List[Optional[float]]]] = None
    n_points: Optional[List[List[Optional[int]]]] = None
