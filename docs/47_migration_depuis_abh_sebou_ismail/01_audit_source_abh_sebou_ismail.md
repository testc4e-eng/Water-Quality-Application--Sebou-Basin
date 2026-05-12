# Audit source officielle - abh_sebou_ismail

## Cadre
- Source officielle : `abh_sebou_ismail`.
- Base cible : `abh_sad`.
- Mode : lecture seule.
- Statut de toutes les tables : `PENDING` tant que la validation humaine n’est pas formalisée.

## Synthèse par type
| Type table | Nombre |
|---|---:|
| autre | 4 |
| hydrologie | 6 |
| météo | 6 |
| pollution | 11 |
| qualité | 9 |
| référentiel | 11 |

## Tables source
| Schéma | Table | Type | Volume | Paramètres | Valeurs | Dates | Destination proposée | Priorité |
|---|---|---|---:|---|---|---|---|---|
| `public` | `adm_cercles_abhs` | référentiel | 61 | à confirmer | à confirmer | à confirmer | staging.raw_adm_cercles_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `adm_communes_abhs` | référentiel | 346 | à confirmer | à confirmer | à confirmer | staging.raw_adm_communes_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `adm_douars_abhs` | référentiel | 6013 | à confirmer | à confirmer | à confirmer | staging.raw_adm_douars_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `adm_provinces_abhs` | référentiel | 21 | à confirmer | à confirmer | à confirmer | staging.raw_adm_provinces_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `adm_regions_abhs` | autre | 6 | à confirmer | à confirmer | à confirmer | staging.raw_adm_regions_abhs puis destination à confirmer | Moyenne |
| `public` | `adm_villes_abhs` | référentiel | 33 | à confirmer | à confirmer | à confirmer | staging.raw_adm_villes_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `barrages_abhs` | hydrologie | 34 | à confirmer | apports_hm | à confirmer | staging.raw_barrages_abhs puis hydro.* après validation stations et unités | Élevée |
| `public` | `bassin_sebou` | référentiel | 1 | à confirmer | à confirmer | à confirmer | staging.raw_bassin_sebou puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `bathymetries_barrages_abhs` | hydrologie | 62359 | à confirmer | volume_mm3 | à confirmer | staging.raw_bathymetries_barrages_abhs puis hydro.* après validation stations et unités | Élevée |
| `public` | `capteurs_abhs` | qualité | 0 | code_type_mesure | code_type_mesure, mode_mesure | date_installation | staging.raw_capteurs_abhs puis qualite.* après mapping validé | Critique |
| `public` | `decharges_abhs` | pollution | 233 | à confirmer | à confirmer | date_mise_service | staging.raw_decharges_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `fosses_septiques_abhs` | référentiel | 20 | à confirmer | à confirmer | à confirmer | staging.raw_fosses_septiques_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `huileries_abhs` | pollution | 612 | à confirmer | à confirmer | à confirmer | staging.raw_huileries_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `idp_2024_mesures_qualite_globale` | qualité | 4894 | parametre_qualite | val_qual | date_jr_prelevement | staging.raw_idp_2024_mesures_qualite_globale puis qualite.* après mapping validé | Critique |
| `public` | `idp_2024_mesures_qualite_marche_cadre` | qualité | 3614 | parametre_qualite | val_qual | date_jr_prelevement | staging.raw_idp_2024_mesures_qualite_marche_cadre puis qualite.* après mapping validé | Critique |
| `public` | `idp_2024_src_pollution_globale` | pollution | 243 | parametre | ph, cond_20_c, o2_dissous, sat_prc, conditions_meteologiques, eau_ss_terr_mesures_periodiques_o_n, eau_ss_terr_debit, eau_surf_debit | date_jr_prelevement | staging.raw_idp_2024_src_pollution_globale puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `idp_2024_src_pollution_marche_cadre` | pollution | 148 | parametre | ph, cond_20_c, o2_dissous, sat_prc, conditions_meteologiques, eau_ss_terr_mesures_periodiques_o_n, eau_ss_terr_debit, eau_surf_debit | date_jr_prelevement | staging.raw_idp_2024_src_pollution_marche_cadre puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `mesures_debit_jr` | hydrologie | 521433 | à confirmer | code_debit, debit_jr | date_jr | staging.raw_mesures_debit_jr puis hydro.* après validation stations et unités | Élevée |
| `public` | `mesures_debit_m` | hydrologie | 19316 | à confirmer | code_debit_m, debit_m | mois, annee | staging.raw_mesures_debit_m puis hydro.* après validation stations et unités | Élevée |
| `public` | `mesures_debit_sources` | hydrologie | 2816 | à confirmer | debit | à confirmer | staging.raw_mesures_debit_sources puis hydro.* après validation stations et unités | Élevée |
| `public` | `mesures_evaporation_jr` | météo | 48900 | à confirmer | date_mesure, val_evaporation | date_mesure | staging.raw_mesures_evaporation_jr puis meteo.* après QA et règles NULL | Élevée |
| `public` | `mesures_niv_eau_barrages` | hydrologie | 85166 | à confirmer | niveau_eau_m_ngm, volume_mm3, restitutions_mm3, transfert_mm3, apports_mm3 | date_jr | staging.raw_mesures_niv_eau_barrages puis hydro.* après validation stations et unités | Élevée |
| `public` | `mesures_precipitations_jr` | météo | 669880 | à confirmer | id_precipitation_jr, ire_precipitation, precipitation_jr | date_jr | staging.raw_mesures_precipitations_jr puis meteo.* après QA et règles NULL | Élevée |
| `public` | `mesures_precipitations_jr_max` | météo | 2085 | à confirmer | nbr_val_jr_mqt, ire_precipitation | annee, date_jr, nb_mois | staging.raw_mesures_precipitations_jr_max puis meteo.* après QA et règles NULL | Élevée |
| `public` | `mesures_precipitations_jr_traitees` | météo | 546007 | à confirmer | val_observees, val_power_nasa, val_remplies, ire_precipitation | date_jr | staging.raw_mesures_precipitations_jr_traitees puis meteo.* après QA et règles NULL | Élevée |
| `public` | `mesures_qualite_barrages` | qualité | 8714 | parametre_qualite | val_qual_barr | date_prelevement | staging.raw_mesures_qualite_barrages puis qualite.* après mapping validé | Critique |
| `public` | `mesures_qualite_nappes` | qualité | 63088 | parametre_qualite | val_qual_nap | date_prelevement | staging.raw_mesures_qualite_nappes puis qualite.* après mapping validé | Critique |
| `public` | `mesures_qualite_rivieres` | qualité | 60097 | parametre_qualite | val_qual_riv | date_prelevement | staging.raw_mesures_qualite_rivieres puis qualite.* après mapping validé | Critique |
| `public` | `mesures_temperatures_jr` | météo | 0 | à confirmer | code_temperature, temperature_jr | date_jr | staging.raw_mesures_temperatures_jr puis meteo.* après QA et règles NULL | Élevée |
| `public` | `mines_abhs` | pollution | 42 | à confirmer | à confirmer | à confirmer | staging.raw_mines_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `nappes_abhs` | autre | 17 | à confirmer | à confirmer | à confirmer | staging.raw_nappes_abhs puis destination à confirmer | Moyenne |
| `public` | `points_eau_abhs` | pollution | 46 | à confirmer | utilisation, date_realisation | date_realisation | staging.raw_points_eau_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `profils_stations` | référentiel | 1980 | à confirmer | à confirmer | à confirmer | staging.raw_profils_stations puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `rejets_abattoirs_abhs` | pollution | 61 | à confirmer | à confirmer | à confirmer | staging.raw_rejets_abattoirs_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `rejets_domestiques_abhs` | pollution | 362 | à confirmer | debit_l_s, reutilisation | à confirmer | staging.raw_rejets_domestiques_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `rejets_ind_abhs` | pollution | 11 | à confirmer | à confirmer | à confirmer | staging.raw_rejets_ind_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `reseau_hydro_abhs` | autre | 28 | à confirmer | à confirmer | à confirmer | staging.raw_reseau_hydro_abhs puis destination à confirmer | Moyenne |
| `public` | `sources_abhs` | référentiel | 135 | à confirmer | à confirmer | à confirmer | staging.raw_sources_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `sous_bassin_sebou` | référentiel | 15 | à confirmer | à confirmer | à confirmer | staging.raw_sous_bassin_sebou puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `spatial_ref_sys` | autre | 8500 | à confirmer | à confirmer | à confirmer | staging.raw_spatial_ref_sys puis destination à confirmer | Moyenne |
| `public` | `stations_abhs` | météo | 390 | à confirmer | ire_precipitation, types_mesures | à confirmer | staging.raw_stations_abhs puis meteo.* après QA et règles NULL | Élevée |
| `public` | `step_abhs` | pollution | 41 | à confirmer | niveau_epuration, reutilisation_eaux_us_epur | à confirmer | staging.raw_step_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `step_ind_abhs` | pollution | 15 | à confirmer | à confirmer | à confirmer | staging.raw_step_ind_abhs puis qualite.source_pollution_* / infra.rejet_* après rattachement validé | Critique |
| `public` | `stm_abhs` | référentiel | 18 | à confirmer | à confirmer | à confirmer | staging.raw_stm_abhs puis infra.* / metadata.* après validation référentiel | Moyenne |
| `public` | `suivi_qualite_brg_garde_hebdo` | qualité | 7094 | parametre_qualite | val_qual_brg_garde_hebdo | date_prelevement | staging.raw_suivi_qualite_brg_garde_hebdo puis qualite.* après mapping validé | Critique |
| `public` | `suivi_qualite_sebou_jr` | qualité | 59436 | parametre_qualite | val_qual_sebou_jr | date_prelevement | staging.raw_suivi_qualite_sebou_jr puis qualite.* après mapping validé | Critique |
| `public` | `types_mesures` | qualité | 64 | type_mesure, parametre_qualite | type_mesure | à confirmer | staging.raw_types_mesures puis qualite.* après mapping validé | Critique |

## Sources complémentaires détectées
| Source | Type | Statut |
|---|---|---|
| `backend/data/uploads/SWATOutput.mdb` | SWAT | source complémentaire détectée, à valider |
| `backend/data/uploads/Data_Results_WASP.xlsx` | WASP | source complémentaire détectée, à valider |
| `CSV température` | météo température | non trouvé dans le dépôt hors archives, à fournir ou confirmer |
