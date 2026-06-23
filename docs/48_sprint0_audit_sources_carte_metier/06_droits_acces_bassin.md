# 6. Analyse des Droits d'Accès Bassin

Pour restreindre la V1 au périmètre "Sebou" sans hardcoder l'UI, l'architecture doit s'appuyer sur le modèle de sécurité.

## Disponibilité des filtres de bassin
* `api.v_station_dimension` expose `bassin_nom` et `sous_bassin_nom`.
* `api.v_pollution_sites` expose `bassin`.
* `api.v_barrage_dimension` ne possède pas nativement de rattachement bassin dans son schéma immédiat, une intersection spatiale préalable avec `geo.bassin_versant` est recommandée si le champ n'existe pas.

## Risque multi-bassin (V2)
Certaines tables d'infrastructure ou de météo pourraient contenir des données nationales. L'absence d'un filtre `WHERE bassin_id IN (:authorized_basins)` au niveau du service backend `map_business_service.py` entrainerait un chargement inutile de données hors périmètre.

## Solution V1
L'endpoint `/availability` et `/features` devront inclure un mécanisme injectant le `bassin_nom = 'Sebou'` pour l'utilisateur actuel.
