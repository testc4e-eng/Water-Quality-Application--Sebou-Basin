-- PROPOSITIONS NON EXECUTEES
-- Objectif : vues minimales d'exposition post-migration pour API/frontend.
-- Ne pas executer sans revue schema/API.

-- ============================================================
-- QUALITE
-- ============================================================

CREATE OR REPLACE VIEW api.v_qualite_dashboard AS
SELECT
    'riviere' AS support_type,
    q.station_id,
    q.ire_station,
    NULL::uuid AS barrage_id,
    NULL::integer AS nappe_id,
    q.temps,
    q.parametre_qualite,
    rp.code_canonique AS code_parametre,
    rp.libelle AS nom_parametre,
    rp.unite,
    q.valeur,
    q.est_valide,
    q.qa_flag_null_value,
    q.qa_flag_negative,
    q.source_system
FROM qualite.mesure_qualite_riviere q
LEFT JOIN metadata.referentiel_parametre rp ON rp.id = q.parametre_ref_id
UNION ALL
SELECT
    'nappe',
    q.station_id,
    q.ire_station,
    NULL::uuid,
    q.nappe_id,
    q.temps,
    q.parametre_qualite,
    rp.code_canonique,
    rp.libelle,
    rp.unite,
    q.valeur,
    q.est_valide,
    q.qa_flag_null_value,
    q.qa_flag_negative,
    q.source_system
FROM qualite.mesure_qualite_nappe q
LEFT JOIN metadata.referentiel_parametre rp ON rp.id = q.parametre_ref_id
UNION ALL
SELECT
    'sebou',
    q.station_id,
    q.ire_station,
    NULL::uuid,
    NULL::integer,
    q.temps,
    q.parametre_qualite,
    rp.code_canonique,
    rp.libelle,
    rp.unite,
    q.valeur,
    q.est_valide,
    q.qa_flag_null_value,
    q.qa_flag_negative,
    q.source_system
FROM qualite.mesure_qualite_sebou q
LEFT JOIN metadata.referentiel_parametre rp ON rp.id = q.parametre_ref_id
UNION ALL
SELECT
    'barrage_garde',
    q.station_id,
    q.ire_station,
    q.barrage_id,
    NULL::integer,
    q.temps,
    q.parametre_qualite,
    rp.code_canonique,
    rp.libelle,
    rp.unite,
    q.valeur,
    q.est_valide,
    q.qa_flag_null_value,
    q.qa_flag_negative,
    q.source_system
FROM qualite.suivi_qualite_barrage_garde_hebdo q
LEFT JOIN metadata.referentiel_parametre rp ON rp.id = q.parametre_ref_id;

-- ============================================================
-- METEO
-- ============================================================

CREATE OR REPLACE VIEW api.v_meteo_dashboard AS
SELECT 'PRECIP' AS code_parametre, station_id, temps, valeur, 'mm' AS unite, source_system
FROM meteo.mesure_precipitation
UNION ALL
SELECT 'EVAPO', station_id, temps, valeur, 'mm', source_system
FROM meteo.mesure_evaporation
UNION ALL
SELECT 'TEMP_MOY', station_id, temps, valeur, '°C', source_system
FROM meteo.mesure_temperature;

-- ============================================================
-- HYDRO / BARRAGE
-- ============================================================

CREATE OR REPLACE VIEW api.v_barrage_dashboard AS
SELECT
    barrage_id,
    temps,
    parametre_code,
    valeur,
    unite,
    scenario,
    source_table,
    metadata_json
FROM hydro.mesure_barrage_param
WHERE parametre_code IN ('NIVEAU_EAU','VOLUME','LACHER','APPORT','TRANSFERT');

-- ============================================================
-- IDP / GEO
-- ============================================================

CREATE OR REPLACE VIEW api.v_idp_points AS
SELECT
    p.id AS prelevement_id,
    p.source_system,
    p.coord_x,
    p.coord_y,
    p.geom,
    CASE WHEN p.geom IS NULL THEN 'GEO_UNRESOLVED' ELSE 'GEO_RESOLVED' END AS geo_status
FROM qualite.source_pollution_prelevement p
UNION ALL
SELECT
    point_id,
    source_file,
    x,
    y,
    geom,
    validation_status
FROM geo.points_non_resolus_idp;

-- ============================================================
-- SWAT / WASP LEGACY LATEST
-- ============================================================

CREATE OR REPLACE VIEW api.v_swat_latest AS
SELECT
    r.run_code,
    r.scenario_code,
    m.subbasin_uid,
    m.temps,
    m.param_code,
    m.valeur,
    'LEGACY_MODELING_TO_REPLACE' AS modeling_status
FROM swat_output.mesure_qualite_subbasin_ts m
JOIN swat_output.ref_run_modele r ON r.run_id = m.run_id;

CREATE OR REPLACE VIEW api.v_wasp_latest AS
SELECT
    r.run_code,
    r.scenario_code,
    m.segment_local_id,
    m.ts_utc,
    m.code_parametre,
    m.valeur,
    'LEGACY_MODELING_TO_REPLACE' AS modeling_status
FROM wasp_output.mesure_qualite_segment_ts m
JOIN wasp_output.ref_run_modele r ON r.run_id = m.run_id;

-- ============================================================
-- POLLUTION
-- ============================================================

CREATE OR REPLACE VIEW api.v_pollution_dashboard AS
SELECT
    p.id AS prelevement_id,
    p.geom,
    m.code_parametre,
    m.valeur_num,
    m.valeur_raw,
    CASE
        WHEN m.valeur_num IS NULL AND trim(COALESCE(m.valeur_raw,'')) = '-' THEN 'QA_ACCEPTED_SOURCE_GAP'
        WHEN m.valeur_num IS NULL THEN 'QA_NON_NUMERIC'
        ELSE 'QA_OK'
    END AS qa_status
FROM qualite.source_pollution_prelevement p
JOIN qualite.source_pollution_mesure_param m ON m.prelevement_id = p.id;
