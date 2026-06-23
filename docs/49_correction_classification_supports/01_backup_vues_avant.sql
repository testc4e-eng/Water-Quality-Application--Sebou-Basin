-- 2026_06_business_map_contracts_v0.sql
-- Migration Script pour les vues materialisees du Dashboard Carte Metier Analytique V1

-- 1. Matrice Availability
DROP MATERIALIZED VIEW IF EXISTS api.mv_business_map_availability CASCADE;

CREATE MATERIALIZED VIEW api.mv_business_map_availability AS
WITH station_qualite AS (
    SELECT 
        'STATION_QUALITE' AS support_type,
        'QUALITE' AS domain,
        'PHYSICO_CHIMIE' AS subdomain, -- Simplification V1
        trim(m.parametre_qualite) AS parameter_code,
        COALESCE(ref.libelle, trim(m.parametre_qualite)) AS parameter_label,
        ref.unite AS unit,
        count(DISTINCT m.station_id) AS object_count,
        count(m.*) AS measure_count,
        min(m.temps::date) AS date_min,
        max(m.temps::date) AS date_max,
        true AS has_geometry,
        true AS has_timeseries,
        false AS has_thresholds,
        true AS recommended_v1,
        COALESCE(s.bassin_nom, 'Sebou') AS authorized_basin
    FROM qualite.mesure_qualite_riviere m
    JOIN api.v_station_dimension s ON s.station_id::text = m.station_id::text
    LEFT JOIN metadata.referentiel_parametre ref ON ref.id = m.parametre_ref_id
    WHERE s.geom IS NOT NULL
    GROUP BY 1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15
),
station_hydro AS (
    SELECT 
        'STATION_HYDRO' AS support_type,
        'HYDROLOGIE' AS domain,
        'DEBIT' AS subdomain,
        'DEBIT' AS parameter_code,
        'Débit' AS parameter_label,
        'm³/s' AS unit,
        count(DISTINCT m.station_id) AS object_count,
        count(m.*) AS measure_count,
        min(m.temps::date) AS date_min,
        max(m.temps::date) AS date_max,
        true AS has_geometry,
        true AS has_timeseries,
        false AS has_thresholds,
        true AS recommended_v1,
        COALESCE(s.bassin_nom, 'Sebou') AS authorized_basin
    FROM hydro.mesure_debit m
    JOIN api.v_station_dimension s ON s.station_id::text = m.station_id::text
    WHERE s.geom IS NOT NULL
    GROUP BY 1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15
),
barrage_hydro AS (
    SELECT 
        'BARRAGE' AS support_type,
        'HYDROLOGIE' AS domain,
        'STOCK' AS subdomain,
        trim(m.parametre_code) AS parameter_code,
        trim(m.parametre_code) AS parameter_label,
        m.unite AS unit,
        count(DISTINCT m.barrage_id) AS object_count,
        count(m.*) AS measure_count,
        min(m.temps::date) AS date_min,
        max(m.temps::date) AS date_max,
        true AS has_geometry,
        true AS has_timeseries,
        false AS has_thresholds,
        true AS recommended_v1,
        'Sebou' AS authorized_basin
    FROM hydro.mesure_barrage_param m
    JOIN api.v_barrage_dimension b ON b.barrage_id::text = m.barrage_id::text
    WHERE b.geom IS NOT NULL
    GROUP BY 1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15
),
station_meteo AS (
    SELECT 
        'STATION_METEO' AS support_type,
        'CLIMATOLOGIE' AS domain,
        'PRECIPITATION' AS subdomain,
        'PREC' AS parameter_code,
        'Précipitation' AS parameter_label,
        'mm' AS unit,
        count(DISTINCT m.station_id) AS object_count,
        count(m.*) AS measure_count,
        min(m.temps::date) AS date_min,
        max(m.temps::date) AS date_max,
        true AS has_geometry,
        true AS has_timeseries,
        false AS has_thresholds,
        true AS recommended_v1,
        COALESCE(s.bassin_nom, 'Sebou') AS authorized_basin
    FROM meteo.mesure_precipitation m
    JOIN api.v_station_dimension s ON s.station_id::text = m.station_id::text
    WHERE s.geom IS NOT NULL
    GROUP BY 1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15
),
source_pollution AS (
    SELECT 
        'SOURCE_POLLUTION' AS support_type,
        'POLLUTION' AS domain,
        'REJET_IDP' AS subdomain,
        rp.code_canonique AS parameter_code,
        rp.libelle AS parameter_label,
        COALESCE(m.unit_canonical, rp.unite) AS unit,
        count(DISTINCT m.site_id) AS object_count,
        count(m.*) AS measure_count,
        min(m.sample_date) AS date_min,
        max(m.sample_date) AS date_max,
        true AS has_geometry,
        true AS has_timeseries,
        false AS has_thresholds,
        true AS recommended_v1,
        COALESCE(s.bassin, 'Sebou') AS authorized_basin
    FROM qualite.resultat_mesure m
    JOIN geo.ref_site_pollution s ON s.site_id = m.site_id
    JOIN metadata.referentiel_parametre rp ON rp.id = m.parameter_id
    WHERE s.geom_4326 IS NOT NULL OR m.geom_4326 IS NOT NULL
    GROUP BY 1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15
)
SELECT * FROM station_qualite
UNION ALL SELECT * FROM station_hydro
UNION ALL SELECT * FROM barrage_hydro
UNION ALL SELECT * FROM station_meteo
UNION ALL SELECT * FROM source_pollution;

