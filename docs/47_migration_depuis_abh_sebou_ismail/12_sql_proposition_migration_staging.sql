-- ATTENTION : SCRIPT PROPOSÉ, NON EXÉCUTÉ
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Structure d’import brut depuis abh_sebou_ismail vers staging abh_sad.

-- Option recommandée : dump/export source puis import contrôlé vers staging.
-- Ne pas charger directement dans qualite/hydro/meteo.

-- CREATE SCHEMA IF NOT EXISTS staging;
-- Table source : public.adm_cercles_abhs
-- CREATE TABLE staging.raw_adm_cercles_abhs AS SELECT * FROM foreign_source."adm_cercles_abhs";
-- ALTER TABLE staging.raw_adm_cercles_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_adm_cercles_abhs ADD COLUMN _source_table text DEFAULT 'public.adm_cercles_abhs';
-- ALTER TABLE staging.raw_adm_cercles_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.adm_communes_abhs
-- CREATE TABLE staging.raw_adm_communes_abhs AS SELECT * FROM foreign_source."adm_communes_abhs";
-- ALTER TABLE staging.raw_adm_communes_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_adm_communes_abhs ADD COLUMN _source_table text DEFAULT 'public.adm_communes_abhs';
-- ALTER TABLE staging.raw_adm_communes_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.adm_douars_abhs
-- CREATE TABLE staging.raw_adm_douars_abhs AS SELECT * FROM foreign_source."adm_douars_abhs";
-- ALTER TABLE staging.raw_adm_douars_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_adm_douars_abhs ADD COLUMN _source_table text DEFAULT 'public.adm_douars_abhs';
-- ALTER TABLE staging.raw_adm_douars_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.adm_provinces_abhs
-- CREATE TABLE staging.raw_adm_provinces_abhs AS SELECT * FROM foreign_source."adm_provinces_abhs";
-- ALTER TABLE staging.raw_adm_provinces_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_adm_provinces_abhs ADD COLUMN _source_table text DEFAULT 'public.adm_provinces_abhs';
-- ALTER TABLE staging.raw_adm_provinces_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.adm_regions_abhs
-- CREATE TABLE staging.raw_adm_regions_abhs AS SELECT * FROM foreign_source."adm_regions_abhs";
-- ALTER TABLE staging.raw_adm_regions_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_adm_regions_abhs ADD COLUMN _source_table text DEFAULT 'public.adm_regions_abhs';
-- ALTER TABLE staging.raw_adm_regions_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.adm_villes_abhs
-- CREATE TABLE staging.raw_adm_villes_abhs AS SELECT * FROM foreign_source."adm_villes_abhs";
-- ALTER TABLE staging.raw_adm_villes_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_adm_villes_abhs ADD COLUMN _source_table text DEFAULT 'public.adm_villes_abhs';
-- ALTER TABLE staging.raw_adm_villes_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.barrages_abhs
-- CREATE TABLE staging.raw_barrages_abhs AS SELECT * FROM foreign_source."barrages_abhs";
-- ALTER TABLE staging.raw_barrages_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_barrages_abhs ADD COLUMN _source_table text DEFAULT 'public.barrages_abhs';
-- ALTER TABLE staging.raw_barrages_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.bassin_sebou
-- CREATE TABLE staging.raw_bassin_sebou AS SELECT * FROM foreign_source."bassin_sebou";
-- ALTER TABLE staging.raw_bassin_sebou ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_bassin_sebou ADD COLUMN _source_table text DEFAULT 'public.bassin_sebou';
-- ALTER TABLE staging.raw_bassin_sebou ADD COLUMN _import_batch_id uuid;

