# Décision architecture finale

## Composants réutilisés

- `DashboardCartoMetier`
- `DashboardQualiteReglementaire`
- backend propagation MVP V1
- backend cartographique métier `/api/v1/map/*`
- backend pollution `/api/v1/pollution/*`
- composants administration existants

## Composants à reléguer

- `/dashboard` legacy
- `/dashboard-climate` en navigation principale
- `/pollution-idp-dev` comme écran utilisateur final
- `/dashboard-scenarios` pour le parcours DG

## Composants fusionnés

- `DashboardAnalytique`
- `DecisionDashboardTest`
- `DashboardCartographique`
- `Dashboard2`
- éléments utiles d'`Observatoire V2`

## Nouveaux composants

- `Accueil SAD`
- panneau d'action métier
- centre d'alertes qualité
- onglet propagation décisionnel pollution
- espace `Analyses`
- espace `Expert`
- entrée unifiée `Administration`

## Charge consolidée

- P0 utile : `27 à 41 jours`
- version consolidée : `35 à 55 jours`

## Décision

- ne pas reconstruire
- converger sur les actifs déjà validés
- réorganiser la hiérarchie d'information
- industrialiser les KPI DG progressivement

## Statut final

`GO_IMPLEMENTATION_DECISION_FIRST_SAD`

## Mise en œuvre Sprint 1

- `Accueil SAD` : implémenté
- `Carte Métier` : convergée vers un écran opérationnel avec panneau d'action
- `Qualité des Eaux` : lecture DG/métier engagée
- `Pollution` : branchée sur les endpoints propagation MVP V1 existants
