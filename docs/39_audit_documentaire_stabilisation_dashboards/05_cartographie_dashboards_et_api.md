# Cartographie dashboards et API

## Vue synthétique

| Dashboard | Route frontend | Fichiers frontend probables | APIs critiques | Backend probable | Statut documentaire |
|---|---|---|---|---|---|
| Home V2 | `/`, `/accueil-sad` | `DashboardHomeV2.tsx`, `dashboardHome.ts`, `dashboardRuntime.ts`, `OperationalMap.tsx`, `LayerSummary.tsx` | `GET /api/v1/dashboard/home`, `GET /api/v1/map/*`, `GET /api/v1/quality/*` | `api/v1/dashboard.py`, `services/dashboard/home_service.py`, `api/v1/map.py`, `routers/quality.py` | actif |
| Qualité réglementaire | `/dashboard-qualite-reglementaire` | `qualityRegulatory.ts`, `useQualityRegulatory.ts`, composants `quality-regulatory/*` | `/api/v1/quality/thresholds`, `/stations`, `/timeseries`, `/classify`, `/regulatory-status` | `routers/quality.py`, `services/regulatory_quality.py` | actif |
| Qualité métier historique | écrans qualité multiples | composants `quality-dashboard/*` | `/api/v1/quality/*`, `/api/v1/qualite/*` | `routers/quality.py`, routers spécialisés P0 | actif mais mixte legacy/P0 |
| Carte métier | `/dashboard-carto-metier` | `mapBusiness.ts`, `useMapBusiness.ts`, composants `DashboardMetier/*` | `/api/v1/map/catalog`, `/entities`, `/latest-values`, `/classification`, `/layers` | `api/v1/map.py`, `services/map_business_service.py`, `routers/business_map.py` | actif |
| Pollution topologique | `/dashboard-pollution`, `/pollution` | `DashboardPollution.tsx`, `pollutionIdp.ts`, `usePollutionIdp.ts`, composants `Pollution/*` | `/api/v1/pollution/sites.geojson`, `/latest-results`, `/api/v1/propagation/*`, `/api/v1/recommendations` | `api/v1/pollution.py`, `api/v1/propagation.py`, `services/propagation/*` | actif |
| Pollution campagnes / déclaration pollution | `/dashboard-pollution-campagnes` | `DashboardPollutionCampagnes.tsx`, `pollutionCampagnes.ts` | `/api/v1/pollution/campagnes*`, `/prelevements*`, `/alerts*` | `api/v1/pollution_campagnes.py`, `services/pollution_campagnes_service.py`, `models/pollution_campagnes_models.py` | documentation à mettre à jour |
| Administration / ingestion | `/admin/data-governance/audit`, `/admin/ingestion` | pages admin et clients `data-admin/*` | `/api/v1/data-admin/*` | `data_admin` routers/services/schemas | actif |

## Contrats API critiques à vérifier

### Home

- `GET /api/v1/dashboard/home`
- contrat racine : `status`, `generated_at`, `data_freshness`, `hero`, `map`, `basin_status`, `alerts`, `recommended_actions`, `trends`, `secondary_kpis`, `metadata`

### Qualité

- coexistence à surveiller :
- `/api/v1/quality/*` legacy métier
- `/api/v1/qualite/*` P0 spécialisé

### Carte métier

- `/api/v1/map/catalog`
- `/api/v1/map/entities`
- `/api/v1/map/entities/{id}`
- `/api/v1/map/latest-values`
- `/api/v1/map/classification`
- `/api/v1/map/layers`

### Pollution topologique

- `/api/v1/pollution/sites.geojson`
- `/api/v1/pollution/latest-results`
- `/api/v1/propagation/source-to-garde`
- `/api/v1/propagation/source-to-stations`
- `/api/v1/propagation/source-to-barrages`
- `/api/v1/propagation/source-to-exutoires`

### Pollution campagnes

À considérer comme critiques pour le nouveau chantier :

- `/api/v1/pollution/campagnes`
- `/api/v1/pollution/campagnes/{id}`
- `/api/v1/pollution/prelevements`
- `/api/v1/pollution/prelevements/{id}`
- `/api/v1/pollution/prelevements/{id}/mesures`
- `/api/v1/pollution/prelevements/{id}/liens`
- `/api/v1/pollution/alerts`

## Risques documentaires

1. plusieurs docs parlent encore du dashboard pollution campagnes comme futur pur alors que le code existe ;
2. plusieurs docs gardent une lecture `quality` vs `qualite` insuffisamment clarifiée ;
3. plusieurs docs Home parlent encore de cible ou d'implémentation alors qu'il faut maintenant documenter la stabilisation ;
4. plusieurs docs pollution topologique mélangent historique de reconstruction et usage dashboard courant.
