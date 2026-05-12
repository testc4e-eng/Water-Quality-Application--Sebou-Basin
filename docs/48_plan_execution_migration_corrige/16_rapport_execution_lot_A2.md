# Rapport d'exécution Lot A2 — vidage staging et import raw

## Statut
Lot A2 exécuté uniquement. Les lots B, C, D et E restent bloqués en attente de validation humaine.

## Périmètre exécuté

| Élément | Résultat |
|---|---:|
| Tables staging vidées | 35 |
| Total lignes staging avant vidage | 2249330 |
| Total lignes staging après vidage | 0 |
| Tables source métier importées | 46 |
| Total lignes source | 2175895 |
| Total lignes raw | 2175895 |
| Delta global source/raw | 0 |
| Tables exclues | 1 (`public.spatial_ref_sys`) |

## Contrôle global A2.3

| Table source | Table raw | Source count | Raw count | Delta | Statut |
|---|---|---:|---:|---:|---|
| `public.adm_cercles_abhs` | `staging.raw_adm_cercles_abhs` | 61 | 61 | 0 | OK |
| `public.adm_communes_abhs` | `staging.raw_adm_communes_abhs` | 346 | 346 | 0 | OK |
| `public.adm_douars_abhs` | `staging.raw_adm_douars_abhs` | 6013 | 6013 | 0 | OK |
| `public.adm_provinces_abhs` | `staging.raw_adm_provinces_abhs` | 21 | 21 | 0 | OK |
| `public.adm_regions_abhs` | `staging.raw_adm_regions_abhs` | 6 | 6 | 0 | OK |
| `public.adm_villes_abhs` | `staging.raw_adm_villes_abhs` | 33 | 33 | 0 | OK |
| `public.barrages_abhs` | `staging.raw_barrages_abhs` | 34 | 34 | 0 | OK |
| `public.bassin_sebou` | `staging.raw_bassin_sebou` | 1 | 1 | 0 | OK |
| `public.bathymetries_barrages_abhs` | `staging.raw_bathymetries_barrages_abhs` | 62359 | 62359 | 0 | OK |
| `public.capteurs_abhs` | `staging.raw_capteurs_abhs` | 0 | 0 | 0 | OK |
| `public.decharges_abhs` | `staging.raw_decharges_abhs` | 233 | 233 | 0 | OK |
| `public.fosses_septiques_abhs` | `staging.raw_fosses_septiques_abhs` | 20 | 20 | 0 | OK |
| `public.huileries_abhs` | `staging.raw_huileries_abhs` | 612 | 612 | 0 | OK |
| `public.idp_2024_mesures_qualite_globale` | `staging.raw_idp_2024_mesures_qualite_globale` | 4894 | 4894 | 0 | OK |
| `public.idp_2024_mesures_qualite_marche_cadre` | `staging.raw_idp_2024_mesures_qualite_marche_cadre` | 3614 | 3614 | 0 | OK |
| `public.idp_2024_src_pollution_globale` | `staging.raw_idp_2024_src_pollution_globale` | 243 | 243 | 0 | OK |
| `public.idp_2024_src_pollution_marche_cadre` | `staging.raw_idp_2024_src_pollution_marche_cadre` | 148 | 148 | 0 | OK |
| `public.mesures_debit_jr` | `staging.raw_mesures_debit_jr` | 521433 | 521433 | 0 | OK |
| `public.mesures_debit_m` | `staging.raw_mesures_debit_m` | 19316 | 19316 | 0 | OK |
| `public.mesures_debit_sources` | `staging.raw_mesures_debit_sources` | 2816 | 2816 | 0 | OK |
| `public.mesures_evaporation_jr` | `staging.raw_mesures_evaporation_jr` | 48900 | 48900 | 0 | OK |
| `public.mesures_niv_eau_barrages` | `staging.raw_mesures_niv_eau_barrages` | 85166 | 85166 | 0 | OK |
| `public.mesures_precipitations_jr` | `staging.raw_mesures_precipitations_jr` | 669880 | 669880 | 0 | OK |
| `public.mesures_precipitations_jr_max` | `staging.raw_mesures_precipitations_jr_max` | 2085 | 2085 | 0 | OK |
| `public.mesures_precipitations_jr_traitees` | `staging.raw_mesures_precipitations_jr_traitees` | 546007 | 546007 | 0 | OK |
| `public.mesures_qualite_barrages` | `staging.raw_mesures_qualite_barrages` | 8714 | 8714 | 0 | OK |
| `public.mesures_qualite_nappes` | `staging.raw_mesures_qualite_nappes` | 63088 | 63088 | 0 | OK |
| `public.mesures_qualite_rivieres` | `staging.raw_mesures_qualite_rivieres` | 60097 | 60097 | 0 | OK |
| `public.mesures_temperatures_jr` | `staging.raw_mesures_temperatures_jr` | 0 | 0 | 0 | OK |
| `public.mines_abhs` | `staging.raw_mines_abhs` | 42 | 42 | 0 | OK |
| `public.nappes_abhs` | `staging.raw_nappes_abhs` | 17 | 17 | 0 | OK |
| `public.points_eau_abhs` | `staging.raw_points_eau_abhs` | 46 | 46 | 0 | OK |
| `public.profils_stations` | `staging.raw_profils_stations` | 1980 | 1980 | 0 | OK |
| `public.rejets_abattoirs_abhs` | `staging.raw_rejets_abattoirs_abhs` | 61 | 61 | 0 | OK |
| `public.rejets_domestiques_abhs` | `staging.raw_rejets_domestiques_abhs` | 362 | 362 | 0 | OK |
| `public.rejets_ind_abhs` | `staging.raw_rejets_ind_abhs` | 11 | 11 | 0 | OK |
| `public.reseau_hydro_abhs` | `staging.raw_reseau_hydro_abhs` | 28 | 28 | 0 | OK |
| `public.sources_abhs` | `staging.raw_sources_abhs` | 135 | 135 | 0 | OK |
| `public.sous_bassin_sebou` | `staging.raw_sous_bassin_sebou` | 15 | 15 | 0 | OK |
| `public.stations_abhs` | `staging.raw_stations_abhs` | 390 | 390 | 0 | OK |
| `public.step_abhs` | `staging.raw_step_abhs` | 41 | 41 | 0 | OK |
| `public.step_ind_abhs` | `staging.raw_step_ind_abhs` | 15 | 15 | 0 | OK |
| `public.stm_abhs` | `staging.raw_stm_abhs` | 18 | 18 | 0 | OK |
| `public.suivi_qualite_brg_garde_hebdo` | `staging.raw_suivi_qualite_brg_garde_hebdo` | 7094 | 7094 | 0 | OK |
| `public.suivi_qualite_sebou_jr` | `staging.raw_suivi_qualite_sebou_jr` | 59436 | 59436 | 0 | OK |
| `public.types_mesures` | `staging.raw_types_mesures` | 64 | 64 | 0 | OK |

