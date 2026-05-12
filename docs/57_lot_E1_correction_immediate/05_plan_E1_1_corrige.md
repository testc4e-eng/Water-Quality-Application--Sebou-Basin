# Plan E1.1 corrige

## Objectif

Reprendre E1 sans duplication metier et avec rollback fiable.

## Prealables obligatoires

1. Restaurer ou reconstituer `qualite.mesure_qualite_sebou` a son niveau attendu avant toute reprise.
2. Regenerer un scope `E0/E1` avec une cle source stable.
3. Ajouter un audit de chargement contenant :
   - `target_table`
   - `target_business_key_hash`
   - `target_tableoid`
   - `target_ctid`
   - `source_table`
   - `source_row_hash`
   - `run_id`

## Strategie d'insertion E1.1

### A. Anti-doublon metier

Avant insertion, filtrer les lignes qui existent deja sur la cle metier cible :

- `qualite.mesure_qualite_sebou` : `(temps, station_id, parametre_qualite)`
- `qualite.mesure_qualite_riviere` : `(temps, station_id, parametre_qualite, source_row_id)` ou variante metier si historique legacy
- `meteo.mesure_precipitation` : `(temps, station_id)` avec logique de merge des colonnes `val_observees`, `val_power_nasa`, `val_remplies`
- `hydro.mesure_barrage` : `(temps, barrage_id)` avec pivot des attributs

### B. Reprise des branches non jouees

Tables a corriger en priorite :

- `raw_mesures_debit_jr`
- `raw_mesures_debit_m`
- `raw_mesures_precipitations_jr`

Cause :
`source_row_id` y reference un `ctid` source et non l'identifiant metier.

## Decision

`E1.1` ne doit pas etre execute avant :

- correction de la restauration `qualite.mesure_qualite_sebou`
- regeneration d'un audit fiable
- revalidation humaine