-- Table source : public.bathymetries_barrages_abhs
-- CREATE TABLE staging.raw_bathymetries_barrages_abhs AS SELECT * FROM foreign_source."bathymetries_barrages_abhs";
-- ALTER TABLE staging.raw_bathymetries_barrages_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_bathymetries_barrages_abhs ADD COLUMN _source_table text DEFAULT 'public.bathymetries_barrages_abhs';
-- ALTER TABLE staging.raw_bathymetries_barrages_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.capteurs_abhs
-- CREATE TABLE staging.raw_capteurs_abhs AS SELECT * FROM foreign_source."capteurs_abhs";
-- ALTER TABLE staging.raw_capteurs_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_capteurs_abhs ADD COLUMN _source_table text DEFAULT 'public.capteurs_abhs';
-- ALTER TABLE staging.raw_capteurs_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.decharges_abhs
-- CREATE TABLE staging.raw_decharges_abhs AS SELECT * FROM foreign_source."decharges_abhs";
-- ALTER TABLE staging.raw_decharges_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_decharges_abhs ADD COLUMN _source_table text DEFAULT 'public.decharges_abhs';
-- ALTER TABLE staging.raw_decharges_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.fosses_septiques_abhs
-- CREATE TABLE staging.raw_fosses_septiques_abhs AS SELECT * FROM foreign_source."fosses_septiques_abhs";
-- ALTER TABLE staging.raw_fosses_septiques_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_fosses_septiques_abhs ADD COLUMN _source_table text DEFAULT 'public.fosses_septiques_abhs';
-- ALTER TABLE staging.raw_fosses_septiques_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.huileries_abhs
-- CREATE TABLE staging.raw_huileries_abhs AS SELECT * FROM foreign_source."huileries_abhs";
-- ALTER TABLE staging.raw_huileries_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_huileries_abhs ADD COLUMN _source_table text DEFAULT 'public.huileries_abhs';
-- ALTER TABLE staging.raw_huileries_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.idp_2024_mesures_qualite_globale
-- CREATE TABLE staging.raw_idp_2024_mesures_qualite_globale AS SELECT * FROM foreign_source."idp_2024_mesures_qualite_globale";
-- ALTER TABLE staging.raw_idp_2024_mesures_qualite_globale ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_idp_2024_mesures_qualite_globale ADD COLUMN _source_table text DEFAULT 'public.idp_2024_mesures_qualite_globale';
-- ALTER TABLE staging.raw_idp_2024_mesures_qualite_globale ADD COLUMN _import_batch_id uuid;

-- Table source : public.idp_2024_mesures_qualite_marche_cadre
-- CREATE TABLE staging.raw_idp_2024_mesures_qualite_marche_cadre AS SELECT * FROM foreign_source."idp_2024_mesures_qualite_marche_cadre";
-- ALTER TABLE staging.raw_idp_2024_mesures_qualite_marche_cadre ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_idp_2024_mesures_qualite_marche_cadre ADD COLUMN _source_table text DEFAULT 'public.idp_2024_mesures_qualite_marche_cadre';
-- ALTER TABLE staging.raw_idp_2024_mesures_qualite_marche_cadre ADD COLUMN _import_batch_id uuid;

-- Table source : public.idp_2024_src_pollution_globale
-- CREATE TABLE staging.raw_idp_2024_src_pollution_globale AS SELECT * FROM foreign_source."idp_2024_src_pollution_globale";
-- ALTER TABLE staging.raw_idp_2024_src_pollution_globale ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_idp_2024_src_pollution_globale ADD COLUMN _source_table text DEFAULT 'public.idp_2024_src_pollution_globale';
-- ALTER TABLE staging.raw_idp_2024_src_pollution_globale ADD COLUMN _import_batch_id uuid;

