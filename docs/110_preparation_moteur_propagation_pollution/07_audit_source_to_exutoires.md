# Audit source-to-exutoires

## Table auditée

- `geo_work.reseau_hydro_nodes_final_candidate_20260602`

## Champs disponibles

- `node_id` : `bigint`
- `geom` : géométrie PostGIS
- `cnt` : `integer`
- `chk` : `integer`
- `ein` : `integer`
- `eout` : `integer`
- `degree` : `integer`
- `component_id` : `bigint`
- `component_nodes` : `integer`
- `component_edges` : `integer`
- `node_type` : `text`

## Définition retenue d’un exutoire

- `eout = 0`
- `ein >= 1`

Cette définition est celle déjà validée dans le chantier hydrologique. Aucune autre définition métier externe n’est introduite.

## Nombre d’exutoires total

- `19`

## Exutoires par composante

- composante `1` : `6`
- composante `5` : `7`
- composante `17` : `2`
- composante `61` : `1`
- composante `72` : `1`
- composante `80` : `1`
- composante `357` : `1`

## Exutoires dans la composante de la garde

- garde fonctionnelle : station `legacy_station_id = 52`
- noeud réseau le plus proche observé : `node_id = 464`
- composante de la garde : `5`
- exutoires dans cette composante : `7`

## Risques d’interprétation

- un exutoire ici est un terminal topologique du graphe validé, pas nécessairement un exutoire hydraulique expertisé à une autre échelle
- une composante peut contenir plusieurs exutoires selon la topologie disponible
- le moteur MVP ne hiérarchise pas encore les exutoires entre eux par importance métier ou bassin principal
