# Endpoints Créés ou Utilisés

## Créés

- `GET /api/v1/quality/stations-with-timeseries`
  - source : `qualite.mesure_qualite_sebou`
  - rôle : exposer les 6 stations qualité réelles avec couverture, statut et dernières valeurs

- `GET /api/v1/dashboard/trends`
  - sources :
    - `meteo.mesure_precipitation`
    - `hydro.mesure_debit`
    - `meteo.mesure_temperature`
    - `qualite.mesure_qualite_sebou`
  - rôle : fournir les séries réelles Pluie / Débit / Température / Qualité

## Étendus

- `GET /api/v1/map/entities/{entity_id}`
  - extension :
    - support `legacy` conservé
    - ajout `group_code` + `support_code`
    - enrichissement métier popup pour qualité / hydro / pluvio

## Réutilisés

- `GET /api/v1/dashboard/home`
- `GET /api/v1/map/entities`
- `GET /api/v1/quality/stations`

## Résultats de test

- `/api/v1/quality/stations-with-timeseries` : `200 OK`, `6` stations
- `/api/v1/dashboard/trends` : `200 OK`
  - pluie : `1` point
  - débit : `3` points
  - température : `30` points
  - qualité : `30` points
- `/api/v1/map/entities/{quality_station}` : `200 OK`, `13` dernières valeurs
- `/api/v1/map/entities/{hydro_station}` : `200 OK`, `2` dernières valeurs
