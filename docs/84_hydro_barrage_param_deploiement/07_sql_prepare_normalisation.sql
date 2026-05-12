\set ON_ERROR_STOP on

-- Phase 3 - Preparation normalisation barrage parametrique
-- Lecture seule: aucune insertion dans hydro.mesure_barrage_param.
-- Cle source stable: staging.raw_mesures_niv_eau_barrages.id.
-- Dedoublonnage source: (ire_barrage, date_jr) order by id.
-- Aucun usage de ctid.

WITH source_ranked AS (
    SELECT
        s.id AS source_row_id,
        s.date_jr,
        s.ire_barrage,
        s.niveau_eau_m_ngm,
        s.volume_mm3,
        s.restitutions_mm3,
        s.apports_mm3,
        s.transfert_mm3,
        s.observations,
        mb.barrage_id,
        ROW_NUMBER() OVER (
            PARTITION BY s.ire_barrage, s.date_jr
            ORDER BY s.id
        ) AS rn,
        COUNT(*) OVER (
            PARTITION BY s.ire_barrage, s.date_jr
        ) AS duplicate_count
    FROM staging.raw_mesures_niv_eau_barrages s
    LEFT JOIN metadata.mapping_barrage mb
      ON mb.legacy_ire_barrage = s.ire_barrage
),
source_stable AS (
    SELECT *
    FROM source_ranked
    WHERE date_jr IS NOT NULL
      AND barrage_id IS NOT NULL
      AND rn = 1
),
normalised AS (
    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC' AS temps,
        'NIVEAU_EAU'::text AS parametre_code,
        niveau_eau_m_ngm::numeric AS valeur,
        'm'::text AS unite,
        'ACTUEL'::text AS scenario,
        NULL::uuid AS scenario_id,
        'staging.raw_mesures_niv_eau_barrages'::text AS source_table,
        source_row_id::text AS source_row_id,
        md5('raw_mesures_niv_eau_barrages|' || source_row_id::text) AS source_row_hash,
        'niveau_eau_m_ngm'::text AS source_column,
        'm NGM'::text AS source_unit,
        ire_barrage,
        duplicate_count,
        observations
    FROM source_stable
    WHERE niveau_eau_m_ngm IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'VOLUME',
        volume_mm3::numeric,
        'Mm3',
        'ACTUEL',
        NULL::uuid,
        'staging.raw_mesures_niv_eau_barrages',
        source_row_id::text,
        md5('raw_mesures_niv_eau_barrages|' || source_row_id::text),
        'volume_mm3',
        'Mm3',
        ire_barrage,
        duplicate_count,
        observations
    FROM source_stable
    WHERE volume_mm3 IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'LACHER',
        restitutions_mm3::numeric,
        'Mm3/j',
        'ACTUEL',
        NULL::uuid,
        'staging.raw_mesures_niv_eau_barrages',
        source_row_id::text,
        md5('raw_mesures_niv_eau_barrages|' || source_row_id::text),
        'restitutions_mm3',
        'Mm3',
        ire_barrage,
        duplicate_count,
        observations
    FROM source_stable
    WHERE restitutions_mm3 IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'APPORTS_HM3',
        apports_mm3::numeric,
        'Mm3/j',
        'ACTUEL',
        NULL::uuid,
        'staging.raw_mesures_niv_eau_barrages',
        source_row_id::text,
        md5('raw_mesures_niv_eau_barrages|' || source_row_id::text),
        'apports_mm3',
        'HM3/Hm3/hm3 or Mm3 harmonised to Mm3',
        ire_barrage,
        duplicate_count,
        observations
    FROM source_stable
    WHERE apports_mm3 IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'TRANSFERT',
        transfert_mm3::numeric,
        'Mm3/j',
        'ACTUEL',
        NULL::uuid,
        'staging.raw_mesures_niv_eau_barrages',
        source_row_id::text,
        md5('raw_mesures_niv_eau_barrages|' || source_row_id::text),
        'transfert_mm3',
        'HM3/Hm3/hm3 or Mm3 harmonised to Mm3',
        ire_barrage,
        duplicate_count,
        observations
    FROM source_stable
    WHERE transfert_mm3 IS NOT NULL
),
resolved AS (
    SELECT
        n.*,
        rpc.parametre_ref_id,
        md5(
            n.barrage_id::text || '|' ||
            n.temps::text || '|' ||
            n.parametre_code || '|' ||
            n.scenario
        ) AS target_business_key_hash,
        jsonb_build_object(
            'legacy_ire_barrage', n.ire_barrage,
            'source_column', n.source_column,
            'source_unit', n.source_unit,
            'unit_harmonisation', CASE
                WHEN n.parametre_code IN ('LACHER', 'APPORTS_HM3', 'TRANSFERT') THEN 'Mm3 -> Mm3/j'
                ELSE 'none'
            END,
            'duplicate_count', n.duplicate_count,
            'observations', n.observations,
            'legacy_parametre_code', CASE
                WHEN n.parametre_code = 'LACHER' THEN 'RESTITUTION'
                ELSE n.parametre_code
            END
        ) AS metadata_json
    FROM normalised n
    LEFT JOIN metadata.referentiel_parametre_canonique rpc
      ON rpc.code_parametre = n.parametre_code
     AND rpc.statut = 'ACTIF'
),
business_duplicates AS (
    SELECT
        barrage_id,
        temps,
        parametre_code,
        scenario,
        COUNT(*) AS n
    FROM resolved
    GROUP BY barrage_id, temps, parametre_code, scenario
    HAVING COUNT(*) > 1
),
hash_duplicates AS (
    SELECT
        target_business_key_hash,
        COUNT(*) AS n
    FROM resolved
    GROUP BY target_business_key_hash
    HAVING COUNT(*) > 1
),
qa_summary AS (
    SELECT 'volume_parametrique_simule' AS controle, COUNT(*)::numeric AS resultat FROM resolved
    UNION ALL SELECT 'doublons_metier_simules', COUNT(*)::numeric FROM business_duplicates
    UNION ALL SELECT 'collisions_business_hash', COALESCE(SUM(n - 1), 0)::numeric FROM hash_duplicates
    UNION ALL SELECT 'collisions_fk_referentiel', COUNT(*)::numeric FROM resolved WHERE parametre_ref_id IS NULL
    UNION ALL SELECT 'barrage_id_null', COUNT(*)::numeric FROM resolved WHERE barrage_id IS NULL
    UNION ALL SELECT 'temps_null', COUNT(*)::numeric FROM resolved WHERE temps IS NULL
    UNION ALL SELECT 'valeur_null', COUNT(*)::numeric FROM resolved WHERE valeur IS NULL
    UNION ALL SELECT 'valeurs_negatives', COUNT(*)::numeric FROM resolved WHERE valeur < 0
    UNION ALL SELECT 'unites_incoherentes', COUNT(*)::numeric
    FROM resolved
    WHERE (parametre_code = 'NIVEAU_EAU' AND unite <> 'm')
       OR (parametre_code = 'VOLUME' AND unite <> 'Mm3')
       OR (parametre_code IN ('LACHER', 'APPORTS_HM3', 'TRANSFERT') AND unite <> 'Mm3/j')
    UNION ALL SELECT 'melange_debit_volume', COUNT(*)::numeric
    FROM resolved
    WHERE parametre_code IN ('LACHER', 'APPORTS_HM3', 'TRANSFERT')
      AND unite = 'm3/s'
)
SELECT *
FROM qa_summary
ORDER BY controle;

