# Journal décisions - migration par table

| Table | Décision | Action | Validateur | Date | Impact |
|---|---|---|---|---|---|
| `hydro.barrage_bathymetrie` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 62359 lignes |
| `hydro.mesure_barrage` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 84831 lignes |
| `hydro.mesure_debit` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 521433 lignes |
| `hydro.mesure_debit_mensuel` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 19316 lignes |
| `hydro.mesure_debit_source` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 2816 lignes |
| `hydro.regle_qualite_debit_source` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 19 lignes |
| `hydro.regle_qualite_debit_station` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 390 lignes |
| `meteo.mesure_evaporation` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 48900 lignes |
| `meteo.mesure_precipitation` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 546007 lignes |
| `meteo.mesure_precipitation_annuelle_max` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 2085 lignes |
| `meteo.mesure_temperature` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 0 lignes |
| `meteo.regle_qualite_evaporation_station` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 390 lignes |
| `qualite.mesure_qualite_barrage` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 15808 lignes |
| `qualite.mesure_qualite_nappe` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 63088 lignes |
| `qualite.mesure_qualite_riviere` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 60097 lignes |
| `qualite.mesure_qualite_sebou` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 51402 lignes |
| `qualite.source_pollution_mesure_param` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 7191 lignes |
| `qualite.suivi_qualite_barrage_garde_hebdo` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 7094 lignes |
| `staging._legacy_qualite_riviere` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 60097 lignes |
| `staging.mesure_precipitation_old_model` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 507930 lignes |
| `staging.mesures_debit_jr` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 173251 lignes |
| `staging.mesures_debit_m` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 19316 lignes |
| `staging.mesures_debit_sources` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 2816 lignes |
| `staging.mesures_evaporation_jr` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 48900 lignes |
| `staging.mesures_niv_eau_barrages` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 85166 lignes |
| `staging.mesures_precip` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 669880 lignes |
| `staging.mesures_precipitations_jr_max` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 2085 lignes |
| `staging.mesures_precipitations_jr_traitees` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 546007 lignes |
| `staging.mesures_qualite_barrages` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 8714 lignes |
| `staging.mesures_qualite_nappes` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 63088 lignes |
| `staging.sources_polution_mesure` | PENDING | valider la structure, exécuter un dry-run, puis migrer avec journalisation |  |  | 141 lignes |
| `staging.suivi_qualite_brg_garde_hebdo` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 7094 lignes |
| `staging.suivi_qualite_sebou` | PENDING | valider table par table, générer quarantaine si nécessaire, puis exécuter sur sous-ensemble test |  |  | 51402 lignes |
