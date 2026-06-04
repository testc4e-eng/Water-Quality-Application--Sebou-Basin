# Audit source-to-barrages

## Vue auditée

- `api.v_barrage_dimension`

## Champs disponibles

- `barrage_id` : `uuid`
- `legacy_ire_barrage` : `text`
- `legacy_barrage_id` : `integer`
- `source_system` : `text`
- `mapping_confidence` : `numeric`
- `barrage_nom` : `text`
- `nom_oued` : `text`
- `type_barrage` : `text`
- `vrn_hm3` : `double precision`
- `hauteur` : `double precision`
- `apports_hm` : `double precision`
- `statut` : `text`
- `longitude` : `double precision`
- `latitude` : `double precision`
- `geom` : géométrie PostGIS

## Champ ID retenu

- `barrage_id`

## Champ nom retenu

- `barrage_nom`

## Mode géométrique retenu

- `geom` PostGIS

Justification :

- `11/11` barrages disposent de `geom`
- `11/11` disposent aussi de `longitude` et `latitude`
- le mode principal retenu est la géométrie PostGIS native

## Nombre de barrages

- total barrages : `11`

## Présence de legacy_barrage_id = 51

- `absent`

Constat :

- `api.v_barrage_dimension` ne contient aucun barrage avec `legacy_barrage_id = 51`

## Rappel garde fonctionnelle

- la garde fonctionnelle validée reste la station `legacy_station_id = 52`
- station observée : `brg de garde / sebou`
- type station : `barrage`

## Contrat retenu pour le MVP

- ID barrage : `barrage_id`
- ID legacy exposé en sortie : `legacy_barrage_id`
- nom : `barrage_nom`
- géométrie : `geom`
- distinction stricte :
  - barrage géographique = `api.v_barrage_dimension`
  - garde fonctionnelle = station `52` dans `api.v_station_dimension`