CREATE INDEX idx_mv_business_map_availability_support ON api.mv_business_map_availability (support_type);
CREATE INDEX idx_mv_business_map_availability_support_domain ON api.mv_business_map_availability (support_type, domain);
CREATE INDEX idx_mv_business_map_availability_param ON api.mv_business_map_availability (parameter_code);
CREATE INDEX idx_mv_business_map_availability_basin ON api.mv_business_map_availability (authorized_basin);


-- 2. Barrage Dimension Enriched
DROP MATERIALIZED VIEW IF EXISTS api.mv_barrage_dimension_enriched CASCADE;

CREATE MATERIALIZED VIEW api.mv_barrage_dimension_enriched AS
SELECT 
    b.barrage_id,
    b.barrage_nom,
    b.geom,
    bv.nom AS bassin_nom,
    sbv.nom AS sous_bassin_nom,
    b.nom_oued,
    b.type_barrage,
    b.statut
FROM api.v_barrage_dimension b
LEFT JOIN geo.bassin_versant bv ON ST_Intersects(ST_Transform(b.geom, 4326), bv.geom)
LEFT JOIN geo.sous_bassin_abh sbv ON ST_Intersects(ST_Transform(b.geom, 4326), sbv.geom);

CREATE INDEX idx_mv_barrage_dimension_enriched_geom ON api.mv_barrage_dimension_enriched USING GIST (geom);
CREATE INDEX idx_mv_barrage_dimension_enriched_id ON api.mv_barrage_dimension_enriched (barrage_id);


-- 3. Features V1
DROP MATERIALIZED VIEW IF EXISTS api.mv_business_map_features_v1 CASCADE;

CREATE MATERIALIZED VIEW api.mv_business_map_features_v1 AS
SELECT 
    'STATION_QUALITE' AS support_type,
    station_id::text AS object_id,
    station_nom AS object_name,
    code_station AS object_code,
    geom,
    ST_AsGeoJSON(ST_Transform(geom, 4326), 6)::jsonb AS geometry_geojson,
    bassin_nom,
    sous_bassin_nom,
    jsonb_build_object('type_station', type_station) AS attributes,
    true AS recommended_v1
FROM api.v_station_dimension
WHERE geom IS NOT NULL
UNION ALL
SELECT 
    'STATION_HYDRO' AS support_type,
    station_id::text AS object_id,
    station_nom AS object_name,
    code_station AS object_code,
    geom,
    ST_AsGeoJSON(ST_Transform(geom, 4326), 6)::jsonb AS geometry_geojson,
    bassin_nom,
    sous_bassin_nom,
    jsonb_build_object('type_station', type_station) AS attributes,
    true AS recommended_v1
FROM api.v_station_dimension
WHERE geom IS NOT NULL AND lower(coalesce(type_station, '')) = 'hydrologique'
UNION ALL
SELECT 
    'STATION_METEO' AS support_type,
    station_id::text AS object_id,
    station_nom AS object_name,
    code_station AS object_code,
    geom,
    ST_AsGeoJSON(ST_Transform(geom, 4326), 6)::jsonb AS geometry_geojson,
    bassin_nom,
    sous_bassin_nom,
    jsonb_build_object('type_station', type_station) AS attributes,
    true AS recommended_v1
FROM api.v_station_dimension
WHERE geom IS NOT NULL AND lower(coalesce(type_station, '')) IN ('pluviometrique', 'pluvio', 'meteo')
UNION ALL
SELECT 
    'BARRAGE' AS support_type,
    barrage_id::text AS object_id,
    barrage_nom AS object_name,
    barrage_id::text AS object_code,
    geom,
    ST_AsGeoJSON(ST_Transform(geom, 4326), 6)::jsonb AS geometry_geojson,
    bassin_nom,
    sous_bassin_nom,
    jsonb_build_object('nom_oued', nom_oued, 'type_barrage', type_barrage, 'statut', statut) AS attributes,
    true AS recommended_v1
