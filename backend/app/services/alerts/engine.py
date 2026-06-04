from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.services.kpi.engine import get_overview_kpis, get_pollution_kpis, get_station_kpis, get_subbasin_kpis


def _severity_label(score: float) -> str:
    if score >= 75:
        return "HIGH"
    if score >= 45:
        return "MEDIUM"
    return "LOW"


def list_alerts(
    db: Session,
    *,
    alert_type: str | None = None,
    limit: int = 50,
    entity_name: str | None = None,
    site_id: str | None = None,
) -> list[dict[str, Any]]:
    station_kpis = get_station_kpis(db)
    pollution_kpis = get_pollution_kpis(db)
    subbasin_kpis = get_subbasin_kpis(db)
    overview = get_overview_kpis(db)

    alerts: list[dict[str, Any]] = []

    for station in station_kpis["top_stations"][:8]:
        if station["status"] == "critique":
            alerts.append(
                {
                    "type": "QUALITY",
                    "code": "ALERT_QUALITY",
                    "severity": "HIGH",
                    "title": f"Station critique : {station['station_name']}",
                    "description": f"Statut {station['status']} avec fraîcheur {station.get('freshness_score') or 'N/D'}/100.",
                    "recommendation": "Contrôle terrain recommandé et revue qualité prioritaire.",
                    "entity_name": station["station_name"],
                }
            )
        elif station["status"] == "surveillance":
            alerts.append(
                {
                    "type": "QUALITY",
                    "code": "ALERT_QUALITY",
                    "severity": "MEDIUM",
                    "title": f"Station sous surveillance : {station['station_name']}",
                    "description": "Station classée en surveillance sur le dernier état qualité exploitable.",
                    "recommendation": "Maintenir le suivi rapproché et comparer la tendance récente.",
                    "entity_name": station["station_name"],
                }
            )
        if (station.get("freshness_days") or 0) > 180:
            alerts.append(
                {
                    "type": "DATA",
                    "code": "ALERT_DATA",
                    "severity": "HIGH",
                    "title": f"Donnée obsolète : {station['station_name']}",
                    "description": f"Aucune donnée utile récente depuis {station['freshness_days']} jours.",
                    "recommendation": "Campagne de mesure recommandée.",
                    "entity_name": station["station_name"],
                }
            )

    for site in pollution_kpis["top_sites"][:6]:
        if site_id and site["site_id"] != site_id:
            continue
        if entity_name and entity_name.lower() not in (site.get("site_name") or "").lower():
            continue
        severity = _severity_label(float(site["ipp"]))
        alerts.append(
            {
                "type": "POLLUTION",
                "code": "ALERT_POLLUTION",
                "severity": severity,
                "title": f"Pollution prioritaire : {site.get('site_name') or site['site_id']}",
                "description": f"IPP {site['ipp']}/100 · snap {site['snap_confidence']} · {site['reachable_stations']} station(s) atteignable(s).",
                "recommendation": "Renforcer la surveillance aval et vérifier la confiance du snap avant décision terrain.",
                "entity_name": site.get("site_name"),
                "site_id": site["site_id"],
            }
        )

    for subbasin in subbasin_kpis["top_subbasins"][:3]:
        if subbasin["risk_score"] >= 60:
            alerts.append(
                {
                    "type": "QUALITY",
                    "code": "ALERT_SUBBASIN",
                    "severity": "MEDIUM",
                    "title": f"Sous-bassin à risque : {subbasin['subbasin_name']}",
                    "description": f"Score ISR local {subbasin['risk_score']}/100, {subbasin['critical']} station(s) critique(s).",
                    "recommendation": "Prioriser le sous-bassin dans l'analyse et les actions de surveillance.",
                    "entity_name": subbasin["subbasin_name"],
                }
            )

    alerts.append(
        {
            "type": "HYDRO",
            "code": "ALERT_HYDRO",
            "severity": "LOW",
            "title": "Réseau hydraulique validé",
            "description": f"ICH {overview['ich']}/100 basé sur le réseau validé et la connectivité lue en lecture seule.",
            "recommendation": "Utiliser ce niveau de confiance comme socle, sans recalcul hydraulique en Sprint 1.5.",
            "entity_name": "Bassin Sebou",
        }
    )

    if alert_type:
        alert_type = alert_type.upper()
        alerts = [alert for alert in alerts if alert["type"] == alert_type]

    alerts.sort(key=lambda item: ({"HIGH": 0, "MEDIUM": 1, "LOW": 2}[item["severity"]], item["title"]))
    return alerts[:limit]
