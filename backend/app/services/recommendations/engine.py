from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.services.alerts.engine import list_alerts
from app.services.kpi.engine import get_overview_kpis, get_pollution_kpis, get_station_kpis


def list_recommendations(
    db: Session,
    *,
    domain: str | None = None,
    limit: int = 10,
    entity_name: str | None = None,
    site_id: str | None = None,
) -> list[dict[str, Any]]:
    alerts = list_alerts(db, limit=100, entity_name=entity_name, site_id=site_id)
    overview = get_overview_kpis(db)
    station_kpis = get_station_kpis(db)
    pollution_kpis = get_pollution_kpis(db)

    recommendations: list[dict[str, Any]] = []

    if station_kpis["critique"] > 0:
        recommendations.append(
            {
                "domain": "quality",
                "priority": "HIGH",
                "action": "Contrôle terrain recommandé",
                "why": f"{station_kpis['critique']} station(s) sont critiques dans le moteur KPI Sprint 1.5.",
            }
        )

    if overview["ifd"] < 50:
        recommendations.append(
            {
                "domain": "data",
                "priority": "HIGH",
                "action": "Campagne de mesure recommandée",
                "why": f"IFD {overview['ifd']}/100 : la fraîcheur globale des données est insuffisante.",
            }
        )

    top_pollution = pollution_kpis["top_sites"][0] if pollution_kpis["top_sites"] else None
    if top_pollution and float(top_pollution["ipp"]) >= 60:
        recommendations.append(
            {
                "domain": "pollution",
                "priority": "HIGH",
                "action": "Renforcer la surveillance aval",
                "why": f"Le site {top_pollution.get('site_name') or top_pollution['site_id']} présente un IPP {top_pollution['ipp']}/100.",
            }
        )
        if top_pollution["reachable_barrages"] > 0:
            recommendations.append(
                {
                    "domain": "hydro",
                    "priority": "MEDIUM",
                    "action": "Vérification préventive recommandée",
                    "why": f"{top_pollution['reachable_barrages']} barrage(x) sont atteignables dans le scénario topologique MVP.",
                }
            )

    for alert in alerts:
        if alert["type"] == "DATA":
            recommendations.append(
                {
                    "domain": "data",
                    "priority": alert["severity"],
                    "action": "Planifier une relance de collecte",
                    "why": alert["description"],
                }
            )
            break

    if domain:
        domain = domain.lower()
        recommendations = [item for item in recommendations if item["domain"] == domain]

    deduped: list[dict[str, Any]] = []
    seen = set()
    for item in recommendations:
        key = (item["domain"], item["action"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)

    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    deduped.sort(key=lambda item: priority_order.get(item["priority"], 3))
    return deduped[:limit]
