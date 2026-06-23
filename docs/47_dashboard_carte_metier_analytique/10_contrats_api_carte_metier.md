# Contrats API Carte Métier

Avant de coder l'interface, les endpoints suivants doivent être développés pour servir de backend exclusif à la carte :

## 1. Endpoint de disponibilité (`/availability`)
L'élément fondamental du filtre intelligent.
```http
GET /api/v1/business-map/availability
```
Exemple de retour :
```json
[
  {
    "support_type": "STATION_QUALITE",
    "domain": "QUALITE",
    "subdomain": "PHYSICO_CHIMIE",
    "parameter_code": "PH",
    "parameter_label": "pH",
    "unit": "unité pH",
    "object_count": 47,
    "date_min": "1980-01-01",
    "date_max": "2026-06-10",
    "has_geometry": true,
    "has_timeseries": true,
    "has_thresholds": true,
    "allowed_for_user": true
  }
]
```

## 2. Autres Endpoints
* `GET /api/v1/business-map/layers` : Répertoire des couches disponibles.
* `GET /api/v1/business-map/features` : Récupération des objets géographiques filtrés.
* `GET /api/v1/business-map/series` : Récupération des séries temporelles analytiques.
* `GET /api/v1/business-map/object/{support_type}/{id}` : Métadonnées approfondies d'un objet (pour popup ou panneau latéral).
