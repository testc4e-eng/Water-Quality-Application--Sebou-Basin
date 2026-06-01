-- PROPOSITIONS NON EXECUTEES
-- Validation technique obligatoire avant creation reelle.
-- Ces vues sont des surfaces d'exposition, pas des tables metier.

-- ============================================================
-- QUALITE
-- ============================================================
CREATE OR REPLACE VIEW api.v_qualite_dashboard AS
SELECT
    'qualite'::text AS domaine,
    'qualite.mesure_qualite_riviere'::text AS source_table,
    'riviere'::text AS support_type,
    q.station_id::text AS support_id,
    q.ire_station::text AS support_nom,
    q.temps AS date_mesure,
    q.parametre_ref_id,
    r.code_parametre,
    r.nom_parametre AS libelle_parametre,
    r.unite_reference,
    q.valeur AS valeur_num,
    q.valeur::text AS valeur_raw,
    CASE
        WHEN q.qa_flag_null_value THEN 'QA_NULL'
        WHEN q.qa_flag_negative THEN 'QA_NEGATIVE'
        WHEN q.qa_flag_param_missing THEN 'QA_PARAM_MISSING'
        ELSE 'QA_OK'
    END AS qa_status,
    CASE WHEN q.qa_flag_station_unmapped THEN 'GEO_UNRESOLVED' ELSE 'GEO_RESOLVED' END AS geo_status,
    q.source_row_id
FROM qualite.mesure_qualite_riviere q
LEFT JOIN metadata.referentiel_parametre_canonique r ON r.parametre_ref_id = q.parametre_ref_id
UNION ALL
SELECT
    'qualite',
    'qualite.mesure_qualite_nappe',
    'nappe',
    q.station_id::text,
    COALESCE(q.ire_station::text, q.code_nappe::text),
    q.temps,
    q.parametre_ref_id,
    r.code_parametre,
    r.nom_parametre,
    r.unite_reference,
    q.valeur,
    q.valeur::text,
    CASE
        WHEN q.qa_flag_null_value THEN 'QA_NULL'
        WHEN q.qa_flag_negative THEN 'QA_NEGATIVE'
        WHEN q.qa_flag_param_missing THEN 'QA_PARAM_MISSING'
        ELSE 'QA_OK'
    END,
    CASE
        WHEN q.qa_flag_station_unmapped OR q.qa_flag_nappe_unmapped THEN 'GEO_UNRESOLVED'
        ELSE 'GEO_RESOLVED'
    END,
    q.source_row_id
FROM qualite.mesure_qualite_nappe q
LEFT JOIN metadata.referentiel_parametre_canonique r ON r.parametre_ref_id = q.parametre_ref_id
UNION ALL
SELECT
    'qualite',
    'qualite.mesure_qualite_sebou',
    'sebou',
    q.station_id::text,
    q.ire_station::text,
    q.temps,
    q.parametre_ref_id,
    r.code_parametre,
    r.nom_parametre,
    r.unite_reference,
    q.valeur,
    COALESCE(q.observation, q.valeur::text),
    CASE
        WHEN q.qa_flag_null_value THEN 'QA_NULL'
        WHEN q.qa_flag_negative THEN 'QA_NEGATIVE'
        WHEN q.qa_flag_param_missing THEN 'QA_PARAM_MISSING'
        ELSE 'QA_OK'
    END,
    CASE WHEN q.qa_flag_station_unmapped THEN 'GEO_UNRESOLVED' ELSE 'GEO_RESOLVED' END,
    q.source_row_id
FROM qualite.mesure_qualite_sebou q
LEFT JOIN metadata.referentiel_parametre_canonique r ON r.parametre_ref_id = q.parametre_ref_id
UNION ALL
SELECT
    'qualite',
    'qualite.suivi_qualite_barrage_garde_hebdo',
    'barrage_garde',
    q.barrage_id::text,
    q.ire_station::text,
    q.temps,
    q.parametre_ref_id,
    r.code_parametre,
    r.nom_parametre,
    r.unite_reference,
    q.valeur,
    COALESCE(q.observation, q.valeur::text),
    CASE
        WHEN q.qa_flag_null_value THEN 'QA_NULL'
        WHEN q.qa_flag_negative THEN 'QA_NEGATIVE'
        WHEN q.qa_flag_param_missing THEN 'QA_PARAM_MISSING'
        ELSE 'QA_OK'
    END,
    CASE
        WHEN q.qa_flag_station_unmapped OR q.qa_flag_barrage_unmapped THEN 'GEO_UNRESOLVED'
        ELSE 'GEO_RESOLVED'
    END,
    q.source_row_id
FROM qualite.suivi_qualite_barrage_garde_hebdo q
LEFT JOIN metadata.referentiel_parametre_canonique r ON r.parametre_ref_id = q.parametre_ref_id;

