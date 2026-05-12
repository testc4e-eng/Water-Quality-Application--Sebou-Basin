# Préparation et dédoublonnage source

## Source utilisée

- table préparée : `qa_dry_run.e0_mesures_preparees`
- filtre : `source_table = 'raw_suivi_qualite_brg_garde_hebdo'`
- jointure brute : `staging.raw_suivi_qualite_brg_garde_hebdo.id::text = source_row_id`
- rattachement métier forcé validé :
  - `station_id = 4179b4bb-277c-4b29-80fa-300fd49eb9c2`
  - `ire_station = 3323/8`
  - `barrage_id = 4179b4bb-277c-4b29-80fa-300fd49eb9c2`
- mapping paramètre de référence : `metadata.referentiel_parametre.code_canonique = code_parametre_canonique`
- déduplication du référentiel : `DISTINCT ON (code_canonique)`

## Règles appliquées

- exclusion des lignes avec `code_parametre_canonique` null
- exclusion des lignes avec `valeur_preparee` null
- exclusion de la quarantaine `E0`
- dédoublonnage métier sur :
  - `(temps, station_id, parametre_qualite)`
- priorité de conservation :
  - valeur non nulle
  - `parametre_ref_id` renseigné
  - `milieu_prelevement` renseigné
  - `observation` renseignée
  - `raw_id` le plus faible en dernier départage

## Résultat

- volume préparé brut : `3 511`
- volume quarantaine exclu : `3 583`
- lignes gardées après dédoublonnage : `1 780`
- lignes écartées : `1 731`

## Point important

Le volume final est fortement réduit car le flux hebdomadaire Garde Sebou contenait de nombreuses collisions sur la clé métier après rattachement forcé à une station unique.
