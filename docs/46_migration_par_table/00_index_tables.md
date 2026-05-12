> ATTENTION : ce document est archivé comme analyse exploratoire. Il ne constitue pas le plan officiel de migration. La migration officielle partira de `abh_sebou_ismail` vers `abh_sad`.

# Index tables - migration par table

## Synthèse
| Indicateur | Valeur |
|---|---:|
| Tables analysées | 33 |
| Paramètres / variables détectés | 682 |
| Problèmes détectés | 61 |
| Tables PENDING | 33 |
| Tables VALIDATED | 0 |
| Tables EXECUTED | 0 |

## Règle de gouvernance
- aucune exécution sans validation humaine ;
- aucun `DELETE` direct ;
- `staging` reste la conservation brute ;
- tout SQL généré est non exécuté et stocké dans `sql_en_attente/`.

## Tables sources contenant des mesures
| Table | Schéma | Volume | Paramètres | Problèmes | Priorité | Statut | Fiche |
|---|---|---:|---:|---|---|---|---|
| `hydro.barrage_bathymetrie` | `hydro` | 62359 | 1 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/hydro_barrage_bathymetrie.md) |
| `hydro.mesure_barrage` | `hydro` | 84831 | 1 | valeurs nulles | Moyenne | PENDING | [fiche](01_fiches_tables/hydro_mesure_barrage.md) |
| `hydro.mesure_debit` | `hydro` | 521433 | 1 | valeurs négatives | Élevée | PENDING | [fiche](01_fiches_tables/hydro_mesure_debit.md) |
| `hydro.mesure_debit_mensuel` | `hydro` | 19316 | 1 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/hydro_mesure_debit_mensuel.md) |
| `hydro.mesure_debit_source` | `hydro` | 2816 | 1 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/hydro_mesure_debit_source.md) |
| `hydro.regle_qualite_debit_source` | `hydro` | 19 | 0 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/hydro_regle_qualite_debit_source.md) |
| `hydro.regle_qualite_debit_station` | `hydro` | 390 | 0 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/hydro_regle_qualite_debit_station.md) |
| `meteo.mesure_evaporation` | `meteo` | 48900 | 1 | valeurs nulles | Moyenne | PENDING | [fiche](01_fiches_tables/meteo_mesure_evaporation.md) |
| `meteo.mesure_precipitation` | `meteo` | 546007 | 3 | unités à valider, valeurs nulles | Élevée | PENDING | [fiche](01_fiches_tables/meteo_mesure_precipitation.md) |
| `meteo.mesure_precipitation_annuelle_max` | `meteo` | 2085 | 0 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/meteo_mesure_precipitation_annuelle_max.md) |
| `meteo.mesure_temperature` | `meteo` | 0 | 3 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/meteo_mesure_temperature.md) |
| `meteo.regle_qualite_evaporation_station` | `meteo` | 390 | 0 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/meteo_regle_qualite_evaporation_station.md) |
| `qualite.mesure_qualite_barrage` | `qualite` | 15808 | 98 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs nulles | Critique | PENDING | [fiche](01_fiches_tables/qualite_mesure_qualite_barrage.md) |
| `qualite.mesure_qualite_nappe` | `qualite` | 63088 | 71 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | Critique | PENDING | [fiche](01_fiches_tables/qualite_mesure_qualite_nappe.md) |
| `qualite.mesure_qualite_riviere` | `qualite` | 60097 | 96 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | Critique | PENDING | [fiche](01_fiches_tables/qualite_mesure_qualite_riviere.md) |
| `qualite.mesure_qualite_sebou` | `qualite` | 51402 | 13 | mapping ambigu ou absent, unités à valider, valeurs nulles | Critique | PENDING | [fiche](01_fiches_tables/qualite_mesure_qualite_sebou.md) |
| `qualite.source_pollution_mesure_param` | `qualite` | 7191 | 51 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs non numériques, valeurs nulles | Critique | PENDING | [fiche](01_fiches_tables/qualite_source_pollution_mesure_param.md) |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `qualite` | 7094 | 39 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs nulles | Critique | PENDING | [fiche](01_fiches_tables/qualite_suivi_qualite_barrage_garde_hebdo.md) |
| `staging._legacy_qualite_riviere` | `staging` | 60097 | 96 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | Critique | PENDING | [fiche](01_fiches_tables/staging_legacy_qualite_riviere.md) |
| `staging.mesure_precipitation_old_model` | `staging` | 507930 | 1 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/staging_mesure_precipitation_old_model.md) |
| `staging.mesures_debit_jr` | `staging` | 173251 | 2 | mapping ambigu ou absent, unités à valider | Critique | PENDING | [fiche](01_fiches_tables/staging_mesures_debit_jr.md) |
| `staging.mesures_debit_m` | `staging` | 19316 | 2 | mapping ambigu ou absent, unités à valider | Critique | PENDING | [fiche](01_fiches_tables/staging_mesures_debit_m.md) |
| `staging.mesures_debit_sources` | `staging` | 2816 | 1 | mapping ambigu ou absent, unités à valider | Critique | PENDING | [fiche](01_fiches_tables/staging_mesures_debit_sources.md) |
| `staging.mesures_evaporation_jr` | `staging` | 48900 | 1 | unités à valider, valeurs nulles | Élevée | PENDING | [fiche](01_fiches_tables/staging_mesures_evaporation_jr.md) |
| `staging.mesures_niv_eau_barrages` | `staging` | 85166 | 5 | unités à valider, valeurs nulles | Élevée | PENDING | [fiche](01_fiches_tables/staging_mesures_niv_eau_barrages.md) |
| `staging.mesures_precip` | `staging` | 669880 | 2 | unités à valider, valeurs nulles | Élevée | PENDING | [fiche](01_fiches_tables/staging_mesures_precip.md) |
| `staging.mesures_precipitations_jr_max` | `staging` | 2085 | 0 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/staging_mesures_precipitations_jr_max.md) |
| `staging.mesures_precipitations_jr_traitees` | `staging` | 546007 | 3 | unités à valider, valeurs nulles | Élevée | PENDING | [fiche](01_fiches_tables/staging_mesures_precipitations_jr_traitees.md) |
| `staging.mesures_qualite_barrages` | `staging` | 8714 | 60 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider | Critique | PENDING | [fiche](01_fiches_tables/staging_mesures_qualite_barrages.md) |
| `staging.mesures_qualite_nappes` | `staging` | 63088 | 71 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs négatives | Critique | PENDING | [fiche](01_fiches_tables/staging_mesures_qualite_nappes.md) |
| `staging.sources_polution_mesure` | `staging` | 141 | 6 | aucun problème critique détecté automatiquement | Moyenne | PENDING | [fiche](01_fiches_tables/staging_sources_polution_mesure.md) |
| `staging.suivi_qualite_brg_garde_hebdo` | `staging` | 7094 | 39 | cas de quarantaine associés, mapping ambigu ou absent, unités à valider, valeurs nulles | Critique | PENDING | [fiche](01_fiches_tables/staging_suivi_qualite_brg_garde_hebdo.md) |
| `staging.suivi_qualite_sebou` | `staging` | 51402 | 13 | mapping ambigu ou absent, unités à valider, valeurs nulles | Critique | PENDING | [fiche](01_fiches_tables/staging_suivi_qualite_sebou.md) |
