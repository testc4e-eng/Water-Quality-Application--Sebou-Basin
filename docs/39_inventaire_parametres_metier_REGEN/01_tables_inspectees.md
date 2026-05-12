# Tables métier inspectées

| Base | Schéma | Table | Nombre lignes | Colonnes paramètre détectées | Colonnes valeur détectées | Type table |
|---|---|---|---|---|---|---|
| abh_sad | geo | _bak_sous_bassin_swat_leben_innaouen_20260403 | 18 |  |  | SWAT |
| abh_sad | geo | bassin_versant | 1 |  |  | autre_métier |
| abh_sad | geo | nappe | 17 |  |  | autre_métier |
| abh_sad | geo | reseau_hydrographique | 697 |  |  | hydrologie |
| abh_sad | geo | source | 135 |  |  | autre_métier |
| abh_sad | geo | sous_bassin_abh | 15 |  |  | autre_métier |
| abh_sad | geo | sous_bassin_swat_bas_sebou | 29 |  |  | SWAT |
| abh_sad | geo | sous_bassin_swat_bassin_cotier | 23 |  |  | SWAT |
| abh_sad | geo | sous_bassin_swat_beht | 27 |  |  | SWAT |
| abh_sad | geo | sous_bassin_swat_haut_sebou | 22 |  |  | SWAT |
| abh_sad | geo | sous_bassin_swat_leben_innaouen | 18 |  |  | SWAT |
| abh_sad | geo | sous_bassin_swat_moyen_sebou | 16 |  |  | SWAT |
| abh_sad | geo | sous_bassin_swat_ouergha | 39 |  |  | SWAT |
| abh_sad | hydro | barrage_bathymetrie | 62359 |  | surface_km2, volume_mm3 | hydrologie |
| abh_sad | hydro | mesure_barrage | 84831 |  | lacher_m3s, volume_mm3 | hydrologie |
| abh_sad | hydro | mesure_debit | 521433 |  |  | hydrologie |
| abh_sad | hydro | mesure_debit_mensuel | 19316 |  |  | hydrologie |
| abh_sad | hydro | mesure_debit_source | 2816 |  |  | hydrologie |
| abh_sad | hydro | regle_qualite_debit_source | 19 |  |  | qualité |
| abh_sad | hydro | regle_qualite_debit_station | 390 |  |  | qualité |
| abh_sad | infra | barrages | 34 |  | apports_hm, montant_md | hydrologie |
| abh_sad | infra | decharge | 233 |  | quantite_t_j, sup_occupee_ha, sup_tot_ha | pollution |
| abh_sad | infra | decharge_inventaire_pollution | 11 |  |  | pollution |
| abh_sad | infra | decharge_inventaire_pollution_general | 139 |  |  | pollution |
| abh_sad | infra | fosses_septiques_abhs | 20 |  |  | pollution |
| abh_sad | infra | huilerie | 612 |  |  | pollution |
| abh_sad | infra | huilerie_inventaire_pollution | 606 |  |  | pollution |
| abh_sad | infra | mine | 42 |  |  | pollution |
| abh_sad | infra | mine_inventaire_pollution | 39 |  |  | pollution |
| abh_sad | infra | point_eau | 46 |  | dist_pt_eau_foyer_pollut_m, profond_tot_m | référentiel |
| abh_sad | infra | profil_station | 1980 |  |  | référentiel |
| abh_sad | infra | rejet_abattoir | 61 |  |  | pollution |
| abh_sad | infra | rejet_abattoir_inventaire_pollution | 56 |  |  | pollution |
| abh_sad | infra | rejet_domestique | 362 |  | debit_l_s | pollution |
| abh_sad | infra | rejet_industriel | 11 |  |  | pollution |
| abh_sad | infra | rejet_inventaire_pollution | 277 |  | debit_l_s | pollution |
| abh_sad | infra | stations | 390 |  |  | référentiel |
| abh_sad | infra | stations_mesure | 390 |  |  | référentiel |
| abh_sad | infra | step | 41 |  | vol_eaux_us_trait_m3_an | pollution |
| abh_sad | infra | step_industrielle | 15 |  |  | pollution |
| abh_sad | infra | step_inventaire_pollution | 49 |  |  | pollution |
| abh_sad | infra | stm | 18 |  |  | pollution |
| abh_sad | metadata | api_view_catalog | 57 |  |  | metadata |
| abh_sad | metadata | api_view_column_catalog | 1101 |  |  | metadata |
| abh_sad | metadata | catalogue_type_mesure | 64 |  |  | metadata |
| abh_sad | metadata | dictionnaire_donnees | 0 |  |  | metadata |
| abh_sad | metadata | mapping_abreviation_colonne_inventaire | 13 |  |  | metadata |
| abh_sad | metadata | mapping_abreviation_unresolved_sources | 5 |  |  | metadata |
| abh_sad | metadata | mapping_barrage | 11 |  |  | metadata |
| abh_sad | metadata | mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo | 0 |  |  | metadata |
| abh_sad | metadata | mapping_nappe_unresolved_qualite_nappes | 292 |  |  | metadata |
| abh_sad | metadata | mapping_parametre_source | 184 | source_value | source_value | metadata |
| abh_sad | metadata | mapping_parametre_source_orphans_audit | 5 |  |  | metadata |
| abh_sad | metadata | mapping_parametre_unresolved_legacy_qualite_riviere | 39 | parametre_qualite |  | metadata |
| abh_sad | metadata | mapping_parametre_unresolved_suivi_qualite_sebou | 7 | parametre_qualite |  | metadata |
| abh_sad | metadata | mapping_point_eau | 46 |  |  | metadata |
| abh_sad | metadata | mapping_point_eau_unresolved_nappe | 22 |  |  | metadata |
| abh_sad | metadata | mapping_point_eau_unresolved_station | 46 |  |  | metadata |
| abh_sad | metadata | mapping_profil_station | 1980 |  |  | metadata |
| abh_sad | metadata | mapping_profil_unresolved_nappe | 1204 |  |  | metadata |
| abh_sad | metadata | mapping_profil_unresolved_station | 0 |  |  | metadata |
| abh_sad | metadata | mapping_source | 19 |  |  | metadata |
| abh_sad | metadata | mapping_station | 390 |  |  | metadata |
| abh_sad | metadata | mapping_station_unresolved_precip_ann_max | 0 |  |  | metadata |
| abh_sad | metadata | mapping_station_unresolved_qualite_barrages | 0 |  |  | metadata |
| abh_sad | metadata | mapping_station_unresolved_qualite_nappes | 0 |  |  | metadata |
| abh_sad | metadata | mapping_station_unresolved_suivi_qualite_brg_garde_hebdo | 0 |  |  | metadata |
| abh_sad | metadata | mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i | 1 |  |  | metadata |
| abh_sad | metadata | mapping_step_ind | 15 |  |  | metadata |
| abh_sad | metadata | mapping_step_ind_unresolved_commune | 0 |  |  | metadata |
| abh_sad | metadata | mapping_stm | 18 |  |  | metadata |
| abh_sad | metadata | mapping_stm_unresolved_commune | 0 |  |  | metadata |
| abh_sad | metadata | mv_refresh_status | 13 |  |  | metadata |
| abh_sad | metadata | obs_parametre_coverage | 16 |  |  | metadata |
| abh_sad | metadata | obs_parametre_entite_compat | 18 |  |  | metadata |
| abh_sad | metadata | obs_referentiel_parametre | 18 | libelle |  | metadata |
| abh_sad | metadata | popup_rules_config | 11 |  |  | metadata |
| abh_sad | metadata | referentiel_abreviation_inventaire | 13 |  |  | metadata |
| abh_sad | metadata | referentiel_parametre | 91 | libelle |  | metadata |
| abh_sad | meteo | mesure_evaporation | 48900 |  |  | météo |
| abh_sad | meteo | mesure_precipitation | 546007 |  |  | météo |
| abh_sad | meteo | mesure_precipitation_annuelle_max | 2085 |  | annee_hydrologique_calculee, annee_hydrologique_debut_mois | météo |
| abh_sad | meteo | mesure_temperature | 0 |  |  | météo |
| abh_sad | meteo | regle_qualite_evaporation_station | 390 |  |  | qualité |
| abh_sad | qualite | mesure_qualite_barrage | 15808 | parametre_qualite | valeur | qualité |
| abh_sad | qualite | mesure_qualite_nappe | 63088 | parametre_qualite | valeur | qualité |
| abh_sad | qualite | mesure_qualite_riviere | 60097 | parametre_qualite | valeur | qualité |
| abh_sad | qualite | mesure_qualite_sebou | 51402 | parametre_qualite | valeur | qualité |
| abh_sad | qualite | source_pollution_mesure_param | 7191 | param_code_legacy | valeur_raw | pollution |
| abh_sad | qualite | source_pollution_prelevement | 141 |  |  | pollution |
| abh_sad | qualite | source_pollution_prelevement_lien | 116 |  |  | pollution |
| abh_sad | qualite | suivi_qualite_barrage_garde_hebdo | 7094 | parametre_qualite | valeur | qualité |
| abh_sad | swat_output | mesure_qualite_subbasin_ts | 745110 |  |  | SWAT |
| abh_sad | swat_output | ref_bassin | 1 |  |  | SWAT |
| abh_sad | swat_output | ref_parametre_qualite | 5 |  |  | SWAT |
| abh_sad | swat_output | ref_run_modele | 1 |  |  | SWAT |
| abh_sad | swat_output | ref_scenario | 1 |  |  | SWAT |
| abh_sad | swat_output | ref_subbasin | 18 |  |  | SWAT |
| abh_sad | swat_output | stg_swat_qualite_long | 745110 |  |  | SWAT |
| abh_sad | swat_output | stg_swat_qualite_meta | 123 |  |  | SWAT |
| abh_sad | swat_sebou | swat_models | 0 |  |  | SWAT |
| abh_sad | swat_sebou | swat_reach_results | 0 |  | chla_out, flow_in, flow_out, no3_out, orgp_out, sed_in, sed_out | SWAT |
| abh_sad | swat_sebou | swat_scenarios | 1 |  |  | SWAT |
| abh_sad | swat_sebou | swat_subbasin_results | 0 |  | orgn, precip, sedp, solp | SWAT |
| abh_sad | wasp_output | mesure_qualite_segment_ts | 931770 | code_parametre | valeur | WASP |
| abh_sad | wasp_output | ref_parametre_qualite | 12 | code_parametre, nom_parametre |  | WASP |
| abh_sad | wasp_output | ref_run_modele | 1 |  |  | WASP |
| abh_sad | wasp_output | ref_segment_modele | 22 |  |  | WASP |
| abh_sad | wasp_output | stg_wasp_qualite_long | 931770 |  |  | WASP |
| abh_sad | wasp_sebou | wasp_results | 931770 |  |  | WASP |
| abh_sad | wasp_sebou | wasp_scenarios | 1 |  |  | WASP |
| abh_sad | wasp_sebou | wasp_variables | 12 |  |  | WASP |
| abh_sebou_070426 | public | infra_barrages_abhs | 34 |  | apports_hm, montant_md | hydrologie |
| abh_sebou_070426 | public | infra_profils_stations | 1980 |  |  | référentiel |
| abh_sebou_070426 | public | infra_stations_abhs | 390 |  |  | référentiel |
| abh_sebou_070426 | public | inv_decharges_abhs | 233 |  | quantite_t_j, sup_occupee_ha, sup_tot_ha | pollution |
| abh_sebou_070426 | public | inv_fosses_septiques_abhs | 20 |  |  | autre_métier |
| abh_sebou_070426 | public | inv_huileries_abhs | 612 |  |  | pollution |
| abh_sebou_070426 | public | inv_mines_abhs | 42 |  |  | pollution |
| abh_sebou_070426 | public | inv_rejets_abattoirs_abhs | 61 |  |  | pollution |
| abh_sebou_070426 | public | inv_rejets_domestiques_abhs | 362 |  | debit_l_s | pollution |
| abh_sebou_070426 | public | inv_rejets_ind_abhs | 11 |  |  | pollution |
| abh_sebou_070426 | public | inv_step_abhs | 41 |  | vol_eaux_us_trait_m3_an | pollution |
| abh_sebou_070426 | public | inv_step_ind_abhs | 15 |  |  | pollution |
| abh_sebou_070426 | public | inv_stm_abhs | 18 |  |  | autre_métier |
| abh_sebou_070426 | public | mesures_bathymetries_barrages_abhs | 62359 |  | surface_km2, volume_mm3 | hydrologie |
| abh_sebou_070426 | public | mesures_debit_jr | 521433 |  | debit_jr | hydrologie |
| abh_sebou_070426 | public | mesures_debit_m | 19316 |  | debit_m | hydrologie |
| abh_sebou_070426 | public | mesures_debit_sources | 2816 |  | debit | hydrologie |
| abh_sebou_070426 | public | mesures_evaporation_jr | 48900 |  | val_evaporation | météo |
| abh_sebou_070426 | public | mesures_idp_2024_qualite_globale | 4894 | parametre_qualite | val_qual | qualité |
| abh_sebou_070426 | public | mesures_idp_2024_qualite_marche_cadre | 3614 | parametre_qualite | val_qual | qualité |
| abh_sebou_070426 | public | mesures_idp_2024_src_pollution_globale | 243 | parametre |  | qualité |
| abh_sebou_070426 | public | mesures_idp_2024_src_pollution_marche_cadre | 148 |  |  | qualité |
| abh_sebou_070426 | public | mesures_niv_eau_barrages | 85166 |  | apports_mm3, niveau_eau_m_ngm, transfert_mm3, volume_mm3 | hydrologie |
| abh_sebou_070426 | public | mesures_precipitations_jr | 669880 |  | precipitation_jr | météo |
| abh_sebou_070426 | public | mesures_precipitations_jr_max | 2085 |  |  | météo |
| abh_sebou_070426 | public | mesures_precipitations_jr_traitees | 546007 |  |  | météo |
| abh_sebou_070426 | public | mesures_qualite_barrages | 8714 | parametre_qualite | val_qual_barr | qualité |
| abh_sebou_070426 | public | mesures_qualite_nappes | 63088 | parametre_qualite | val_qual_nap | qualité |
| abh_sebou_070426 | public | mesures_qualite_rivieres | 60097 | parametre_qualite | val_qual_riv | qualité |
| abh_sebou_070426 | public | mesures_suivi_qualite_brg_garde_hebdo | 7094 | parametre_qualite | val_qual_brg_garde_hebdo | qualité |
| abh_sebou_070426 | public | mesures_suivi_qualite_sebou_jr_6stations | 59436 | parametre_qualite | val_qual_sebou_jr | qualité |
| abh_sebou_070426 | public | ref_types_mesures | 64 | parametre_qualite | type_mesure | autre_métier |
| abh_sebou_070426 | qualite | audit_integration_qualite | 0 |  | parametres_orphelins | qualité |
| abh_sebou_070426 | qualite | campagne | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | map_parametre_source | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | mesure_qualite_unifiee | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | prelevement | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | ref_parametre | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | ref_source_mesure | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | ref_type_mesure | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | ref_unite | 0 |  |  | qualité |

