\set ON_ERROR_STOP on

-- Phase 5 - Vues de compatibilite API pour le modele barrage parametrique
-- Aucune donnee metier n'est modifiee.

BEGIN;

DROP VIEW IF EXISTS api.v_hydro_barrage_param_compat_wide;

CREATE OR REPLACE VIEW api.v_hydro_barrage_param_journalier AS
SELECT
    m.barrage_id,
    date_trunc('day', m.temps)::date AS bucket_day,
    m.temps,
    m.parametre_code,
    CASE m.parametre_code
        WHEN 'NIVEAU_EAU' THEN 'niveau_barrage'
        WHEN 'VOLUME' THEN 'volume_barrage'
        WHEN 'LACHER' THEN 'lacher_barrage'
        WHEN 'APPORT' THEN 'apport'
        WHEN 'TRANSFERT' THEN 'transfert'
        ELSE lower(m.parametre_code)
    END AS metric,
    CASE m.parametre_code
        WHEN 'NIVEAU_EAU' THEN 'Niveau barrage'
        WHEN 'VOLUME' THEN 'Volume barrage'
        WHEN 'LACHER' THEN 'Lacher barrage'
        WHEN 'APPORT' THEN 'Apport barrage'
        WHEN 'TRANSFERT' THEN 'Transfert barrage'
        ELSE m.parametre_code
    END AS metric_label,
    m.valeur::double precision AS valeur,
    m.unite,
    m.scenario,
    m.scenario_id,
    m.parametre_ref_id,
    m.source_table,
    m.source_row_id,
    m.source_row_hash,
    m.target_business_key_hash,
    m.metadata_json,
    bd.barrage_nom,
    bd.nom_oued,
    bd.geom
FROM hydro.mesure_barrage_param m
LEFT JOIN api.v_barrage_dimension bd
  ON bd.barrage_id = m.barrage_id;

COMMENT ON VIEW api.v_hydro_barrage_param_journalier IS
'Vue API parametrique des mesures barrage: une ligne par barrage, jour, scenario et parametre_code.';

CREATE OR REPLACE VIEW api.v_hydro_barrage_param_compat_wide AS
SELECT
    barrage_id,
    bucket_day,
    scenario,
    max(valeur) FILTER (WHERE parametre_code = 'NIVEAU_EAU') AS niveau_barrage,
    max(valeur) FILTER (WHERE parametre_code = 'VOLUME') AS volume_barrage,
    max(valeur) FILTER (WHERE parametre_code = 'LACHER') AS lacher_barrage,
    max(valeur) FILTER (WHERE parametre_code = 'APPORT') AS apport,
    max(valeur) FILTER (WHERE parametre_code = 'APPORT') AS apports_hm3,
    max(valeur) FILTER (WHERE parametre_code = 'TRANSFERT') AS transfert,
    max(barrage_nom) AS barrage_nom,
    max(nom_oued) AS nom_oued,
    (array_agg(geom ORDER BY parametre_code) FILTER (WHERE geom IS NOT NULL))[1] AS geom
FROM api.v_hydro_barrage_param_journalier
GROUP BY barrage_id, bucket_day, scenario;

COMMENT ON VIEW api.v_hydro_barrage_param_compat_wide IS
'Vue large de compatibilite construite depuis hydro.mesure_barrage_param. Ne pas confondre avec les colonnes legacy.';

COMMIT;

SELECT
    'api.v_hydro_barrage_param_journalier' AS view_name,
    COUNT(*) AS rows
FROM api.v_hydro_barrage_param_journalier
UNION ALL
SELECT
    'api.v_hydro_barrage_param_compat_wide',
    COUNT(*)
FROM api.v_hydro_barrage_param_compat_wide
ORDER BY view_name;
