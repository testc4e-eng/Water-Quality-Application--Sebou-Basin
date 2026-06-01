# Flux Cartographiques et Données Spatiales

## 1. Flux des Données
Le cycle de vie d'une donnée spatiale dans le MVP est le suivant :
1. **Stockage DB** : La donnée géométrique réside dans une colonne PostGIS (ex: `geom` ou `shape`).
2. **Requête API** : Le frontend (via Axios) interroge `GET /api/v1/geojson/{layer_key}`.
3. **Transformation SQL** : Le backend exécute une fonction `ST_AsGeoJSON()` combinée à un agrégateur JSON pour former un objet FeatureCollection standard.
4. **Rendu Frontend** : MapLibre ingère le GeoJSON via une balise `<Source>` et l'affiche via une `<Layer>`.

## 2. Problématique et Correction de la Projection (EPSG)
### Le Problème
Initialement, le frontend plantait avec l'erreur `Invalid LngLat latitude value: must be between -90 and 90`.
**Cause** : Les données spatiales marocaines étaient stockées dans la base de données dans un système de projection plan cartésien local (ex: Lambert Maroc - EPSG:26191) utilisant des valeurs métriques (ex: `Y = 445886`). Le standard GeoJSON exige strictement des coordonnées géographiques non projetées en **WGS84 (EPSG:4326)**, soit des longitudes/latitudes classiques.

### La Correction
La correction a été implémentée dans le fichier backend `app/api/v1/geojson.py` en ajoutant la reprojection à la volée via PostGIS :
```sql
-- Avant
ST_AsGeoJSON(geom_col)

-- Après
ST_AsGeoJSON(ST_Transform(geom_col, 4326))
```
Cette modification silencieuse pour le client garantit une conformité parfaite avec le standard Web Mapping, stabilisant ainsi la carte.

## 3. Filtrage Métier des Entités
Pour répondre aux besoins opérationnels, un filtrage côté frontend a été appliqué :
- **Stations** : Seules les entités de la table stations dont la propriété `type_station` vaut `'hydrologique'` sont conservées. Les puits, forages ou sources sont exclus de la carte de gestion de crise surfacique.
- **Barrages** : Intégrés indépendamment, classifiés dynamiquement (barrage réservoir vs barrage de garde) en fonction de leur nom.