FROM api.mv_barrage_dimension_enriched
WHERE geom IS NOT NULL
UNION ALL
SELECT 
    'SOURCE_POLLUTION' AS support_type,
    site_id::text AS object_id,
    site_name AS object_name,
    site_code AS object_code,
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) AS geom,
    geometry AS geometry_geojson,
    bassin AS bassin_nom,
    NULL AS sous_bassin_nom,
    jsonb_build_object('commune', commune, 'source_type_label', source_type_label) AS attributes,
    true AS recommended_v1
FROM api.v_pollution_sites
WHERE longitude IS NOT NULL AND latitude IS NOT NULL;

CREATE INDEX idx_mv_business_map_features_v1_geom ON api.mv_business_map_features_v1 USING GIST (geom);
CREATE INDEX idx_mv_business_map_features_v1_support ON api.mv_business_map_features_v1 (support_type);
CREATE INDEX idx_mv_business_map_features_v1_basin ON api.mv_business_map_features_v1 (bassin_nom);


-- 4. Last Values
DROP MATERIALIZED VIEW IF EXISTS api.mv_business_map_last_values CASCADE;

CREATE MATERIALIZED VIEW api.mv_business_map_last_values AS
WITH qualite AS (
    SELECT DISTINCT ON (m.station_id, trim(m.parametre_qualite))
        'STATION_QUALITE' AS support_type,
        m.station_id::text AS object_id,
        trim(m.parametre_qualite) AS parameter_code,
        m.temps::date AS last_date,
        m.valeur AS last_value,
        NULL AS quality_flag
    FROM qualite.mesure_qualite_riviere m
    WHERE m.valeur IS NOT NULL AND coalesce(m.est_valide, true) = true
    ORDER BY m.station_id, trim(m.parametre_qualite), m.temps DESC
),
hydro AS (
    SELECT DISTINCT ON (m.station_id)
        'STATION_HYDRO' AS support_type,
        m.station_id::text AS object_id,
        'DEBIT' AS parameter_code,
        m.temps::date AS last_date,
        m.valeur AS last_value,
        NULL AS quality_flag
    FROM hydro.mesure_debit m
    WHERE m.valeur IS NOT NULL AND coalesce(m.est_valide, true) = true
    ORDER BY m.station_id, m.temps DESC
),
barrage AS (
    SELECT DISTINCT ON (m.barrage_id, trim(m.parametre_code))
        'BARRAGE' AS support_type,
        m.barrage_id::text AS object_id,
        trim(m.parametre_code) AS parameter_code,
        m.temps::date AS last_date,
        m.valeur AS last_value,
        NULL AS quality_flag
    FROM hydro.mesure_barrage_param m
    WHERE m.valeur IS NOT NULL
    ORDER BY m.barrage_id, trim(m.parametre_code), m.temps DESC
),
meteo AS (
    SELECT DISTINCT ON (m.station_id)
        'STATION_METEO' AS support_type,
        m.station_id::text AS object_id,
        'PREC' AS parameter_code,
        m.temps::date AS last_date,
        m.val_observees AS last_value,
        NULL AS quality_flag
    FROM meteo.mesure_precipitation m
    WHERE m.val_observees IS NOT NULL AND coalesce(m.est_valide, true) = true
    ORDER BY m.station_id, m.temps DESC
),
pollution AS (
    SELECT DISTINCT ON (r.site_id, rp.code_canonique)
        'SOURCE_POLLUTION' AS support_type,
        r.site_id::text AS object_id,
        rp.code_canonique AS parameter_code,
        r.sample_date AS last_date,
        r.value_numeric AS last_value,
        r.quality_flag AS quality_flag
    FROM qualite.resultat_mesure r
    JOIN metadata.referentiel_parametre rp ON rp.id = r.parameter_id
    WHERE r.value_numeric IS NOT NULL
    ORDER BY r.site_id, rp.code_canonique, r.sample_date DESC
)
SELECT * FROM qualite
UNION ALL SELECT * FROM hydro
UNION ALL SELECT * FROM barrage
UNION ALL SELECT * FROM meteo
UNION ALL SELECT * FROM pollution;

CREATE INDEX idx_mv_business_map_last_values_support_obj ON api.mv_business_map_last_values (support_type, object_id);
CREATE INDEX idx_mv_business_map_last_values_param ON api.mv_business_map_last_values (parameter_code);
