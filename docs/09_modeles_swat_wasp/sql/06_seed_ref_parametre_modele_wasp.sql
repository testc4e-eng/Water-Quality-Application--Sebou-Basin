BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM metadata.ref_modele
        WHERE model_code = 'WASP'
    ) THEN
        RAISE EXCEPTION 'Model WASP missing in metadata.ref_modele. Execute 04_seed_ref_modele.sql first.';
    END IF;
END $$;

WITH wasp_model AS (
    SELECT model_id
    FROM metadata.ref_modele
    WHERE model_code = 'WASP'
),
seed_rows AS (
    SELECT *
    FROM (
        VALUES
            ('81111111-1111-4111-8111-111111111111'::uuid, 'DO', 'Dissolved Oxygen', 'Dissolved oxygen', 'mg/L', 'MODEL_STATE_VARIABLE', 'SEGMENT', 'DAILY', 'DIRECTE', true, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('82222222-2222-4222-8222-222222222222'::uuid, 'PH', 'pH', 'pH', 'pH', 'MODEL_STATE_VARIABLE', 'SEGMENT', 'DAILY', 'DIRECTE', true, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('83333333-3333-4333-8333-333333333333'::uuid, 'WATER_TEMP', 'Water Temperature', 'Water temperature', 'degC', 'MODEL_STATE_VARIABLE', 'SEGMENT', 'DAILY', 'DIRECTE', true, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('84444444-4444-4444-8444-444444444444'::uuid, 'NH4_N', 'Ammonia N', 'Ammonia nitrogen', 'mg/L', 'MODEL_STATE_VARIABLE_DERIVED', 'SEGMENT', 'DAILY', 'DERIVEE', true, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('85555555-5555-4555-8555-555555555555'::uuid, 'NO3_N', 'Nitrate N', 'Nitrate nitrogen', 'mg/L', 'MODEL_STATE_VARIABLE_DERIVED', 'SEGMENT', 'DAILY', 'DERIVEE', true, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('86666666-6666-4666-8666-666666666666'::uuid, 'TKN', 'Total Kjeldahl Nit', 'Total Kjeldahl nitrogen', 'mg/L', 'MODEL_STATE_VARIABLE_DERIVED', 'SEGMENT', 'DAILY', 'DERIVEE', true, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('87777777-7777-4777-8777-777777777777'::uuid, 'TN', 'Total Nitrogen', 'Total nitrogen', 'mg/L', 'MODEL_STATE_VARIABLE_DERIVED', 'SEGMENT', 'DAILY', 'DERIVEE', true, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('88888888-8888-4888-8888-888888888888'::uuid, 'FLOW_OUT', 'Flow Out of Segment', 'Flow out of segment', 'm3/s', 'MODEL_HYDRAULIC_VARIABLE', 'SEGMENT', 'DAILY', 'MODELE_PUR', false, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('89999999-9999-4999-8999-999999999999'::uuid, 'WATER_AGE', 'Water Age', 'Water age', 'day', 'MODEL_INDICATOR', 'SEGMENT', 'DAILY', 'MODELE_PUR', false, true, true, true, true, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('8aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'CBOD_U', 'CBOD (Ultimate)', 'Ultimate carbonaceous biochemical oxygen demand', 'mg/L', 'MODEL_STATE_VARIABLE', 'SEGMENT', 'DAILY', 'NON_UTILISE', false, false, false, false, false, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('8bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'TCBOD', 'Total CBOD', 'Total carbonaceous biochemical oxygen demand', 'mg/L', 'MODEL_STATE_VARIABLE', 'SEGMENT', 'DAILY', 'NON_UTILISE', false, false, false, false, false, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true),
            ('8ccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'SOLIDS', 'Solids', 'Solids', 'mg/L', 'MODEL_STATE_VARIABLE', 'SEGMENT', 'DAILY', 'NON_UTILISE', false, false, false, false, false, 'https://www.epa.gov/hydrowq/water-quality-analysis-simulation-program-wasp', 'ANAS', 'A_VALIDER_ANAS', true)
    ) AS t(
        param_model_id,
        code_modele,
        nom_modele,
        description_officielle,
        unite_modele,
        type_variable_modele,
        echelle_spatiale,
        echelle_temporelle,
        type_convergence,
        comparable_mesure_terrain,
        utilisable_api,
        utilisable_dashboard,
        utilisable_prediction,
        utilisable_recommandation,
        source_documentaire,
        responsable_validation,
        statut_validation,
        active
    )
)
INSERT INTO metadata.ref_parametre_modele (
    param_model_id,
    model_id,
    code_modele,
    nom_modele,
    description_officielle,
    unite_modele,
    type_variable_modele,
    echelle_spatiale,
    echelle_temporelle,
    type_convergence,
    comparable_mesure_terrain,
    utilisable_api,
    utilisable_dashboard,
    utilisable_prediction,
    utilisable_recommandation,
    source_documentaire,
    responsable_validation,
    statut_validation,
    active
)
SELECT
    s.param_model_id,
    m.model_id,
    s.code_modele,
    s.nom_modele,
    s.description_officielle,
    s.unite_modele,
    s.type_variable_modele,
    s.echelle_spatiale,
    s.echelle_temporelle,
    s.type_convergence,
    s.comparable_mesure_terrain,
    s.utilisable_api,
    s.utilisable_dashboard,
    s.utilisable_prediction,
    s.utilisable_recommandation,
    s.source_documentaire,
    s.responsable_validation,
    s.statut_validation,
    s.active
FROM seed_rows s
CROSS JOIN wasp_model m
ON CONFLICT (model_id, code_modele) DO UPDATE
SET
    nom_modele = EXCLUDED.nom_modele,
    description_officielle = EXCLUDED.description_officielle,
    unite_modele = EXCLUDED.unite_modele,
    type_variable_modele = EXCLUDED.type_variable_modele,
    echelle_spatiale = EXCLUDED.echelle_spatiale,
    echelle_temporelle = EXCLUDED.echelle_temporelle,
    type_convergence = EXCLUDED.type_convergence,
    comparable_mesure_terrain = EXCLUDED.comparable_mesure_terrain,
    utilisable_api = EXCLUDED.utilisable_api,
    utilisable_dashboard = EXCLUDED.utilisable_dashboard,
    utilisable_prediction = EXCLUDED.utilisable_prediction,
    utilisable_recommandation = EXCLUDED.utilisable_recommandation,
    source_documentaire = EXCLUDED.source_documentaire,
    responsable_validation = EXCLUDED.responsable_validation,
    statut_validation = EXCLUDED.statut_validation,
    active = EXCLUDED.active,
    updated_at = now();

COMMIT;
