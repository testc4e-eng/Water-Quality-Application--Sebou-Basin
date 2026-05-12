-- ATTENTION : SCRIPT PROPOSÉ, NON EXÉCUTÉ
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- AUCUN TRUNCATE ACTIF DANS CE FICHIER : toutes les commandes de vidage sont commentées.
-- Précondition obligatoire : backup complet + exports CSV + validation table par table.

-- RÈGLE D'ORDRE : vider d'abord les tables enfants dépendantes, puis les tables parentes si validées.
-- Si une dépendance FK bloque, ne pas utiliser CASCADE sans validation DBA/métier explicite.

-- ==================================================
-- Lot 0 - staging historique
-- ==================================================
-- Table : staging._legacy_qualite_riviere | volume : 60097 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."_legacy_qualite_riviere";
-- TRUNCATE TABLE "staging"."_legacy_qualite_riviere";

-- Table : staging.decharges | volume : 139 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."decharges";
-- TRUNCATE TABLE "staging"."decharges";

-- Table : staging.decharges_Abondonees | volume : 11 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."decharges_Abondonees";
-- TRUNCATE TABLE "staging"."decharges_Abondonees";

-- Table : staging.huileries | volume : 606 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."huileries";
-- TRUNCATE TABLE "staging"."huileries";

-- Table : staging.mesure_precipitation_old_model | volume : 507930 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesure_precipitation_old_model";
-- TRUNCATE TABLE "staging"."mesure_precipitation_old_model";

-- Table : staging.mesures_debit_jr | volume : 173251 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_debit_jr";
-- TRUNCATE TABLE "staging"."mesures_debit_jr";

-- Table : staging.mesures_debit_m | volume : 19316 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_debit_m";
-- TRUNCATE TABLE "staging"."mesures_debit_m";

-- Table : staging.mesures_debit_sources | volume : 2816 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_debit_sources";
-- TRUNCATE TABLE "staging"."mesures_debit_sources";

-- Table : staging.mesures_evaporation_jr | volume : 48900 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_evaporation_jr";
-- TRUNCATE TABLE "staging"."mesures_evaporation_jr";

-- Table : staging.mesures_niv_eau_barrages | volume : 85166 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_niv_eau_barrages";
-- TRUNCATE TABLE "staging"."mesures_niv_eau_barrages";

-- Table : staging.mesures_precip | volume : 669880 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_precip";
-- TRUNCATE TABLE "staging"."mesures_precip";

-- Table : staging.mesures_precipitations_jr_max | volume : 2085 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_precipitations_jr_max";
-- TRUNCATE TABLE "staging"."mesures_precipitations_jr_max";

-- Table : staging.mesures_precipitations_jr_traitees | volume : 546007 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_precipitations_jr_traitees";
-- TRUNCATE TABLE "staging"."mesures_precipitations_jr_traitees";

-- Table : staging.mesures_qualite_barrages | volume : 8714 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_qualite_barrages";
-- TRUNCATE TABLE "staging"."mesures_qualite_barrages";

-- Table : staging.mesures_qualite_nappes | volume : 63088 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mesures_qualite_nappes";
-- TRUNCATE TABLE "staging"."mesures_qualite_nappes";

-- Table : staging.mines | volume : 39 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."mines";
-- TRUNCATE TABLE "staging"."mines";

-- Table : staging.points_eau_abhs | volume : 46 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."points_eau_abhs";
-- TRUNCATE TABLE "staging"."points_eau_abhs";

-- Table : staging.profils_stations | volume : 1980 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."profils_stations";
-- TRUNCATE TABLE "staging"."profils_stations";

-- Table : staging.rejet_abattoir | volume : 56 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."rejet_abattoir";
-- TRUNCATE TABLE "staging"."rejet_abattoir";

-- Table : staging.rejets_brutes | volume : 277 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."rejets_brutes";
-- TRUNCATE TABLE "staging"."rejets_brutes";

-- Table : staging.sources_polution_mesure | volume : 141 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sources_polution_mesure";
-- TRUNCATE TABLE "staging"."sources_polution_mesure";

-- Table : staging.sous_bassin_swat_bas_sebou_new | volume : 29 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sous_bassin_swat_bas_sebou_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_bas_sebou_new";

-- Table : staging.sous_bassin_swat_bassin_cotier_new | volume : 23 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sous_bassin_swat_bassin_cotier_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_bassin_cotier_new";

