BEGIN;

DO $$
DECLARE
    v_missing_count integer;
BEGIN
    SELECT COUNT(*)
    INTO v_missing_count
    FROM (
        VALUES
            ('DO', 'O2_DISS'),
            ('PH', 'PH'),
            ('WATER_TEMP', 'T_EAU'),
            ('NH4_N', 'NH4'),
            ('NO3_N', 'NO3-'),
            ('TKN', 'AZOTE_TOT_KJELD'),
            ('TN', 'AZOTE_TOTAL')
    ) AS expected(code_modele, code_parametre)
    LEFT JOIN metadata.ref_parametre_modele rpm
        ON rpm.code_modele = expected.code_modele
    LEFT JOIN metadata.referentiel_parametre_canonique rpc
        ON rpc.code_parametre = expected.code_parametre
    WHERE rpm.param_model_id IS NULL
       OR rpc.parametre_ref_id IS NULL;

    IF v_missing_count <> 0 THEN
        RAISE EXCEPTION 'Missing ref_parametre_modele or referentiel_parametre_canonique rows for proposed mappings. Execute seeds 05/06 and verify canonical codes first.';
    END IF;
END $$;

WITH seed_rows AS (
    SELECT *
    FROM (
        VALUES
            ('91111111-1111-4111-8111-111111111111'::uuid, 'DO', 'O2_DISS', 'DIRECTE', NULL::text, 0.9500::numeric, 'Correspondance documentaire directe. Activation interdite avant validation scientifique Anas.', 'PENDING_SCIENTIFIC_VALIDATION'),
            ('92222222-2222-4222-8222-222222222222'::uuid, 'PH', 'PH', 'DIRECTE', NULL::text, 0.9800::numeric, 'Correspondance documentaire directe. Activation interdite avant validation scientifique Anas.', 'PENDING_SCIENTIFIC_VALIDATION'),
            ('93333333-3333-4333-8333-333333333333'::uuid, 'WATER_TEMP', 'T_EAU', 'DIRECTE', 'degC -> °C (equivalence directe)', 0.9700::numeric, 'Correspondance documentaire directe. Activation interdite avant validation scientifique Anas.', 'PENDING_SCIENTIFIC_VALIDATION'),
            ('94444444-4444-4444-8444-444444444444'::uuid, 'NH4_N', 'NH4', 'DERIVEE', 'Conversion chimique azote ammoniacal -> ammonium a valider scientifiquement', 0.6500::numeric, 'Proposition documentaire C2-C. Conversion et validation Anas requises.', 'PENDING_SCIENTIFIC_VALIDATION'),
            ('95555555-5555-4555-8555-555555555555'::uuid, 'NO3_N', 'NO3-', 'DERIVEE', 'Conversion chimique azote nitrique -> nitrate a valider scientifiquement', 0.6500::numeric, 'Proposition documentaire C2-C. Conversion et validation Anas requises.', 'PENDING_SCIENTIFIC_VALIDATION'),
            ('96666666-6666-4666-8666-666666666666'::uuid, 'TKN', 'AZOTE_TOT_KJELD', 'DERIVEE', 'Alignement unite/definition TKN -> AZOTE_TOT_KJELD a valider scientifiquement', 0.7000::numeric, 'Proposition documentaire C2-C. Conversion et validation Anas requises.', 'PENDING_SCIENTIFIC_VALIDATION'),
            ('97777777-7777-4777-8777-777777777777'::uuid, 'TN', 'AZOTE_TOTAL', 'DERIVEE', 'Alignement definition total nitrogen -> AZOTE_TOTAL a valider scientifiquement', 0.7000::numeric, 'Proposition documentaire C2-C. Conversion et validation Anas requises.', 'PENDING_SCIENTIFIC_VALIDATION')
    ) AS t(
        mapping_id,
        code_modele,
        code_parametre_canonique,
        relation_type,
        formule_conversion,
        niveau_confiance,
        justification_scientifique,
        validation_status
    )
)
INSERT INTO metadata.ref_parametre_modele_mapping (
    mapping_id,
    param_model_id,
    parametre_canonique_id,
    relation_type,
    formule_conversion,
    niveau_confiance,
    justification_scientifique,
    validation_status,
    validated_by,
    validated_at,
    active
)
SELECT
    s.mapping_id,
    rpm.param_model_id,
    rpc.parametre_ref_id,
    s.relation_type,
    s.formule_conversion,
    s.niveau_confiance,
    s.justification_scientifique,
    s.validation_status,
    NULL::text,
    NULL::timestamptz,
    false
FROM seed_rows s
JOIN metadata.ref_parametre_modele rpm
    ON rpm.code_modele = s.code_modele
JOIN metadata.referentiel_parametre_canonique rpc
    ON rpc.code_parametre = s.code_parametre_canonique
ON CONFLICT (param_model_id, parametre_canonique_id, relation_type) DO UPDATE
SET
    formule_conversion = EXCLUDED.formule_conversion,
    niveau_confiance = EXCLUDED.niveau_confiance,
    justification_scientifique = EXCLUDED.justification_scientifique,
    validation_status = EXCLUDED.validation_status,
    validated_by = NULL,
    validated_at = NULL,
    active = false,
    updated_at = now();

COMMIT;
