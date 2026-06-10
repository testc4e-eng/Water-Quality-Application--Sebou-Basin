# Dashboards connectés

## Accueil DG

- Fichier : `frontend/src/pages/DashboardHomeV2.tsx`
- Endpoint principal : `GET /api/v1/dashboard/home`
- Ajouts :
  - modules opérationnels
  - modules partiels
  - décisions métier restantes
  - signaux qualité / pollution / QA / RBAC
  - badges de statut

## Qualité réglementaire

- Fichier : `frontend/src/pages/DashboardQualiteReglementaire.tsx`
- Endpoints :
  - `GET /api/v1/quality/regulatory-status`
  - `GET /api/v1/quality/thresholds`
  - `GET /api/v1/quality/stations`
  - `GET /api/v1/quality/timeseries`
  - `POST /api/v1/quality/classify`
- Ajouts :
  - badge `PREPROD_CONDITIONNEL` / `DEV_PARTIAL`
  - bloc source API
  - état vide stations

## Pollution

- Fichier : `frontend/src/pages/DashboardPollution.tsx`
- Endpoints :
  - `GET /api/v1/pollution/sites.geojson`
  - `GET /api/v1/pollution/latest-results`
  - `GET /api/v1/propagation/source-to-garde`
  - `GET /api/v1/propagation/source-to-stations`
  - `GET /api/v1/propagation/source-to-barrages`
  - `GET /api/v1/recommendations`
- Ajouts :
  - badge `DEV`
  - garde-fous `TOPOLOGIQUE` / `NON HYDRAULIQUE SCIENTIFIQUE`
  - synthèse typologies de rejets
  - état erreur et état vide

## Données / QA

- Fichier : `frontend/src/pages/DashboardDataQuality.tsx`
- Endpoints :
  - `GET /api/v1/data-admin/classes`
  - `GET /api/v1/data-admin/classes/{class}/count`
  - `GET /api/v1/data-admin/validation-rules`
  - `GET /api/v1/admin/data-availability`
- Ajouts :
  - lecture DG synthétique
  - lien vers espace expert `data-admin`
  - états `loading / error / empty`

## Administration / RBAC

- Fichier : `frontend/src/pages/DashboardAdministration.tsx`
- Endpoints :
  - `GET /api/v1/data-admin/change-requests`
  - `GET /api/v1/users`
  - `GET /api/v1/admin/password-reset-requests`
  - `GET /api/v1/security/logs/activity`
  - `GET /api/v1/security/logs/auth`
- Ajouts :
  - synthèse rôle courant
  - permissions critiques
  - utilisateurs
  - audit sécurité
  - message propre en cas de refus 401/403

## Navigation cible appliquée

1. `Accueil DG`
2. `Qualité des eaux`
3. `Carte Métier`
4. `Pollution`
5. `Données / QA`
6. `Administration`

## Modules déclassés ou masqués

- `dashboard-scenarios` : remplacé par un écran `EN_CONSTRUCTION`
- `pollution-idp-dev` : route conservée mais non exposée dans la navigation DG
- `expert` : redirigé vers `Données / QA`
- `dashboard-analytique` / `analyses` : déclassés au profit de la navigation cible
- `/admin/ingestion` : non mis en avant dans la navigation cible
