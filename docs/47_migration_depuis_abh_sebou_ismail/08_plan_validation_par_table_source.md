# Plan validation par table source

## Principe
- travailler table par table depuis `abh_sebou_ismail` ;
- importer d’abord en staging ;
- migrer vers les tables finales seulement après validation mapping, unités et QA.

## Statuts
- `PENDING`
- `VALIDATED_FOR_STAGING`
- `STAGING_IMPORTED`
- `VALIDATED_FOR_FINAL_MIGRATION`
- `FINAL_MIGRATED`
- `BLOCKED`

## Tableau de validation
| Table source | Type | Volume | Destination | Étapes à valider | Statut |
|---|---|---:|---|---|---|
| `public.adm_cercles_abhs` | référentiel | 61 | staging.raw_adm_cercles_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.adm_communes_abhs` | référentiel | 346 | staging.raw_adm_communes_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.adm_douars_abhs` | référentiel | 6013 | staging.raw_adm_douars_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.adm_provinces_abhs` | référentiel | 21 | staging.raw_adm_provinces_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.adm_regions_abhs` | autre | 6 | staging.raw_adm_regions_abhs puis destination à confirmer | structure, mapping, QA, dry-run, migration | PENDING |
| `public.adm_villes_abhs` | référentiel | 33 | staging.raw_adm_villes_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.barrages_abhs` | hydrologie | 34 | staging.raw_barrages_abhs puis hydro.* après validation stations et unités | structure, mapping, QA, dry-run, migration | PENDING |
| `public.bassin_sebou` | référentiel | 1 | staging.raw_bassin_sebou puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.bathymetries_barrages_abhs` | hydrologie | 62359 | staging.raw_bathymetries_barrages_abhs puis hydro.* après validation stations et unités | structure, mapping, QA, dry-run, migration | PENDING |
| `public.capteurs_abhs` | qualité | 0 | staging.raw_capteurs_abhs puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.decharges_abhs` | pollution | 233 | staging.raw_decharges_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.fosses_septiques_abhs` | référentiel | 20 | staging.raw_fosses_septiques_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.huileries_abhs` | pollution | 612 | staging.raw_huileries_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.idp_2024_mesures_qualite_globale` | qualité | 4894 | staging.raw_idp_2024_mesures_qualite_globale puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.idp_2024_mesures_qualite_marche_cadre` | qualité | 3614 | staging.raw_idp_2024_mesures_qualite_marche_cadre puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.idp_2024_src_pollution_globale` | pollution | 243 | staging.raw_idp_2024_src_pollution_globale puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.idp_2024_src_pollution_marche_cadre` | pollution | 148 | staging.raw_idp_2024_src_pollution_marche_cadre puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_debit_jr` | hydrologie | 521433 | staging.raw_mesures_debit_jr puis hydro.* après validation stations et unités | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_debit_m` | hydrologie | 19316 | staging.raw_mesures_debit_m puis hydro.* après validation stations et unités | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_debit_sources` | hydrologie | 2816 | staging.raw_mesures_debit_sources puis hydro.* après validation stations et unités | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_evaporation_jr` | météo | 48900 | staging.raw_mesures_evaporation_jr puis meteo.* après QA et règles NULL | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_niv_eau_barrages` | hydrologie | 85166 | staging.raw_mesures_niv_eau_barrages puis hydro.* après validation stations et unités | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_precipitations_jr` | météo | 669880 | staging.raw_mesures_precipitations_jr puis meteo.* après QA et règles NULL | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_precipitations_jr_max` | météo | 2085 | staging.raw_mesures_precipitations_jr_max puis meteo.* après QA et règles NULL | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_precipitations_jr_traitees` | météo | 546007 | staging.raw_mesures_precipitations_jr_traitees puis meteo.* après QA et règles NULL | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_qualite_barrages` | qualité | 8714 | staging.raw_mesures_qualite_barrages puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_qualite_nappes` | qualité | 63088 | staging.raw_mesures_qualite_nappes puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_qualite_rivieres` | qualité | 60097 | staging.raw_mesures_qualite_rivieres puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mesures_temperatures_jr` | météo | 0 | staging.raw_mesures_temperatures_jr puis meteo.* après QA et règles NULL | structure, mapping, QA, dry-run, migration | PENDING |
| `public.mines_abhs` | pollution | 42 | staging.raw_mines_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.nappes_abhs` | autre | 17 | staging.raw_nappes_abhs puis destination à confirmer | structure, mapping, QA, dry-run, migration | PENDING |
| `public.points_eau_abhs` | pollution | 46 | staging.raw_points_eau_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.profils_stations` | référentiel | 1980 | staging.raw_profils_stations puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.rejets_abattoirs_abhs` | pollution | 61 | staging.raw_rejets_abattoirs_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.rejets_domestiques_abhs` | pollution | 362 | staging.raw_rejets_domestiques_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.rejets_ind_abhs` | pollution | 11 | staging.raw_rejets_ind_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.reseau_hydro_abhs` | autre | 28 | staging.raw_reseau_hydro_abhs puis destination à confirmer | structure, mapping, QA, dry-run, migration | PENDING |
| `public.sources_abhs` | référentiel | 135 | staging.raw_sources_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.sous_bassin_sebou` | référentiel | 15 | staging.raw_sous_bassin_sebou puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.spatial_ref_sys` | autre | 8500 | staging.raw_spatial_ref_sys puis destination à confirmer | structure, mapping, QA, dry-run, migration | PENDING |
| `public.stations_abhs` | météo | 390 | staging.raw_stations_abhs puis meteo.* après QA et règles NULL | structure, mapping, QA, dry-run, migration | PENDING |
| `public.step_abhs` | pollution | 41 | staging.raw_step_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.step_ind_abhs` | pollution | 15 | staging.raw_step_ind_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.stm_abhs` | référentiel | 18 | staging.raw_stm_abhs puis infra.* / metadata.* après validation référentiel | structure, mapping, QA, dry-run, migration | PENDING |
| `public.suivi_qualite_brg_garde_hebdo` | qualité | 7094 | staging.raw_suivi_qualite_brg_garde_hebdo puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.suivi_qualite_sebou_jr` | qualité | 59436 | staging.raw_suivi_qualite_sebou_jr puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
| `public.types_mesures` | qualité | 64 | staging.raw_types_mesures puis qualite.* après mapping validé | structure, mapping, QA, dry-run, migration | PENDING |
