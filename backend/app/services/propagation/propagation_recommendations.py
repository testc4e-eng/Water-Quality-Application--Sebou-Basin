# backend/app/services/propagation/propagation_recommendations.py
from __future__ import annotations

from datetime import datetime
from typing import Any


# Seuils provisoires en mg/L — à valider avec le métier.
ALERT_THRESHOLDS: dict[str, dict[str, float]] = {
    "Cd": {"WARNING": 0.005, "CRITICAL": 0.01},
    "Pb": {"WARNING": 0.01, "CRITICAL": 0.05},
    "Hg": {"WARNING": 0.001, "CRITICAL": 0.002},
    "Cr": {"WARNING": 0.05, "CRITICAL": 0.1},
    "Hydrocarbures": {"WARNING": 0.05, "CRITICAL": 0.1},
    "Autre": {"WARNING": 999999.0, "CRITICAL": 999999.0},
}


def get_alert_level(pollutant_type: str, concentration_mg_l: float) -> str:
    thresholds = ALERT_THRESHOLDS.get(pollutant_type, {})
    if concentration_mg_l >= thresholds.get("CRITICAL", float("inf")):
        return "CRITICAL"
    if concentration_mg_l >= thresholds.get("WARNING", float("inf")):
        return "WARNING"
    return "SAFE"


def generate_recommendations(
    impacted_stations: list[dict[str, Any]], pollutant_type: str
) -> list[dict[str, Any]]:
    recommendations: list[dict[str, Any]] = []
    thresholds = ALERT_THRESHOLDS.get(pollutant_type, {})
    for station in impacted_stations:
        alert_level = station.get("alert_level")
        arrival_time = station.get("arrival_time")
        if not isinstance(arrival_time, datetime):
            try:
                arrival_time = datetime.fromisoformat(str(arrival_time))
            except Exception:
                arrival_time = datetime.utcnow()
        name = (
            station.get("station_name")
            or station.get("barrage_name")
            or f"Exutoire {station.get('station_id')}"
        )
        concentration = float(station.get("estimated_concentration_mg_l", 0.0))
        if alert_level == "CRITICAL":
            recommendations.append(
                {
                    "priority": 1,
                    "action": f"Fermer la prise d'eau à {name}",
                    "target": name,
                    "deadline": arrival_time,
                    "reason": (
                        f"Concentration {pollutant_type} estimée {concentration:.3f} mg/L "
                        f"(seuil critique : {thresholds.get('CRITICAL')} mg/L)"
                    ),
                }
            )
        elif alert_level == "WARNING":
            recommendations.append(
                {
                    "priority": 2,
                    "action": f"Surveillance renforcée à {name}",
                    "target": name,
                    "deadline": arrival_time,
                    "reason": (
                        f"Concentration {pollutant_type} estimée {concentration:.3f} mg/L "
                        f"(seuil warning : {thresholds.get('WARNING')} mg/L)"
                    ),
                }
            )
    recommendations.sort(key=lambda x: x["priority"])
    return recommendations
