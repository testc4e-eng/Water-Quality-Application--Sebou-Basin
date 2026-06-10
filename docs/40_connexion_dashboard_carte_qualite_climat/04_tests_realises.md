# Tests Réalisés

## Backend

- `GET /api/v1/quality/stations-with-timeseries` : `200 OK`
- `GET /api/v1/dashboard/trends` : `200 OK`
- `GET /api/v1/map/entities/c1299320-3bdb-4bb3-8bbf-0f9dc3ca71ef?support=stations_qualite` : `200 OK`
- `GET /api/v1/map/entities/706fc2fe-3cee-4ec2-8e85-dbde9b672f89?group_code=stations&support_code=hydro` : `200 OK`
- `GET /api/v1/map/entities/346e234c-23f0-478b-b592-14898492ce2e?group_code=stations&support_code=pluvio` : `200 OK`

## Frontend

- `npm run build` : `OK`
- ouverture `http://127.0.0.1:5174/accueil-sad` : chargement sans erreur console bloquante
- vérification snapshot Playwright :
  - le bloc `Tendances` expose maintenant `Température`
  - le message `Température non disponible en base` apparaît quand la série est vide
- capture générée :
  - `home-runtime-quality-trends.png`

## Vérifications fonctionnelles

- popup station qualité :
  - nom réel
  - commune/province
  - dernière date
  - nombre de mesures
  - dernières valeurs classifiées
- popup station hydro :
  - nom réel
  - commune/province
  - dernière date
  - débit récent
  - température air si disponible
- bloc qualité accueil :
  - utilise les 6 vraies stations de `qualite.mesure_qualite_sebou`
- tendances :
  - pluie : série réelle, `1` point actuellement disponible
  - débit : série réelle, `3` points actuellement disponibles
  - température : série réelle, `30` points
  - qualité : série réelle, `30` points
