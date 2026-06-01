# Spécification du dashboard test

## Route

- frontend : `/decision-dashboard-test`
- page : `frontend/src/pages/DecisionDashboardTest.tsx`

## Composants

- `frontend/src/components/decision/DecisionModeSelector.tsx`
- `frontend/src/components/decision/FreshnessFilter.tsx`
- `frontend/src/components/decision/CampaignSelector.tsx`
- `frontend/src/components/decision/SupportFilter.tsx`
- `frontend/src/components/decision/DecisionMapPanel.tsx`
- `frontend/src/components/decision/DecisionKpiPanel.tsx`
- `frontend/src/components/decision/DecisionDataPanel.tsx`
- `frontend/src/components/decision/DecisionLegend.tsx`
- `frontend/src/config/decisionDashboardCatalog.ts`

## Sources données

- endpoints actifs :
  - `GET /api/v1/qualite/metaux`
  - `GET /api/v1/qualite/pollution-organique`
  - `GET /api/v1/qualite/chimie-minerale`
  - `GET /api/v1/qualite/physicochimie`

## Règles fonctionnelles

- aucune donnée chargée à l'ouverture ;
- vue de base visible ;
- sélection vision obligatoire ;
- sélection paramètre ou campagne obligatoire ;
- clic `Afficher` obligatoire ;
- état `à venir` pour les familles et campagnes non branchées ;
- modes carte / tableau / graphique pris en charge ;
- séparation explicite récent / historique / archive.
