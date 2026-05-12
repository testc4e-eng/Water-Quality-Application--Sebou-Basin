> ATTENTION : ce document est archivé comme analyse exploratoire. Il ne constitue pas le plan officiel de migration. La migration officielle partira de `abh_sebou_ismail` vers `abh_sad`.

# Plan de migration par table

## Principe
La migration se pilote table par table. Une table ne peut passer de `PENDING` à `VALIDATED`, puis `EXECUTED`, qu’après validation humaine explicite.

## Ordre recommandé
| Rang | Table | Raison | Action proposée | Statut |
|---:|---|---|---|---|
| 1 | `staging.mesures_debit_jr` | mapping ambigu ou absent, unités à valider | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 2 | `qualite.mesure_qualite_nappe` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 3 | `staging.mesures_qualite_nappes` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 4 | `qualite.mesure_qualite_riviere` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 5 | `staging._legacy_qualite_riviere` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 6 | `qualite.mesure_qualite_sebou` | mapping ambigu ou absent, unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 7 | `staging.suivi_qualite_sebou` | mapping ambigu ou absent, unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 8 | `staging.mesures_debit_m` | mapping ambigu ou absent, unités à valider | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 9 | `qualite.mesure_qualite_barrage` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 10 | `staging.mesures_qualite_barrages` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 11 | `qualite.source_pollution_mesure_param` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs non numériques, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 12 | `qualite.suivi_qualite_barrage_garde_hebdo` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 13 | `staging.suivi_qualite_brg_garde_hebdo` | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 14 | `staging.mesures_debit_sources` | mapping ambigu ou absent, unités à valider | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 15 | `staging.mesures_precip` | unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 16 | `meteo.mesure_precipitation` | unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 17 | `staging.mesures_precipitations_jr_traitees` | unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 18 | `hydro.mesure_debit` | valeurs négatives | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 19 | `staging.mesures_niv_eau_barrages` | unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 20 | `staging.mesures_evaporation_jr` | unités à valider, valeurs nulles | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test | PENDING |
| 21 | `staging.mesure_precipitation_old_model` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 22 | `hydro.mesure_barrage` | valeurs nulles | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 23 | `hydro.barrage_bathymetrie` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 24 | `meteo.mesure_evaporation` | valeurs nulles | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 25 | `hydro.mesure_debit_mensuel` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 26 | `hydro.mesure_debit_source` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 27 | `meteo.mesure_precipitation_annuelle_max` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 28 | `staging.mesures_precipitations_jr_max` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 29 | `hydro.regle_qualite_debit_station` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 30 | `meteo.regle_qualite_evaporation_station` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 31 | `staging.sources_polution_mesure` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 32 | `hydro.regle_qualite_debit_source` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
| 33 | `meteo.mesure_temperature` | aucun problème critique détecté automatiquement | valider la structure, exécuter un dry-run, puis migrer avec journalisation | PENDING |
