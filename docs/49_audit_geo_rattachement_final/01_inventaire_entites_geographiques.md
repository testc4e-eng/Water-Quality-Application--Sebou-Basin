# Inventaire des entites geographiques

| schema | table | classe_geo | volume | geom_present | coordonnees_presentes | srid | type_geom | statut |
|---|---|---|---:|---|---|---|---|---|
| infra | step | STEP | 41 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | step_industrielle | STEP | 15 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | step_inventaire_pollution | STEP | 49 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| staging | raw_step_abhs | STEP | 41 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_step_ind_abhs | STEP | 15 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | step_ind_abhs | STEP | 0 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | steps | STEP | 0 | Oui | X, Y | 26191 | POINT | OK |
| staging | steps_industrielles | STEP | 0 | Oui | X, Y | 26191 | POINT | OK |
| infra | rejet_abattoir | abattoirs | 61 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | rejet_abattoir_inventaire_pollution | abattoirs | 56 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| staging | raw_rejets_abattoirs_abhs | abattoirs | 61 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | rejet_abattoir | abattoirs | 0 | Oui | X, Y | 26191 | POINT | OK |
| geo | nappe | autres | 17 | Oui | Non | 0 | GEOMETRY | OK |
| infra | fosses_septiques_abhs | autres | 20 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| infra | profil_station | autres | 1980 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | rejet_inventaire_pollution | autres | 277 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| infra | stm | autres | 18 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| meteo | mesure_precipitation_annuelle_max | autres | 2085 | Non | y | a confirmer | a confirmer | OK |
| staging | mesures_evaporation_jr | autres | 0 | Oui | Non | 0 | GEOMETRY | OK |
| staging | mesures_precipitations_jr_max | autres | 0 | Non | y | a confirmer | a confirmer | OK |
| staging | points_eau_abhs | autres | 0 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | profils_stations | autres | 0 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_adm_cercles_abhs | autres | 61 | Oui | Non | 0 | GEOMETRY | OK |
| staging | raw_adm_communes_abhs | autres | 346 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| staging | raw_adm_douars_abhs | autres | 6013 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_adm_provinces_abhs | autres | 21 | Oui | Non | 0 | GEOMETRY | OK |
| staging | raw_adm_regions_abhs | autres | 6 | Oui | Non | 0 | GEOMETRY | OK |
| staging | raw_adm_villes_abhs | autres | 33 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_fosses_septiques_abhs | autres | 20 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_idp_2024_mesures_qualite_globale | autres | 4894 | Non | coord_x, coord_y | a confirmer | a confirmer | OK |
| staging | raw_idp_2024_mesures_qualite_marche_cadre | autres | 3614 | Non | coord_x, coord_y | a confirmer | a confirmer | OK |
| staging | raw_idp_2024_src_pollution_globale | autres | 243 | Non | coord_x, coord_y | a confirmer | a confirmer | OK |
| staging | raw_idp_2024_src_pollution_marche_cadre | autres | 148 | Non | coord_x, coord_y | a confirmer | a confirmer | OK |
| staging | raw_mesures_evaporation_jr | autres | 48900 | Oui | Non | 0 | GEOMETRY | OK |
| staging | raw_mesures_precipitations_jr_max | autres | 2085 | Non | y | a confirmer | a confirmer | OK |
| staging | raw_nappes_abhs | autres | 17 | Oui | Non | 0 | GEOMETRY | OK |
| staging | raw_points_eau_abhs | autres | 46 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_profils_stations | autres | 1980 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_rejets_domestiques_abhs | autres | 362 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_sources_abhs | autres | 135 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_stm_abhs | autres | 18 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | rejets_brutes | autres | 0 | Oui | X, Y | 26191 | POINT | OK |
| staging | sources_polution_mesure | autres | 0 | Oui | X, Y | 26191 | POINT | OK |
| staging | stm_abhs | autres | 0 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | stms | autres | 0 | Oui | X, Y | 26191 | POINT | OK |
| infra | barrages | barrages | 34 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_barrages_abhs | barrages | 34 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| geo | bassin_versant | bassins | 1 | Oui | Non | 4326 | MULTIPOLYGON | OK |
| staging | raw_bassin_sebou | bassins | 1 | Oui | Non | 0 | GEOMETRY | OK |
| staging | raw_sous_bassin_sebou | bassins | 15 | Oui | Non | 0 | GEOMETRY | OK |
| infra | decharge | decharges | 233 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | decharge_inventaire_pollution | decharges | 11 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| infra | decharge_inventaire_pollution_general | decharges | 139 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| staging | decharges | decharges | 0 | Oui | X, Y | 26191 | POINT | OK |
| staging | decharges_Abondonees | decharges | 0 | Oui | x, y | 26191 | POINT | OK |
| staging | raw_decharges_abhs | decharges | 233 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | huilerie | huileries | 612 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | huilerie_inventaire_pollution | huileries | 606 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| staging | huileries | huileries | 0 | Oui | X, Y | 26191 | POINT | OK |
| staging | raw_huileries_abhs | huileries | 612 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | mine | mines | 42 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | mine_inventaire_pollution | mines | 39 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| staging | mines | mines | 0 | Oui | X, Y | 26191 | POINT | OK |
| staging | raw_mines_abhs | mines | 42 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | point_eau | points eau | 46 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| qualite | source_pollution_prelevement | points pollution | 141 | Oui | coord_x, coord_y | 26191 | POINT | OK |
| infra | rejet_domestique | rejets domestiques | 362 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | rejet_industriel | rejets industriels | 11 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| staging | raw_rejets_ind_abhs | rejets industriels | 11 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| geo | reseau_hydrographique | reseau hydrographique | 697 | Oui | Non | 26191 | MULTILINESTRING | OK |
| staging | raw_reseau_hydro_abhs | reseau hydrographique | 28 | Oui | Non | 0 | GEOMETRY | OK |
| geo | source | source de pollution | 135 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| geo | _bak_sous_bassin_swat_leben_innaouen_20260403 | sous-bassins | 18 | Oui | Lat | 26191 | MULTIPOLYGON | OK |
| geo | sous_bassin_abh | sous-bassins | 15 | Oui | Non | 4326 | MULTIPOLYGON | OK |
| geo | sous_bassin_swat_bas_sebou | sous-bassins | 29 | Oui | lat | 26191 | MULTIPOLYGON | OK |
| geo | sous_bassin_swat_bassin_cotier | sous-bassins | 23 | Oui | lat | 26191 | MULTIPOLYGON | OK |
| geo | sous_bassin_swat_beht | sous-bassins | 27 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| geo | sous_bassin_swat_haut_sebou | sous-bassins | 22 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| geo | sous_bassin_swat_leben_innaouen | sous-bassins | 18 | Oui | Lat | 26191 | MULTIPOLYGON | OK |
| geo | sous_bassin_swat_moyen_sebou | sous-bassins | 16 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| geo | sous_bassin_swat_ouergha | sous-bassins | 39 | Oui | lat | 26191 | MULTIPOLYGON | OK |
| staging | sous_bassin_swat_bas_sebou_new | sous-bassins | 0 | Oui | lat | 26191 | MULTIPOLYGON | OK |
| staging | sous_bassin_swat_bassin_cotier_new | sous-bassins | 0 | Oui | lat | 26191 | MULTIPOLYGON | OK |
| staging | sous_bassin_swat_beht_new | sous-bassins | 0 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| staging | sous_bassin_swat_haut_sebou_new | sous-bassins | 0 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| staging | sous_bassin_swat_leben_innaouen_new | sous-bassins | 0 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| staging | sous_bassin_swat_moyen_sebou_new | sous-bassins | 0 | Oui | Non | 26191 | MULTIPOLYGON | OK |
| staging | sous_bassin_swat_ouergha_new | sous-bassins | 0 | Oui | lat | 26191 | MULTIPOLYGON | OK |
| infra | stations | stations | 390 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |
| infra | stations_mesure | stations | 390 | Oui | Non | 4326 | POINT | OK |
| staging | raw_stations_abhs | stations | 390 | Oui | coord_x, coord_y | 0 | GEOMETRY | OK |

