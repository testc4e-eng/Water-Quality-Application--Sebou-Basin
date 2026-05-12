# Remigration qualite sebour

## Source

- source dry-run : `qa_dry_run.e0_mesures_preparees`
- table source : `raw_suivi_qualite_sebou_jr`
- run_id : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Regles appliquees

- jointure sur `staging.raw_suivi_qualite_sebou_jr.id = source_row_id`
- jointure station sur `metadata.mapping_station.legacy_code_station = ire_station`
- jointure parametre sur `metadata.mapping_parametre_source`
- anti-doublon sur `(date_prelevement, station_id, parametre_qualite)`
- conservation de la ligne la plus complete selon :
  - valeur non nulle
  - station mappée
  - parametre_ref_id present
  - observation presente

## Resultat

- lignes preparees source : `49954`
- lignes dedoublonnees candidates : `49954`
- lignes remigrees : `49954`
- audit insere : `49954`
- migration_run_id audit : `QUALITE_SEBOU_RESET_20260505T131415Z`
