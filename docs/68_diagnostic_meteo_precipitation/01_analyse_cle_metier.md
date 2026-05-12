# Analyse de la clé métier

## Clés testées

- `(temps, station_id)`
- `(temps, station_id, ire_precipitation)`

## Résultats sur la cible

- volume cible : `546 007`
- distinct `(temps, station_id)` : `546 007`
- distinct `(temps, station_id, ire_precipitation)` : `546 007`
- doublons sur `(temps, station_id)` : `0`
- doublons sur `(temps, station_id, ire_precipitation)` : `0`

## Résultats sur les sources

### raw_mesures_precipitations_jr

- volume : `669 880`
- distinct `(date_jr, ire_station)` : `669 880`
- distinct `(date_jr, ire_station, ire_precipitation)` : `669 880`

### raw_mesures_precipitations_jr_traitees

- volume : `546 007`
- distinct `(date_jr, ire_station)` : `546 007`
- distinct `(date_jr, ire_station, ire_precipitation)` : `546 007`

## Conclusion

La clé métier réelle est :

`(temps, station_id, ire_precipitation)`

En pratique, `ire_precipitation` est suffisamment déterministe pour que `(temps, station_id)` soit déjà unique dans la cible, mais la clé complète reste la plus robuste conceptuellement.
