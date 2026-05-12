# Insert only missing

## Règle appliquée

Insertion uniquement des lignes :

- absentes de `hydro.mesure_debit` sur la clé métier `(temps, station_id)`
- absentes du backlog `E0`
- hors conflits et anomalies de scaling

## Résultat

- lignes insérées : `131 013`
- audit inséré : `131 013`
- aucune ligne existante modifiée
- aucune autre table modifiée

## Audit stable

Table alimentée :
- `qa_dry_run.e1_1_insert_audit`

Champs alimentés :
- `migration_run_id`
- `mini_lot`
- `target_table`
- `target_business_key_hash`
- `source_table`
- `source_row_hash`
- `source_date`
- `geo_ref`
- `code_parametre_canonique`
- `valeur_preparee`
