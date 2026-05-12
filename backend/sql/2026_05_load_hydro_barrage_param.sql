\set ON_ERROR_STOP on

-- Phase 4 - Chargement reel controle de hydro.mesure_barrage_param
-- Preconditions validees:
--   Phase 1 = READY_FOR_PARAM_MODEL
--   Phase 2 = PARAM_TABLE_CREATED
--   Phase 3 = NORMALISATION_OK
-- Interdits:
--   - aucune modification de hydro.mesure_barrage legacy
--   - aucune modification de hydro.mesure_debit, qualite.*, meteo.*, staging.*
--   - aucun usage de ctid

BEGIN;

CREATE TABLE IF NOT EXISTS audit.hydro_barrage_param_load_audit (
    run_id uuid PRIMARY KEY,
    source_table text NOT NULL,
    target_table text NOT NULL,
    volume_before integer NOT NULL,
    backup_table text NULL,
    volume_source_brut integer NOT NULL,
    volume_source_stable integer NOT NULL,
    volume_insert_attendu integer NOT NULL,
    volume_exclu integer NOT NULL,
    volume_inserted integer NULL,
    volume_final integer NULL,
    started_at timestamptz NOT NULL,
    finished_at timestamptz NULL,
    status text NOT NULL,
    error_message text NULL,
    qa_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb
);

COMMIT;

CREATE TEMP TABLE hydro_barrage_param_load_ctx (
    run_id uuid NOT NULL,
    started_at timestamptz NOT NULL,
    volume_before integer NOT NULL,
    backup_table text NULL
);

DO $$
DECLARE
    v_run_id uuid := gen_random_uuid();
    v_started_at timestamptz := clock_timestamp();
    v_volume_before integer;
    v_backup_table text := NULL;
BEGIN
    SELECT COUNT(*)::integer
    INTO v_volume_before
    FROM hydro.mesure_barrage_param;

    IF v_volume_before > 0 THEN
        v_backup_table := 'bkp_hydro_mesure_barrage_param_' || to_char(clock_timestamp(), 'YYYYMMDD_HH24MISS_US');
        EXECUTE format('CREATE TABLE audit.%I AS TABLE hydro.mesure_barrage_param', v_backup_table);
    END IF;

    INSERT INTO hydro_barrage_param_load_ctx (
        run_id,
        started_at,
        volume_before,
        backup_table
    )
    VALUES (
        v_run_id,
        v_started_at,
        v_volume_before,
        v_backup_table
    );

    INSERT INTO audit.hydro_barrage_param_load_audit (
        run_id,
        source_table,
        target_table,
        volume_before,
        backup_table,
        volume_source_brut,
        volume_source_stable,
        volume_insert_attendu,
        volume_exclu,
        started_at,
        status,
        metadata_json
    )
    VALUES (
        v_run_id,
        'staging.raw_mesures_niv_eau_barrages',
        'hydro.mesure_barrage_param',
        v_volume_before,
        CASE WHEN v_backup_table IS NULL THEN NULL ELSE 'audit.' || v_backup_table END,
        85166,
        84831,
        272652,
        335,
        v_started_at,
        'STARTED',
        jsonb_build_object(
            'phase', 'PHASE_4_LOAD',
            'rules_source', 'docs/84_hydro_barrage_param_deploiement/07_sql_prepare_normalisation.sql',
            'legacy_tables_touched', false,
            'excluded', jsonb_build_object('DATE_NULL', 92, 'DUPLICATE_SOURCE_KEY', 243)
        )
    );
END
$$;

BEGIN;

CREATE TEMP TABLE hydro_barrage_param_candidates AS
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
        'APPORT',
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
                WHEN n.parametre_code IN ('LACHER', 'APPORT', 'TRANSFERT') THEN 'Mm3 -> Mm3/j'
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
)
SELECT *
FROM resolved;

DO $$
DECLARE
    v_candidate_count integer;
    v_business_duplicates integer;
    v_hash_collisions integer;
    v_fk_collisions integer;
    v_nulls integer;
    v_unit_errors integer;
    v_negative_values integer;
    v_debit_volume_mix integer;
