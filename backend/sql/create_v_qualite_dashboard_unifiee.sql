
CREATE OR REPLACE VIEW api.v_qualite_dashboard_unifiee AS
SELECT
    'SENTINELLE'::varchar AS support_type,
    'qualite.mesure_qualite_sebou'::varchar AS source_table,
    source_row_id::text AS source_id,
    ire_station::text AS ire_station,
    station_id::text AS station_id,
    temps::timestamp AS date_mesure,
    parametre_qualite::text AS parametre_qualite,
    parametre_ref_id::text AS parametre_ref_id,
    valeur::double precision AS valeur,
    est_valide::boolean AS est_valide
FROM qualite.mesure_qualite_sebou

UNION ALL

SELECT
    'RIVIERE'::varchar AS support_type,
    'qualite.mesure_qualite_riviere'::varchar AS source_table,
    source_row_id::text AS source_id,
    ire_station::text AS ire_station,
    station_id::text AS station_id,
    temps::timestamp AS date_mesure,
    parametre_qualite::text AS parametre_qualite,
    parametre_ref_id::text AS parametre_ref_id,
    valeur::double precision AS valeur,
    est_valide::boolean AS est_valide
FROM qualite.mesure_qualite_riviere

UNION ALL

SELECT
    'BARRAGE'::varchar AS support_type,
    'qualite.mesure_qualite_barrage'::varchar AS source_table,
    source_row_id::text AS source_id,
    ire_station::text AS ire_station,
    station_id::text AS station_id,
    temps::timestamp AS date_mesure,
    parametre_qualite::text AS parametre_qualite,
    NULL::text AS parametre_ref_id,
    valeur::double precision AS valeur,
    est_valide::boolean AS est_valide
FROM qualite.mesure_qualite_barrage

UNION ALL

SELECT
    'BARRAGE_GARDE'::varchar AS support_type,
    'qualite.suivi_qualite_barrage_garde_hebdo'::varchar AS source_table,
    source_row_id::text AS source_id,
    ire_station::text AS ire_station,
    station_id::text AS station_id,
    temps::timestamp AS date_mesure,
    parametre_qualite::text AS parametre_qualite,
    parametre_ref_id::text AS parametre_ref_id,
    valeur::double precision AS valeur,
    est_valide::boolean AS est_valide
FROM qualite.suivi_qualite_barrage_garde_hebdo;