## Anciennes tables staging vidées

| Table | Count avant | Count après | Statut |
|---|---:|---:|---|
| `staging._legacy_qualite_riviere` | 60097 | 0 | OK |
| `staging.decharges` | 139 | 0 | OK |
| `staging.decharges_Abondonees` | 11 | 0 | OK |
| `staging.huileries` | 606 | 0 | OK |
| `staging.mesure_precipitation_old_model` | 507930 | 0 | OK |
| `staging.mesures_debit_jr` | 173251 | 0 | OK |
| `staging.mesures_debit_m` | 19316 | 0 | OK |
| `staging.mesures_debit_sources` | 2816 | 0 | OK |
| `staging.mesures_evaporation_jr` | 48900 | 0 | OK |
| `staging.mesures_niv_eau_barrages` | 85166 | 0 | OK |
| `staging.mesures_precip` | 669880 | 0 | OK |
| `staging.mesures_precipitations_jr_max` | 2085 | 0 | OK |
| `staging.mesures_precipitations_jr_traitees` | 546007 | 0 | OK |
| `staging.mesures_qualite_barrages` | 8714 | 0 | OK |
| `staging.mesures_qualite_nappes` | 63088 | 0 | OK |
| `staging.mines` | 39 | 0 | OK |
| `staging.points_eau_abhs` | 46 | 0 | OK |
| `staging.profils_stations` | 1980 | 0 | OK |
| `staging.rejet_abattoir` | 56 | 0 | OK |
| `staging.rejets_brutes` | 277 | 0 | OK |
| `staging.sources_polution_mesure` | 141 | 0 | OK |
| `staging.sous_bassin_swat_bas_sebou_new` | 29 | 0 | OK |
| `staging.sous_bassin_swat_bassin_cotier_new` | 23 | 0 | OK |
| `staging.sous_bassin_swat_beht_new` | 27 | 0 | OK |
| `staging.sous_bassin_swat_haut_sebou_new` | 22 | 0 | OK |
| `staging.sous_bassin_swat_leben_innaouen_new` | 18 | 0 | OK |
| `staging.sous_bassin_swat_moyen_sebou_new` | 16 | 0 | OK |
| `staging.sous_bassin_swat_ouergha_new` | 39 | 0 | OK |
| `staging.step_ind_abhs` | 15 | 0 | OK |
| `staging.steps` | 49 | 0 | OK |
| `staging.steps_industrielles` | 14 | 0 | OK |
| `staging.stm_abhs` | 18 | 0 | OK |
| `staging.stms` | 19 | 0 | OK |
| `staging.suivi_qualite_brg_garde_hebdo` | 7094 | 0 | OK |
| `staging.suivi_qualite_sebou` | 51402 | 0 | OK |

## Fichiers de preuve

- Résultats vidage staging : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_1_truncate_staging_results.md`
- Résultats import raw : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_2_import_raw_results.md`
- Contrôle global : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_3_global_volume_control.md`

## Garde-fous respectés

- Aucun schéma `qualite`, `hydro`, `meteo`, `infra` ou `metadata` modifié.
- Aucun Lot B, C, D ou E exécuté.
- `public.spatial_ref_sys` exclue de l'import raw.
- Arrêt obligatoire après A2 pour validation humaine.
