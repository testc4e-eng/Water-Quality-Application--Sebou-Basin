-- SQL FINAL CORRIGE - VALIDATION REQUISE
-- NON EXECUTE DURABLEMENT
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE
-- SECURITE : transaction avec ROLLBACK actif par defaut.

BEGIN;
CREATE SCHEMA IF NOT EXISTS api;

-- PROPOSITION NON EXECUTEE
-- Vues SQL metier specialisees - revue technique.
-- Ne pas executer sans validation explicite.
-- Aucune modification de donnees. CREATE OR REPLACE VIEW propose uniquement.

-- =========================================================
-- METEO
-- =========================================================

CREATE OR REPLACE VIEW api.v_meteo_temperature AS
SELECT
  'meteo.mesure_temperature'::text AS source_table,
  'station_meteo'::text AS support_type,
  station_id::text AS support_id,
  NULL::text AS support_nom,
  temps AS date_mesure,
  NULL::uuid AS parametre_ref_id,
  v.code_parametre,
  v.code_parametre AS libelle_parametre,
  '°C'::text AS unite_reference,
  v.valeur_num::double precision AS valeur_num,
  v.valeur_num::text AS valeur_raw,
  CASE WHEN v.valeur_num IS NULL THEN 'QA_NULL_VALUE' ELSE 'QA_OK' END AS qa_status,
  'GEO_LINKED_BY_ID'::text AS geo_status,
  NULL::text AS source_row_id,
  NULL::geometry AS geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM meteo.mesure_temperature t
CROSS JOIN LATERAL (
  VALUES ('TEMP_MIN'::text, t.val_min), ('TEMP_MAX'::text, t.val_max), ('TEMP_MOY'::text, t.val_moy)
) v(code_parametre, valeur_num);

CREATE OR REPLACE VIEW api.v_meteo_precipitation AS
SELECT
  'meteo.mesure_precipitation'::text AS source_table,
  'station_meteo'::text AS support_type,
  station_id::text AS support_id,
  NULL::text AS support_nom,
  temps AS date_mesure,
  NULL::uuid AS parametre_ref_id,
  'PRECIP'::text AS code_parametre,
  'Precipitation'::text AS libelle_parametre,
  'mm'::text AS unite_reference,
  COALESCE(val_observees, val_remplies, val_power_nasa)::double precision AS valeur_num,
  concat_ws('|', 'obs=' || val_observees::text, 'remplie=' || val_remplies::text, 'nasa=' || val_power_nasa::text) AS valeur_raw,
  CASE
    WHEN qa_flag_negative THEN 'QA_NEGATIVE'
    WHEN qa_flag_null_filled THEN 'QA_NULL_FILLED'
    WHEN qa_flag_fill_inconsistency THEN 'QA_FILL_INCONSISTENCY'
    WHEN qa_flag_source_nasa_only THEN 'QA_NASA_ONLY'
    WHEN qa_flag_method_missing THEN 'QA_METHOD_MISSING'
    ELSE 'QA_OK'
  END AS qa_status,
  'GEO_LINKED_BY_ID'::text AS geo_status,
  ire_precipitation::text AS source_row_id,
  NULL::geometry AS geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM meteo.mesure_precipitation;

CREATE OR REPLACE VIEW api.v_meteo_evaporation AS
SELECT
  'meteo.mesure_evaporation'::text AS source_table,
  'station_meteo'::text AS support_type,
  station_id::text AS support_id,
  NULL::text AS support_nom,
  temps AS date_mesure,
  NULL::uuid AS parametre_ref_id,
  'EVAPO'::text AS code_parametre,
  'Evaporation'::text AS libelle_parametre,
  'mm'::text AS unite_reference,
  valeur::double precision AS valeur_num,
  valeur::text AS valeur_raw,
  CASE
    WHEN qa_flag_null_value THEN 'QA_NULL_VALUE'
    WHEN qa_flag_negative THEN 'QA_NEGATIVE'
    WHEN qa_flag_outlier THEN 'QA_OUTLIER'
    WHEN qa_flag_method_missing THEN 'QA_METHOD_MISSING'
    ELSE 'QA_OK'
  END AS qa_status,
  'GEO_LINKED_BY_ID'::text AS geo_status,
  NULL::text AS source_row_id,
  NULL::geometry AS geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM meteo.mesure_evaporation;

-- =========================================================
-- HYDRO / BARRAGE
-- =========================================================

CREATE OR REPLACE VIEW api.v_barrage_parametres AS
SELECT
  source_table,
  'barrage'::text AS support_type,
  barrage_id::text AS support_id,
  NULL::text AS support_nom,
  temps AS date_mesure,
  parametre_ref_id,
  parametre_code AS code_parametre,
  parametre_code AS libelle_parametre,
  unite AS unite_reference,
  valeur::double precision AS valeur_num,
  valeur::text AS valeur_raw,
  'QA_OK'::text AS qa_status,
  'GEO_LINKED_BY_ID'::text AS geo_status,
  source_row_id::text AS source_row_id,
  NULL::geometry AS geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM hydro.mesure_barrage_param
