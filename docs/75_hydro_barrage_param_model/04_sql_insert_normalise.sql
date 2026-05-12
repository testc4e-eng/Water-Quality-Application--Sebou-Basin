-- Phase 1 - Insert normalise propose
-- Pre-conditions:
--   1. hydro.mesure_barrage_param existe
--   2. metadata.referentiel_parametre_canonique existe
--   3. aucune execution destructive en amont

WITH source_ranked AS (
    SELECT
        s.id AS source_id,
        s.date_jr,
        s.ire_barrage,
        s.niveau_eau_m_ngm,
        s.volume_mm3,
        s.restitutions_mm3,
        s.transfert_mm3,
        s.apports_mm3,
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
source_dedup AS (
    SELECT *
    FROM source_ranked
    WHERE rn = 1
      AND date_jr IS NOT NULL
      AND barrage_id IS NOT NULL
),
exploded AS (
    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC' AS temps,
        'NIVEAU_EAU'::text AS parametre_code,
        niveau_eau_m_ngm::numeric AS valeur,
        'm'::text AS unite,
        'niveau_eau_m_ngm'::text AS source_parametre,
        source_id,
        ire_barrage,
        duplicate_count,
        observations,
        'm NGM'::text AS source_unite
    FROM source_dedup
    WHERE niveau_eau_m_ngm IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'VOLUME',
        volume_mm3::numeric,
        'Mm3',
        'volume_mm3',
        source_id,
        ire_barrage,
        duplicate_count,
        observations,
        'Mm3'
    FROM source_dedup
    WHERE volume_mm3 IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'LACHER',
        restitutions_mm3::numeric,
        'Mm3/j',
        'restitutions_mm3',
        source_id,
        ire_barrage,
        duplicate_count,
        observations,
        'Mm3'
    FROM source_dedup
    WHERE restitutions_mm3 IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'APPORTS_HM3',
        apports_mm3::numeric,
        'Mm3/j',
        'apports_mm3',
        source_id,
        ire_barrage,
        duplicate_count,
        observations,
        'Mm3'
    FROM source_dedup
    WHERE apports_mm3 IS NOT NULL

    UNION ALL

    SELECT
        barrage_id,
        date_jr::timestamp AT TIME ZONE 'UTC',
        'TRANSFERT',
        transfert_mm3::numeric,
        'Mm3/j',
        'transfert_mm3',
        source_id,
        ire_barrage,
        duplicate_count,
        observations,
        'Mm3'
    FROM source_dedup
    WHERE transfert_mm3 IS NOT NULL
),
resolved AS (
    SELECT
        e.*,
        rpc.parametre_ref_id
    FROM exploded e
    LEFT JOIN metadata.referentiel_parametre_canonique rpc
      ON rpc.code_parametre = e.parametre_code
     AND rpc.statut = 'ACTIF'
)
INSERT INTO hydro.mesure_barrage_param (
    barrage_id,
    temps,
    parametre_code,
    parametre_ref_id,
    valeur,
    unite,
    source_donnee,
    scenario,
    scenario_id,
    metadata_json,
    source_table,
    source_row_hash,
    target_business_key_hash
)
SELECT
    r.barrage_id,
    r.temps,
    r.parametre_code,
    r.parametre_ref_id,
    r.valeur,
    r.unite,
    'staging.raw_mesures_niv_eau_barrages'::text,
    'ACTUEL'::text,
    NULL::uuid,
    jsonb_build_object(
        'legacy_ire_barrage', r.ire_barrage,
        'source_id', r.source_id,
        'source_parametre', r.source_parametre,
        'source_unite', r.source_unite,
        'source_unite_harmonisee', CASE
            WHEN r.parametre_code IN ('LACHER', 'APPORTS_HM3', 'TRANSFERT') THEN 'Mm3'
            ELSE r.source_unite
        END,
        'duplicate_count', r.duplicate_count,
        'observations', r.observations,
        'legacy_parametre_code', CASE WHEN r.parametre_code = 'LACHER' THEN 'RESTITUTION' ELSE r.parametre_code END
    ),
    'staging.raw_mesures_niv_eau_barrages'::text,
    md5('staging.raw_mesures_niv_eau_barrages|' || r.source_id::text),
    md5(
        r.barrage_id::text || '|' ||
        r.temps::text || '|' ||
        r.parametre_code || '|' ||
        'ACTUEL'
    )
FROM resolved r
WHERE r.parametre_ref_id IS NOT NULL
ON CONFLICT (target_business_key_hash) DO NOTHING;