-- Table : staging.sous_bassin_swat_beht_new | volume : 27 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sous_bassin_swat_beht_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_beht_new";

-- Table : staging.sous_bassin_swat_haut_sebou_new | volume : 22 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sous_bassin_swat_haut_sebou_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_haut_sebou_new";

-- Table : staging.sous_bassin_swat_leben_innaouen_new | volume : 18 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sous_bassin_swat_leben_innaouen_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_leben_innaouen_new";

-- Table : staging.sous_bassin_swat_moyen_sebou_new | volume : 16 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sous_bassin_swat_moyen_sebou_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_moyen_sebou_new";

-- Table : staging.sous_bassin_swat_ouergha_new | volume : 39 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."sous_bassin_swat_ouergha_new";
-- TRUNCATE TABLE "staging"."sous_bassin_swat_ouergha_new";

-- Table : staging.step_ind_abhs | volume : 15 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."step_ind_abhs";
-- TRUNCATE TABLE "staging"."step_ind_abhs";

-- Table : staging.steps | volume : 49 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."steps";
-- TRUNCATE TABLE "staging"."steps";

-- Table : staging.steps_industrielles | volume : 14 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."steps_industrielles";
-- TRUNCATE TABLE "staging"."steps_industrielles";

-- Table : staging.stm_abhs | volume : 18 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."stm_abhs";
-- TRUNCATE TABLE "staging"."stm_abhs";

-- Table : staging.stms | volume : 19 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."stms";
-- TRUNCATE TABLE "staging"."stms";

-- Table : staging.suivi_qualite_brg_garde_hebdo | volume : 7094 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."suivi_qualite_brg_garde_hebdo";
-- TRUNCATE TABLE "staging"."suivi_qualite_brg_garde_hebdo";

-- Table : staging.suivi_qualite_sebou | volume : 51402 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "staging"."suivi_qualite_sebou";
-- TRUNCATE TABLE "staging"."suivi_qualite_sebou";