WHERE parametre_code IN ('NIVEAU_EAU','VOLUME','LACHER','APPORT','TRANSFERT');

-- =========================================================
-- QUALITE : base technique commune proposee
-- Vue support non ciblee par table_cible, utile pour maintenir les vues specialisees.
-- Exclusion stricte FM / F_M_MES.
-- =========================================================

CREATE OR REPLACE VIEW api.v_qualite_base_multi_support AS
WITH q AS (
  SELECT 'qualite.mesure_qualite_riviere'::text source_table, 'riviere'::text support_type, station_id::text support_id, temps, parametre_ref_id, parametre_qualite, valeur, NULL::text observation, source_row_id::text source_row_id, qa_flag_null_value, qa_flag_negative, qa_flag_param_missing, qa_flag_station_unmapped FROM qualite.mesure_qualite_riviere WHERE parametre_qualite NOT IN ('FM','F_M_MES')
  UNION ALL
  SELECT 'qualite.mesure_qualite_nappe', 'nappe', station_id::text, temps, parametre_ref_id, parametre_qualite, valeur, NULL::text, source_row_id::text, qa_flag_null_value, qa_flag_negative, qa_flag_param_missing, qa_flag_station_unmapped FROM qualite.mesure_qualite_nappe WHERE parametre_qualite NOT IN ('FM','F_M_MES')
  UNION ALL
  SELECT 'qualite.mesure_qualite_barrage', 'barrage', station_id::text, temps, NULL::uuid, parametre_qualite, valeur, NULL::text, source_row_id::text, qa_flag_null_value, qa_flag_negative, qa_flag_param_missing, qa_flag_station_unmapped FROM qualite.mesure_qualite_barrage WHERE parametre_qualite NOT IN ('FM','F_M_MES')
  UNION ALL
  SELECT 'qualite.mesure_qualite_sebou', 'sebou', station_id::text, temps, parametre_ref_id, parametre_qualite, valeur, observation, source_row_id::text, qa_flag_null_value, qa_flag_negative, qa_flag_param_missing, qa_flag_station_unmapped FROM qualite.mesure_qualite_sebou WHERE parametre_qualite NOT IN ('FM','F_M_MES')
  UNION ALL
  SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', 'barrage', station_id::text, temps, parametre_ref_id, parametre_qualite, valeur, observation, source_row_id::text, qa_flag_null_value, qa_flag_negative, qa_flag_param_missing, qa_flag_station_unmapped FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_qualite NOT IN ('FM','F_M_MES')
)
SELECT
  q.source_table,
  q.support_type,
  q.support_id,
  NULL::text AS support_nom,
  q.temps AS date_mesure,
  COALESCE(q.parametre_ref_id, c.parametre_ref_id) AS parametre_ref_id,
  COALESCE(c.code_parametre, q.parametre_qualite) AS code_parametre,
  COALESCE(c.nom_parametre, q.parametre_qualite) AS libelle_parametre,
  c.unite_reference,
  q.valeur::double precision AS valeur_num,
  COALESCE(q.observation, q.valeur::text) AS valeur_raw,
  CASE
    WHEN q.qa_flag_null_value THEN 'QA_NULL_VALUE'
    WHEN q.qa_flag_negative THEN 'QA_NEGATIVE'
    WHEN q.qa_flag_param_missing THEN 'QA_PARAM_UNMAPPED'
    WHEN q.qa_flag_station_unmapped THEN 'QA_GEO_UNMAPPED'
    ELSE 'QA_OK'
  END AS qa_status,
  CASE WHEN q.qa_flag_station_unmapped THEN 'GEO_UNRESOLVED' ELSE 'GEO_LINKED_BY_ID' END AS geo_status,
  q.source_row_id,
  NULL::geometry AS geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM q
LEFT JOIN metadata.referentiel_parametre_canonique c
  ON c.parametre_ref_id = q.parametre_ref_id
  OR (q.parametre_ref_id IS NULL AND c.code_parametre = q.parametre_qualite);

CREATE OR REPLACE VIEW api.v_qualite_physicochimie AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('PH','EH');

CREATE OR REPLACE VIEW api.v_qualite_chimie_minerale AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('CA','MG','NA','K','CL','SO4','CO3','HCT','OH','S','S2','TA','TAC','TH');

CREATE OR REPLACE VIEW api.v_qualite_metaux AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('AG','AL','AS','BA','BE','CD','CO','CU','FE','FE2','FET','LI','MN','Mo','NI','PB','SB','SE','SN','SR','TL','V','ZN');

CREATE OR REPLACE VIEW api.v_qualite_pollution_organique AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('DCO','DETERGENT','MES','MO','PHENOL');

CREATE OR REPLACE VIEW api.v_qualite_microbiologie AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('CF','CT','SF');

CREATE OR REPLACE VIEW api.v_qualite_biologique AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('CHLA','PHEOPIGMENT','IBD','IBGN');

