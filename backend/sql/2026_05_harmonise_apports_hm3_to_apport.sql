\set ON_ERROR_STOP on

-- Harmonisation APPORTS_HM3 -> APPORT.
-- Les valeurs numeriques ne sont pas modifiees : 1 Hm3 = 1 Mm3.
-- Perimetre ecritures : referentiel canonique, table parametrique barrage, contraintes associees.

BEGIN;

CREATE TABLE IF NOT EXISTS audit.hydro_barrage_param_apport_harmonisation_audit (
    run_id uuid PRIMARY KEY,
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    status text NOT NULL,
    rows_before integer NOT NULL,
    rows_after integer,
    value_delta_max numeric,
    unit_errors integer,
    orphan_param_rows integer,
    metadata_ref_rows integer,
    backup_hydro_table text,
    backup_ref_table text,
    notes jsonb NOT NULL DEFAULT '{}'::jsonb
);

DO $$
DECLARE
    v_run_id uuid := gen_random_uuid();
    v_backup_hydro text := 'bkp_hydro_mesure_barrage_param_apport_' || to_char(clock_timestamp(), 'YYYYMMDD_HH24MISS_US');
    v_backup_ref text := 'bkp_metadata_referentiel_parametre_canonique_apport_' || to_char(clock_timestamp(), 'YYYYMMDD_HH24MISS_US');
    v_rows_before integer;
    v_rows_after integer;
    v_ref_rows integer;
    v_delta numeric;
    v_unit_errors integer;
    v_orphans integer;