-- Distribution par parametre simulee.
WITH source_ranked AS (
    SELECT
        s.id AS source_row_id,
        s.date_jr,
        s.ire_barrage,
        s.niveau_eau_m_ngm,
        s.volume_mm3,
        s.restitutions_mm3,
        s.apports_mm3,
        s.transfert_mm3,
        mb.barrage_id,
        ROW_NUMBER() OVER (PARTITION BY s.ire_barrage, s.date_jr ORDER BY s.id) AS rn
    FROM staging.raw_mesures_niv_eau_barrages s
    LEFT JOIN metadata.mapping_barrage mb
      ON mb.legacy_ire_barrage = s.ire_barrage
),
source_stable AS (
    SELECT *
    FROM source_ranked
    WHERE date_jr IS NOT NULL
      AND barrage_id IS NOT NULL
      AND rn = 1
),
distribution AS (
    SELECT 'NIVEAU_EAU'::text AS parametre_code, 'm'::text AS unite, niveau_eau_m_ngm::numeric AS valeur FROM source_stable WHERE niveau_eau_m_ngm IS NOT NULL
    UNION ALL SELECT 'VOLUME', 'Mm3', volume_mm3::numeric FROM source_stable WHERE volume_mm3 IS NOT NULL
    UNION ALL SELECT 'LACHER', 'Mm3/j', restitutions_mm3::numeric FROM source_stable WHERE restitutions_mm3 IS NOT NULL
    UNION ALL SELECT 'APPORTS_HM3', 'Mm3/j', apports_mm3::numeric FROM source_stable WHERE apports_mm3 IS NOT NULL
    UNION ALL SELECT 'TRANSFERT', 'Mm3/j', transfert_mm3::numeric FROM source_stable WHERE transfert_mm3 IS NOT NULL
)
SELECT
    parametre_code,
    COUNT(*) AS volume,
    unite,
    CASE
        WHEN COUNT(*) FILTER (WHERE valeur IS NULL) > 0 THEN 'BLOCKED_NULL_VALUE'
        WHEN COUNT(*) FILTER (WHERE valeur < 0) > 0 THEN 'BLOCKED_NEGATIVE'
        ELSE 'OK'
    END AS qa
FROM distribution
GROUP BY parametre_code, unite
ORDER BY CASE parametre_code
    WHEN 'NIVEAU_EAU' THEN 1
    WHEN 'VOLUME' THEN 2
    WHEN 'LACHER' THEN 3
    WHEN 'APPORTS_HM3' THEN 4
    WHEN 'TRANSFERT' THEN 5
END;
