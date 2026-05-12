-- Audit read-only - migration par table
-- Aucun ordre d’écriture. Aucun DELETE. Aucun INSERT. Aucun UPDATE.

-- Table : hydro.barrage_bathymetrie
SELECT COUNT(*) AS volume_source FROM "hydro"."barrage_bathymetrie";

-- Table : hydro.mesure_barrage
SELECT COUNT(*) AS volume_source FROM "hydro"."mesure_barrage";

-- Table : hydro.mesure_debit
SELECT COUNT(*) AS volume_source FROM "hydro"."mesure_debit";

-- Table : hydro.mesure_debit_mensuel
SELECT COUNT(*) AS volume_source FROM "hydro"."mesure_debit_mensuel";

-- Table : hydro.mesure_debit_source
SELECT COUNT(*) AS volume_source FROM "hydro"."mesure_debit_source";

-- Table : hydro.regle_qualite_debit_source
SELECT COUNT(*) AS volume_source FROM "hydro"."regle_qualite_debit_source";

-- Table : hydro.regle_qualite_debit_station
SELECT COUNT(*) AS volume_source FROM "hydro"."regle_qualite_debit_station";

-- Table : meteo.mesure_evaporation
SELECT COUNT(*) AS volume_source FROM "meteo"."mesure_evaporation";

-- Table : meteo.mesure_precipitation
SELECT COUNT(*) AS volume_source FROM "meteo"."mesure_precipitation";

-- Table : meteo.mesure_precipitation_annuelle_max
SELECT COUNT(*) AS volume_source FROM "meteo"."mesure_precipitation_annuelle_max";

-- Table : meteo.mesure_temperature
SELECT COUNT(*) AS volume_source FROM "meteo"."mesure_temperature";

-- Table : meteo.regle_qualite_evaporation_station
SELECT COUNT(*) AS volume_source FROM "meteo"."regle_qualite_evaporation_station";

-- Table : qualite.mesure_qualite_barrage
SELECT COUNT(*) AS volume_source FROM "qualite"."mesure_qualite_barrage";

-- Table : qualite.mesure_qualite_nappe
SELECT COUNT(*) AS volume_source FROM "qualite"."mesure_qualite_nappe";

-- Table : qualite.mesure_qualite_riviere
SELECT COUNT(*) AS volume_source FROM "qualite"."mesure_qualite_riviere";

-- Table : qualite.mesure_qualite_sebou
SELECT COUNT(*) AS volume_source FROM "qualite"."mesure_qualite_sebou";

-- Table : qualite.source_pollution_mesure_param
SELECT COUNT(*) AS volume_source FROM "qualite"."source_pollution_mesure_param";

-- Table : qualite.suivi_qualite_barrage_garde_hebdo
SELECT COUNT(*) AS volume_source FROM "qualite"."suivi_qualite_barrage_garde_hebdo";

-- Table : staging._legacy_qualite_riviere
SELECT COUNT(*) AS volume_source FROM "staging"."_legacy_qualite_riviere";

-- Table : staging.mesure_precipitation_old_model
SELECT COUNT(*) AS volume_source FROM "staging"."mesure_precipitation_old_model";

-- Table : staging.mesures_debit_jr
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_debit_jr";

-- Table : staging.mesures_debit_m
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_debit_m";

-- Table : staging.mesures_debit_sources
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_debit_sources";

-- Table : staging.mesures_evaporation_jr
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_evaporation_jr";

-- Table : staging.mesures_niv_eau_barrages
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_niv_eau_barrages";

-- Table : staging.mesures_precip
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_precip";

-- Table : staging.mesures_precipitations_jr_max
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_precipitations_jr_max";

-- Table : staging.mesures_precipitations_jr_traitees
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_precipitations_jr_traitees";

-- Table : staging.mesures_qualite_barrages
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_qualite_barrages";

-- Table : staging.mesures_qualite_nappes
SELECT COUNT(*) AS volume_source FROM "staging"."mesures_qualite_nappes";

-- Table : staging.sources_polution_mesure
SELECT COUNT(*) AS volume_source FROM "staging"."sources_polution_mesure";

-- Table : staging.suivi_qualite_brg_garde_hebdo
SELECT COUNT(*) AS volume_source FROM "staging"."suivi_qualite_brg_garde_hebdo";

-- Table : staging.suivi_qualite_sebou
SELECT COUNT(*) AS volume_source FROM "staging"."suivi_qualite_sebou";
