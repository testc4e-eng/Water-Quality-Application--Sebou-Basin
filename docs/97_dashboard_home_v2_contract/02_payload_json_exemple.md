# Exemple JSON complet

```json
{
  "status": "success",
  "generated_at": "2026-06-03T15:30:00+01:00",
  "data_freshness": {
    "barrages": {
      "latest_date": "2025-09-01",
      "age_days": 275,
      "status": "STALE",
      "note": "10 barrages avec données journalières disponibles, 9 avec lâcher."
    },
    "hydro": {
      "latest_date": "2025-08-31",
      "age_days": 276,
      "status": "STALE",
      "note": "7 stations actives sur le dernier jour observé."
    },
    "pluvio": {
      "latest_date": "2024-08-31",
      "age_days": 641,
      "status": "STALE",
      "note": "Données pluie disponibles ; typologie station à consolider."
    },
    "quality_daily": {
      "latest_date": "2026-01-06",
      "age_days": 148,
      "status": "STALE",
      "note": "Réseau qualité quotidien sur 6 stations sentinelles."
    }
  },
  "hero": {
    "title": "WaterQual Sebou",
    "subtitle": "Système d'Aide à la Décision pour la Qualité des Eaux du Bassin du Sebou",
    "operational_date": "2026-06-03",
    "summary_label": "État opérationnel du bassin",
    "cards": [
      {
        "id": "barrages_suivis",
        "label": "Barrages suivis",
        "value": 10,
        "unit": "ouvrages",
        "status": "SURVEILLANCE",
        "trend": "STABLE",
        "description": "Barrages avec données journalières récentes disponibles.",
        "color_hint": "blue",
        "icon": "dam",
        "freshness": {
          "latest_date": "2025-09-01",
          "age_days": 275,
          "status": "STALE"
        }
      },
      {
        "id": "donnees_pluie_disponibles",
        "label": "Données pluie disponibles",
        "value": 47,
        "unit": "stations",
        "status": "SURVEILLANCE",
        "trend": "UNKNOWN",
        "description": "Stations avec pluie disponible ; typologie métier pluvio non encore consolidée.",
        "color_hint": "green",
        "icon": "rain",
        "freshness": {
          "latest_date": "2024-08-31",
          "age_days": 641,
          "status": "STALE"
        }
      },
      {
        "id": "stations_hydro_actives",
        "label": "Stations hydro actives",
        "value": 7,
        "unit": "stations",
        "status": "SURVEILLANCE",
        "trend": "STABLE",
        "description": "Stations hydro présentes sur le dernier jour de lecture.",
        "color_hint": "blue",
        "icon": "river",
        "freshness": {
          "latest_date": "2025-08-31",
          "age_days": 276,
          "status": "STALE"
        }
      },
      {
        "id": "stations_sentinelles_qualite",
        "label": "Stations sentinelles qualité",
        "value": 6,
        "unit": "réseau",
        "status": "SURVEILLANCE",
        "trend": "STABLE",
        "description": "Réseau qualité quotidien du Sebou.",
        "color_hint": "orange",
        "icon": "quality",
        "freshness": {
          "latest_date": "2026-01-06",
          "age_days": 148,
          "status": "STALE"
        }
      }
    ]
  },
  "map": {
    "default_layers": ["barrages", "hydro", "pluvio", "quality_daily"],
    "secondary_layers": ["pollution", "campaigns", "swat", "wasp", "historical"],
    "layers": {
      "barrages": {
        "label": "Barrages",
        "enabled": true,
        "count": 10,
        "symbology": {
          "shape": "marker",
          "color": "blue_dark",
          "size": "large"
        },
        "features_endpoint": "/api/v1/dashboard/map?layers=barrages"
      },
      "hydro": {
        "label": "Hydro",
        "enabled": true,
        "count": 7,
        "symbology": {
          "shape": "circle",
          "color": "blue",
          "size": "scaled_by_flow"
        },
        "features_endpoint": "/api/v1/dashboard/map?layers=hydro"
      },
      "pluvio": {
        "label": "Données pluie disponibles",
        "enabled": true,
        "count": 47,
        "symbology": {
          "shape": "drop",
          "color": "green",
          "size": "medium"
        },
        "features_endpoint": "/api/v1/dashboard/map?layers=pluvio"
      },
      "quality_daily": {
        "label": "Stations sentinelles qualité",
        "enabled": true,
        "count": 6,
        "symbology": {
          "shape": "hexagon",
          "color": "orange",
          "size": "medium"
        },
        "features_endpoint": "/api/v1/dashboard/map?layers=quality_daily"
      }
    }
  },
  "basin_status": {
    "hydrology": {
      "debit_moyen": 41.2,
      "unit": "m3/s",
      "stations_hausse": 2,
      "stations_baisse": 3,
      "stations_stables": 2,
      "station_count": 7,
      "latest_date": "2025-08-31"
    },
    "rainfall": {
      "cumul_24h": 6.4,
      "cumul_7j": 18.2,
      "cumul_30j": 41.6,
      "unit": "mm",
      "station_count": 47,
      "latest_date": "2024-08-31",
      "warning_typology_not_validated": true,
      "label": "Données pluie disponibles"
    },
    "quality": {
      "sentinel_station_count": 6,
      "conformes": 3,
      "surveillance": 2,
      "critiques": 1,
      "unknown": 0,
      "latest_date": "2026-01-06",
      "label": "Stations sentinelles qualité"
    },
    "barrages": {
      "barrage_count": 10,
      "apport_total": 128.4,
      "lacher_total": 92.7,
      "niveau_moyen": 68.1,
      "unit_flow": "Mm3/j",
      "latest_date": "2025-09-01"
    }
  },
  "alerts": [
    {
      "id": "alt-data-hydro-20250831",
      "type": "DATA",
      "severity": "SURVEILLANCE",
      "title": "Fraîcheur hydro à surveiller",
      "message": "Les débits affichés reposent sur une dernière date utile au 2025-08-31.",
      "object_label": "Réseau hydro",
      "object_type": "network",
      "action_hint": "Vérifier la chaîne d'alimentation hydro.",
      "created_at": "2026-06-03T15:30:00+01:00",
      "source": "alert_engine"
    },
    {
      "id": "alt-data-rain-20240831",
      "type": "PLUVIO",
      "severity": "SURVEILLANCE",
      "title": "Typologie pluie à consolider",
      "message": "Les données pluie sont disponibles mais la typologie métier des stations n'est pas encore figée.",
      "object_label": "Réseau pluie",
      "object_type": "station_network",
      "action_hint": "Valider la liste home-ready des stations pluie.",
      "created_at": "2026-06-03T15:30:00+01:00",
      "source": "alert_engine"
    }
  ],
  "recommended_actions": [
    {
      "id": "rec-home-1",
      "priority": "P0",
      "title": "Consolider la chaîne pluie",
      "why": "Le home affichera la pluie au centre du pilotage quotidien.",
      "action": "Valider la typologie des stations pluie avant activation du KPI métier strict.",
      "target_type": "network",
      "target_label": "Réseau pluie",
      "source": "recommendation_engine"
    },
    {
      "id": "rec-home-2",
      "priority": "P0",
      "title": "Stabiliser le contrat qualité quotidien",
      "why": "Le home doit exposer clairement les 6 stations sentinelles qualité.",
      "action": "Créer un contrat home-ready pour la qualité journalière avec classe, paramètre critique et tendance.",
      "target_type": "quality_daily",
      "target_label": "Réseau qualité quotidien",
      "source": "recommendation_engine"
    }
  ],
  "trends": {
    "hydro_30d": {
      "label": "Débit moyen 30 jours",
      "unit": "m3/s",
      "points": [
        { "date": "2025-08-27", "value": 42.3 },
        { "date": "2025-08-28", "value": 43.8 },
        { "date": "2025-08-29", "value": 41.9 },
        { "date": "2025-08-30", "value": 40.7 },
        { "date": "2025-08-31", "value": 41.2 }
      ]
    },
    "rainfall_30d": {
      "label": "Précipitations 30 jours",
      "unit": "mm",
      "points": [
        { "date": "2024-08-27", "value": 0.0 },
        { "date": "2024-08-28", "value": 1.1 },
        { "date": "2024-08-29", "value": 3.4 },
        { "date": "2024-08-30", "value": 2.5 },
        { "date": "2024-08-31", "value": 6.4 }
      ]
    },
    "barrage_apport_30d": {
      "label": "Apports barrages 30 jours",
      "unit": "Mm3",
      "points": [
        { "date": "2025-08-28", "value": 121.6 },
        { "date": "2025-08-29", "value": 126.2 },
        { "date": "2025-08-30", "value": 127.8 },
        { "date": "2025-08-31", "value": 129.1 },
        { "date": "2025-09-01", "value": 128.4 }
      ]
    },
    "quality_30d": {
      "label": "Qualité sentinelle 30 jours",
      "unit": "score",
      "points": [
        { "date": "2026-01-02", "value": 66 },
        { "date": "2026-01-03", "value": 65 },
        { "date": "2026-01-04", "value": 64 },
        { "date": "2026-01-05", "value": 67 },
        { "date": "2026-01-06", "value": 68 }
      ]
    }
  },
  "secondary_kpis": {
    "iqgb": {
      "value": 83,
      "label": "IQGB",
      "status": "OK",
      "description": "Indice Qualité Global Bassin.",
      "source_endpoint": "/api/v1/kpi/overview"
    },
    "ifd": {
      "value": 15,
      "label": "IFD",
      "status": "CRITIQUE",
      "description": "Indice Fraîcheur Données.",
      "source_endpoint": "/api/v1/kpi/overview"
    },
    "icd": {
      "value": 84,
      "label": "ICD",
      "status": "OK",
      "description": "Indice Confiance Données.",
      "source_endpoint": "/api/v1/kpi/overview"
    },
    "ich": {
      "value": 90,
      "label": "ICH",
      "status": "OK",
      "description": "Indice Confiance Hydraulique.",
      "source_endpoint": "/api/v1/kpi/overview"
    },
    "ipp": {
      "value": 51.7,
      "label": "IPP",
      "status": "SURVEILLANCE",
      "description": "Indice Pression Pollution MVP topologique.",
      "source_endpoint": "/api/v1/kpi/overview"
    },
    "isr": {
      "value": 92,
      "label": "ISR",
      "status": "OK",
      "description": "Indice Sous-Bassin à Risque.",
      "source_endpoint": "/api/v1/kpi/overview"
    }
  },
  "metadata": {
    "mode": "OPERATIONAL_HOME_V2",
    "scientific_warning": "Les prévisions hydrologiques avancées ne sont pas encore activées.",
    "temperature_rule": "AIR_TEMPERATURE != WATER_TEMPERATURE",
    "quality_scope": "6 stations sentinelles qualité",
    "rainfall_typology_status": "TO_CONSOLIDATE",
    "excluded_from_home": ["swat", "wasp", "legacy", "historical_campaigns"]
  }
}
```