-- ==================================================
-- Lot 1 - tables qualité
-- ==================================================
-- Table : qualite.source_pollution_prelevement | volume : 141 | validation : PENDING
-- Dépendances enfants applicatives : qualite.source_pollution_mesure_param (source_pollution_mesure_param_prelevement_id_fkey); qualite.source_pollution_prelevement_lien (source_pollution_prelevement_lien_prelevement_id_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."source_pollution_prelevement";
-- TRUNCATE TABLE "qualite"."source_pollution_prelevement";

-- Table : qualite.mesure_qualite_barrage | volume : 15808 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (mesure_qualite_barrage_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."mesure_qualite_barrage";
-- TRUNCATE TABLE "qualite"."mesure_qualite_barrage";

-- Table : qualite.mesure_qualite_nappe | volume : 63088 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (mesure_qualite_nappe_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."mesure_qualite_nappe";
-- TRUNCATE TABLE "qualite"."mesure_qualite_nappe";

-- Table : qualite.mesure_qualite_riviere | volume : 60097 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.referentiel_parametre (mesure_qualite_riviere_parametre_ref_id_fkey); infra.stations_mesure (mesure_qualite_riviere_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."mesure_qualite_riviere";
-- TRUNCATE TABLE "qualite"."mesure_qualite_riviere";

-- Table : qualite.mesure_qualite_sebou | volume : 51402 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.referentiel_parametre (mesure_qualite_sebou_parametre_ref_id_fkey); infra.stations_mesure (mesure_qualite_sebou_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."mesure_qualite_sebou";
-- TRUNCATE TABLE "qualite"."mesure_qualite_sebou";

-- Table : qualite.source_pollution_mesure_param | volume : 7191 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.referentiel_parametre (source_pollution_mesure_param_parametre_ref_id_fkey); qualite.source_pollution_prelevement (source_pollution_mesure_param_prelevement_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."source_pollution_mesure_param";
-- TRUNCATE TABLE "qualite"."source_pollution_mesure_param";

-- Table : qualite.source_pollution_prelevement_lien | volume : 116 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : qualite.source_pollution_prelevement (source_pollution_prelevement_lien_prelevement_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."source_pollution_prelevement_lien";
-- TRUNCATE TABLE "qualite"."source_pollution_prelevement_lien";

-- Table : qualite.suivi_qualite_barrage_garde_hebdo | volume : 7094 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (suivi_qualite_barrage_hebdo_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "qualite"."suivi_qualite_barrage_garde_hebdo";
-- TRUNCATE TABLE "qualite"."suivi_qualite_barrage_garde_hebdo";

-- ==================================================
-- Lot 2 - tables hydro
-- ==================================================
-- Table : hydro.barrage_bathymetrie | volume : 62359 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "hydro"."barrage_bathymetrie";
-- TRUNCATE TABLE "hydro"."barrage_bathymetrie";

-- Table : hydro.mesure_barrage | volume : 84831 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "hydro"."mesure_barrage";
-- TRUNCATE TABLE "hydro"."mesure_barrage";

-- Table : hydro.mesure_debit | volume : 521433 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (mesure_debit_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "hydro"."mesure_debit";
-- TRUNCATE TABLE "hydro"."mesure_debit";

-- Table : hydro.mesure_debit_mensuel | volume : 19316 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (mesure_debit_mensuel_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "hydro"."mesure_debit_mensuel";
-- TRUNCATE TABLE "hydro"."mesure_debit_mensuel";

-- Table : hydro.mesure_debit_source | volume : 2816 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.mapping_source (mesure_debit_source_source_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "hydro"."mesure_debit_source";
-- TRUNCATE TABLE "hydro"."mesure_debit_source";

-- Table : hydro.regle_qualite_debit_source | volume : 19 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.mapping_source (regle_qualite_debit_source_source_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "hydro"."regle_qualite_debit_source";
-- TRUNCATE TABLE "hydro"."regle_qualite_debit_source";

-- Table : hydro.regle_qualite_debit_station | volume : 390 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (regle_qualite_debit_station_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "hydro"."regle_qualite_debit_station";
-- TRUNCATE TABLE "hydro"."regle_qualite_debit_station";

-- ==================================================
-- Lot 3 - tables météo
-- ==================================================
-- Table : meteo.mesure_evaporation | volume : 48900 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (mesure_evaporation_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "meteo"."mesure_evaporation";
-- TRUNCATE TABLE "meteo"."mesure_evaporation";

-- Table : meteo.mesure_precipitation | volume : 546007 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (mesure_precipitation_traitee_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "meteo"."mesure_precipitation";
-- TRUNCATE TABLE "meteo"."mesure_precipitation";

-- Table : meteo.mesure_precipitation_annuelle_max | volume : 2085 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "meteo"."mesure_precipitation_annuelle_max";
-- TRUNCATE TABLE "meteo"."mesure_precipitation_annuelle_max";

-- Table : meteo.regle_qualite_evaporation_station | volume : 390 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.stations_mesure (regle_qualite_evaporation_station_station_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "meteo"."regle_qualite_evaporation_station";
-- TRUNCATE TABLE "meteo"."regle_qualite_evaporation_station";

-- ==================================================
-- Lot 4 - metadata instable
-- ==================================================
-- Table : metadata.referentiel_parametre | volume : 91 | validation : PENDING
-- Dépendances enfants applicatives : metadata.mapping_parametre_source (mapping_parametre_source_parametre_ref_id_fkey); qualite.mesure_qualite_riviere (mesure_qualite_riviere_parametre_ref_id_fkey); qualite.mesure_qualite_sebou (mesure_qualite_sebou_parametre_ref_id_fkey); qualite.source_pollution_mesure_param (source_pollution_mesure_param_parametre_ref_id_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."referentiel_parametre";
-- TRUNCATE TABLE "metadata"."referentiel_parametre";

-- Table : metadata.mapping_source | volume : 19 | validation : PENDING
-- Dépendances enfants applicatives : hydro.mesure_debit_source (mesure_debit_source_source_id_fkey); hydro.regle_qualite_debit_source (regle_qualite_debit_source_source_id_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_source";
-- TRUNCATE TABLE "metadata"."mapping_source";

-- Table : metadata.obs_referentiel_parametre | volume : 18 | validation : PENDING
-- Dépendances enfants applicatives : metadata.obs_parametre_coverage (obs_parametre_coverage_parametre_code_fkey); metadata.obs_parametre_entite_compat (obs_parametre_entite_compat_parametre_code_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."obs_referentiel_parametre";
-- TRUNCATE TABLE "metadata"."obs_referentiel_parametre";

-- Table : metadata.referentiel_abreviation_inventaire | volume : 13 | validation : PENDING
-- Dépendances enfants applicatives : metadata.mapping_abreviation_colonne_inventaire (mapping_abreviation_colonne_inventaire_abreviation_ref_id_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."referentiel_abreviation_inventaire";
-- TRUNCATE TABLE "metadata"."referentiel_abreviation_inventaire";

-- Table : metadata.mapping_abreviation_colonne_inventaire | volume : 13 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.referentiel_abreviation_inventaire (mapping_abreviation_colonne_inventaire_abreviation_ref_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_abreviation_colonne_inventaire";
-- TRUNCATE TABLE "metadata"."mapping_abreviation_colonne_inventaire";

-- Table : metadata.mapping_abreviation_unresolved_sources | volume : 5 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_abreviation_unresolved_sources";
-- TRUNCATE TABLE "metadata"."mapping_abreviation_unresolved_sources";

-- Table : metadata.mapping_barrage | volume : 11 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_barrage";
-- TRUNCATE TABLE "metadata"."mapping_barrage";

-- Table : metadata.mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo";
-- TRUNCATE TABLE "metadata"."mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo";

-- Table : metadata.mapping_nappe_unresolved_qualite_nappes | volume : 292 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_nappe_unresolved_qualite_nappes";
-- TRUNCATE TABLE "metadata"."mapping_nappe_unresolved_qualite_nappes";

-- Table : metadata.mapping_parametre_source | volume : 184 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.referentiel_parametre (mapping_parametre_source_parametre_ref_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_parametre_source";
-- TRUNCATE TABLE "metadata"."mapping_parametre_source";

-- Table : metadata.mapping_parametre_source_orphans_audit | volume : 5 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_parametre_source_orphans_audit";
-- TRUNCATE TABLE "metadata"."mapping_parametre_source_orphans_audit";

-- Table : metadata.mapping_parametre_unresolved_legacy_qualite_riviere | volume : 39 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_parametre_unresolved_legacy_qualite_riviere";
-- TRUNCATE TABLE "metadata"."mapping_parametre_unresolved_legacy_qualite_riviere";

-- Table : metadata.mapping_parametre_unresolved_suivi_qualite_sebou | volume : 7 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_parametre_unresolved_suivi_qualite_sebou";
-- TRUNCATE TABLE "metadata"."mapping_parametre_unresolved_suivi_qualite_sebou";

-- Table : metadata.mapping_point_eau | volume : 46 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_point_eau";
-- TRUNCATE TABLE "metadata"."mapping_point_eau";

-- Table : metadata.mapping_point_eau_unresolved_nappe | volume : 22 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_point_eau_unresolved_nappe";
-- TRUNCATE TABLE "metadata"."mapping_point_eau_unresolved_nappe";

-- Table : metadata.mapping_point_eau_unresolved_station | volume : 46 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_point_eau_unresolved_station";
-- TRUNCATE TABLE "metadata"."mapping_point_eau_unresolved_station";

-- Table : metadata.mapping_profil_station | volume : 1980 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_profil_station";
-- TRUNCATE TABLE "metadata"."mapping_profil_station";

-- Table : metadata.mapping_profil_unresolved_nappe | volume : 1204 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_profil_unresolved_nappe";
-- TRUNCATE TABLE "metadata"."mapping_profil_unresolved_nappe";

-- Table : metadata.mapping_profil_unresolved_station | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_profil_unresolved_station";
-- TRUNCATE TABLE "metadata"."mapping_profil_unresolved_station";

-- Table : metadata.mapping_station | volume : 390 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_station";
-- TRUNCATE TABLE "metadata"."mapping_station";

-- Table : metadata.mapping_station_unresolved_precip_ann_max | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_station_unresolved_precip_ann_max";
-- TRUNCATE TABLE "metadata"."mapping_station_unresolved_precip_ann_max";

-- Table : metadata.mapping_station_unresolved_qualite_barrages | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_station_unresolved_qualite_barrages";
-- TRUNCATE TABLE "metadata"."mapping_station_unresolved_qualite_barrages";

-- Table : metadata.mapping_station_unresolved_qualite_nappes | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_station_unresolved_qualite_nappes";
-- TRUNCATE TABLE "metadata"."mapping_station_unresolved_qualite_nappes";

-- Table : metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo";
-- TRUNCATE TABLE "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo";

-- Table : metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i | volume : 1 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i";
-- TRUNCATE TABLE "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i";

-- Table : metadata.mapping_step_ind | volume : 15 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_step_ind";
-- TRUNCATE TABLE "metadata"."mapping_step_ind";

-- Table : metadata.mapping_step_ind_unresolved_commune | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_step_ind_unresolved_commune";
-- TRUNCATE TABLE "metadata"."mapping_step_ind_unresolved_commune";

-- Table : metadata.mapping_stm | volume : 18 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_stm";
-- TRUNCATE TABLE "metadata"."mapping_stm";

-- Table : metadata.mapping_stm_unresolved_commune | volume : 0 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."mapping_stm_unresolved_commune";
-- TRUNCATE TABLE "metadata"."mapping_stm_unresolved_commune";

-- Table : metadata.obs_parametre_coverage | volume : 16 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.obs_referentiel_parametre (obs_parametre_coverage_parametre_code_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."obs_parametre_coverage";
-- TRUNCATE TABLE "metadata"."obs_parametre_coverage";

-- Table : metadata.obs_parametre_entite_compat | volume : 18 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : metadata.obs_referentiel_parametre (obs_parametre_entite_compat_parametre_code_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "metadata"."obs_parametre_entite_compat";
-- TRUNCATE TABLE "metadata"."obs_parametre_entite_compat";

-- ==================================================
-- Lot 5 - pollution et référentiels instables
-- ==================================================
-- Table : infra.decharge | volume : 233 | validation : PENDING
-- Dépendances enfants applicatives : infra.decharge_inventaire_pollution (decharge_inventaire_pollution_decharge_id_fkey); infra.decharge_inventaire_pollution_general (decharge_inventaire_pollution_general_decharge_id_fkey)
-- Dépendances parents applicatives : admin.communes (fk_decharges_jr_station)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."decharge";
-- TRUNCATE TABLE "infra"."decharge";

-- Table : infra.huilerie | volume : 612 | validation : PENDING
-- Dépendances enfants applicatives : infra.huilerie_inventaire_pollution (huilerie_inventaire_pollution_huilerie_id_fkey)
-- Dépendances parents applicatives : admin.communes (fk_huileries_commune)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."huilerie";
-- TRUNCATE TABLE "infra"."huilerie";

-- Table : infra.mine | volume : 42 | validation : PENDING
-- Dépendances enfants applicatives : infra.mine_inventaire_pollution (mine_inventaire_pollution_mine_id_fkey)
-- Dépendances parents applicatives : admin.communes (fk_mines_commune)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."mine";
-- TRUNCATE TABLE "infra"."mine";

-- Table : infra.rejet_abattoir | volume : 61 | validation : PENDING
-- Dépendances enfants applicatives : infra.rejet_abattoir_inventaire_pollution (rejet_abattoir_inventaire_pollution_rejet_abattoir_id_fkey)
-- Dépendances parents applicatives : admin.communes (fk_rejets_abattoirs_commune)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."rejet_abattoir";
-- TRUNCATE TABLE "infra"."rejet_abattoir";

-- Table : infra.rejet_domestique | volume : 362 | validation : PENDING
-- Dépendances enfants applicatives : infra.rejet_inventaire_pollution (rejet_inventaire_pollution_rejet_domestique_id_fkey)
-- Dépendances parents applicatives : admin.communes (fk_rejets_domestiques_commune)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."rejet_domestique";
-- TRUNCATE TABLE "infra"."rejet_domestique";

-- Table : infra.step | volume : 41 | validation : PENDING
-- Dépendances enfants applicatives : infra.step_inventaire_pollution (step_inventaire_pollution_step_id_fkey)
-- Dépendances parents applicatives : admin.communes (fk_step_commune)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."step";
-- TRUNCATE TABLE "infra"."step";

-- Table : infra.decharge_inventaire_pollution | volume : 11 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.decharge (decharge_inventaire_pollution_decharge_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."decharge_inventaire_pollution";
-- TRUNCATE TABLE "infra"."decharge_inventaire_pollution";

-- Table : infra.decharge_inventaire_pollution_general | volume : 139 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.decharge (decharge_inventaire_pollution_general_decharge_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."decharge_inventaire_pollution_general";
-- TRUNCATE TABLE "infra"."decharge_inventaire_pollution_general";

-- Table : infra.huilerie_inventaire_pollution | volume : 606 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.huilerie (huilerie_inventaire_pollution_huilerie_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."huilerie_inventaire_pollution";
-- TRUNCATE TABLE "infra"."huilerie_inventaire_pollution";

-- Table : infra.mine_inventaire_pollution | volume : 39 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.mine (mine_inventaire_pollution_mine_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."mine_inventaire_pollution";
-- TRUNCATE TABLE "infra"."mine_inventaire_pollution";

-- Table : infra.rejet_abattoir_inventaire_pollution | volume : 56 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.rejet_abattoir (rejet_abattoir_inventaire_pollution_rejet_abattoir_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."rejet_abattoir_inventaire_pollution";
-- TRUNCATE TABLE "infra"."rejet_abattoir_inventaire_pollution";

-- Table : infra.rejet_industriel | volume : 11 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : admin.communes (fk_rejets_ind_commune)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."rejet_industriel";
-- TRUNCATE TABLE "infra"."rejet_industriel";

-- Table : infra.rejet_inventaire_pollution | volume : 277 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.rejet_domestique (rejet_inventaire_pollution_rejet_domestique_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."rejet_inventaire_pollution";
-- TRUNCATE TABLE "infra"."rejet_inventaire_pollution";

-- Table : infra.step_industrielle | volume : 15 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."step_industrielle";
-- TRUNCATE TABLE "infra"."step_industrielle";

-- Table : infra.step_inventaire_pollution | volume : 49 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : infra.step (step_inventaire_pollution_step_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "infra"."step_inventaire_pollution";
-- TRUNCATE TABLE "infra"."step_inventaire_pollution";

-- ==================================================
-- Lot 6 - modèles SWAT/WASP
-- ==================================================
-- Table : swat_output.ref_bassin | volume : 1 | validation : PENDING
-- Dépendances enfants applicatives : swat_output.ref_run_modele (ref_run_modele_bassin_code_fkey); swat_output.ref_subbasin (ref_subbasin_bassin_code_fkey); wasp_output.ref_run_modele (fk_wasp_bassin_code)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."ref_bassin";
-- TRUNCATE TABLE "swat_output"."ref_bassin";

-- Table : swat_output.ref_scenario | volume : 1 | validation : PENDING
-- Dépendances enfants applicatives : swat_output.ref_run_modele (ref_run_modele_scenario_code_fkey); wasp_output.ref_run_modele (fk_wasp_scenario_code)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."ref_scenario";
-- TRUNCATE TABLE "swat_output"."ref_scenario";

-- Table : swat_sebou.swat_scenarios | volume : 1 | validation : PENDING
-- Dépendances enfants applicatives : swat_sebou.swat_reach_results (swat_reach_results_scenario_id_fkey); swat_sebou.swat_subbasin_results (swat_subbasin_results_scenario_id_fkey)
-- Dépendances parents applicatives : swat_sebou.swat_models (swat_scenarios_model_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_sebou"."swat_scenarios";
-- TRUNCATE TABLE "swat_sebou"."swat_scenarios";

-- Table : swat_output.ref_parametre_qualite | volume : 5 | validation : PENDING
-- Dépendances enfants applicatives : swat_output.mesure_qualite_subbasin_ts (mesure_qualite_subbasin_ts_param_code_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."ref_parametre_qualite";
-- TRUNCATE TABLE "swat_output"."ref_parametre_qualite";

-- Table : swat_output.ref_run_modele | volume : 1 | validation : PENDING
-- Dépendances enfants applicatives : swat_output.mesure_qualite_subbasin_ts (mesure_qualite_subbasin_ts_run_id_fkey)
-- Dépendances parents applicatives : swat_output.ref_bassin (ref_run_modele_bassin_code_fkey); swat_output.ref_scenario (ref_run_modele_scenario_code_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."ref_run_modele";
-- TRUNCATE TABLE "swat_output"."ref_run_modele";

-- Table : swat_output.ref_subbasin | volume : 18 | validation : PENDING
-- Dépendances enfants applicatives : swat_output.mesure_qualite_subbasin_ts (mesure_qualite_subbasin_ts_subbasin_uid_fkey)
-- Dépendances parents applicatives : swat_output.ref_bassin (ref_subbasin_bassin_code_fkey); geo.sous_bassin_swat_leben_innaouen (ref_subbasin_geo_sous_bassin_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."ref_subbasin";
-- TRUNCATE TABLE "swat_output"."ref_subbasin";

-- Table : wasp_output.ref_parametre_qualite | volume : 12 | validation : PENDING
-- Dépendances enfants applicatives : wasp_output.mesure_qualite_segment_ts (mesure_qualite_segment_ts_code_parametre_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_output"."ref_parametre_qualite";
-- TRUNCATE TABLE "wasp_output"."ref_parametre_qualite";

-- Table : wasp_output.ref_run_modele | volume : 1 | validation : PENDING
-- Dépendances enfants applicatives : wasp_output.mesure_qualite_segment_ts (mesure_qualite_segment_ts_run_id_fkey)
-- Dépendances parents applicatives : swat_output.ref_bassin (fk_wasp_bassin_code); swat_output.ref_scenario (fk_wasp_scenario_code)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_output"."ref_run_modele";
-- TRUNCATE TABLE "wasp_output"."ref_run_modele";

-- Table : wasp_output.ref_segment_modele | volume : 22 | validation : PENDING
-- Dépendances enfants applicatives : wasp_output.mesure_qualite_segment_ts (fk_wasp_mesure_segment)
-- Dépendances parents applicatives : geo.reseau_hydrographique (fk_wasp_segment_reseau)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_output"."ref_segment_modele";
-- TRUNCATE TABLE "wasp_output"."ref_segment_modele";

-- Table : wasp_sebou.wasp_scenarios | volume : 1 | validation : PENDING
-- Dépendances enfants applicatives : wasp_sebou.wasp_results (wasp_results_scenario_id_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_sebou"."wasp_scenarios";
-- TRUNCATE TABLE "wasp_sebou"."wasp_scenarios";

-- Table : wasp_sebou.wasp_variables | volume : 12 | validation : PENDING
-- Dépendances enfants applicatives : wasp_sebou.wasp_results (wasp_results_variable_id_fkey)
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_sebou"."wasp_variables";
-- TRUNCATE TABLE "wasp_sebou"."wasp_variables";

-- Table : swat_output.mesure_qualite_subbasin_ts | volume : 745110 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : swat_output.ref_parametre_qualite (mesure_qualite_subbasin_ts_param_code_fkey); swat_output.ref_run_modele (mesure_qualite_subbasin_ts_run_id_fkey); swat_output.ref_subbasin (mesure_qualite_subbasin_ts_subbasin_uid_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."mesure_qualite_subbasin_ts";
-- TRUNCATE TABLE "swat_output"."mesure_qualite_subbasin_ts";

-- Table : swat_output.stg_swat_qualite_long | volume : 745110 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."stg_swat_qualite_long";
-- TRUNCATE TABLE "swat_output"."stg_swat_qualite_long";

-- Table : swat_output.stg_swat_qualite_meta | volume : 123 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "swat_output"."stg_swat_qualite_meta";
-- TRUNCATE TABLE "swat_output"."stg_swat_qualite_meta";

-- Table : wasp_output.mesure_qualite_segment_ts | volume : 931770 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : wasp_output.ref_segment_modele (fk_wasp_mesure_segment); wasp_output.ref_parametre_qualite (mesure_qualite_segment_ts_code_parametre_fkey); wasp_output.ref_run_modele (mesure_qualite_segment_ts_run_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_output"."mesure_qualite_segment_ts";
-- TRUNCATE TABLE "wasp_output"."mesure_qualite_segment_ts";

-- Table : wasp_output.stg_wasp_qualite_long | volume : 931770 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : aucune dépendance parent applicative extraite
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_output"."stg_wasp_qualite_long";
-- TRUNCATE TABLE "wasp_output"."stg_wasp_qualite_long";

-- Table : wasp_sebou.wasp_results | volume : 931770 | validation : PENDING
-- Dépendances enfants applicatives : aucune dépendance enfant applicative extraite
-- Dépendances parents applicatives : wasp_sebou.wasp_scenarios (wasp_results_scenario_id_fkey); wasp_sebou.wasp_variables (wasp_results_variable_id_fkey)
-- Contrôle avant vidage : SELECT COUNT(*) FROM "wasp_sebou"."wasp_results";
-- TRUNCATE TABLE "wasp_sebou"."wasp_results";
