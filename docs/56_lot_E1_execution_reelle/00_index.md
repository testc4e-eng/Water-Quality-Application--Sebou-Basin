# Lot E1 - execution reelle sans IDP

## Synthese

| Indicateur | Valeur |
|---|---:|
| Run dry-run source | f0f2a858-1c90-4b15-a6af-cc172bece071 |
| Candidats E1 traites | 922086 |
| Lignes effectivement inserees | 51116 |
| Tables finales modifiees | 2 |
| IDP insere | 0 |
| Doublons naturels detectes apres E1 | 42052 |

## Detail

- `hydro.mesure_debit` depuis `raw_mesures_debit_jr` : candidats `0`, inseres `0`
- `hydro.mesure_debit_mensuel` depuis `raw_mesures_debit_m` : candidats `0`, inseres `0`
- `hydro.mesure_debit_source` depuis `raw_mesures_debit_sources` : candidats `2816`, inseres `1162`
- `hydro.mesure_barrage` depuis `raw_mesures_niv_eau_barrages` : candidats `85074`, inseres `0`
- `hydro.barrage_bathymetrie` depuis `raw_bathymetries_barrages_abhs` : candidats `62359`, inseres `0`
- `meteo.mesure_precipitation` depuis `raw_mesures_precipitations_jr_traitees` : candidats `546007`, inseres `0`
- `meteo.mesure_precipitation` depuis `raw_mesures_precipitations_jr` : candidats `0`, inseres `0`
- `meteo.mesure_precipitation_annuelle_max` depuis `raw_mesures_precipitations_jr_max` : candidats `1915`, inseres `0`
- `meteo.mesure_evaporation` depuis `raw_mesures_evaporation_jr` : candidats `38592`, inseres `0`
- `qualite.mesure_qualite_barrage` depuis `raw_mesures_qualite_barrages` : candidats `8708`, inseres `0`
- `qualite.mesure_qualite_nappe` depuis `raw_mesures_qualite_nappes` : candidats `63076`, inseres `0`
- `qualite.mesure_qualite_riviere` depuis `raw_mesures_qualite_rivieres` : candidats `60074`, inseres `0`
- `qualite.mesure_qualite_sebou` depuis `raw_suivi_qualite_sebou_jr` : candidats `49954`, inseres `49954`
- `qualite.suivi_qualite_barrage_garde_hebdo` depuis `raw_suivi_qualite_brg_garde_hebdo` : candidats `3511`, inseres `0`

## Alerte post-execution

- `qualite.mesure_qualite_sebou` contient `42052` doublons naturels sur la cle metier `(temps, station_id, parametre_qualite)` apres execution
- `hydro.mesure_debit_jr`, `hydro.mesure_debit_mensuel` et `meteo.mesure_precipitation` via `raw_mesures_precipitations_jr` n'ont pas ete rejoues car `source_row_id` dans `E0` utilise une cle technique differente pour ces tables
- rollback cible disponible via `qa_dry_run.e1_insert_audit`
