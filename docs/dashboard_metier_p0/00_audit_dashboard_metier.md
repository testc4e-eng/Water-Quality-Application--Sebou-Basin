# Audit actif dashboard metier P0

## Statut

`AUDIT_LECTURE_SEULE_TERMINE`  
`IMPLEMENTATION_API_MAP_P0_A_PREPARER`

## Sources inspectees

Backend :

- `backend/app/api/v1/`
- `backend/app/services/`
- `backend/app/models/`
- `backend/app/db/`
- `backend/app/repositories/api_views_repository.py`
- `backend/app/routers/quality.py`
- `backend/app/routers/layers.py`
- `backend/app/routers/observatory.py`

Frontend :

- `frontend/src/pages/`
- `frontend/src/components/`
- `frontend/src/api/`
- `frontend/src/config/`
- `frontend/src/hooks/`

Documentation de reference :

- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`

## Constats backend

| Brique | Statut | Usage P0 |
|---|---|---|
| `/api/v1/pollution/sites.geojson` | DEV fonctionnel | source principale IDP pollution |
| `/api/v1/pollution/latest-results` | DEV fonctionnel | derniers resultats P0 |
| `/api/v1/quality/classify` | DEV fonctionnel | classification reglementaire |
| `/api/v1/quality/thresholds` | DEV fonctionnel | seuils et palette |
| `/api/v1/qualite/*` | P0 specialise | qualite historique par familles |
| `/api/v1/layers/*` | generique SIG | supports geographiques existants |
| `/api/v1/geojson/*` | legacy/generique | a eviter comme source cible |
| `/api/v1/observatory/*` | riche mais large | source inspiration/catalogue |

## Constats frontend

| Brique | Statut | Usage P0 |
|---|---|---|
| `PollutionIdpMap.tsx` | MapLibre propre, popup et classification | base directe pour carte metier |
| `PollutionIdpDevPage.tsx` | page isolee fonctionnelle | reference d'integration sans regression |
| `InteractiveMap.jsx` | MapLibre imperatif legacy | reutilisation limitee |
| `DecisionDashboardTest.tsx` | prototype UX metier | source pour sidebar/filtres |
| `ObservatoryMenuV2.tsx` | catalogue local + chargement differe | logique de navigation reutilisable |
| `DashboardCartographique.tsx` | alias vers `Dashboard2` | ne pas modifier en P0 |

## Risques observes

- Catalogues frontend concurrents : `observatoryCatalog.ts`, `decisionDashboardCatalog.ts`, `layers/config.ts`.
- Deux styles de cartographie : `react-map-gl/maplibre` moderne et `maplibre-gl` imperatif legacy.
- Routeurs backend nombreux avec chevauchement `quality`, `qualite`, `layers`, `geojson`, `observatory`.
- Certains endpoints legacy reposent encore sur noms anciens ou generiques.
- `Dashboard2` est volumineux et ne doit pas porter le nouveau chantier P0.

## Decision d'audit

Le P0 doit creer une nouvelle tranche isolee :

- backend : `backend/app/api/v1/map.py` + `backend/app/services/map_business_service.py`;
- frontend : `/dashboard-carto-metier` + composants `frontend/src/components/DashboardMetier/`;
- pas de remplacement de `Dashboard2`, `pollution-idp-dev`, `decision-dashboard-test` ou `qualite/metaux`.

## GO/NOGO

| Sujet | Decision |
|---|---|
| Lancer API cartographique metier P0 | GO |
| Modifier dashboard legacy | NOGO |
| Refactor massif des catalogues | NOGO |
| Reutiliser classification reglementaire | GO |
| Reutiliser `PollutionIdpMap` comme base technique | GO |
