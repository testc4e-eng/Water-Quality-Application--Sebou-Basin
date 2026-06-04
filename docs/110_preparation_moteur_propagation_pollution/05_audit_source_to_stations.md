# Audit source-to-stations

## Vue auditée

- `api.v_station_dimension`

## Champs disponibles

- `station_id` : `uuid`
- `legacy_station_id` : `double precision`
- `legacy_code_station` : `text`
- `source_system` : `text`
- `mapping_confidence` : `numeric`
- `code_station` : `varchar`
- `station_nom` : `varchar`
- `type_station` : `varchar`
- `date_mise_service` : `date`
- `altitude_m` : `numeric`
- `actif` : `boolean`
- `sous_bassin_id` / `sous_bassin_nom`
- `bassin_id` / `bassin_nom`
- `longitude` : `double precision`
- `latitude` : `double precision`
- `geom` : géométrie PostGIS

## Champ ID retenu

- `station_id`

Justification :

- identifiant stable exposé par la vue
- type `uuid`
- distinct du code legacy métier

## Champ nom retenu

- `station_nom`

## Champ type retenu

- `type_station`

## Mode géométrique retenu

- `geom` PostGIS

Justification :

- `390/390` stations disposent de `geom`
- `390/390` disposent aussi de `longitude` et `latitude`
- le mode principal retenu est la géométrie PostGIS native ; `longitude` / `latitude` restent un fallback documentaire possible mais non nécessaire ici

## Volumétrie observée

- total stations : `390`
- `geom` non nul : `390`
- `longitude` non nul : `390`
- `latitude` non nul : `390`

## Typologie observée

Top types observés :

- `puits` : `137`
- `NULL` : `121`
- `hydrologique` : `41`
- `source` : `41`
- `forage` : `30`
- `barrage` : `15`
- `pluviometrique` : `5`

## Contrat retenu pour le MVP

- ID station : `station_id`
- ID legacy exposé en sortie : `legacy_station_id`
- nom : `station_nom`
- type : `type_station`
- géométrie : `geom`
