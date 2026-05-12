# Reconstruction stable

## Source utilisée

- table source officielle : `staging.raw_mesures_debit_jr`
- mapping station : `metadata.mapping_station`
- clé stable :
  - `code_debit`
  - `ire_station`
  - `date_jr`
  - `debit_jr`
  - `source_row_hash`
  - `target_business_key_hash`

## Contrôles avant insertion

- `code_debit` unique : `oui`
- mapping station : `100 %`
- unité : `m3/s` unique
- doublons source sur `(date_jr, station_id)` : `0`
- lignes réellement manquantes : `131 013`
- conflits exclus : `1 553`
- backlog exclu : `5 455`

## Règle d’exclusion backlog

Les lignes backlog ont été exclues via une signature stable :

- `source_date`
- `valeur_brute`

Cette exclusion respecte le périmètre métier validé sans réutiliser `ctid`.
