# Écarts documentation vs dashboards

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport de réorganisation documentaire |
| Source de vérité | Non - rapport d'audit et de consolidation |
| Date | 2026-05-22 |

## Routes backend détectées

| Fichier | Préfixes | Nb routes |
|---|---|---|
| backend/app/main.py |  | 0 |
| backend/app/api/api_v1.py | /admin, /analytics, /climate, /hydro, /layers, /names, /quality, /routing | 0 |
| backend/app/api/items.py | /items | 2 |
| backend/app/api/__init__.py | /layers | 0 |
| backend/app/routers/admin_data_scan.py |  | 1 |
| backend/app/routers/admin_password_resets.py | /password-reset-requests | 3 |
| backend/app/routers/admin_users.py | /users | 1 |
| backend/app/routers/analytics.py |  | 9 |
| backend/app/routers/api.py | /api/v1 | 3 |
| backend/app/routers/catalog.py | /catalog | 4 |
| backend/app/routers/climate.py |  | 5 |
| backend/app/routers/entities.py |  | 6 |
| backend/app/routers/geojson.py | /geojson | 3 |
| backend/app/routers/hydro.py |  | 7 |
| backend/app/routers/ingestion.py | /ingestion | 11 |
| backend/app/routers/layers.py |  | 3 |
| backend/app/routers/layer_configs.py | /layers/configs | 5 |
| backend/app/routers/measurements.py | /stations | 1 |
| backend/app/routers/names.py |  | 1 |
| backend/app/routers/objects.py |  | 2 |
| backend/app/routers/observatory.py | /observatory | 29 |
| backend/app/routers/quality.py |  | 9 |
| backend/app/routers/stations.py | /api/v1 | 1 |
| backend/app/security/routes_logs.py | /security | 2 |
| backend/app/security/routes_users.py | /users | 7 |
| backend/app/api/v1/alerts.py | /alerts | 1 |
| backend/app/api/v1/api_router.py | /catalog, /layers, /names | 0 |
| backend/app/api/v1/auth.py | /auth | 7 |
| backend/app/api/v1/geojson.py | /geojson | 1 |
| backend/app/api/v1/hydro.py |  | 1 |
| backend/app/api/v1/items.py | /items | 5 |
| backend/app/api/v1/map.py | /map | 8 |
| backend/app/api/v1/measurements.py | /stations | 1 |
| backend/app/api/v1/meta.py | /meta | 5 |
| backend/app/api/v1/pollution.py | /pollution | 2 |
| backend/app/api/v1/qualite_specialized.py | /qualite | 4 |
| backend/app/api/v1/raw.py | /raw | 6 |
| backend/app/api/v1/routing.py |  | 3 |
| backend/app/api/v1/stations.py | /stations | 1 |
| backend/app/api/v1/swat.py | /swat | 4 |
| backend/app/api/v1/swat_analysis.py | /swat/analysis | 2 |

## Routes frontend détectées

| Fichier | Routes |
|---|---|
| frontend/src/App.tsx | *, /, /change-password, /login, /register, about, admin/audit, admin/data-scan, admin/gestion-users, admin/ingestion, admin/password-resets, admin/popup-rules, admin/users, carte, contact, dashboard, dashboard-2, dashboard-analytique, dashboard-carto-metier, dashboard-cartographique, dashboard-pollution, dashboard-scenarios, data, decision-dashboard-test, pollution-idp-dev, qualite/metaux |
| frontend/src/router.tsx | *, /, /login, /register, about, admin/users, contact, dashboard, dashboard-2, dashboard-analytique, dashboard-carto-metier, dashboard-cartographique, dashboard-climate, dashboard-scenarios, data, decision-dashboard-test, pollution-idp-dev, qualite/metaux |

## Points d'attention

| Sujet | Statut |
|---|---|
| /api/v1/quality vs /api/v1/qualite | coexistence legacy/P0 |
| /pollution-idp-dev | DEV demo, pas préproduction |
| /dashboard-carto-metier | P0 isolé |
| SWAT analysis | optionnel selon flag runtime |
| routage pollution | topologique visuel non hydraulique scientifique |