-- Table source : public.idp_2024_src_pollution_marche_cadre
-- CREATE TABLE staging.raw_idp_2024_src_pollution_marche_cadre AS SELECT * FROM foreign_source."idp_2024_src_pollution_marche_cadre";
-- ALTER TABLE staging.raw_idp_2024_src_pollution_marche_cadre ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_idp_2024_src_pollution_marche_cadre ADD COLUMN _source_table text DEFAULT 'public.idp_2024_src_pollution_marche_cadre';
-- ALTER TABLE staging.raw_idp_2024_src_pollution_marche_cadre ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_debit_jr
-- CREATE TABLE staging.raw_mesures_debit_jr AS SELECT * FROM foreign_source."mesures_debit_jr";
-- ALTER TABLE staging.raw_mesures_debit_jr ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_debit_jr ADD COLUMN _source_table text DEFAULT 'public.mesures_debit_jr';
-- ALTER TABLE staging.raw_mesures_debit_jr ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_debit_m
-- CREATE TABLE staging.raw_mesures_debit_m AS SELECT * FROM foreign_source."mesures_debit_m";
-- ALTER TABLE staging.raw_mesures_debit_m ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_debit_m ADD COLUMN _source_table text DEFAULT 'public.mesures_debit_m';
-- ALTER TABLE staging.raw_mesures_debit_m ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_debit_sources
-- CREATE TABLE staging.raw_mesures_debit_sources AS SELECT * FROM foreign_source."mesures_debit_sources";
-- ALTER TABLE staging.raw_mesures_debit_sources ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_debit_sources ADD COLUMN _source_table text DEFAULT 'public.mesures_debit_sources';
-- ALTER TABLE staging.raw_mesures_debit_sources ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_evaporation_jr
-- CREATE TABLE staging.raw_mesures_evaporation_jr AS SELECT * FROM foreign_source."mesures_evaporation_jr";
-- ALTER TABLE staging.raw_mesures_evaporation_jr ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_evaporation_jr ADD COLUMN _source_table text DEFAULT 'public.mesures_evaporation_jr';
-- ALTER TABLE staging.raw_mesures_evaporation_jr ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_niv_eau_barrages
-- CREATE TABLE staging.raw_mesures_niv_eau_barrages AS SELECT * FROM foreign_source."mesures_niv_eau_barrages";
-- ALTER TABLE staging.raw_mesures_niv_eau_barrages ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_niv_eau_barrages ADD COLUMN _source_table text DEFAULT 'public.mesures_niv_eau_barrages';
-- ALTER TABLE staging.raw_mesures_niv_eau_barrages ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_precipitations_jr
-- CREATE TABLE staging.raw_mesures_precipitations_jr AS SELECT * FROM foreign_source."mesures_precipitations_jr";
-- ALTER TABLE staging.raw_mesures_precipitations_jr ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_precipitations_jr ADD COLUMN _source_table text DEFAULT 'public.mesures_precipitations_jr';
-- ALTER TABLE staging.raw_mesures_precipitations_jr ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_precipitations_jr_max
-- CREATE TABLE staging.raw_mesures_precipitations_jr_max AS SELECT * FROM foreign_source."mesures_precipitations_jr_max";
-- ALTER TABLE staging.raw_mesures_precipitations_jr_max ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_precipitations_jr_max ADD COLUMN _source_table text DEFAULT 'public.mesures_precipitations_jr_max';
-- ALTER TABLE staging.raw_mesures_precipitations_jr_max ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_precipitations_jr_traitees
-- CREATE TABLE staging.raw_mesures_precipitations_jr_traitees AS SELECT * FROM foreign_source."mesures_precipitations_jr_traitees";
-- ALTER TABLE staging.raw_mesures_precipitations_jr_traitees ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_precipitations_jr_traitees ADD COLUMN _source_table text DEFAULT 'public.mesures_precipitations_jr_traitees';
-- ALTER TABLE staging.raw_mesures_precipitations_jr_traitees ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_qualite_barrages
-- CREATE TABLE staging.raw_mesures_qualite_barrages AS SELECT * FROM foreign_source."mesures_qualite_barrages";
-- ALTER TABLE staging.raw_mesures_qualite_barrages ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_qualite_barrages ADD COLUMN _source_table text DEFAULT 'public.mesures_qualite_barrages';
-- ALTER TABLE staging.raw_mesures_qualite_barrages ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_qualite_nappes
-- CREATE TABLE staging.raw_mesures_qualite_nappes AS SELECT * FROM foreign_source."mesures_qualite_nappes";
-- ALTER TABLE staging.raw_mesures_qualite_nappes ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_qualite_nappes ADD COLUMN _source_table text DEFAULT 'public.mesures_qualite_nappes';
-- ALTER TABLE staging.raw_mesures_qualite_nappes ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_qualite_rivieres
-- CREATE TABLE staging.raw_mesures_qualite_rivieres AS SELECT * FROM foreign_source."mesures_qualite_rivieres";
-- ALTER TABLE staging.raw_mesures_qualite_rivieres ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_qualite_rivieres ADD COLUMN _source_table text DEFAULT 'public.mesures_qualite_rivieres';
-- ALTER TABLE staging.raw_mesures_qualite_rivieres ADD COLUMN _import_batch_id uuid;

