# Home V2 final validation

## Frontend

- `npm run build` : `OK`
- route `/` : `OK`
- route `/accueil-sad` : `OK`
- route `/dashboard-carto-metier` : `OK`

## Backend

- `pytest backend/tests/test_dashboard_home_v2.py -q` : `13 passed`
- `/health` : `OK`
- `/api/v1/dashboard/home` : `200`

## UX/UI

- cockpit full-width : `OK`
- carte métier dominante : `OK`
- BusinessMap mode `home` compact : `OK`
- tooltips KPI métier : `OK`
- tooltips IFD / ICD / ICH : `OK`

## Performance

- cache chaud : `OK`
- cold start : encore trop lent pour l’objectif `< 2 s`
- prewarm startup : `ajouté`

## Limites restantes

- temps cold-start élevé ;
- tendance DG fondée sur dernière session et non historique backend ;
- `1366x768` reste exploitable mais demande encore une micro-recette visuelle finale si usage salle de supervision stricte.

## Statut final

- `READY_FOR_DG_DEMO_WITH_WARM_CACHE`
