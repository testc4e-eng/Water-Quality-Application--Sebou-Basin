# Plan de migration KPI frontend

## Avant Sprint 1.5

- `decision-metrics.ts` calculait ou simulait une partie des KPI côté frontend
- les écrans Sprint 1 dépendaient encore de proxys locaux

## Après Sprint 1.5

- les KPI structurants viennent du backend
- le frontend garde seulement :
  - helpers d'affichage
  - formatage UI
  - labels

## Migration réalisée

### Remplacé

- Accueil SAD : métriques locales -> `/api/v1/kpi/overview`
- recommandations locales -> `/api/v1/recommendations`
- alertes locales/proxys -> `/api/v1/alerts`

### Conservé temporairement

- `decision-metrics.ts`
  - reste utile pour :
    - formatage
    - `buildPollutionSummary()` local MVP
    - compatibilité UI

## Étape suivante recommandée

- déplacer progressivement le calcul local `IPP` purement UI vers la réponse backend pollution détaillée si une API métier dédiée est ajoutée plus tard
- conserver la logique locale uniquement pour la présentation, pas pour la décision
