# Préparation et dédoublonnage source

## Source utilisée

- table préparée : `qa_dry_run.e0_mesures_preparees`
- filtre : `source_table = 'raw_mesures_qualite_nappes'`
- jointure brute : `staging.raw_mesures_qualite_nappes.id::text = source_row_id`
- mapping station : `metadata.mapping_station.legacy_code_station = ire_station`
- mapping paramètre de référence : `metadata.referentiel_parametre.code_canonique = code_parametre_canonique`

## Règles appliquées

- exclusion des lignes avec `station_id` null
- exclusion des lignes avec `code_parametre_canonique` null
- exclusion des lignes avec `valeur_preparee` null
- exclusion de la quarantaine `E0`
- dédoublonnage métier sur :
  - `(temps, station_id, parametre_qualite)`
- priorité de conservation :
  - valeur non nulle
  - `parametre_ref_id` renseigné
  - `raw_id` le plus faible en dernier départage

## Résultat

- volume préparé brut : `63 076`
- volume quarantaine exclu : `11`
- lignes gardées après dédoublonnage : `63 047`
- lignes écartées : `34`

## Point important

Le volume final inséré est inférieur au volume préparé brut car le dédoublonnage source retire explicitement les collisions métier présentes dans le flux préparé.
