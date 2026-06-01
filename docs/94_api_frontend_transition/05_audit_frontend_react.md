# Audit frontend React

## Synthese

Le frontend consomme majoritairement des modules `frontend/src/api/*`, avec des appels directs dans certaines pages et gestion cartographique via `layers/config.ts` et `layers/layerManager.ts`. La transition doit créer de nouveaux clients API spécialisés avant de remplacer les appels existants.

## Composants et pages audites

| Composant/Page | APIs utilisees | Donnees | Remplacement recommande | Priorite |
|---|---|---|---|---|
| `src/api/quality.ts` | `/quality/stations`, `/quality/parameters`, `/quality/timeseries`, `/quality/latest`, `/quality/inventory/rows` | Qualite riviere legacy + inventaire pollution melange | Nouveau client `src/api/qualiteSpecialized.ts` vers `/qualite/*`, `/pollution/*`, `/idp/*` | P0 |
| `components/quality/*` | `fetchQuality*` | KPIs, courbes, tables qualite | Brancher par familles vues specialisees | P0 |
| `src/api/hydro.ts` | `/hydro/*`, `/barrages/{id}/quality-*` | Hydro mensuel, points eau, qualite barrage legacy | Ajouter appels `/hydro/barrages/parametres` et `/hydro/barrages/qualite` | P1 |
| `components/Climate/Hydro*` | `fetchHydro*` | Hydro dashboards | Migration progressive ; conserver debit mensuel jusqu'a vue `api.v_hydro_debit` | P2 |
| `src/api/climate.ts` | `/climate/stations`, `/climate/timeseries`, `/climate/kpis` | Precipitation annuelle max | Nouveau client `meteoSpecialized.ts` | P1 |
| `src/api/observatory.ts` | `/observatory/*` | Hierarchie, barrage, temperature | Conserver hiérarchie ; remplacer temperature/barrage par endpoints specialises | P1 |
| `src/api/analytics.ts` | `/analytics/*` | MVs dashboard | Conserver pour dashboards actuels ; prévoir remplacement par vues spécialisées ou MVs futures | P2 |
| `src/layers/config.ts` | `/climate/*`, `/hydro/*`, `/quality/*`, `/observatory/*` | Configuration couches métier | Mettre à jour après création endpoints spécialisés | P1 |
| `src/layers/layerManager.ts` | `/layers/*`, `/observatory/*`, `/quality/latest`, `/hydro/latest` | Cartes + latest values | Remplacer latest qualité par endpoints spécialisés | P1 |
| `pages/Dashboard2.tsx` | `/layers/*`, `/observatory/*`, `/entity/{id}/data` | Observatoire cartographique | Conserver puis remplacer popups/series via endpoints spécialisés | P2 |
| `pages/DashboardClimate.tsx` | `Climate`, `Hydro`, `QualityDashboardContent` | Dashboard multi-domaines | Découper en écrans métiers spécialisés | P1 |
| `pages/DashboardPollution.tsx` | `/geojson/*`, `/routing/*`, mocks pollution | Pollution simulation | Remplacer mocks par `/pollution/*` et `/idp/*` | P1 |
| `components/Pollution/*` | mocks `pollutionSimulationData` | Pollution simulée | Brancher sur vues `api.v_pollution_*` | P1 |
| `services/ingestionService.ts` | `/ingestion/*` | Ingestion admin | Conserver, chantier futur | P3 |
| `components/admin/data-scan/*` | `/admin/data-availability` | Audit disponibilité | Conserver admin ; ne pas mélanger avec restitution | P3 |
| `src/api/client.ts`, `src/lib/api.ts` | Axios base `/api/v1` | Client HTTP | Rationaliser à un client unique plus tard | P2 |

## Risques frontend

- Deux clients Axios coexistent (`src/api/client.ts`, `src/lib/api.ts`).
- La qualité mélange actuellement données qualité et inventaire pollution.
- `DashboardPollution` dépend de mocks et doit être rebranché.
- Le dashboard cartographique interroge un endpoint générique `/entity/{id}/data` qui lit encore des tables métier.

## Decision audit frontend

Statut frontend : `GO_CONCEPTION_FRONT_SPECIALISE`, implementation réelle à lancer après validation des endpoints FastAPI.
