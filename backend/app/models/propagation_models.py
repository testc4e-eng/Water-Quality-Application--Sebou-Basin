# backend/app/models/propagation_models.py
from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class SimulatePropagationRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90, description="Latitude du point de rejet (WGS84)")
    lon: float = Field(..., ge=-180, le=180, description="Longitude du point de rejet (WGS84)")
    pollutant_type: Literal["Cd", "Pb", "Hg", "Cr", "Hydrocarbures", "Autre"] = Field(
        ..., description="Famille de polluant"
    )
    initial_concentration_mg_l: float = Field(..., gt=0, description="Concentration initiale en mg/L")
    timestamp: datetime = Field(..., description="Date/heure du rejet")
    simulation_hours: int = Field(default=72, ge=1, le=720, description="Horizon de simulation en heures")
    vitesse_reference_kmh: float = Field(default=10.0, gt=0, le=200, description="Vitesse d'écoulement de référence")
    lambda_1_per_h: float = Field(default=0.05, ge=0, le=2, description="Coefficient d'atténuation exponentiel (h⁻¹)")


class ImpactedStation(BaseModel):
    station_id: str
    station_name: str
    station_type: str
    lat: float
    lon: float
    distance_km: float
    arrival_time: datetime
    estimated_concentration_mg_l: float
    alert_level: Literal["SAFE", "WARNING", "CRITICAL"]


class Recommendation(BaseModel):
    priority: int
    action: str
    target: str
    deadline: datetime
    reason: str


class PathSummary(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[dict[str, Any]] = Field(default_factory=list)
    length_km: float
    travel_time_h: float


class SimulatePropagationResponse(BaseModel):
    propagation_id: str
    start_node: dict[str, Any]
    pollutant_type: str
    initial_concentration_mg_l: float
    parameters: dict[str, Any]
    path: PathSummary
    impacted_stations: list[ImpactedStation]
    impacted_barrages: list[ImpactedStation]
    impacted_exutoires: list[ImpactedStation]
    recommendations: list[Recommendation]
    warnings: list[str]