## Attributs clefs detectes

| table | identifiants | noms/codes | role metier probable |
|---|---|---|---|
| infra.step | id, code_commune, code_step | id, code_commune, code_step | inventaire traitement / rejet |
| infra.step_industrielle | id, code_commune, code_step | nom_step, id, code_commune, code_step | inventaire traitement / rejet |
| infra.step_inventaire_pollution | id, code_step | id, code_step | inventaire traitement / rejet |
| staging.raw_step_abhs | id, code_commune, code_step | id, code_commune, code_step | inventaire traitement / rejet |
| staging.raw_step_ind_abhs | id, code_commune, code_step | nom_step, id, code_commune, code_step | inventaire traitement / rejet |
| staging.step_ind_abhs | id, code_commune, code_step | nom_step, id, code_commune, code_step | inventaire traitement / rejet |
| staging.steps | id, Code_STEP | id, Code_STEP | inventaire traitement / rejet |
| staging.steps_industrielles | id | Nom, id | inventaire traitement / rejet |
| infra.rejet_abattoir | id, code_commune, code_abattoir | id, code_commune, code_abattoir | inventaire pollution |
| infra.rejet_abattoir_inventaire_pollution | id | id | inventaire pollution |
| staging.raw_rejets_abattoirs_abhs | id, code_commune, code_abattoir | id, code_commune, code_abattoir | inventaire pollution |
| staging.rejet_abattoir | id | id | inventaire pollution |
| geo.nappe | id, code_nappe | nom_nappe, id, code_nappe | a qualifier |
| infra.fosses_septiques_abhs | id, code_commu, code_regio, code_provi, code_cercl, code_com_1 | id, code_commu, code_regio, code_provi, code_cercl, code_com_1 | a qualifier |
| infra.profil_station | id, ire_station | id, ire_station | a qualifier |
| infra.rejet_inventaire_pollution | id, code_rejet | id, code_rejet | a qualifier |
| infra.stm | id, code_commune, code_stm | nom_stm, id, code_commune, code_stm | a qualifier |
| meteo.mesure_precipitation_annuelle_max | id, ire_precipitation, ire_station | id, ire_precipitation, ire_station | a qualifier |
| staging.mesures_evaporation_jr | id, code_commune, ire_station | id, code_commune, ire_station | a qualifier |
| staging.mesures_precipitations_jr_max | id, ire_precipitation, ire_station | id, ire_precipitation, ire_station | a qualifier |
| staging.points_eau_abhs | id, code_commune, code_pt_eau | nom_pt_eau, id, code_commune, code_pt_eau | a qualifier |
| staging.profils_stations | id, ire_station | id, ire_station | a qualifier |
| staging.raw_adm_cercles_abhs | code_cercle, code_province | code_cercle, code_province | a qualifier |
| staging.raw_adm_communes_abhs | code_region, code_province, code_cercle, code_commune | code_region, code_province, code_cercle, code_commune | a qualifier |
| staging.raw_adm_douars_abhs | id, code_commune, code_douar | id, code_commune, code_douar | a qualifier |
| staging.raw_adm_provinces_abhs | code_region, code_province | code_region, code_province | a qualifier |
| staging.raw_adm_regions_abhs | code_region | code_region | a qualifier |
| staging.raw_adm_villes_abhs | id, code_commune | nom_ville, id, code_commune | a qualifier |
| staging.raw_fosses_septiques_abhs | id, code_commune | id, code_commune | a qualifier |
| staging.raw_idp_2024_mesures_qualite_globale | id_pts, id_table, ire, code_commune | id_pts, id_table, ire, code_commune | a qualifier |
| staging.raw_idp_2024_mesures_qualite_marche_cadre | id_pts, id_table, ire, code_commune | id_pts, id_table, ire, code_commune | a qualifier |
| staging.raw_idp_2024_src_pollution_globale | id_pts, id_table, ire, code_commune | id_pts, id_table, ire, code_commune | a qualifier |
| staging.raw_idp_2024_src_pollution_marche_cadre | id_pts, id_table, ire, code_commune | id_pts, id_table, ire, code_commune | a qualifier |
| staging.raw_mesures_evaporation_jr | id, code_commune, ire_station | id, code_commune, ire_station | a qualifier |
| staging.raw_mesures_precipitations_jr_max | id, ire_precipitation, ire_station | id, ire_precipitation, ire_station | a qualifier |
| staging.raw_nappes_abhs | id, code_nappe | nom_nappe, id, code_nappe | a qualifier |
| staging.raw_points_eau_abhs | id, code_commune, code_pt_eau | nom_pt_eau, id, code_commune, code_pt_eau | a qualifier |
| staging.raw_profils_stations | id, ire_station | id, ire_station | a qualifier |
| staging.raw_rejets_domestiques_abhs | id, code_commune, code_rejet | id, code_commune, code_rejet | a qualifier |
| staging.raw_sources_abhs | id, code_commune, code_nappe, ire_source | nom_source, id, code_commune, code_nappe, ire_source | a qualifier |
| staging.raw_stm_abhs | id, code_commune, code_stm | nom_stm, id, code_commune, code_stm | a qualifier |
| staging.rejets_brutes | id, Code_rejet | id, Code_rejet | a qualifier |
| staging.sources_polution_mesure | id | id | a qualifier |
| staging.stm_abhs | id, code_commune, code_stm | nom_stm, id, code_commune, code_stm | a qualifier |
| staging.stms | id | Nom, id | a qualifier |
| infra.barrages | id, code_commune, ire | nom_barrage, nom_oued, id, code_commune, ire | rattachement des mesures barrage et stockages |
| staging.raw_barrages_abhs | id, code_commune, ire | nom_barrage, nom_oued, id, code_commune, ire | rattachement des mesures barrage et stockages |
| geo.bassin_versant | id | nom, id | coherence spatiale macro |
| staging.raw_bassin_sebou | id | nom, id | coherence spatiale macro |
| staging.raw_sous_bassin_sebou | id, code_sb | nom_sous_bassin, nom_oued, id, code_sb | coherence spatiale macro |
| infra.decharge | id, code_decharge, code_commune | nom_decharge, id, code_decharge, code_commune | inventaire pollution |
| infra.decharge_inventaire_pollution | id | nom_site, id | inventaire pollution |
| infra.decharge_inventaire_pollution_general | id, code_decharge_source | nom_site, id, code_decharge_source | inventaire pollution |
| staging.decharges | id, Code | nom, id, Code | inventaire pollution |
| staging.decharges_Abondonees | id | Nom, id | inventaire pollution |
| staging.raw_decharges_abhs | id, code_decharge, code_commune | nom_decharge, id, code_decharge, code_commune | inventaire pollution |
| infra.huilerie | id, code_commune, code_huilerie | nom_huilerie, id, code_commune, code_huilerie | inventaire pollution |
| infra.huilerie_inventaire_pollution | id, code_huilerie_source | nom_huilerie_source, id, code_huilerie_source | inventaire pollution |
| staging.huileries | id, Code | Nom, id, Code | inventaire pollution |
| staging.raw_huileries_abhs | id, code_commune, code_huilerie | nom_huilerie, id, code_commune, code_huilerie | inventaire pollution |
| infra.mine | id, code_commune, code_mine | nom_mine, id, code_commune, code_mine | inventaire pollution |
| infra.mine_inventaire_pollution | id | nom_mine_source, id | inventaire pollution |
| staging.mines | id | Nom, id | inventaire pollution |
| staging.raw_mines_abhs | id, code_commune, code_mine | nom_mine, id, code_commune, code_mine | inventaire pollution |
| infra.point_eau | id, code_commune, code_pt_eau | nom_pt_eau, id, code_commune, code_pt_eau | rattachement nappes et points de prelevement |
| qualite.source_pollution_prelevement | id | id | rattachement des prelevements pollution |
| infra.rejet_domestique | id, code_commune, code_rejet | id, code_commune, code_rejet | inventaire pollution |
| infra.rejet_industriel | id, code_commune, code_rejet | nom_rejet, id, code_commune, code_rejet | inventaire pollution |
| staging.raw_rejets_ind_abhs | id, code_commune, code_rejet | nom_rejet, id, code_commune, code_rejet | inventaire pollution |
| geo.reseau_hydrographique | id, ID, IDD | name, id, ID, IDD | reference proximite des rejets et stations riviere |
| staging.raw_reseau_hydro_abhs | id, code_oued | nom_oued, id, code_oued | reference proximite des rejets et stations riviere |
| geo.source | id, code_commune, code_nappe, ire_source | nom_source, id, code_commune, code_nappe, ire_source | rattachement sources / debit sources |
| geo._bak_sous_bassin_swat_leben_innaouen_20260403 | id | id | coherence spatiale fine / modeles |
| geo.sous_bassin_abh | id | nom, id | coherence spatiale fine / modeles |
| geo.sous_bassin_swat_bas_sebou | id | id | coherence spatiale fine / modeles |
| geo.sous_bassin_swat_bassin_cotier | id | id | coherence spatiale fine / modeles |
| geo.sous_bassin_swat_beht | id | id | coherence spatiale fine / modeles |
| geo.sous_bassin_swat_haut_sebou | id | id | coherence spatiale fine / modeles |
| geo.sous_bassin_swat_leben_innaouen | id | id | coherence spatiale fine / modeles |
| geo.sous_bassin_swat_moyen_sebou | id | id | coherence spatiale fine / modeles |
| geo.sous_bassin_swat_ouergha | id | id | coherence spatiale fine / modeles |
| staging.sous_bassin_swat_bas_sebou_new | a confirmer | a confirmer | coherence spatiale fine / modeles |
| staging.sous_bassin_swat_bassin_cotier_new | a confirmer | a confirmer | coherence spatiale fine / modeles |
| staging.sous_bassin_swat_beht_new | a confirmer | a confirmer | coherence spatiale fine / modeles |
| staging.sous_bassin_swat_haut_sebou_new | a confirmer | a confirmer | coherence spatiale fine / modeles |
| staging.sous_bassin_swat_leben_innaouen_new | a confirmer | nom_stat | coherence spatiale fine / modeles |
| staging.sous_bassin_swat_moyen_sebou_new | a confirmer | a confirmer | coherence spatiale fine / modeles |
| staging.sous_bassin_swat_ouergha_new | a confirmer | a confirmer | coherence spatiale fine / modeles |
| infra.stations | id_station, code_commune, ire_station, code_ressource, ire_precipitation | nom_station, id_station, code_commune, ire_station, code_ressource, ire_precipitation | point de mesure / rattachement qualite-hydro-meteo |
| infra.stations_mesure | id, code_station | nom, id, code_station | point de mesure / rattachement qualite-hydro-meteo |
| staging.raw_stations_abhs | id_station, code_commune, ire_station, code_ressource, ire_precipitation | nom_station, id_station, code_commune, ire_station, code_ressource, ire_precipitation | point de mesure / rattachement qualite-hydro-meteo |