-- ============================================================
-- METEO
-- ============================================================
CREATE OR REPLACE VIEW api.v_meteo_dashboard AS
SELECT
    'meteo'::text AS domaine,
    'meteo.mesure_precipitation'::text AS source_table,
    'station_meteo'::text AS support_type,
    station_id::text AS support_id,
    NULL::text AS support_nom,
    temps AS date_mesure,
    NULL::uuid AS parametre_ref_id,
    'PRECIP'::text AS code_parametre,
    'Precipitation'::text AS libelle_parametre,
    'mm'::text AS unite_reference,
    valeur AS valeur_num,
    valeur::text AS valeur_raw,
    CASE WHEN valeur IS NULL THEN 'QA_NULL' ELSE 'QA_OK' END AS qa_status,
    NULL::text AS geo_status,
    NULL::text AS source_row_id
FROM meteo.mesure_precipitation
UNION ALL
SELECT
    'meteo',
    'meteo.mesure_evaporation',
    'station_meteo',
    station_id::text,
    NULL::text,
    temps,
    NULL::uuid,
    'EVAPO',
    'Evaporation',
    'mm',
    valeur,
    valeur::text,
    CASE WHEN valeur IS NULL THEN 'QA_ACCEPTED_SOURCE_GAP' ELSE 'QA_OK' END,
    NULL::text,
    NULL::text
FROM meteo.mesure_evaporation
UNION ALL
SELECT
    'meteo',
    'meteo.mesure_temperature',
    'station_meteo',
    station_id::text,
    NULL::text,
    temps,
    NULL::uuid,
    'TEMP_MOY',
    'Temperature moyenne',
    '°C',
    valeur,
    valeur::text,
    CASE WHEN valeur IS NULL THEN 'QA_NULL' ELSE 'QA_OK' END,
    NULL::text,
    NULL::text
FROM meteo.mesure_temperature;

-- ============================================================
-- HYDRO / BARRAGE
-- ============================================================
CREATE OR REPLACE VIEW api.v_barrage_dashboard AS
SELECT
    'hydro'::text AS domaine,
    source_table,
    'barrage'::text AS support_type,
    barrage_id::text AS support_id,
    NULL::text AS support_nom,
    temps AS date_mesure,
    parametre_ref_id,
    parametre_code AS code_parametre,
    parametre_code AS libelle_parametre,
    unite AS unite_reference,
    valeur AS valeur_num,
    valeur::text AS valeur_raw,
    'QA_OK'::text AS qa_status,
    NULL::text AS geo_status,
    source_row_id
FROM hydro.mesure_barrage_param
WHERE parametre_code IN ('NIVEAU_EAU', 'VOLUME', 'LACHER', 'APPORT', 'TRANSFERT');

-- ============================================================
-- IDP / GEO
-- ============================================================
CREATE OR REPLACE VIEW api.v_idp_points AS
SELECT
    'idp'::text AS domaine,
    'qualite.source_pollution_prelevement'::text AS source_table,
    'point_idp'::text AS support_type,
    p.id::text AS support_id,
    NULL::text AS support_nom,
    NULL::timestamptz AS date_mesure,
    NULL::uuid AS parametre_ref_id,
    NULL::text AS code_parametre,
    NULL::text AS libelle_parametre,
    NULL::text AS unite_reference,
    NULL::numeric AS valeur_num,
    NULL::text AS valeur_raw,
    'QA_OK'::text AS qa_status,
    CASE WHEN p.geom IS NULL THEN 'GEO_UNRESOLVED' ELSE 'GEO_RESOLVED' END AS geo_status,
    p.id::text AS source_row_id
FROM qualite.source_pollution_prelevement p;

-- ============================================================
-- POLLUTION
-- ============================================================
CREATE OR REPLACE VIEW api.v_pollution_dashboard AS
SELECT
    'pollution'::text AS domaine,
    'qualite.source_pollution_mesure_param'::text AS source_table,
    'point_idp'::text AS support_type,
    m.prelevement_id::text AS support_id,
    NULL::text AS support_nom,
    NULL::timestamptz AS date_mesure,
    NULL::uuid AS parametre_ref_id,
    m.code_parametre,
    m.code_parametre AS libelle_parametre,
    NULL::text AS unite_reference,
    m.valeur_num,
    m.valeur_raw,
    CASE
        WHEN m.valeur_num IS NULL AND trim(COALESCE(m.valeur_raw, '')) = '-' THEN 'QA_ACCEPTED_SOURCE_GAP'
        WHEN m.valeur_num IS NULL THEN 'QA_NON_NUMERIC'
        ELSE 'QA_OK'
    END AS qa_status,
    NULL::text AS geo_status,
    m.id::text AS source_row_id
FROM qualite.source_pollution_mesure_param m;
