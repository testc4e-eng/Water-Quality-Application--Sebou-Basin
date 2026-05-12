-- ATTENTION : SCRIPT PROPOSÉ, NON EXÉCUTÉ
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Toutes les commandes TRUNCATE sont commentées.
-- Préconditions : backup complet + exports CSV + validation Lot A.

-- Table : staging._legacy_qualite_riviere | volume : 60097 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."_legacy_qualite_riviere";
-- TRUNCATE TABLE "staging"."_legacy_qualite_riviere";

-- Table : staging.decharges | volume : 139 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."decharges";
-- TRUNCATE TABLE "staging"."decharges";

-- Table : staging.decharges_Abondonees | volume : 11 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."decharges_Abondonees";
-- TRUNCATE TABLE "staging"."decharges_Abondonees";

-- Table : staging.huileries | volume : 606 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."huileries";
-- TRUNCATE TABLE "staging"."huileries";

-- Table : staging.mesure_precipitation_old_model | volume : 507930 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesure_precipitation_old_model";
-- TRUNCATE TABLE "staging"."mesure_precipitation_old_model";

-- Table : staging.mesures_debit_jr | volume : 173251 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_debit_jr";
-- TRUNCATE TABLE "staging"."mesures_debit_jr";

-- Table : staging.mesures_debit_m | volume : 19316 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_debit_m";
-- TRUNCATE TABLE "staging"."mesures_debit_m";

-- Table : staging.mesures_debit_sources | volume : 2816 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_debit_sources";
-- TRUNCATE TABLE "staging"."mesures_debit_sources";

-- Table : staging.mesures_evaporation_jr | volume : 48900 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_evaporation_jr";
-- TRUNCATE TABLE "staging"."mesures_evaporation_jr";

-- Table : staging.mesures_niv_eau_barrages | volume : 85166 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_niv_eau_barrages";
-- TRUNCATE TABLE "staging"."mesures_niv_eau_barrages";

-- Table : staging.mesures_precip | volume : 669880 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_precip";
-- TRUNCATE TABLE "staging"."mesures_precip";

-- Table : staging.mesures_precipitations_jr_max | volume : 2085 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_precipitations_jr_max";
-- TRUNCATE TABLE "staging"."mesures_precipitations_jr_max";

-- Table : staging.mesures_precipitations_jr_traitees | volume : 546007 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_precipitations_jr_traitees";
-- TRUNCATE TABLE "staging"."mesures_precipitations_jr_traitees";

-- Table : staging.mesures_qualite_barrages | volume : 8714 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_qualite_barrages";
-- TRUNCATE TABLE "staging"."mesures_qualite_barrages";

-- Table : staging.mesures_qualite_nappes | volume : 63088 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mesures_qualite_nappes";
-- TRUNCATE TABLE "staging"."mesures_qualite_nappes";

-- Table : staging.mines | volume : 39 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."mines";
-- TRUNCATE TABLE "staging"."mines";

-- Table : staging.points_eau_abhs | volume : 46 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."points_eau_abhs";
-- TRUNCATE TABLE "staging"."points_eau_abhs";

-- Table : staging.profils_stations | volume : 1980 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."profils_stations";
-- TRUNCATE TABLE "staging"."profils_stations";

-- Table : staging.rejet_abattoir | volume : 56 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."rejet_abattoir";
-- TRUNCATE TABLE "staging"."rejet_abattoir";

-- Table : staging.rejets_brutes | volume : 277 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."rejets_brutes";
-- TRUNCATE TABLE "staging"."rejets_brutes";

-- Table : staging.sources_polution_mesure | volume : 141 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sources_polution_mesure";
-- TRUNCATE TABLE "staging"."sources_polution_mesure";

-- Table : staging.sous_bassin_swat_bas_sebou_new | volume : 29 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sous_bassin_swat_bas_sebou_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_bas_sebou_new";

-- Table : staging.sous_bassin_swat_bassin_cotier_new | volume : 23 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sous_bassin_swat_bassin_cotier_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_bassin_cotier_new";

-- Table : staging.sous_bassin_swat_beht_new | volume : 27 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sous_bassin_swat_beht_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_beht_new";

-- Table : staging.sous_bassin_swat_haut_sebou_new | volume : 22 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sous_bassin_swat_haut_sebou_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_haut_sebou_new";

-- Table : staging.sous_bassin_swat_leben_innaouen_new | volume : 18 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sous_bassin_swat_leben_innaouen_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_leben_innaouen_new";

-- Table : staging.sous_bassin_swat_moyen_sebou_new | volume : 16 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sous_bassin_swat_moyen_sebou_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_moyen_sebou_new";

-- Table : staging.sous_bassin_swat_ouergha_new | volume : 39 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."sous_bassin_swat_ouergha_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_ouergha_new";

-- Table : staging.step_ind_abhs | volume : 15 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."step_ind_abhs";
-- TRUNCATE TABLE "staging"."step_ind_abhs";

-- Table : staging.steps | volume : 49 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."steps";
-- TRUNCATE TABLE "staging"."steps";

-- Table : staging.steps_industrielles | volume : 14 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."steps_industrielles";
-- TRUNCATE TABLE "staging"."steps_industrielles";

-- Table : staging.stm_abhs | volume : 18 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."stm_abhs";
-- TRUNCATE TABLE "staging"."stm_abhs";

-- Table : staging.stms | volume : 19 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."stms";
-- TRUNCATE TABLE "staging"."stms";

-- Table : staging.suivi_qualite_brg_garde_hebdo | volume : 7094 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."suivi_qualite_brg_garde_hebdo";
-- TRUNCATE TABLE "staging"."suivi_qualite_brg_garde_hebdo";

-- Table : staging.suivi_qualite_sebou | volume : 51402 | validation : PENDING
-- SELECT COUNT(*) FROM "staging"."suivi_qualite_sebou";
-- TRUNCATE TABLE "staging"."suivi_qualite_sebou";
