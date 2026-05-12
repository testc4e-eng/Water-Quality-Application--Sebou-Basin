# Mapping source vers cible

| Source `abh_sebou_ismail` | Type | Destination proposée | Statut |
|---|---|---|---|
| `public.adm_cercles_abhs` | référentiel | staging.raw_adm_cercles_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.adm_communes_abhs` | référentiel | staging.raw_adm_communes_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.adm_douars_abhs` | référentiel | staging.raw_adm_douars_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.adm_provinces_abhs` | référentiel | staging.raw_adm_provinces_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.adm_regions_abhs` | autre | staging.raw_adm_regions_abhs puis destination à confirmer | PENDING |
| `public.adm_villes_abhs` | référentiel | staging.raw_adm_villes_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.barrages_abhs` | hydrologie | staging.raw_barrages_abhs puis hydro.* après validation stations et unités | PENDING |
| `public.bassin_sebou` | référentiel | staging.raw_bassin_sebou puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.bathymetries_barrages_abhs` | hydrologie | staging.raw_bathymetries_barrages_abhs puis hydro.* après validation stations et unités | PENDING |
| `public.capteurs_abhs` | qualité | staging.raw_capteurs_abhs puis qualite.* après mapping validé | PENDING |
| `public.decharges_abhs` | pollution | staging.raw_decharges_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.fosses_septiques_abhs` | référentiel | staging.raw_fosses_septiques_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.huileries_abhs` | pollution | staging.raw_huileries_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.idp_2024_mesures_qualite_globale` | qualité | staging.raw_idp_2024_mesures_qualite_globale puis qualite.* après mapping validé | PENDING |
| `public.idp_2024_mesures_qualite_marche_cadre` | qualité | staging.raw_idp_2024_mesures_qualite_marche_cadre puis qualite.* après mapping validé | PENDING |
| `public.idp_2024_src_pollution_globale` | pollution | staging.raw_idp_2024_src_pollution_globale puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.idp_2024_src_pollution_marche_cadre` | pollution | staging.raw_idp_2024_src_pollution_marche_cadre puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.mesures_debit_jr` | hydrologie | staging.raw_mesures_debit_jr puis hydro.* après validation stations et unités | PENDING |
| `public.mesures_debit_m` | hydrologie | staging.raw_mesures_debit_m puis hydro.* après validation stations et unités | PENDING |
| `public.mesures_debit_sources` | hydrologie | staging.raw_mesures_debit_sources puis hydro.* après validation stations et unités | PENDING |
| `public.mesures_evaporation_jr` | météo | staging.raw_mesures_evaporation_jr puis meteo.* après QA et règles NULL | PENDING |
| `public.mesures_niv_eau_barrages` | hydrologie | staging.raw_mesures_niv_eau_barrages puis hydro.* après validation stations et unités | PENDING |
| `public.mesures_precipitations_jr` | météo | staging.raw_mesures_precipitations_jr puis meteo.* après QA et règles NULL | PENDING |
| `public.mesures_precipitations_jr_max` | météo | staging.raw_mesures_precipitations_jr_max puis meteo.* après QA et règles NULL | PENDING |
| `public.mesures_precipitations_jr_traitees` | météo | staging.raw_mesures_precipitations_jr_traitees puis meteo.* après QA et règles NULL | PENDING |
| `public.mesures_qualite_barrages` | qualité | staging.raw_mesures_qualite_barrages puis qualite.* après mapping validé | PENDING |
| `public.mesures_qualite_nappes` | qualité | staging.raw_mesures_qualite_nappes puis qualite.* après mapping validé | PENDING |
| `public.mesures_qualite_rivieres` | qualité | staging.raw_mesures_qualite_rivieres puis qualite.* après mapping validé | PENDING |
| `public.mesures_temperatures_jr` | météo | staging.raw_mesures_temperatures_jr puis meteo.* après QA et règles NULL | PENDING |
| `public.mines_abhs` | pollution | staging.raw_mines_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.nappes_abhs` | autre | staging.raw_nappes_abhs puis destination à confirmer | PENDING |
| `public.points_eau_abhs` | pollution | staging.raw_points_eau_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.profils_stations` | référentiel | staging.raw_profils_stations puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.rejets_abattoirs_abhs` | pollution | staging.raw_rejets_abattoirs_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.rejets_domestiques_abhs` | pollution | staging.raw_rejets_domestiques_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.rejets_ind_abhs` | pollution | staging.raw_rejets_ind_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.reseau_hydro_abhs` | autre | staging.raw_reseau_hydro_abhs puis destination à confirmer | PENDING |
| `public.sources_abhs` | référentiel | staging.raw_sources_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.sous_bassin_sebou` | référentiel | staging.raw_sous_bassin_sebou puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.spatial_ref_sys` | autre | staging.raw_spatial_ref_sys puis destination à confirmer | PENDING |
| `public.stations_abhs` | météo | staging.raw_stations_abhs puis meteo.* après QA et règles NULL | PENDING |
| `public.step_abhs` | pollution | staging.raw_step_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.step_ind_abhs` | pollution | staging.raw_step_ind_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | PENDING |
| `public.stm_abhs` | référentiel | staging.raw_stm_abhs puis infra.* / metadata.* après validation référentiel | PENDING |
| `public.suivi_qualite_brg_garde_hebdo` | qualité | staging.raw_suivi_qualite_brg_garde_hebdo puis qualite.* après mapping validé | PENDING |
| `public.suivi_qualite_sebou_jr` | qualité | staging.raw_suivi_qualite_sebou_jr puis qualite.* après mapping validé | PENDING |
| `public.types_mesures` | qualité | staging.raw_types_mesures puis qualite.* après mapping validé | PENDING |

## Règles
- tout mapping reste proposé tant qu’il n’est pas validé ;
- les tables source sont d’abord importées en brut dans `staging` ;
- les tables finales ne sont alimentées qu’après mapping, parsing, unités et QA.
