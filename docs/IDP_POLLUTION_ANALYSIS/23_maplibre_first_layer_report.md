# Rapport premiere couche MapLibre DEV - IDP pollution

Date execution : 2026-05-18

## Artefacts crees

| Fichier | Role |
|---|---|
| `maplibre_pollution_sites_sample.geojson` | echantillon GeoJSON de 100 sites depuis l'endpoint FastAPI |
| `maplibre_pollution_layer_config.json` | configuration source/layer/filtres MapLibre |
| `maplibre_pollution_first_layer.html` | page HTML de test MapLibre autonome |

## Source cartographique

Endpoint cible :

```text
GET http://localhost:8000/api/v1/pollution/sites.geojson?limit=5000
```

## Affichage couvert

- points `geo.ref_site_pollution` exposes par `api.v_pollution_sites`;
- couleur par `validation_status`;
- popup : nom site, typologie, commune, derniers resultats P0;
- filtre client/API par `DBO5`, `DCO`, `NH4`, `NO3`, `MES`.

## Validation effectuee

- Endpoint `sites.geojson?limit=5` teste via FastAPI : 200 OK.
- Endpoint `latest-results?parameter_code=DBO5&limit=5` teste via FastAPI : 200 OK.
- Echantillon GeoJSON genere avec 100 features.

## Prerequis d'ouverture

Demarrer le backend FastAPI sur `http://localhost:8000`, puis ouvrir `maplibre_pollution_first_layer.html`.