BEGIN
    SELECT COUNT(*)::integer INTO v_candidate_count FROM hydro_barrage_param_candidates;

    SELECT COUNT(*)::integer
    INTO v_business_duplicates
    FROM (
        SELECT barrage_id, temps, parametre_code, scenario
        FROM hydro_barrage_param_candidates
        GROUP BY barrage_id, temps, parametre_code, scenario
        HAVING COUNT(*) > 1
    ) d;

    SELECT COALESCE(SUM(n - 1), 0)::integer
    INTO v_hash_collisions
    FROM (
        SELECT target_business_key_hash, COUNT(*) AS n
        FROM hydro_barrage_param_candidates
        GROUP BY target_business_key_hash
        HAVING COUNT(*) > 1
    ) h;

    SELECT COUNT(*)::integer
    INTO v_fk_collisions
    FROM hydro_barrage_param_candidates
    WHERE parametre_ref_id IS NULL;

    SELECT COUNT(*)::integer
    INTO v_nulls
    FROM hydro_barrage_param_candidates
    WHERE barrage_id IS NULL
       OR temps IS NULL
       OR valeur IS NULL
       OR parametre_ref_id IS NULL;

    SELECT COUNT(*)::integer
    INTO v_unit_errors
    FROM hydro_barrage_param_candidates
    WHERE (parametre_code = 'NIVEAU_EAU' AND unite <> 'm')
       OR (parametre_code = 'VOLUME' AND unite <> 'Mm3')
       OR (parametre_code IN ('LACHER', 'APPORT', 'TRANSFERT') AND unite <> 'Mm3/j');

    SELECT COUNT(*)::integer
    INTO v_negative_values
    FROM hydro_barrage_param_candidates
    WHERE valeur < 0;

    SELECT COUNT(*)::integer
    INTO v_debit_volume_mix
    FROM hydro_barrage_param_candidates
    WHERE parametre_code IN ('LACHER', 'APPORT', 'TRANSFERT')
      AND unite = 'm3/s';

    IF v_candidate_count <> 272652
       OR v_business_duplicates <> 0
       OR v_hash_collisions <> 0
       OR v_fk_collisions <> 0
       OR v_nulls <> 0
       OR v_unit_errors <> 0
       OR v_negative_values <> 0
       OR v_debit_volume_mix <> 0 THEN
        UPDATE audit.hydro_barrage_param_load_audit a
        SET
            finished_at = clock_timestamp(),
            status = 'BLOCKED_PRE_INSERT_QA',
            error_message = 'Pre-insert QA failed',
            qa_json = jsonb_build_object(
                'candidate_count', v_candidate_count,
                'business_duplicates', v_business_duplicates,
                'hash_collisions', v_hash_collisions,
                'fk_collisions', v_fk_collisions,
                'null_critical_rows', v_nulls,
                'unit_errors', v_unit_errors,
                'negative_values', v_negative_values,
                'debit_volume_mix', v_debit_volume_mix
            )
        FROM hydro_barrage_param_load_ctx ctx
        WHERE a.run_id = ctx.run_id;

        RAISE EXCEPTION 'Pre-insert QA failed';
    END IF;
END
$$;

INSERT INTO hydro.mesure_barrage_param (
    barrage_id,
    temps,
    parametre_code,
    parametre_ref_id,
    valeur,
    unite,
    scenario,
    scenario_id,
    source_table,
    source_row_id,
    source_row_hash,
    target_business_key_hash,
    metadata_json
)
SELECT
    barrage_id,
    temps,
    parametre_code,
    parametre_ref_id,
    valeur,
    unite,
    scenario,
    scenario_id,
    source_table,
    source_row_id,
    source_row_hash,
    target_business_key_hash,
    metadata_json
FROM hydro_barrage_param_candidates;

UPDATE audit.hydro_barrage_param_load_audit a
SET
    finished_at = clock_timestamp(),
    status = 'SUCCESS',
    volume_inserted = (
        SELECT COUNT(*)::integer
        FROM hydro.mesure_barrage_param
    ) - a.volume_before,
    volume_final = (
        SELECT COUNT(*)::integer
        FROM hydro.mesure_barrage_param
    ),
    qa_json = jsonb_build_object(
        'post_load_volume', (SELECT COUNT(*) FROM hydro.mesure_barrage_param),
        'business_duplicates', (
            SELECT COUNT(*)
            FROM (
                SELECT barrage_id, temps, parametre_code, scenario
                FROM hydro.mesure_barrage_param
                GROUP BY barrage_id, temps, parametre_code, scenario
                HAVING COUNT(*) > 1
            ) d
        ),
        'null_barrage_id', (SELECT COUNT(*) FROM hydro.mesure_barrage_param WHERE barrage_id IS NULL),
        'null_temps', (SELECT COUNT(*) FROM hydro.mesure_barrage_param WHERE temps IS NULL),
        'null_valeur', (SELECT COUNT(*) FROM hydro.mesure_barrage_param WHERE valeur IS NULL),
        'null_parametre_ref_id', (SELECT COUNT(*) FROM hydro.mesure_barrage_param WHERE parametre_ref_id IS NULL),
        'unit_errors', (
            SELECT COUNT(*)
            FROM hydro.mesure_barrage_param
            WHERE (parametre_code = 'NIVEAU_EAU' AND unite <> 'm')
               OR (parametre_code = 'VOLUME' AND unite <> 'Mm3')
               OR (parametre_code IN ('LACHER', 'APPORT', 'TRANSFERT') AND unite <> 'Mm3/j')
        ),
        'debit_volume_mix', (
            SELECT COUNT(*)
            FROM hydro.mesure_barrage_param
            WHERE parametre_code IN ('LACHER', 'APPORT', 'TRANSFERT')
              AND unite = 'm3/s'
        ),
        'business_hash_collisions', (
            SELECT COALESCE(SUM(n - 1), 0)
            FROM (
                SELECT target_business_key_hash, COUNT(*) AS n
                FROM hydro.mesure_barrage_param
                GROUP BY target_business_key_hash
                HAVING COUNT(*) > 1
            ) h
        )
    )
FROM hydro_barrage_param_load_ctx ctx
WHERE a.run_id = ctx.run_id;

COMMIT;

SELECT
    run_id,
    status,
    volume_before,
    backup_table,
    volume_insert_attendu,
    volume_inserted,
    volume_final,
    started_at,
    finished_at
FROM audit.hydro_barrage_param_load_audit
ORDER BY started_at DESC
LIMIT 1;
