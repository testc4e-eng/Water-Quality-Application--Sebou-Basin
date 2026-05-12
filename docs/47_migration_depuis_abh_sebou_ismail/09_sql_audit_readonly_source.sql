-- ATTENTION : SCRIPT PROPOSÉ, NON EXÉCUTÉ
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Audit read-only de la source officielle abh_sebou_ismail.

SELECT table_schema, table_name, table_type FROM information_schema.tables WHERE table_schema NOT LIKE 'pg_%' AND table_schema <> 'information_schema' ORDER BY table_schema, table_name;

SELECT table_schema, table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema NOT LIKE 'pg_%' AND table_schema <> 'information_schema' ORDER BY table_schema, table_name, ordinal_position;

-- Volume source : public.adm_cercles_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."adm_cercles_abhs";

-- Volume source : public.adm_communes_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."adm_communes_abhs";

-- Volume source : public.adm_douars_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."adm_douars_abhs";

-- Volume source : public.adm_provinces_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."adm_provinces_abhs";

-- Volume source : public.adm_regions_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."adm_regions_abhs";

-- Volume source : public.adm_villes_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."adm_villes_abhs";

-- Volume source : public.barrages_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."barrages_abhs";

-- Volume source : public.bassin_sebou
SELECT COUNT(*) AS volume_lignes FROM "public"."bassin_sebou";

-- Volume source : public.bathymetries_barrages_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."bathymetries_barrages_abhs";

-- Volume source : public.capteurs_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."capteurs_abhs";

-- Volume source : public.decharges_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."decharges_abhs";

-- Volume source : public.fosses_septiques_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."fosses_septiques_abhs";

-- Volume source : public.huileries_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."huileries_abhs";

-- Volume source : public.idp_2024_mesures_qualite_globale
SELECT COUNT(*) AS volume_lignes FROM "public"."idp_2024_mesures_qualite_globale";

-- Volume source : public.idp_2024_mesures_qualite_marche_cadre
SELECT COUNT(*) AS volume_lignes FROM "public"."idp_2024_mesures_qualite_marche_cadre";

-- Volume source : public.idp_2024_src_pollution_globale
SELECT COUNT(*) AS volume_lignes FROM "public"."idp_2024_src_pollution_globale";

-- Volume source : public.idp_2024_src_pollution_marche_cadre
SELECT COUNT(*) AS volume_lignes FROM "public"."idp_2024_src_pollution_marche_cadre";

-- Volume source : public.mesures_debit_jr
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_debit_jr";

-- Volume source : public.mesures_debit_m
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_debit_m";

-- Volume source : public.mesures_debit_sources
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_debit_sources";

-- Volume source : public.mesures_evaporation_jr
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_evaporation_jr";

-- Volume source : public.mesures_niv_eau_barrages
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_niv_eau_barrages";

-- Volume source : public.mesures_precipitations_jr
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_precipitations_jr";

-- Volume source : public.mesures_precipitations_jr_max
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_precipitations_jr_max";

-- Volume source : public.mesures_precipitations_jr_traitees
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_precipitations_jr_traitees";

-- Volume source : public.mesures_qualite_barrages
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_qualite_barrages";

-- Volume source : public.mesures_qualite_nappes
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_qualite_nappes";

-- Volume source : public.mesures_qualite_rivieres
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_qualite_rivieres";

-- Volume source : public.mesures_temperatures_jr
SELECT COUNT(*) AS volume_lignes FROM "public"."mesures_temperatures_jr";

-- Volume source : public.mines_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."mines_abhs";

-- Volume source : public.nappes_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."nappes_abhs";

-- Volume source : public.points_eau_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."points_eau_abhs";

-- Volume source : public.profils_stations
SELECT COUNT(*) AS volume_lignes FROM "public"."profils_stations";

-- Volume source : public.rejets_abattoirs_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."rejets_abattoirs_abhs";

-- Volume source : public.rejets_domestiques_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."rejets_domestiques_abhs";

-- Volume source : public.rejets_ind_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."rejets_ind_abhs";

-- Volume source : public.reseau_hydro_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."reseau_hydro_abhs";

-- Volume source : public.sources_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."sources_abhs";

-- Volume source : public.sous_bassin_sebou
SELECT COUNT(*) AS volume_lignes FROM "public"."sous_bassin_sebou";

-- Volume source : public.spatial_ref_sys
SELECT COUNT(*) AS volume_lignes FROM "public"."spatial_ref_sys";

-- Volume source : public.stations_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."stations_abhs";

-- Volume source : public.step_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."step_abhs";

-- Volume source : public.step_ind_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."step_ind_abhs";

-- Volume source : public.stm_abhs
SELECT COUNT(*) AS volume_lignes FROM "public"."stm_abhs";

-- Volume source : public.suivi_qualite_brg_garde_hebdo
SELECT COUNT(*) AS volume_lignes FROM "public"."suivi_qualite_brg_garde_hebdo";

-- Volume source : public.suivi_qualite_sebou_jr
SELECT COUNT(*) AS volume_lignes FROM "public"."suivi_qualite_sebou_jr";

-- Volume source : public.types_mesures
SELECT COUNT(*) AS volume_lignes FROM "public"."types_mesures";
