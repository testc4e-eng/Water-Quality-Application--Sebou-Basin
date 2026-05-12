# Analyse des sources precipitation

## Source brute

### raw_mesures_precipitations_jr

- volume : `669 880`
- colonnes métier :
  - `date_jr`
  - `ire_station`
  - `ire_precipitation`
  - `precipitation_jr`

Cette source porte une seule valeur brute observée.

## Source traitée

### raw_mesures_precipitations_jr_traitees

- volume : `546 007`
- colonnes métier :
  - `date_jr`
  - `ire_station`
  - `ire_precipitation`
  - `val_observees`
  - `val_power_nasa`
  - `val_remplies`

Cette source est structurellement compatible avec `meteo.mesure_precipitation`.

## Recouvrement entre sources

- overlap exact sur la clé `(date_jr, ire_station, ire_precipitation)` : `64 529`
- parmi ces overlaps :
  - `64 529` ont `raw.precipitation_jr = traitees.val_observees`
  - `0` conflit de valeur

## Lecture

Les deux sources ne doivent pas être fusionnées dans un même chargement sans décision métier explicite :

- `raw_mesures_precipitations_jr_traitees` correspond au modèle cible actuel
- `raw_mesures_precipitations_jr` est une source brute parallèle, partiellement recouverte mais beaucoup plus large

## Décision technique recommandée

- **ne pas fusionner**
- considérer `raw_mesures_precipitations_jr_traitees` comme source officielle pour `meteo.mesure_precipitation`
- garder `raw_mesures_precipitations_jr` en backlog ou dans un lot séparé si l’on veut reconstituer une histoire brute complémentaire
