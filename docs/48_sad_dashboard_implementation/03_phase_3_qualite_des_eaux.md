# Phase 3 - Qualité des Eaux

## Base de convergence

Faire évoluer `/dashboard-qualite-reglementaire`.

## Statut Sprint 1

- `IMPLEMENTED_FRONTEND_MVP`
- page modifiée : `frontend/src/pages/DashboardQualiteReglementaire.tsx`
- nouveau composant : `frontend/src/components/quality-regulatory/QualityAlertCenter.tsx`

## Objectif

Passer d'un écran de conformité à un écran d'aide à la décision.

## Composants réutilisés

- route `/dashboard-qualite-reglementaire`
- client `frontend/src/api/qualityRegulatory.ts`
- hooks `frontend/src/hooks/useQualityRegulatory.ts`
- composants `frontend/src/components/quality-regulatory/*`
- endpoints `/api/v1/quality/*`

## Éléments à mettre en avant

- stations conformes
- stations sous surveillance
- stations critiques
- évolution qualité
- anomalies
- alertes

## Éléments à déplacer en mode Expert

- 36 classifiables
- 177 seuils
- alias
- référentiels
- détails techniques

## Sous-modules cibles

### Synthèse qualité

- KPI station/bassin
- tendance récente

### Centre d'alertes qualité

- nouvelles dégradations
- dépassements critiques
- stations sans données récentes

### Analyse temporelle

- évolution par station
- évolution par paramètre

### Comparaison stations

- panel court de stations
- comparaison simple et lisible

## Règle température

- `WATER_TEMPERATURE` seulement via `T_EAU` / `api.v_qualite_terrain`
- ne jamais utiliser `meteo.mesure_temperature` ou `api.v_meteo_temperature` dans cet écran

## Dépendances

- `/api/v1/quality/regulatory-status`
- `/api/v1/quality/thresholds`
- `/api/v1/quality/stations`
- `/api/v1/quality/timeseries`
- `/api/v1/quality/classify`
- `/api/v1/qualite/*` pour les familles spécialisées

## Risque principal

Conserver une logique de conformité brute au lieu d'une logique de priorisation métier.

## Intégration réalisée

- bandeau DG/métier en tête d'écran
- centre d'alertes qualité
- cartes décisionnelles de surveillance et fraîcheur
- rappel strict `WATER_TEMPERATURE` uniquement
