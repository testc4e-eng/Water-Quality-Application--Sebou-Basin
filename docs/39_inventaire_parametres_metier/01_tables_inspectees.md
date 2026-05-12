# Tables inspectées

| Base | Schéma | Table | Nombre lignes | Colonnes paramètre détectées | Colonnes valeur détectées | Type table |
|---|---|---|---:|---|---|---|
| abh_sad | hydro | barrage_bathymetrie | 62359 | (large) | hauteur_m, volume_mm3, surface_km2 | hydrologie |
| abh_sad | hydro | mesure_barrage | 84831 | (large) | cote_m, volume_mm3, lacher_m3s | hydrologie |
| abh_sad | hydro | mesure_debit | 521433 |  | valeur | hydrologie |
| abh_sad | hydro | mesure_debit_mensuel | 19316 |  | valeur_moy_m3s | hydrologie |
| abh_sad | hydro | mesure_debit_source | 2816 |  | valeur_m3s | hydrologie |
| abh_sad | hydro | regle_qualite_debit_source | 19 |  | min_valeur, max_valeur | qualité |
| abh_sad | hydro | regle_qualite_debit_station | 390 |  | min_valeur, max_valeur | qualité |
| abh_sad | infra | barrages | 34 | (large) | vrn_hm3, hauteur, apports_hm, montant_md, coord_x, coord_y | pollution |
| abh_sad | infra | decharge | 233 | (large) | sup_tot_ha, sup_occupee_ha, quantite_t_j, coord_x, coord_y, altitude_z | pollution |
| abh_sad | infra | decharge_inventaire_pollution | 11 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | decharge_inventaire_pollution_general | 139 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | fosses_septiques_abhs | 20 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | huilerie | 612 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | huilerie_inventaire_pollution | 606 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | mine | 42 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | mine_inventaire_pollution | 39 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | point_eau | 46 | (large) | dist_pt_eau_foyer_pollut_m, profond_tot_m, vol_preleve_m3_an, niv_piezometrique_m, coord_x, coord_y, altitude_z | pollution |
| abh_sad | infra | profil_station | 1980 | (large) | coord_x, coord_y, altitude_z | pollution |
| abh_sad | infra | rejet_abattoir | 61 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | rejet_abattoir_inventaire_pollution | 56 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | rejet_domestique | 362 | (large) | dimension, debit_l_s, coord_x, coord_y | pollution |
| abh_sad | infra | rejet_industriel | 11 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | rejet_inventaire_pollution | 277 | (large) | coord_x, coord_y, debit_l_s | pollution |
| abh_sad | infra | stations | 390 | (large) | types_mesures | pollution |
| abh_sad | infra | stations_mesure | 390 | (large) | altitude_m | pollution |
| abh_sad | infra | step | 41 | (large) | superficie_ha, vol_eaux_us_trait_m3_an, cap_equiv_hab, coord_x, coord_y | pollution |
| abh_sad | infra | step_industrielle | 15 |  | coord_x, coord_y | pollution |
| abh_sad | infra | step_inventaire_pollution | 49 | (large) | coord_x, coord_y | pollution |
| abh_sad | infra | stm | 18 | (large) | coord_x, coord_y | pollution |
| abh_sad | metadata | api_view_catalog | 57 | (large) |  | référentiel |
| abh_sad | metadata | api_view_column_catalog | 1101 | (large) | ordinal_position | référentiel |
| abh_sad | metadata | catalogue_type_mesure | 64 | parametre_qualite | type_mesure | référentiel |
| abh_sad | metadata | dictionnaire_donnees | 0 | (large) |  | référentiel |
| abh_sad | metadata | mapping_abreviation_colonne_inventaire | 13 | (large) |  | référentiel |
| abh_sad | metadata | mapping_abreviation_unresolved_sources | 5 |  |  | référentiel |
| abh_sad | metadata | mapping_barrage | 11 | (large) | duplicate_count | référentiel |
| abh_sad | metadata | mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo | 0 |  | row_count | qualité |
| abh_sad | metadata | mapping_nappe_unresolved_qualite_nappes | 292 |  | row_count | qualité |
| abh_sad | metadata | mapping_parametre_source | 184 | (large) | source_value | référentiel |
| abh_sad | metadata | mapping_parametre_source_orphans_audit | 5 | (large) | source_value | référentiel |
| abh_sad | metadata | mapping_parametre_unresolved_legacy_qualite_riviere | 39 | parametre_qualite | sample_rows | qualité |
| abh_sad | metadata | mapping_parametre_unresolved_suivi_qualite_sebou | 7 | parametre_qualite | sample_rows | qualité |
| abh_sad | metadata | mapping_point_eau | 46 | (large) |  | référentiel |
| abh_sad | metadata | mapping_point_eau_unresolved_nappe | 22 | (large) |  | référentiel |
| abh_sad | metadata | mapping_point_eau_unresolved_station | 46 | (large) |  | référentiel |
| abh_sad | metadata | mapping_profil_station | 1980 |  |  | référentiel |
| abh_sad | metadata | mapping_profil_unresolved_nappe | 1204 |  |  | référentiel |
| abh_sad | metadata | mapping_profil_unresolved_station | 0 |  |  | référentiel |
| abh_sad | metadata | mapping_source | 19 | (large) | duplicate_count | référentiel |
| abh_sad | metadata | mapping_station | 390 |  |  | référentiel |
| abh_sad | metadata | mapping_station_unresolved_precip_ann_max | 0 | (large) | row_count | météo |
| abh_sad | metadata | mapping_station_unresolved_qualite_barrages | 0 | sample_parametre | row_count | qualité |
| abh_sad | metadata | mapping_station_unresolved_qualite_nappes | 0 | sample_parametre | row_count | qualité |
| abh_sad | metadata | mapping_station_unresolved_suivi_qualite_brg_garde_hebdo | 0 | sample_parametre | row_count | qualité |
| abh_sad | metadata | mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i | 1 | sample_parametre | row_count | qualité |
| abh_sad | metadata | mapping_step_ind | 15 |  |  | pollution |
| abh_sad | metadata | mapping_step_ind_unresolved_commune | 0 |  |  | pollution |
| abh_sad | metadata | mapping_stm | 18 |  |  | référentiel |
| abh_sad | metadata | mapping_stm_unresolved_commune | 0 |  |  | référentiel |
| abh_sad | metadata | mv_refresh_status | 13 |  | row_count | référentiel |
| abh_sad | metadata | obs_parametre_coverage | 16 | parametre_code | n_values, has_values | référentiel |
| abh_sad | metadata | obs_parametre_entite_compat | 18 | parametre_code |  | référentiel |
| abh_sad | metadata | obs_referentiel_parametre | 18 | parametre_code |  | référentiel |
| abh_sad | metadata | popup_rules_config | 11 |  |  | référentiel |
| abh_sad | metadata | referentiel_abreviation_inventaire | 13 |  |  | référentiel |
| abh_sad | metadata | referentiel_parametre | 91 |  |  | référentiel |
| abh_sad | meteo | mesure_evaporation | 48900 | (large) | valeur, qa_flag_null_value | météo |
| abh_sad | meteo | mesure_precipitation | 546007 | (large) | val_observees, val_power_nasa, val_remplies | météo |
| abh_sad | meteo | mesure_precipitation_annuelle_max | 2085 | (large) | annee, p_max, p_annuelle, nbr_val_jr_mqt, nb_mois, nb_j_avec_0, nb_j_sans_0, annee_civile, annee_hydrologique_calculee, annee_hydrologique_debut_mois | météo |
| abh_sad | meteo | mesure_temperature | 0 | (large) | val_min, val_max, val_moy | météo |
| abh_sad | meteo | regle_qualite_evaporation_station | 390 |  | min_valeur, max_valeur | qualité |
| abh_sad | public | spatial_ref_sys | 8500 |  |  | autre |
| abh_sad | qualite | mesure_qualite_barrage | 15808 | parametre_qualite | valeur, qa_flag_null_value | qualité |
| abh_sad | qualite | mesure_qualite_nappe | 63088 | parametre_qualite | valeur, qa_flag_null_value | qualité |
| abh_sad | qualite | mesure_qualite_riviere | 60097 | parametre_qualite | valeur, qa_flag_null_value | qualité |
| abh_sad | qualite | mesure_qualite_sebou | 51402 | parametre_qualite | valeur, qa_flag_null_value | qualité |
| abh_sad | qualite | source_pollution_mesure_param | 7191 |  | valeur_raw, valeur_num, valeur_qualifier, qa_flag_value_missing, qa_flag_value_non_numeric | qualité |
| abh_sad | qualite | source_pollution_prelevement | 141 | (large) | coord_x, coord_y | qualité |
| abh_sad | qualite | source_pollution_prelevement_lien | 116 |  |  | qualité |
| abh_sad | qualite | suivi_qualite_barrage_garde_hebdo | 7094 | parametre_qualite | valeur, qa_flag_null_value | qualité |
| abh_sad | staging | _legacy_qualite_riviere | 60097 | parametre_qualite | val_qual_riv | qualité |
| abh_sad | staging | decharges | 139 |  |  | staging |
| abh_sad | staging | decharges_Abondonees | 11 |  |  | staging |
| abh_sad | staging | huileries | 606 | (large) | DC, ST__m²_, SC____, SA__m²_, SA__m²_1, PP, PS, NJ, CP__H_, NLI, QM__T_J_, QS__T_, DS__J_, OMOY_T_C_, HOM_l_J_, HOM_m3_C_, LSRL_X, LSRL_Y, NB, G_QST_J, DO_QT_T_J | pollution |
| abh_sad | staging | mesure_precipitation_old_model | 507930 | (large) | valeur | météo |
| abh_sad | staging | mesures_debit_jr | 173251 | (large) | code_debit, debit_jr | hydrologie |
| abh_sad | staging | mesures_debit_m | 19316 | (large) | code_debit_m, debit_m | hydrologie |
| abh_sad | staging | mesures_debit_sources | 2816 | (large) | debit | hydrologie |
| abh_sad | staging | mesures_evaporation_jr | 48900 | (large) | date_mesure | météo |
| abh_sad | staging | mesures_niv_eau_barrages | 85166 | (large) | niveau_eau_m_ngm, volume_mm3, restitutions_mm3, transfert_mm3, apports_mm3 | staging |
| abh_sad | staging | mesures_precip | 669880 | (large) | precipitation_jr | météo |
| abh_sad | staging | mesures_precipitations_jr_max | 2085 | (large) | annee, p_max, p_annuelle, nbr_val_jr_mqt, nb_mois, nb_j_avec_0, nb_j_sans_0 | météo |
| abh_sad | staging | mesures_precipitations_jr_traitees | 546007 | (large) | val_observees, val_power_nasa, val_remplies | météo |
| abh_sad | staging | mesures_qualite_barrages | 8714 | parametre_qualite | val_qual_barr | qualité |
| abh_sad | staging | mesures_qualite_nappes | 63088 | parametre_qualite | val_qual_nap | qualité |
| abh_sad | staging | mines | 39 | (large) | N°_Licenc | pollution |
| abh_sad | staging | points_eau_abhs | 46 | (large) | dist_pt_eau_foyer_pollut_m, profond_tot_m, vol_preleve_m3_an, niv_piezometrique_m, coord_x, coord_y, altitude_z | staging |
| abh_sad | staging | profils_stations | 1980 | (large) | coord_x, coord_y, altitude_z | staging |
| abh_sad | staging | rejet_abattoir | 56 |  |  | pollution |
| abh_sad | staging | rejets_brutes | 277 | (large) | Population, Ø, Q__l_s_ | pollution |
| abh_sad | staging | sources_polution_mesure | 141 | Parametre | T_air, T_eau, pH, Conduc, O2_Diss, DCO, DBO5, NTK, NH4_, PT, PO43_, Cl_, SO4__, Ca__, Mg__, TH, Na_, K_ | staging |
| abh_sad | staging | sous_bassin_swat_bas_sebou_new | 29 | (large) | subbasin, area, slo1, len1, sll, csl, dep1, long_, elev, elevmin, elevmax | SWAT |
| abh_sad | staging | sous_bassin_swat_bassin_cotier_new | 23 | (large) | subbasin, area, slo1, len1, sll, csl, dep1, long_, elev, elevmin, elevmax | SWAT |
| abh_sad | staging | sous_bassin_swat_beht_new | 27 | (large) | area, subbasin | SWAT |
| abh_sad | staging | sous_bassin_swat_haut_sebou_new | 22 | (large) | area, subbasin | SWAT |
| abh_sad | staging | sous_bassin_swat_leben_innaouen_new | 18 | (large) | subbasin, area, slo1, len1 | SWAT |
| abh_sad | staging | sous_bassin_swat_moyen_sebou_new | 16 | (large) | area, subbasin | SWAT |
| abh_sad | staging | sous_bassin_swat_ouergha_new | 39 | (large) | subbasin, area, slo1, len1, sll, csl, dep1, long_, elev, elevmin, elevmax | SWAT |
| abh_sad | staging | step_ind_abhs | 15 |  | coord_x, coord_y | pollution |
| abh_sad | staging | steps | 49 | (large) |  | pollution |
| abh_sad | staging | steps_industrielles | 14 | (large) |  | pollution |
| abh_sad | staging | stm_abhs | 18 | (large) | coord_x, coord_y | staging |
| abh_sad | staging | stms | 19 |  |  | staging |
| abh_sad | staging | suivi_qualite_brg_garde_hebdo | 7094 | parametre_qualite | val_qual_brg_garde_hebdo | qualité |
| abh_sad | staging | suivi_qualite_sebou | 51402 | parametre_qualite | val_qual_sebou_jr | qualité |
| abh_sad | swat_output | mesure_qualite_subbasin_ts | 745110 |  | valeur | SWAT |
| abh_sad | swat_output | ref_bassin | 1 |  |  | SWAT |
| abh_sad | swat_output | ref_parametre_qualite | 5 |  |  | SWAT |
| abh_sad | swat_output | ref_run_modele | 1 |  |  | SWAT |
| abh_sad | swat_output | ref_scenario | 1 |  |  | SWAT |
| abh_sad | swat_output | ref_subbasin | 18 |  |  | SWAT |
| abh_sad | swat_output | stg_swat_qualite_long | 745110 |  | valeur_txt, valeur_num | SWAT |
| abh_sad | swat_output | stg_swat_qualite_meta | 123 | (large) |  | SWAT |
| abh_sad | swat_sebou | swat_models | 0 |  |  | SWAT |
| abh_sad | swat_sebou | swat_reach_results | 0 | (large) | reach, flow_in, flow_out, sed_in, sed_out, no3_out, orgp_out, chla_out | SWAT |
| abh_sad | swat_sebou | swat_scenarios | 1 | (large) |  | SWAT |
| abh_sad | swat_sebou | swat_subbasin_results | 0 | (large) | subbasin, precip, surq, gw_q, wyld, sedp, orgn, solp | SWAT |
| abh_sad | wasp_output | mesure_qualite_segment_ts | 931770 | code_parametre | valeur | WASP |
| abh_sad | wasp_output | ref_parametre_qualite | 12 | code_parametre, nom_parametre |  | WASP |
| abh_sad | wasp_output | ref_run_modele | 1 |  |  | WASP |
| abh_sad | wasp_output | ref_segment_modele | 22 |  |  | WASP |
| abh_sad | wasp_output | stg_wasp_qualite_long | 931770 | (large) | valeur | WASP |
| abh_sad | wasp_sebou | wasp_results | 931770 | (large) | value | WASP |
| abh_sad | wasp_sebou | wasp_scenarios | 1 |  |  | WASP |
| abh_sad | wasp_sebou | wasp_variables | 12 |  |  | WASP |
| abh_sebou_070426 | public | adm_cercles_abhs | 61 |  |  | autre |
| abh_sebou_070426 | public | adm_communes_abhs | 346 |  |  | autre |
| abh_sebou_070426 | public | adm_douars_abhs | 6013 | (large) | coord_x, coord_y | autre |
| abh_sebou_070426 | public | adm_provinces_abhs | 21 |  |  | autre |
| abh_sebou_070426 | public | adm_regions_abhs | 6 |  |  | autre |
| abh_sebou_070426 | public | adm_villes_abhs | 33 | (large) | coord_x, coord_y | autre |
| abh_sebou_070426 | public | geo_bassin_sebou | 1 | (large) | perimetre, superficie_km2 | autre |
| abh_sebou_070426 | public | geo_nappes_abhs | 17 |  | superficie_km2 | autre |
| abh_sebou_070426 | public | geo_points_eau_abhs | 46 | (large) | dist_pt_eau_foyer_pollut_m, profond_tot_m, vol_preleve_m3_an, niv_piezometrique_m, coord_x, coord_y, altitude_z | autre |
| abh_sebou_070426 | public | geo_reseau_hydro_abhs | 28 |  | longueur_km | hydrologie |
| abh_sebou_070426 | public | geo_sources_abhs | 135 | (large) | coord_x, coord_y, coord_z | autre |
| abh_sebou_070426 | public | geo_sous_bassin_sebou | 15 |  | superficie_km2 | autre |
| abh_sebou_070426 | public | infra_barrages_abhs | 34 | (large) | vrn_hm3, hauteur, apports_hm, montant_md, coord_x, coord_y | autre |
| abh_sebou_070426 | public | infra_profils_stations | 1980 | (large) | coord_x, coord_y, altitude_z | autre |
| abh_sebou_070426 | public | infra_stations_abhs | 390 | (large) | types_mesures | autre |
| abh_sebou_070426 | public | inv_decharges_abhs | 233 | (large) | sup_tot_ha, sup_occupee_ha, quantite_t_j, coord_x, coord_y, altitude_z | autre |
| abh_sebou_070426 | public | inv_fosses_septiques_abhs | 20 | (large) | coord_x, coord_y | autre |
| abh_sebou_070426 | public | inv_huileries_abhs | 612 | (large) | coord_x, coord_y | pollution |
| abh_sebou_070426 | public | inv_mines_abhs | 42 | (large) | coord_x, coord_y | pollution |
| abh_sebou_070426 | public | inv_rejets_abattoirs_abhs | 61 | (large) | coord_x, coord_y | pollution |
| abh_sebou_070426 | public | inv_rejets_domestiques_abhs | 362 | (large) | dimension, debit_l_s, coord_x, coord_y | pollution |
| abh_sebou_070426 | public | inv_rejets_ind_abhs | 11 | (large) | coord_x, coord_y | pollution |
| abh_sebou_070426 | public | inv_step_abhs | 41 | (large) | superficie_ha, vol_eaux_us_trait_m3_an, cap_equiv_hab, coord_x, coord_y | pollution |
| abh_sebou_070426 | public | inv_step_ind_abhs | 15 |  | coord_x, coord_y | pollution |
| abh_sebou_070426 | public | inv_stm_abhs | 18 | (large) | coord_x, coord_y | autre |
| abh_sebou_070426 | public | mesures_bathymetries_barrages_abhs | 62359 | (large) | hauteur_m, volume_mm3, surface_km2 | autre |
| abh_sebou_070426 | public | mesures_debit_jr | 521433 | (large) | code_debit, debit_jr | hydrologie |
| abh_sebou_070426 | public | mesures_debit_m | 19316 | (large) | code_debit_m, debit_m | hydrologie |
| abh_sebou_070426 | public | mesures_debit_sources | 2816 | (large) | debit | hydrologie |
| abh_sebou_070426 | public | mesures_evaporation_jr | 48900 | (large) | date_mesure | météo |
| abh_sebou_070426 | public | mesures_idp_2024_qualite_globale | 4894 | parametre_qualite | val_qual | qualité |
| abh_sebou_070426 | public | mesures_idp_2024_qualite_marche_cadre | 3614 | parametre_qualite | val_qual | qualité |
| abh_sebou_070426 | public | mesures_idp_2024_src_pollution_globale | 243 | parametre | eau_ss_terr_mesures_periodiques_o_n | pollution |
| abh_sebou_070426 | public | mesures_idp_2024_src_pollution_marche_cadre | 148 | parametre | eau_ss_terr_mesures_periodiques_o_n | pollution |
| abh_sebou_070426 | public | mesures_niv_eau_barrages | 85166 | (large) | niveau_eau_m_ngm, volume_mm3, restitutions_mm3, transfert_mm3, apports_mm3 | autre |
| abh_sebou_070426 | public | mesures_precipitations_jr | 669880 | (large) | precipitation_jr | météo |
| abh_sebou_070426 | public | mesures_precipitations_jr_max | 2085 | (large) | annee, p_max, p_annuelle, nbr_val_jr_mqt, nb_mois, nb_j_avec_0, nb_j_sans_0 | météo |
| abh_sebou_070426 | public | mesures_precipitations_jr_traitees | 546007 | (large) | val_observees, val_power_nasa, val_remplies | météo |
| abh_sebou_070426 | public | mesures_qualite_barrages | 8714 | parametre_qualite | val_qual_barr | qualité |
| abh_sebou_070426 | public | mesures_qualite_nappes | 63088 | parametre_qualite | val_qual_nap | qualité |
| abh_sebou_070426 | public | mesures_qualite_rivieres | 60097 | parametre_qualite | val_qual_riv | qualité |
| abh_sebou_070426 | public | mesures_suivi_qualite_brg_garde_hebdo | 7094 | parametre_qualite | val_qual_brg_garde_hebdo | qualité |
| abh_sebou_070426 | public | mesures_suivi_qualite_sebou_jr_6stations | 59436 | parametre_qualite | val_qual_sebou_jr | qualité |
| abh_sebou_070426 | public | ref_types_mesures | 64 | parametre_qualite | type_mesure | autre |
| abh_sebou_070426 | public | spatial_ref_sys | 8500 |  |  | autre |
| abh_sebou_070426 | qualite | audit_integration_qualite | 0 | parametres_orphelins | lignes_scannees, lignes_inserees, lignes_rejetees, doublons_detectes, parametres_orphelins | qualité |
| abh_sebou_070426 | qualite | campagne | 0 | (large) | source_mesure_id | qualité |
| abh_sebou_070426 | qualite | map_parametre_source | 0 | parametre_nom_origine |  | qualité |
| abh_sebou_070426 | qualite | mesure_qualite_unifiee | 0 | parametre_brut | type_mesure_id, valeur_numerique, valeur_texte | qualité |
| abh_sebou_070426 | qualite | prelevement | 0 | (large) | profondeur_m | qualité |
| abh_sebou_070426 | qualite | ref_parametre | 0 | code_parametre | limite_detection, limite_quantite, plage_min_alert, plage_max_alert | qualité |
| abh_sebou_070426 | qualite | ref_source_mesure | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | ref_type_mesure | 0 |  |  | qualité |
| abh_sebou_070426 | qualite | ref_unite | 0 |  |  | qualité |
