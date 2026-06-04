# Plan frontend implementation

## Principe

Le frontend ne doit pas recréer une nouvelle carte autonome. Il doit composer le home autour du moteur cartographique existant.

## Composants à créer

- `DashboardHomeV2.tsx`
- `HeroSection.tsx`
- `OperationalMap.tsx`
- `BasinStatus.tsx`
- `AlertsPanel.tsx`
- `RecommendedActionsPanel.tsx`
- `TrendPanel.tsx`
- `SecondaryKpiPanel.tsx`
- `DataFreshnessBadge.tsx`
- `LayerSummary.tsx`
- `dashboardHome.ts`
- `useDashboardHome.ts`

## Composants à modifier

- `frontend/src/pages/AccueilSadPage.tsx`
- `frontend/src/components/DashboardMetier/BusinessMap.tsx`

## Composants à réutiliser

- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/components/DashboardMetier/BusinessMap.tsx`
- `frontend/src/components/DashboardMetier/PanneauActionMetier.tsx`
- `frontend/src/components/decision-first/RecommendationList.tsx`
- `frontend/src/components/quality-regulatory/QualityAlertCenter.tsx`

## Placement visuel recommandé

### Bloc 1

- hero compact en haut

### Bloc 2

- carte métier au centre
- la carte doit représenter la majorité de la valeur visuelle

### Bloc 3

- `Situation du bassin`
- `Alertes`
- `Actions recommandées`

### Bloc 4

- `Tendances`
- `Indicateurs DG` en secondaire

## Réutilisation BusinessMap

Recommandation :

- extraire un mode home à partir de `BusinessMap`
- fournir des couches par défaut :
  - `barrages`
  - `hydro`
  - `pluvio`
  - `quality_daily`

sans recréer un autre moteur cartographique.

## Stratégie data frontend

- créer un client `dashboardHome.ts`
- ne pas brancher directement plusieurs endpoints disparates depuis la page home
- consommer prioritairement `GET /api/v1/dashboard/home`

## Implémentation réalisée

- `AccueilSadPage.tsx` délègue maintenant au nouveau `DashboardHomeV2.tsx`
- le Home V2 consomme un seul endpoint : `GET /api/v1/dashboard/home`
- `BusinessMap` est réutilisé en mode `home`, sans casser `/dashboard-carto-metier`
- `PanneauActionMetier` est réutilisé comme panneau latéral d’entrée vers la carte métier complète
- les KPI DG sont déplacés dans `SecondaryKpiPanel`
- les libellés métier obligatoires sont respectés :
  - `Données pluie disponibles`
  - `Stations sentinelles qualité`
  - `AIR_TEMPERATURE != WATER_TEMPERATURE`

## Validation réelle

- `npm run build` : `OK`
- route `/` validée visuellement
- route `/accueil-sad` validée visuellement
- le Home affiche bien :
  - les 4 cartes hero opérationnelles
  - la carte métier centrale
  - les alertes visibles
  - les recommandations visibles
  - les KPI DG en secondaire

## Limite runtime observée

- le rendu final dépend actuellement d’un endpoint backend lent ; le premier chargement du Home peut rester plusieurs dizaines de secondes en état `loading`

## Alignement design maquette

- le shell home est maintenant traité comme un mode institutionnel dédié :
  - sidebar sombre
  - header bleu nuit
  - fond principal bleu très pâle
- les KPI DG restent alimentés par le contrat `secondary_kpis` mais sont remontés visuellement dans une bande `État global du bassin`, en cohérence avec la maquette
- la carte métier reste réutilisée via `BusinessMap`, sans recréer de nouveau moteur cartographique
- la page est restructurée en 4 lignes denses :
  - état global + alertes
  - carte métier + stations critiques + pollutions prioritaires
  - qualité + recommandations + confiance données
  - prévisions + historique récent

## Règle UX

- KPI DG visibles mais secondaires ;
- alertes visibles immédiatement ;
- vocabulaire qualité sentinelle explicite ;
- pluie libellée `Données pluie disponibles` tant que la typologie n'est pas consolidée.
