# Architecture dashboard

## Architecture fonctionnelle cible

```text
Hero
  -> chiffres opérationnels du jour

Carte métier principale
  -> barrages / hydro / pluvio / qualité

Situation du bassin
  -> hydrologie / pluie / qualité

Alertes
  -> hydro / pluvio / qualité / barrage

Tendances
  -> débit / pluie / apports / qualité
```

## Backend cible

### Endpoint 1

`GET /api/v1/dashboard/home`

Rôle :

- charger la matière du home en un seul appel

Payload cible :

```json
{
  "hero": {},
  "map": {},
  "basin_status": {},
  "alerts": [],
  "trends": {}
}
```

### Endpoint 2

`GET /api/v1/dashboard/alerts`

Rôle :

- fournir le centre d'alertes opérationnelles du home

### Endpoint 3

`GET /api/v1/dashboard/trends`

Rôle :

- fournir les séries 30 jours / 7 jours du home

### Endpoint 4

`GET /api/v1/dashboard/map`

Rôle :

- fournir le GeoJSON opérationnel unifié des 4 couches par défaut

## Frontend cible

### `DashboardHomeV2.tsx`

Rôle :

- composer le home complet

### `HeroSection.tsx`

Rôle :

- titre ;
- sous-titre ;
- 4 cartes de synthèse opérationnelle.

### `OperationalMap.tsx`

Rôle :

- rendre la carte principale ;
- activer uniquement les 4 couches par défaut au chargement.

### `BasinStatus.tsx`

Rôle :

- résumer hydrologie, pluie et qualité.

### `AlertsPanel.tsx`

Rôle :

- afficher les alertes ouvertes ;
- prioriser la lecture métier.

### `TrendPanel.tsx`

Rôle :

- afficher 4 graphes de tendance lisibles.

### `LayerControl.tsx`

Rôle :

- gérer les couches secondaires ;
- ne pas polluer l'affichage initial.

## Réutilisation recommandée

### Backend

À réutiliser :

- `backend/app/routers/observatory.py`
- `backend/app/api/v1/map.py`
- `backend/app/services/map_business_service.py`
- `backend/app/api/v1/kpi.py`
- `backend/app/api/v1/alerts.py`
- `backend/app/api/v1/recommendations.py`

### Frontend

À réutiliser :

- `frontend/src/pages/AccueilSadPage.tsx`
- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/components/DashboardMetier/BusinessMap.tsx`
- `frontend/src/components/DashboardMetier/PanneauActionMetier.tsx`
- `frontend/src/components/quality-regulatory/QualityAlertCenter.tsx`
- `frontend/src/components/Charts/TimeSeriesChart.jsx`

## Recommandation d’implémentation

La meilleure approche n'est pas de créer une nouvelle carte indépendante.

La meilleure approche est :

1. créer un endpoint backend agrégateur home ;
2. réutiliser le moteur carte métier existant ;
3. spécialiser les symbologies et popups pour les 4 familles opérationnelles ;
4. déplacer les contenus non quotidiens hors du home.
