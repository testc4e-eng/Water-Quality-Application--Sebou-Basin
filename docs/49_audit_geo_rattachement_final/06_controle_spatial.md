# Controle spatial

| table | classe_geo | geom_nulles | geom_invalides | srid_incoherents | hors_bassin | eloigne_reseau_gt_500m |
|---|---|---:|---:|---:|---:|---:|
| infra.step | STEP | 0 | 0 | 0 | 0 | 31 |
| infra.step_industrielle | STEP | 0 | 0 | 0 | 0 | 12 |
| infra.step_inventaire_pollution | STEP | 0 | 0 | 0 | 14 | 40 |
| staging.raw_step_abhs | STEP | 0 | 0 | 0 | 0 | 31 |
| staging.raw_step_ind_abhs | STEP | 0 | 0 | 0 | 0 | 12 |
| staging.step_ind_abhs | STEP | 0 | 0 | 0 | 0 | 0 |
| staging.steps | STEP | 0 | 0 | 0 | 0 | 0 |
| staging.steps_industrielles | STEP | 0 | 0 | 0 | 0 | 0 |
| infra.rejet_abattoir | abattoirs | 0 | 0 | 0 | 1 | 41 |
| infra.rejet_abattoir_inventaire_pollution | abattoirs | 0 | 0 | 0 | 2 | 38 |
| staging.raw_rejets_abattoirs_abhs | abattoirs | 0 | 0 | 0 | 1 | 41 |
| staging.rejet_abattoir | abattoirs | 0 | 0 | 0 | 0 | 0 |
| geo.nappe | autres | 0 | 1 | 0 | 0 | 0 |
| infra.fosses_septiques_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| infra.profil_station | autres | 0 | 0 | 0 | 0 | 0 |
| infra.rejet_inventaire_pollution | autres | 0 | 0 | 0 | 0 | 0 |
| infra.stm | autres | 0 | 0 | 0 | 0 | 0 |
| staging.mesures_evaporation_jr | autres | 0 | 0 | 0 | 0 | 0 |
| staging.points_eau_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.profils_stations | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_adm_cercles_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_adm_communes_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_adm_douars_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_adm_provinces_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_adm_regions_abhs | autres | 0 | 1 | 0 | 0 | 0 |
| staging.raw_adm_villes_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_fosses_septiques_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_mesures_evaporation_jr | autres | 48900 | 0 | 0 | 0 | 0 |
| staging.raw_nappes_abhs | autres | 0 | 1 | 0 | 0 | 0 |
| staging.raw_points_eau_abhs | autres | 4 | 0 | 0 | 0 | 0 |
| staging.raw_profils_stations | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_rejets_domestiques_abhs | autres | 78 | 0 | 0 | 0 | 0 |
| staging.raw_sources_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.raw_stm_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.rejets_brutes | autres | 0 | 0 | 0 | 0 | 0 |
| staging.sources_polution_mesure | autres | 0 | 0 | 0 | 0 | 0 |
| staging.stm_abhs | autres | 0 | 0 | 0 | 0 | 0 |
| staging.stms | autres | 0 | 0 | 0 | 0 | 0 |
| infra.barrages | barrages | 0 | 0 | 0 | 0 | 0 |
| staging.raw_barrages_abhs | barrages | 0 | 0 | 0 | 0 | 0 |
| geo.bassin_versant | bassins | 0 | 0 | 0 | 0 | 0 |
| staging.raw_bassin_sebou | bassins | 0 | 0 | 0 | 0 | 0 |
| staging.raw_sous_bassin_sebou | bassins | 0 | 6 | 0 | 0 | 0 |
| infra.decharge | decharges | 86 | 0 | 0 | 3 | 107 |
| infra.decharge_inventaire_pollution | decharges | 0 | 0 | 0 | 5 | 10 |
| infra.decharge_inventaire_pollution_general | decharges | 0 | 0 | 0 | 2 | 100 |
| staging.decharges | decharges | 0 | 0 | 0 | 0 | 0 |
| staging.decharges_Abondonees | decharges | 0 | 0 | 0 | 0 | 0 |
| staging.raw_decharges_abhs | decharges | 86 | 0 | 0 | 3 | 107 |
| infra.huilerie | huileries | 13 | 0 | 0 | 3 | 497 |
| infra.huilerie_inventaire_pollution | huileries | 0 | 0 | 0 | 19 | 504 |
| staging.huileries | huileries | 0 | 0 | 0 | 0 | 0 |
| staging.raw_huileries_abhs | huileries | 13 | 0 | 0 | 3 | 497 |
| infra.mine | mines | 0 | 0 | 0 | 0 | 31 |
| infra.mine_inventaire_pollution | mines | 0 | 0 | 0 | 0 | 28 |
| staging.mines | mines | 0 | 0 | 0 | 0 | 0 |
| staging.raw_mines_abhs | mines | 0 | 0 | 0 | 0 | 31 |
| infra.point_eau | points eau | 4 | 0 | 0 | 0 | 0 |
| qualite.source_pollution_prelevement | points pollution | 0 | 0 | 0 | 2 | 75 |
| infra.rejet_domestique | rejets domestiques | 78 | 0 | 0 | 3 | 141 |
| infra.rejet_industriel | rejets industriels | 0 | 0 | 0 | 0 | 8 |
| staging.raw_rejets_ind_abhs | rejets industriels | 0 | 0 | 0 | 0 | 8 |
| geo.reseau_hydrographique | reseau hydrographique | 0 | 0 | 0 | 0 | 0 |
| staging.raw_reseau_hydro_abhs | reseau hydrographique | 0 | 0 | 0 | 0 | 0 |
| geo.source | source de pollution | 0 | 0 | 0 | 1 | 94 |
| geo._bak_sous_bassin_swat_leben_innaouen_20260403 | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| geo.sous_bassin_abh | sous-bassins | 0 | 6 | 0 | 0 | 0 |
| geo.sous_bassin_swat_bas_sebou | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| geo.sous_bassin_swat_bassin_cotier | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| geo.sous_bassin_swat_beht | sous-bassins | 0 | 5 | 0 | 0 | 0 |
| geo.sous_bassin_swat_haut_sebou | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| geo.sous_bassin_swat_leben_innaouen | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| geo.sous_bassin_swat_moyen_sebou | sous-bassins | 0 | 3 | 0 | 0 | 0 |
| geo.sous_bassin_swat_ouergha | sous-bassins | 0 | 1 | 0 | 0 | 0 |
| staging.sous_bassin_swat_bas_sebou_new | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| staging.sous_bassin_swat_bassin_cotier_new | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| staging.sous_bassin_swat_beht_new | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| staging.sous_bassin_swat_haut_sebou_new | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| staging.sous_bassin_swat_leben_innaouen_new | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| staging.sous_bassin_swat_moyen_sebou_new | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| staging.sous_bassin_swat_ouergha_new | sous-bassins | 0 | 0 | 0 | 0 | 0 |
| infra.stations | stations | 0 | 0 | 0 | 4 | 0 |
| infra.stations_mesure | stations | 0 | 0 | 0 | 4 | 0 |
| staging.raw_stations_abhs | stations | 0 | 0 | 0 | 4 | 0 |
