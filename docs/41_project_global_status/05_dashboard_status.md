# Dashboards qualité et cartographie

## Statut
`GO_DEV_DEMO_P0_1__NOGO_PREPROD_DASHBOARD`

## Ce qui est prêt DEV
- `/dashboard-carto-metier` existe et le build frontend a été validé dans les rapports P0/P0.1.
- Catalogue métier `/api/v1/map/catalog` et entités `/api/v1/map/entities` utilisés.
- Symbologie réglementaire disponible dans les composants `BusinessMap`, `BusinessLegend`, `BusinessPopup`.
- Route `/pollution-idp-dev` conservée.

## Blocages préproduction
- Validation navigateur métier avec backend HTTP réel encore à refaire.
- Les statuts exacts exigés `HORS_PERIMETRE_REGLEMENTAIRE` et `TYPE_EAU_NON_OPERATIONNEL` ne sont pas confirmés côté frontend/backend.
- Les supports hors IDP ont une couverture latest-values hétérogène.
- Séries temporelles P1 non branchées dans le dashboard métier.

## Risques
- Confusion entre observationnel et réglementaire si l'UI affiche seulement `non classifiable` générique.
- `water_type` deprecated non signalé visuellement si un client legacy l'utilise.

## Prochaine action
Ajouter les statuts réglementaires explicites UI/API, valider en navigateur avec backend FastAPI réel, puis ouvrir démo métier contrôlée.
