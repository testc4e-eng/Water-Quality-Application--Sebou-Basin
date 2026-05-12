# Insertion propre

## Cible

- table cible : `qualite.suivi_qualite_barrage_garde_hebdo`

## Données insérées

- lignes insérées : `1 780`
- source système marqué : `E1_1_GARDE_HEBDO`
- `source_row_id` utilisé : `raw.id`
- aucune utilisation de `ctid`

## Audit stable

Table alimentée :
- `qa_dry_run.e1_1_insert_audit`

Champs clés alimentés :
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

Volume audit :
- `1 780`
