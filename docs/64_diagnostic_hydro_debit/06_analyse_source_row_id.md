# Analyse de source_row_id

## Constat

- lignes source préparées : `515 978`
- `source_row_id` distincts : `515 978`
- `source_row_id` au format `ctid` : `515 978`

## Interprétation

Le flux `hydro.mesure_debit` dépend entièrement de `ctid` pour relier `qa_dry_run.e0_mesures_preparees` à `staging.raw_mesures_debit_jr`.

Or `ctid` :

- n’est pas stable dans le temps ;
- n’est pas un identifiant métier ;
- n’est pas recevable comme base de rollback ;
- ne doit pas servir de clé de reprise `E1.1`.

## Impact opérationnel

Même si `131 013` lignes semblent “nouvelles”, elles ne peuvent pas être rejouées proprement en production sans reconstruire une clé source stable, par exemple :

- `source_table`
- `code_debit`
- `ire_station`
- `date_jr`
- hash métier source
