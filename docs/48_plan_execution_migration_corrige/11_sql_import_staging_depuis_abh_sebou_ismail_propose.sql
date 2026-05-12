-- ATTENTION : SCRIPT PROPOSÉ, NON EXÉCUTÉ
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Objectif : proposer l'import brut depuis abh_sebou_ismail vers abh_sad.staging.raw_*.
-- Le mécanisme exact doit être validé : pg_dump/pg_restore table par table, postgres_fdw ou dblink.
-- Toutes les commandes ci-dessous sont commentées.
-- public.spatial_ref_sys est exclue : table technique PostGIS, non métier.

-- Option technique à valider : postgres_fdw
-- CREATE EXTENSION IF NOT EXISTS postgres_fdw;
-- CREATE SERVER abh_sebou_ismail_srv FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '127.0.0.1', port '5432', dbname 'abh_sebou_ismail');
-- CREATE USER MAPPING FOR CURRENT_USER SERVER abh_sebou_ismail_srv OPTIONS (user 'postgres', password '***');

-- Source : public.adm_cercles_abhs | volume source : 61 | cible : staging.raw_adm_cercles_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_adm_cercles_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("adm_cercles_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_adm_cercles_abhs AS SELECT * FROM staging."adm_cercles_abhs";
-- SELECT COUNT(*) FROM staging.raw_adm_cercles_abhs;

-- Source : public.adm_communes_abhs | volume source : 346 | cible : staging.raw_adm_communes_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_adm_communes_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("adm_communes_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_adm_communes_abhs AS SELECT * FROM staging."adm_communes_abhs";
-- SELECT COUNT(*) FROM staging.raw_adm_communes_abhs;

-- Source : public.adm_douars_abhs | volume source : 6013 | cible : staging.raw_adm_douars_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_adm_douars_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("adm_douars_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_adm_douars_abhs AS SELECT * FROM staging."adm_douars_abhs";
-- SELECT COUNT(*) FROM staging.raw_adm_douars_abhs;

-- Source : public.adm_provinces_abhs | volume source : 21 | cible : staging.raw_adm_provinces_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_adm_provinces_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("adm_provinces_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_adm_provinces_abhs AS SELECT * FROM staging."adm_provinces_abhs";
-- SELECT COUNT(*) FROM staging.raw_adm_provinces_abhs;

-- Source : public.adm_regions_abhs | volume source : 6 | cible : staging.raw_adm_regions_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_adm_regions_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("adm_regions_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_adm_regions_abhs AS SELECT * FROM staging."adm_regions_abhs";
-- SELECT COUNT(*) FROM staging.raw_adm_regions_abhs;

-- Source : public.adm_villes_abhs | volume source : 33 | cible : staging.raw_adm_villes_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_adm_villes_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("adm_villes_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_adm_villes_abhs AS SELECT * FROM staging."adm_villes_abhs";
-- SELECT COUNT(*) FROM staging.raw_adm_villes_abhs;

-- Source : public.barrages_abhs | volume source : 34 | cible : staging.raw_barrages_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_barrages_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("barrages_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_barrages_abhs AS SELECT * FROM staging."barrages_abhs";
-- SELECT COUNT(*) FROM staging.raw_barrages_abhs;

-- Source : public.bassin_sebou | volume source : 1 | cible : staging.raw_bassin_sebou
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_bassin_sebou; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("bassin_sebou") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_bassin_sebou AS SELECT * FROM staging."bassin_sebou";
-- SELECT COUNT(*) FROM staging.raw_bassin_sebou;

-- Source : public.bathymetries_barrages_abhs | volume source : 62359 | cible : staging.raw_bathymetries_barrages_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_bathymetries_barrages_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("bathymetries_barrages_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_bathymetries_barrages_abhs AS SELECT * FROM staging."bathymetries_barrages_abhs";
-- SELECT COUNT(*) FROM staging.raw_bathymetries_barrages_abhs;

-- Source : public.capteurs_abhs | volume source : 0 | cible : staging.raw_capteurs_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_capteurs_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("capteurs_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_capteurs_abhs AS SELECT * FROM staging."capteurs_abhs";
-- SELECT COUNT(*) FROM staging.raw_capteurs_abhs;

-- Source : public.decharges_abhs | volume source : 233 | cible : staging.raw_decharges_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_decharges_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("decharges_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_decharges_abhs AS SELECT * FROM staging."decharges_abhs";
-- SELECT COUNT(*) FROM staging.raw_decharges_abhs;

-- Source : public.fosses_septiques_abhs | volume source : 20 | cible : staging.raw_fosses_septiques_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_fosses_septiques_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("fosses_septiques_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_fosses_septiques_abhs AS SELECT * FROM staging."fosses_septiques_abhs";
-- SELECT COUNT(*) FROM staging.raw_fosses_septiques_abhs;

-- Source : public.huileries_abhs | volume source : 612 | cible : staging.raw_huileries_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_huileries_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("huileries_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_huileries_abhs AS SELECT * FROM staging."huileries_abhs";
-- SELECT COUNT(*) FROM staging.raw_huileries_abhs;

-- Source : public.idp_2024_mesures_qualite_globale | volume source : 4894 | cible : staging.raw_idp_2024_mesures_qualite_globale
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_idp_2024_mesures_qualite_globale; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("idp_2024_mesures_qualite_globale") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_idp_2024_mesures_qualite_globale AS SELECT * FROM staging."idp_2024_mesures_qualite_globale";
-- SELECT COUNT(*) FROM staging.raw_idp_2024_mesures_qualite_globale;

-- Source : public.idp_2024_mesures_qualite_marche_cadre | volume source : 3614 | cible : staging.raw_idp_2024_mesures_qualite_marche_cadre
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_idp_2024_mesures_qualite_marche_cadre; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("idp_2024_mesures_qualite_marche_cadre") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_idp_2024_mesures_qualite_marche_cadre AS SELECT * FROM staging."idp_2024_mesures_qualite_marche_cadre";
-- SELECT COUNT(*) FROM staging.raw_idp_2024_mesures_qualite_marche_cadre;

-- Source : public.idp_2024_src_pollution_globale | volume source : 243 | cible : staging.raw_idp_2024_src_pollution_globale
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_idp_2024_src_pollution_globale; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("idp_2024_src_pollution_globale") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_idp_2024_src_pollution_globale AS SELECT * FROM staging."idp_2024_src_pollution_globale";
-- SELECT COUNT(*) FROM staging.raw_idp_2024_src_pollution_globale;

-- Source : public.idp_2024_src_pollution_marche_cadre | volume source : 148 | cible : staging.raw_idp_2024_src_pollution_marche_cadre
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_idp_2024_src_pollution_marche_cadre; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("idp_2024_src_pollution_marche_cadre") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_idp_2024_src_pollution_marche_cadre AS SELECT * FROM staging."idp_2024_src_pollution_marche_cadre";
-- SELECT COUNT(*) FROM staging.raw_idp_2024_src_pollution_marche_cadre;

-- Source : public.mesures_debit_jr | volume source : 521433 | cible : staging.raw_mesures_debit_jr
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_debit_jr; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_debit_jr") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_debit_jr AS SELECT * FROM staging."mesures_debit_jr";
-- SELECT COUNT(*) FROM staging.raw_mesures_debit_jr;

-- Source : public.mesures_debit_m | volume source : 19316 | cible : staging.raw_mesures_debit_m
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_debit_m; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_debit_m") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_debit_m AS SELECT * FROM staging."mesures_debit_m";
-- SELECT COUNT(*) FROM staging.raw_mesures_debit_m;

-- Source : public.mesures_debit_sources | volume source : 2816 | cible : staging.raw_mesures_debit_sources
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_debit_sources; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_debit_sources") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_debit_sources AS SELECT * FROM staging."mesures_debit_sources";
-- SELECT COUNT(*) FROM staging.raw_mesures_debit_sources;

-- Source : public.mesures_evaporation_jr | volume source : 48900 | cible : staging.raw_mesures_evaporation_jr
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_evaporation_jr; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_evaporation_jr") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_evaporation_jr AS SELECT * FROM staging."mesures_evaporation_jr";
-- SELECT COUNT(*) FROM staging.raw_mesures_evaporation_jr;

-- Source : public.mesures_niv_eau_barrages | volume source : 85166 | cible : staging.raw_mesures_niv_eau_barrages
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_niv_eau_barrages; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_niv_eau_barrages") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_niv_eau_barrages AS SELECT * FROM staging."mesures_niv_eau_barrages";
-- SELECT COUNT(*) FROM staging.raw_mesures_niv_eau_barrages;

-- Source : public.mesures_precipitations_jr | volume source : 669880 | cible : staging.raw_mesures_precipitations_jr
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_precipitations_jr; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_precipitations_jr") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_precipitations_jr AS SELECT * FROM staging."mesures_precipitations_jr";
-- SELECT COUNT(*) FROM staging.raw_mesures_precipitations_jr;

-- Source : public.mesures_precipitations_jr_max | volume source : 2085 | cible : staging.raw_mesures_precipitations_jr_max
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_precipitations_jr_max; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_precipitations_jr_max") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_precipitations_jr_max AS SELECT * FROM staging."mesures_precipitations_jr_max";
-- SELECT COUNT(*) FROM staging.raw_mesures_precipitations_jr_max;

-- Source : public.mesures_precipitations_jr_traitees | volume source : 546007 | cible : staging.raw_mesures_precipitations_jr_traitees
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_precipitations_jr_traitees; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_precipitations_jr_traitees") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_precipitations_jr_traitees AS SELECT * FROM staging."mesures_precipitations_jr_traitees";
-- SELECT COUNT(*) FROM staging.raw_mesures_precipitations_jr_traitees;

-- Source : public.mesures_qualite_barrages | volume source : 8714 | cible : staging.raw_mesures_qualite_barrages
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_qualite_barrages; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_qualite_barrages") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_qualite_barrages AS SELECT * FROM staging."mesures_qualite_barrages";
-- SELECT COUNT(*) FROM staging.raw_mesures_qualite_barrages;

-- Source : public.mesures_qualite_nappes | volume source : 63088 | cible : staging.raw_mesures_qualite_nappes
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_qualite_nappes; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_qualite_nappes") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_qualite_nappes AS SELECT * FROM staging."mesures_qualite_nappes";
-- SELECT COUNT(*) FROM staging.raw_mesures_qualite_nappes;

-- Source : public.mesures_qualite_rivieres | volume source : 60097 | cible : staging.raw_mesures_qualite_rivieres
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_qualite_rivieres; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_qualite_rivieres") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_qualite_rivieres AS SELECT * FROM staging."mesures_qualite_rivieres";
-- SELECT COUNT(*) FROM staging.raw_mesures_qualite_rivieres;

-- Source : public.mesures_temperatures_jr | volume source : 0 | cible : staging.raw_mesures_temperatures_jr
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mesures_temperatures_jr; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mesures_temperatures_jr") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mesures_temperatures_jr AS SELECT * FROM staging."mesures_temperatures_jr";
-- SELECT COUNT(*) FROM staging.raw_mesures_temperatures_jr;

-- Source : public.mines_abhs | volume source : 42 | cible : staging.raw_mines_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_mines_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("mines_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_mines_abhs AS SELECT * FROM staging."mines_abhs";
-- SELECT COUNT(*) FROM staging.raw_mines_abhs;

-- Source : public.nappes_abhs | volume source : 17 | cible : staging.raw_nappes_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_nappes_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("nappes_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_nappes_abhs AS SELECT * FROM staging."nappes_abhs";
-- SELECT COUNT(*) FROM staging.raw_nappes_abhs;

-- Source : public.points_eau_abhs | volume source : 46 | cible : staging.raw_points_eau_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_points_eau_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("points_eau_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_points_eau_abhs AS SELECT * FROM staging."points_eau_abhs";
-- SELECT COUNT(*) FROM staging.raw_points_eau_abhs;

-- Source : public.profils_stations | volume source : 1980 | cible : staging.raw_profils_stations
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_profils_stations; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("profils_stations") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_profils_stations AS SELECT * FROM staging."profils_stations";
-- SELECT COUNT(*) FROM staging.raw_profils_stations;

-- Source : public.rejets_abattoirs_abhs | volume source : 61 | cible : staging.raw_rejets_abattoirs_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_rejets_abattoirs_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("rejets_abattoirs_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_rejets_abattoirs_abhs AS SELECT * FROM staging."rejets_abattoirs_abhs";
-- SELECT COUNT(*) FROM staging.raw_rejets_abattoirs_abhs;

-- Source : public.rejets_domestiques_abhs | volume source : 362 | cible : staging.raw_rejets_domestiques_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_rejets_domestiques_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("rejets_domestiques_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_rejets_domestiques_abhs AS SELECT * FROM staging."rejets_domestiques_abhs";
-- SELECT COUNT(*) FROM staging.raw_rejets_domestiques_abhs;

-- Source : public.rejets_ind_abhs | volume source : 11 | cible : staging.raw_rejets_ind_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_rejets_ind_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("rejets_ind_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_rejets_ind_abhs AS SELECT * FROM staging."rejets_ind_abhs";
-- SELECT COUNT(*) FROM staging.raw_rejets_ind_abhs;

-- Source : public.reseau_hydro_abhs | volume source : 28 | cible : staging.raw_reseau_hydro_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_reseau_hydro_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("reseau_hydro_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_reseau_hydro_abhs AS SELECT * FROM staging."reseau_hydro_abhs";
-- SELECT COUNT(*) FROM staging.raw_reseau_hydro_abhs;

-- Source : public.sources_abhs | volume source : 135 | cible : staging.raw_sources_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_sources_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("sources_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_sources_abhs AS SELECT * FROM staging."sources_abhs";
-- SELECT COUNT(*) FROM staging.raw_sources_abhs;

-- Source : public.sous_bassin_sebou | volume source : 15 | cible : staging.raw_sous_bassin_sebou
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_sous_bassin_sebou; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("sous_bassin_sebou") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_sous_bassin_sebou AS SELECT * FROM staging."sous_bassin_sebou";
-- SELECT COUNT(*) FROM staging.raw_sous_bassin_sebou;

-- Source : public.stations_abhs | volume source : 390 | cible : staging.raw_stations_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_stations_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("stations_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_stations_abhs AS SELECT * FROM staging."stations_abhs";
-- SELECT COUNT(*) FROM staging.raw_stations_abhs;

-- Source : public.step_abhs | volume source : 41 | cible : staging.raw_step_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_step_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("step_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_step_abhs AS SELECT * FROM staging."step_abhs";
-- SELECT COUNT(*) FROM staging.raw_step_abhs;

-- Source : public.step_ind_abhs | volume source : 15 | cible : staging.raw_step_ind_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_step_ind_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("step_ind_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_step_ind_abhs AS SELECT * FROM staging."step_ind_abhs";
-- SELECT COUNT(*) FROM staging.raw_step_ind_abhs;

-- Source : public.stm_abhs | volume source : 18 | cible : staging.raw_stm_abhs
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_stm_abhs; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("stm_abhs") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_stm_abhs AS SELECT * FROM staging."stm_abhs";
-- SELECT COUNT(*) FROM staging.raw_stm_abhs;

-- Source : public.suivi_qualite_brg_garde_hebdo | volume source : 7094 | cible : staging.raw_suivi_qualite_brg_garde_hebdo
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_suivi_qualite_brg_garde_hebdo; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("suivi_qualite_brg_garde_hebdo") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_suivi_qualite_brg_garde_hebdo AS SELECT * FROM staging."suivi_qualite_brg_garde_hebdo";
-- SELECT COUNT(*) FROM staging.raw_suivi_qualite_brg_garde_hebdo;

-- Source : public.suivi_qualite_sebou_jr | volume source : 59436 | cible : staging.raw_suivi_qualite_sebou_jr
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_suivi_qualite_sebou_jr; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("suivi_qualite_sebou_jr") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_suivi_qualite_sebou_jr AS SELECT * FROM staging."suivi_qualite_sebou_jr";
-- SELECT COUNT(*) FROM staging.raw_suivi_qualite_sebou_jr;

-- Source : public.types_mesures | volume source : 64 | cible : staging.raw_types_mesures
-- DROP FOREIGN TABLE IF EXISTS staging.ft_raw_types_mesures; -- interdit sans validation, ligne illustrative seulement
-- IMPORT FOREIGN SCHEMA public LIMIT TO ("types_mesures") FROM SERVER abh_sebou_ismail_srv INTO staging;
-- CREATE TABLE staging.raw_types_mesures AS SELECT * FROM staging."types_mesures";
-- SELECT COUNT(*) FROM staging.raw_types_mesures;
