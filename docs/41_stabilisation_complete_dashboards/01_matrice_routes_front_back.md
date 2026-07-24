# 01  Matrice routes front-back

| Dashboard | Route frontend | Composant page | APIs principales | État initial |
|---|---|---|---|---|
| Accueil DG | `/` | `DashboardHomeV2.tsx` via `AccueilSadPage.tsx` | `/api/v1/dashboard/home`, `/api/v1/dashboard/trends`, `/api/v1/quality/stations-with-timeseries`, `/api/v1/quality/unified/stations`, `/api/v1/map/entities` | Chargement prolongé, erreur possible à froid |
| Qualité des eaux | `/dashboard-qualite-reglementaire` | `DashboardQualiteReglementaire` | `/api/v1/quality/*`, `/api/v1/quality/unified/*` | À auditer |
| Carte Métier | `/dashboard-carto-metier` | `DashboardCartoMetier` | `/api/v1/map/catalog`, `/api/v1/map/entities`, `/api/v1/business-map/*` | À auditer |
| Pollution - Surveillance | `/dashboard-pollution` | `DashboardPollution.tsx` | `/api/v1/propagation/network.geojson`, APIs pollution existantes | À auditer |
| Pollution - Déclaration | `/dashboard-pollution?view=declaration` | `DashboardPollution.tsx` + `DeclarationWorkspace` | `/api/v1/pollution/declarations`, `/submit`, `/evaluate`, `/report` | Matrix V1 validé |
| Pollution - Campagnes | `/dashboard-pollution-campagnes` | `DashboardPollutionCampagnes.tsx` | `/api/v1/pollution/campagnes/*` | À auditer |
| Données / QA | `/dashboard-data-qa` | `DashboardDataQuality` | `/api/v1/raw/*`, `/api/v1/data-admin/*` | À auditer |
| Administration | `/administration` | Administration routes | `/api/v1/admin/*`, `/api/v1/users/*` | À auditer |

## Détail STAB-01 Accueil DG

| Élément | Valeur |
|---|---|
| Hook principal | `useDashboardHome` |
| Client API | `frontend/src/api/dashboardHome.ts` |
| Endpoint principal | `GET /api/v1/dashboard/home` |
| Services backend | `app.services.dashboard.home_service`, `app.services.dashboard.runtime_service` |
| États UI testés | loading, success, reload, navigation vers Carte Métier |
| Captures | `01-home-loading.png`, `02-home-success.png`, `03-home-reload.png` |

