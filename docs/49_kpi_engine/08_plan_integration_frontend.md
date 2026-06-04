# Plan d'intégration frontend

## Écrans concernés

### Accueil SAD

Consomme désormais :

- `/api/v1/kpi/overview`
- `/api/v1/kpi/stations`
- `/api/v1/kpi/pollution`
- `/api/v1/alerts`
- `/api/v1/recommendations`

### Carte Métier

`PanneauActionMetier` consomme désormais :

- `/api/v1/alerts`
- `/api/v1/recommendations`

### Qualité des Eaux

`QualityAlertCenter` consomme désormais :

- `/api/v1/alerts?type=QUALITY`

### Pollution

L'onglet recommandations consomme désormais :

- `/api/v1/recommendations?domain=pollution`

L'onglet propagation continue de consommer :

- `/api/v1/propagation/*`

## Principe de migration

- conserver les composants d'écran Sprint 1
- remplacer les calculs locaux par des endpoints backend métier
- garder les mentions de prudence sur la propagation topologique

## Hooks frontend créés

- `frontend/src/api/decisionIntelligence.ts`
- `frontend/src/hooks/useDecisionIntelligence.ts`

## Écrans non touchés

- navigation globale
- dashboards hors Sprint 1.5
- espace Expert et Administration