BEGIN
    SELECT COUNT(*)
    INTO v_rows_before
    FROM hydro.mesure_barrage_param
    WHERE parametre_code = 'APPORTS_HM3';

    IF v_rows_before = 0 THEN
        RAISE EXCEPTION 'No APPORTS_HM3 rows found to harmonise.';
    END IF;

    IF EXISTS (SELECT 1 FROM hydro.mesure_barrage_param WHERE parametre_code = 'APPORT') THEN
        RAISE EXCEPTION 'APPORT rows already exist. Manual arbitration required.';
    END IF;

    IF EXISTS (SELECT 1 FROM metadata.referentiel_parametre_canonique WHERE code_parametre = 'APPORT') THEN
        RAISE EXCEPTION 'APPORT canonical reference already exists. Manual arbitration required.';
    END IF;

    EXECUTE format(
        'CREATE TABLE audit.%I AS SELECT * FROM hydro.mesure_barrage_param WHERE parametre_code = %L',
        v_backup_hydro,
        'APPORTS_HM3'
    );

    EXECUTE format(
        'CREATE TABLE audit.%I AS SELECT * FROM metadata.referentiel_parametre_canonique WHERE code_parametre = %L',
        v_backup_ref,
        'APPORTS_HM3'
    );

    INSERT INTO audit.hydro_barrage_param_apport_harmonisation_audit (
        run_id, status, rows_before, backup_hydro_table, backup_ref_table, notes
    )
    VALUES (
        v_run_id,
        'RUNNING',
        v_rows_before,
        'audit.' || v_backup_hydro,
        'audit.' || v_backup_ref,
        jsonb_build_object(
            'operation', 'APPORTS_HM3 -> APPORT',
            'numeric_conversion', 'none',
            'unit_rule', 'Mm3/j',
            'hm3_equals_mm3', true
        )
    );

    ALTER TABLE hydro.mesure_barrage_param
        DROP CONSTRAINT fk_mesure_barrage_param_code,
        DROP CONSTRAINT chk_mesure_barrage_param_code,
        DROP CONSTRAINT chk_mesure_barrage_param_unit;

    UPDATE metadata.referentiel_parametre_canonique
    SET
        code_parametre = 'APPORT',
        nom_parametre = 'Apport barrage',
        aliases = (
            SELECT jsonb_agg(DISTINCT alias_value)
            FROM jsonb_array_elements_text(
                COALESCE(aliases, '[]'::jsonb) || '["APPORTS_HM3", "apports_hm3", "apports_mm3"]'::jsonb
            ) AS alias_value
        ),
        description_metier = 'Apport journalier entrant barrage. Les variantes source HM3/Hm3/hm3 et APPORTS_HM3 sont harmonisees vers APPORT en Mm3/j.'
    WHERE code_parametre = 'APPORTS_HM3'
      AND statut = 'ACTIF';

    GET DIAGNOSTICS v_ref_rows = ROW_COUNT;

    IF v_ref_rows <> 1 THEN
        RAISE EXCEPTION 'Expected exactly 1 canonical reference update, got %.', v_ref_rows;
    END IF;

    UPDATE hydro.mesure_barrage_param
    SET
        parametre_code = 'APPORT',
        target_business_key_hash = md5(
            barrage_id::text || '|' ||
            temps::text || '|' ||
            'APPORT' || '|' ||
            scenario
        ),
        metadata_json = COALESCE(metadata_json, '{}'::jsonb)
            || jsonb_build_object(
                'previous_parametre_code', 'APPORTS_HM3',
                'parametre_code_harmonised_to', 'APPORT',
                'harmonisation_rule', 'rename_only_no_numeric_conversion'
            )
    WHERE parametre_code = 'APPORTS_HM3';

    GET DIAGNOSTICS v_rows_after = ROW_COUNT;

    IF v_rows_after <> v_rows_before THEN
        RAISE EXCEPTION 'Expected % rows updated, got %.', v_rows_before, v_rows_after;
    END IF;

    ALTER TABLE hydro.mesure_barrage_param
        ADD CONSTRAINT fk_mesure_barrage_param_code
            FOREIGN KEY (parametre_code)
            REFERENCES metadata.referentiel_parametre_canonique(code_parametre),
        ADD CONSTRAINT chk_mesure_barrage_param_code
            CHECK (parametre_code IN ('NIVEAU_EAU', 'VOLUME', 'LACHER', 'APPORT', 'TRANSFERT')),
        ADD CONSTRAINT chk_mesure_barrage_param_unit
            CHECK (
                (parametre_code = 'NIVEAU_EAU' AND unite = 'm')
                OR (parametre_code = 'VOLUME' AND unite = 'Mm3')
                OR (parametre_code IN ('LACHER', 'APPORT', 'TRANSFERT') AND unite = 'Mm3/j')
            );

    EXECUTE format(
        'SELECT COALESCE(MAX(ABS(a.valeur - b.valeur)), 0)
         FROM audit.%I b
         JOIN hydro.mesure_barrage_param a ON a.source_row_hash = b.source_row_hash
         WHERE a.parametre_code = %L',
        v_backup_hydro,
        'APPORT'
    )
    INTO v_delta;

    SELECT COUNT(*)
    INTO v_unit_errors
    FROM hydro.mesure_barrage_param
    WHERE NOT (
        (parametre_code = 'NIVEAU_EAU' AND unite = 'm')
        OR (parametre_code = 'VOLUME' AND unite = 'Mm3')
        OR (parametre_code IN ('LACHER', 'APPORT', 'TRANSFERT') AND unite = 'Mm3/j')
    );

    SELECT COUNT(*)
    INTO v_orphans
    FROM hydro.mesure_barrage_param m
    LEFT JOIN metadata.referentiel_parametre_canonique r
      ON r.code_parametre = m.parametre_code
     AND r.parametre_ref_id = m.parametre_ref_id
     AND r.statut = 'ACTIF'
    WHERE r.parametre_ref_id IS NULL;

    IF v_delta <> 0 THEN
        RAISE EXCEPTION 'Numeric values changed during APPORT harmonisation. Max delta = %.', v_delta;
    END IF;

    IF v_unit_errors <> 0 THEN
        RAISE EXCEPTION 'Unit errors after APPORT harmonisation: %.', v_unit_errors;
    END IF;

    IF v_orphans <> 0 THEN
        RAISE EXCEPTION 'Orphan param rows after APPORT harmonisation: %.', v_orphans;
    END IF;

    UPDATE audit.hydro_barrage_param_apport_harmonisation_audit
    SET
        finished_at = now(),
        status = 'SUCCESS',
        rows_after = v_rows_after,
        value_delta_max = v_delta,
        unit_errors = v_unit_errors,
        orphan_param_rows = v_orphans,
        metadata_ref_rows = v_ref_rows
    WHERE run_id = v_run_id;
END $$;

COMMIT;

SELECT
    parametre_code,
    unite,
    COUNT(*) AS rows,
    MIN(valeur) AS min_value,
    MAX(valeur) AS max_value,
    AVG(valeur) AS avg_value
FROM hydro.mesure_barrage_param
WHERE parametre_code IN ('APPORTS_HM3', 'APPORT')
GROUP BY parametre_code, unite
ORDER BY parametre_code;

SELECT *
FROM audit.hydro_barrage_param_apport_harmonisation_audit
ORDER BY started_at DESC
LIMIT 1;
