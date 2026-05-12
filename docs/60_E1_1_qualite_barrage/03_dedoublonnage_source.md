# Préparation et dédoublonnage source

## Source utilisée

- table préparée : `qa_dry_run.e0_mesures_preparees`
- filtre : `source_table = 'raw_mesures_qualite_barrages'`
- jointure brute : `staging.raw_mesures_qualite_barrages.id::text = source_row_id`
- mapping station : `metadata.mapping_station.legacy_code_station = ire_station`

## Règles appliquées

- exclusion des lignes avec `station_id` null
- exclusion des lignes avec `code_parametre_canonique` null
- exclusion des lignes avec `valeur_preparee` null
- dédoublonnage métier sur :
  - `(temps, station_id, parametre_qualite)`
- priorité de conservation :
  - valeur non nulle
  - unité renseignée
  - `milieu_prelevement` renseigné
  - `raw_id` le plus faible en dernier départage

## Résultat

- volume source préparé brut : `8 708`
- lignes gardées après dédoublonnage : `7 820`
- lignes écartées : `888`

## Point important

Le volume final est inférieur au volume brut attendu `8 708` parce que le dédoublonnage source retire explicitement les collisions métier déjà présentes dans le flux préparé.
