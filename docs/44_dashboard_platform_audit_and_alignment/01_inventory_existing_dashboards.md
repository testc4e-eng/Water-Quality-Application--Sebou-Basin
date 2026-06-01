# Inventaire des dashboards existants

## Routeur réellement utilisé
`frontend/src/main.tsx` monte `App.tsx`. Le fichier `frontend/src/router.tsx` existe mais n’est pas le routeur actif observé.

## Routes dashboard dans `App.tsx`
| Dashboard | Route | Fichiers frontend | APIs consommées | Données affichées | Statut | Problèmes |
|---|---|---|---|---|---|---|
| Dashboard principal legacy | `/dashboard` | `Dashboard1.tsx`, `components/Dashboard/*` | `/stations/{id}/measurements`, `/alerts`, `/layers/*` selon composants | KPI, alertes, carte legacy | `LEGACY_UPDATE` | Risque endpoints legacy/station-centric, usage partiel anciennes abstractions |
| Dashboard cartographique legacy | `/dashboard-cartographique` | `DashboardCartographique.tsx` -> `Dashboard2.tsx`, `Map/*`, `observatory/*` | `/layers/*`, `/geojson/*`, `/observatory/*`, `/qualite/*` | Carte bassin, couches, observatoire V2 | `UPDATE` | Très volumineux, mélange carto/observatoire/pollution, statut réglementaire incomplet |
| Dashboard cartographique métier P0.1 | `/dashboard-carto-metier` | `DashboardCartoMetier.tsx`, `components/DashboardMetier/*`, `api/mapBusiness.ts` | `/api/v1/map/catalog`, `/map/entities`, `/map/latest-values`, `/map/classification` | Supports métier, carte MapLibre, popup, classification | `KEEP_UPDATE` | Préprod bloquée par validation navigateur, statuts réglementaires à expliciter partout |
| Dashboard analytique | `/dashboard-analytique` | `DashboardAnalytique.tsx`, `components/Climate/Unified*`, `api/analytics.ts` | `/analytics/climat-meteo/*`, `/analytics/hydrologie/*`, `/analytics/pollution/*` | Séries climat/hydro/pollution | `UPDATE` | Doit intégrer température batch COMMITTED et statuts hydrauliques non validés |
| Dashboard climat/hydro/qualité | `/dashboard-climate` | `DashboardClimate.tsx` | `/climate/*`, `/hydro/*` selon composants | Climat, hydrologie, qualité | `BLOCKED` | Importe `ClimateModesDashboard`, `HydroDashboardContent`, `QualityDashboardContent` absents du dossier `components` |
| Dashboard scénarios | `/dashboard-scenarios` | `DashboardScenarios.tsx` | navigation seulement | Cartes de navigation SWAT/WASP/pollution | `KEEP_UPDATE` | Doit marquer SWAT/propagation comme non scientifique si hydraulique non validée |
| Dashboard pollution simulation | `/dashboard-pollution` | `DashboardPollution.tsx`, `components/Pollution/*` | `/geojson/reseau`, `/geojson/stations`, `/geojson/barrages`, `/routing/topology-qa`, `/routing/downstream-to-garde` | Simulation topologique pollution | `REMOVE_FROM_PREPROD` | Routage topologique visuel, pas hydraulique scientifique; titre trop opérationnel |
| Pollution IDP DEV | `/pollution-idp-dev` | `PollutionIdpDevPage.tsx`, `PollutionIdpMap.tsx`, `api/pollutionIdp.ts` | `/pollution/sites.geojson`, `/pollution/latest-results` | Sites IDP, résultats P0, classification | `KEEP_DEV` | DEV uniquement; arbitrage spatial toujours bloquant PREPROD |
| Qualité métaux pilote | `/qualite/metaux` | `pages/qualite/MetauxPage.tsx`, `api/qualite.ts` | `/qualite/metaux` | Métaux spécialisés | `KEEP_UPDATE` | Écran pilote, pas dashboard réglementaire complet |
| Dashboard décisionnel test | `/decision-dashboard-test` | `DecisionDashboardTest.tsx`, `components/decision/*` | `/qualite/metaux`, `/qualite/chimie-minerale`, `/qualite/physicochimie`, `/qualite/pollution-organique` | Vue métier test qualité | `KEEP_DEV` | Test métier, non consolidé DG/préprod |
| Admin data scan | `/admin/data-scan` | `DataScanPage.tsx`, `DataScanDashboard.tsx` | `/admin/data-availability` | Disponibilité données | `KEEP` | Utile équipe data/dev |
| Admin ingestion | `/admin/ingestion` | `IngestionPage.tsx` | `/observatory/cache/clear`, ingestion optionnelle selon backend | Ingestion/cache | `UPDATE` | API ingestion optionnelle; éviter actions non activées |
| Admin popup rules | `/admin/popup-rules` | `PopupRulesPage.tsx` | `/observatory/popup-rules*` | Règles popup | `KEEP_ADMIN` | Doit rester admin |

## Points structurels
- `App.tsx` et `router.tsx` divergent : `router.tsx` ne contient pas toutes les routes admin et mappe `/dashboard` vers `Dashboard2`, contrairement à `App.tsx`.
- `DashboardCartographique.tsx` ré-exporte `Dashboard2`, ce qui masque la complexité réelle.
- Les dashboards P0 récents sont isolés, ce qui est sain, mais la navigation principale pointe encore surtout vers les dashboards legacy.