-- Table source : public.mesures_temperatures_jr
-- CREATE TABLE staging.raw_mesures_temperatures_jr AS SELECT * FROM foreign_source."mesures_temperatures_jr";
-- ALTER TABLE staging.raw_mesures_temperatures_jr ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mesures_temperatures_jr ADD COLUMN _source_table text DEFAULT 'public.mesures_temperatures_jr';
-- ALTER TABLE staging.raw_mesures_temperatures_jr ADD COLUMN _import_batch_id uuid;

-- Table source : public.mines_abhs
-- CREATE TABLE staging.raw_mines_abhs AS SELECT * FROM foreign_source."mines_abhs";
-- ALTER TABLE staging.raw_mines_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_mines_abhs ADD COLUMN _source_table text DEFAULT 'public.mines_abhs';
-- ALTER TABLE staging.raw_mines_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.nappes_abhs
-- CREATE TABLE staging.raw_nappes_abhs AS SELECT * FROM foreign_source."nappes_abhs";
-- ALTER TABLE staging.raw_nappes_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_nappes_abhs ADD COLUMN _source_table text DEFAULT 'public.nappes_abhs';
-- ALTER TABLE staging.raw_nappes_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.points_eau_abhs
-- CREATE TABLE staging.raw_points_eau_abhs AS SELECT * FROM foreign_source."points_eau_abhs";
-- ALTER TABLE staging.raw_points_eau_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_points_eau_abhs ADD COLUMN _source_table text DEFAULT 'public.points_eau_abhs';
-- ALTER TABLE staging.raw_points_eau_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.profils_stations
-- CREATE TABLE staging.raw_profils_stations AS SELECT * FROM foreign_source."profils_stations";
-- ALTER TABLE staging.raw_profils_stations ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_profils_stations ADD COLUMN _source_table text DEFAULT 'public.profils_stations';
-- ALTER TABLE staging.raw_profils_stations ADD COLUMN _import_batch_id uuid;

-- Table source : public.rejets_abattoirs_abhs
-- CREATE TABLE staging.raw_rejets_abattoirs_abhs AS SELECT * FROM foreign_source."rejets_abattoirs_abhs";
-- ALTER TABLE staging.raw_rejets_abattoirs_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_rejets_abattoirs_abhs ADD COLUMN _source_table text DEFAULT 'public.rejets_abattoirs_abhs';
-- ALTER TABLE staging.raw_rejets_abattoirs_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.rejets_domestiques_abhs
-- CREATE TABLE staging.raw_rejets_domestiques_abhs AS SELECT * FROM foreign_source."rejets_domestiques_abhs";
-- ALTER TABLE staging.raw_rejets_domestiques_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_rejets_domestiques_abhs ADD COLUMN _source_table text DEFAULT 'public.rejets_domestiques_abhs';
-- ALTER TABLE staging.raw_rejets_domestiques_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.rejets_ind_abhs
-- CREATE TABLE staging.raw_rejets_ind_abhs AS SELECT * FROM foreign_source."rejets_ind_abhs";
-- ALTER TABLE staging.raw_rejets_ind_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_rejets_ind_abhs ADD COLUMN _source_table text DEFAULT 'public.rejets_ind_abhs';
-- ALTER TABLE staging.raw_rejets_ind_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.reseau_hydro_abhs
-- CREATE TABLE staging.raw_reseau_hydro_abhs AS SELECT * FROM foreign_source."reseau_hydro_abhs";
-- ALTER TABLE staging.raw_reseau_hydro_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_reseau_hydro_abhs ADD COLUMN _source_table text DEFAULT 'public.reseau_hydro_abhs';
-- ALTER TABLE staging.raw_reseau_hydro_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.sources_abhs
-- CREATE TABLE staging.raw_sources_abhs AS SELECT * FROM foreign_source."sources_abhs";
-- ALTER TABLE staging.raw_sources_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_sources_abhs ADD COLUMN _source_table text DEFAULT 'public.sources_abhs';
-- ALTER TABLE staging.raw_sources_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.sous_bassin_sebou
-- CREATE TABLE staging.raw_sous_bassin_sebou AS SELECT * FROM foreign_source."sous_bassin_sebou";
-- ALTER TABLE staging.raw_sous_bassin_sebou ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_sous_bassin_sebou ADD COLUMN _source_table text DEFAULT 'public.sous_bassin_sebou';
-- ALTER TABLE staging.raw_sous_bassin_sebou ADD COLUMN _import_batch_id uuid;

