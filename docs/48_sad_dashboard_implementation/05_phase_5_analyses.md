# Phase 5 - Analyses

## Objectif

Créer un dashboard d'analyses croisées utile à la décision et aux experts.

## Axes

- qualité
- pollution
- hydrologie
- température eau
- climat

## Règle température

- climat : `AIR_TEMPERATURE` depuis `meteo.mesure_temperature` / `api.v_meteo_temperature`
- qualité eau : `WATER_TEMPERATURE` via `T_EAU` / `api.v_qualite_terrain`
- aucun mélange des deux dans une même série sans indication explicite

## Fonctions cibles

- corrélations
- comparaisons
- tendances
- alertes de dégradation

## Composants à fusionner

- `DashboardAnalytique`
- `DecisionDashboardTest`
- parties utiles d'`Observatoire V2`

## Résultat attendu

Un espace d'analyse lisible avec deux portes d'entrée :

- lecture métier simplifiée
- approfondissement expert

## Dépendances

- endpoints qualité spécialisés `/api/v1/qualite/*`
- endpoints qualité réglementaires `/api/v1/quality/*`
- endpoints pollution `/api/v1/pollution/*`
- endpoints hydrologie `/api/v1/hydro/*` et `/api/v1/observatory/*`
- disponibilité réelle de `api.v_meteo_temperature`

## Risque principal

Reproduire un écran catalogue de paramètres au lieu d'un espace d'analyses orienté questions métier.