CREATE OR REPLACE VIEW api.v_qualite_terrain AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('T_AIR','T_EAU')
   OR (code_parametre = 'DISQUE_SECCHI' AND support_type = 'riviere');

CREATE OR REPLACE VIEW api.v_qualite_contexte_station AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre IN ('LARGEUR','PROFONDEUR');

CREATE OR REPLACE VIEW api.v_qualite_organoleptique AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre = 'COULEUR';

CREATE OR REPLACE VIEW api.v_barrage_qualite AS
SELECT * FROM api.v_qualite_base_multi_support
WHERE code_parametre = 'DISQUE_SECCHI'
  AND support_type = 'barrage';

-- =========================================================
-- POLLUTION / IDP
-- =========================================================

CREATE OR REPLACE VIEW api.v_pollution_constat_prealable AS
SELECT
  'qualite.source_pollution_prelevement'::text AS source_table,
  'point_pollution'::text AS support_type,
  id::text AS support_id,
  point_prelevement AS support_nom,
  date_prelevement::timestamptz AS date_mesure,
  NULL::uuid AS parametre_ref_id,
  'CONSTAT_PREALABLE'::text AS code_parametre,
  'Constat prealable pollution'::text AS libelle_parametre,
  NULL::text AS unite_reference,
  NULL::double precision AS valeur_num,
  concat_ws(' | ', nature, observation, observation_2, debit_raw) AS valeur_raw,
  CASE WHEN qa_flag_missing_geom THEN 'QA_GEO_MISSING' WHEN qa_flag_missing_commune THEN 'QA_COMMUNE_MISSING' ELSE 'QA_OK' END AS qa_status,
  CASE WHEN geom IS NOT NULL THEN 'GEO_GEOMETRY_PRESENT' ELSE 'GEO_UNRESOLVED' END AS geo_status,
  source_row_id::text AS source_row_id,
  geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM qualite.source_pollution_prelevement;

CREATE OR REPLACE VIEW api.v_pollution_analyses_finales AS
SELECT
  'qualite.source_pollution_mesure_param'::text AS source_table,
  'point_pollution'::text AS support_type,
  p.id::text AS support_id,
  p.point_prelevement AS support_nom,
  p.date_prelevement::timestamptz AS date_mesure,
  m.parametre_ref_id,
  COALESCE(c.code_parametre, m.param_code_legacy) AS code_parametre,
  COALESCE(c.nom_parametre, m.param_code_legacy) AS libelle_parametre,
  c.unite_reference,
  m.valeur_num::double precision AS valeur_num,
  m.valeur_raw,
  CASE
    WHEN m.qa_flag_value_missing THEN 'QA_NULL_VALUE'
    WHEN m.qa_flag_value_non_numeric THEN 'QA_NON_NUMERIC'
    WHEN m.qa_flag_param_unmapped THEN 'QA_PARAM_UNMAPPED'
    ELSE 'QA_OK'
  END AS qa_status,
  CASE WHEN p.geom IS NOT NULL THEN 'GEO_GEOMETRY_PRESENT' ELSE 'GEO_UNRESOLVED' END AS geo_status,
  m.id::text AS source_row_id,
  p.geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM qualite.source_pollution_mesure_param m
JOIN qualite.source_pollution_prelevement p ON p.id = m.prelevement_id
LEFT JOIN metadata.referentiel_parametre_canonique c ON c.parametre_ref_id = m.parametre_ref_id;

CREATE OR REPLACE VIEW api.v_idp_points AS
SELECT
  'qualite.source_pollution_prelevement'::text AS source_table,
  'point_pollution'::text AS support_type,
  id::text AS support_id,
  point_prelevement AS support_nom,
  date_prelevement::timestamptz AS date_mesure,
  NULL::uuid AS parametre_ref_id,
  'IDP_POINT'::text AS code_parametre,
  'Point IDP'::text AS libelle_parametre,
  NULL::text AS unite_reference,
  NULL::double precision AS valeur_num,
  concat_ws(' | ', commune, province, nature, observation) AS valeur_raw,
  CASE WHEN qa_flag_missing_geom THEN 'QA_GEO_MISSING' WHEN qa_flag_missing_commune THEN 'QA_COMMUNE_MISSING' ELSE 'QA_OK' END AS qa_status,
  CASE WHEN geom IS NOT NULL THEN 'GEO_GEOMETRY_PRESENT' ELSE 'GEO_UNRESOLVED' END AS geo_status,
  source_row_id::text AS source_row_id,
  geom,
  NULL::text AS campagne_id,
  NULL::text AS ingestion_batch_id
FROM qualite.source_pollution_prelevement;

CREATE OR REPLACE VIEW api.v_idp_points_non_resolus AS
SELECT *
FROM api.v_idp_points
WHERE geo_status = 'GEO_UNRESOLVED';

-- FIN PROPOSITION NON EXECUTEE


ROLLBACK;
-- COMMIT;