-- Table source : public.spatial_ref_sys
-- CREATE TABLE staging.raw_spatial_ref_sys AS SELECT * FROM foreign_source."spatial_ref_sys";
-- ALTER TABLE staging.raw_spatial_ref_sys ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_spatial_ref_sys ADD COLUMN _source_table text DEFAULT 'public.spatial_ref_sys';
-- ALTER TABLE staging.raw_spatial_ref_sys ADD COLUMN _import_batch_id uuid;

-- Table source : public.stations_abhs
-- CREATE TABLE staging.raw_stations_abhs AS SELECT * FROM foreign_source."stations_abhs";
-- ALTER TABLE staging.raw_stations_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_stations_abhs ADD COLUMN _source_table text DEFAULT 'public.stations_abhs';
-- ALTER TABLE staging.raw_stations_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.step_abhs
-- CREATE TABLE staging.raw_step_abhs AS SELECT * FROM foreign_source."step_abhs";
-- ALTER TABLE staging.raw_step_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_step_abhs ADD COLUMN _source_table text DEFAULT 'public.step_abhs';
-- ALTER TABLE staging.raw_step_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.step_ind_abhs
-- CREATE TABLE staging.raw_step_ind_abhs AS SELECT * FROM foreign_source."step_ind_abhs";
-- ALTER TABLE staging.raw_step_ind_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_step_ind_abhs ADD COLUMN _source_table text DEFAULT 'public.step_ind_abhs';
-- ALTER TABLE staging.raw_step_ind_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.stm_abhs
-- CREATE TABLE staging.raw_stm_abhs AS SELECT * FROM foreign_source."stm_abhs";
-- ALTER TABLE staging.raw_stm_abhs ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_stm_abhs ADD COLUMN _source_table text DEFAULT 'public.stm_abhs';
-- ALTER TABLE staging.raw_stm_abhs ADD COLUMN _import_batch_id uuid;

-- Table source : public.suivi_qualite_brg_garde_hebdo
-- CREATE TABLE staging.raw_suivi_qualite_brg_garde_hebdo AS SELECT * FROM foreign_source."suivi_qualite_brg_garde_hebdo";
-- ALTER TABLE staging.raw_suivi_qualite_brg_garde_hebdo ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_suivi_qualite_brg_garde_hebdo ADD COLUMN _source_table text DEFAULT 'public.suivi_qualite_brg_garde_hebdo';
-- ALTER TABLE staging.raw_suivi_qualite_brg_garde_hebdo ADD COLUMN _import_batch_id uuid;

-- Table source : public.suivi_qualite_sebou_jr
-- CREATE TABLE staging.raw_suivi_qualite_sebou_jr AS SELECT * FROM foreign_source."suivi_qualite_sebou_jr";
-- ALTER TABLE staging.raw_suivi_qualite_sebou_jr ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_suivi_qualite_sebou_jr ADD COLUMN _source_table text DEFAULT 'public.suivi_qualite_sebou_jr';
-- ALTER TABLE staging.raw_suivi_qualite_sebou_jr ADD COLUMN _import_batch_id uuid;

-- Table source : public.types_mesures
-- CREATE TABLE staging.raw_types_mesures AS SELECT * FROM foreign_source."types_mesures";
-- ALTER TABLE staging.raw_types_mesures ADD COLUMN _source_database text DEFAULT 'abh_sebou_ismail';
-- ALTER TABLE staging.raw_types_mesures ADD COLUMN _source_table text DEFAULT 'public.types_mesures';
-- ALTER TABLE staging.raw_types_mesures ADD COLUMN _import_batch_id uuid;
