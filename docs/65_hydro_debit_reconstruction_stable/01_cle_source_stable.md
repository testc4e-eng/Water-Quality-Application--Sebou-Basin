# Clé source stable

## Problème actuel

Dans `qa_dry_run.e0_mesures_preparees`, les `515 978` lignes du flux débit utilisent :

- `source_row_id = ctid`

Cette approche est non rejouable et non recevable pour :

- un mini-lot `E1.1`
- un rollback
- un audit durable

## Clé stable proposée

La source brute `staging.raw_mesures_debit_jr` fournit déjà une clé robuste :

- `code_debit`

Constat :

- volume brut : `521 433`
- `COUNT(DISTINCT code_debit)` : `521 433`

`code_debit` est donc unique dans la source brute actuelle.

## Clé technique recommandée

Conserver les champs suivants dans la reconstruction stable :

- `source_table`
- `code_debit`
- `ire_station`
- `date_jr`
- `debit_jr`
- `station_id`
- `source_row_hash`
- `target_business_key_hash`

## Hash proposés

- `source_row_hash`
  - `md5(source_table || '|' || code_debit || '|' || ire_station || '|' || date_jr || '|' || debit_jr)`
- `target_business_key_hash`
  - `md5(temps || '|' || station_id)`

## Conséquence

Le flux débit peut être reconstruit sans dépendance à `ctid`, uniquement depuis la source brute et le mapping station validé.
