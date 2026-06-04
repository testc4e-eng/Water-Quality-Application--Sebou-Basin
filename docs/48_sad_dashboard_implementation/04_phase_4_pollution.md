# Phase 4 - Pollution

## Base de convergence

Refondre `/dashboard-pollution` sans réimplémenter le backend propagation.

## Statut Sprint 1

- `IMPLEMENTED_FRONTEND_MVP`
- page modifiée : `frontend/src/pages/DashboardPollution.tsx`
- carte réutilisée : `frontend/src/components/Pollution/PollutionIdpMap.tsx`
- clients/hook ajoutés :
  - `frontend/src/api/propagation.ts`
  - `frontend/src/hooks/usePropagation.ts`

## Objectif

Transformer l'écran pollution en écran décisionnel.

## Structure cible

### Onglet A - Pollutions déclarées

- sources actives
- dernières observations
- sévérité
- localisation

### Onglet B - Propagation

- consommer les endpoints MVP existants
- afficher stations impactées
- afficher barrages impactés
- afficher exutoires impactés
- afficher confiance du snap
- afficher indice risque propagation

Mentions obligatoires :

- `Propagation topologique`
- `Aide à la décision préliminaire`
- `Validation hydraulique avancée future`

### Onglet C - Impacts potentiels

- zones sensibles aval
- priorisation opérationnelle

### Onglet D - Recommandations

- actions immédiates
- surveillance renforcée
- investigations à lancer

## Composants et APIs réutilisés

- `/api/v1/pollution/sites.geojson`
- `/api/v1/pollution/latest-results`
- `/api/v1/propagation/source-to-garde`
- `/api/v1/propagation/snap-diagnostic`
- `/api/v1/propagation/source-to-stations`
- `/api/v1/propagation/source-to-barrages`
- `/api/v1/propagation/source-to-exutoires`

## Score métier à créer

### IPP - Indice Pression Pollution

- intensité pollution
- proximité d'actifs sensibles
- qualité du snap
- distance aval
- confiance hydraulique MVP

## Règle stricte

Ne jamais présenter les temps de transfert comme scientifiquement validés.

## Risques

- confusion entre démonstration topologique et simulation hydraulique
- surcharge cartographique si trop de couches restent visibles

## Intégration réalisée

- onglets `Pollutions déclarées`, `Propagation`, `Impacts potentiels`, `Recommandations`
- consommation effective des endpoints propagation MVP existants
- affichage du snap, des stations/barrages/exutoires atteignables et de l'IPP MVP
- mentions obligatoires de prudence intégrées dans l'écran
