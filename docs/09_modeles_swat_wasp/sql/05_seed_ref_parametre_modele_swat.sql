BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM metadata.ref_modele
        WHERE model_code = 'SWAT_PLUS'
    ) THEN
        RAISE EXCEPTION 'Model SWAT_PLUS missing in metadata.ref_modele. Execute 04_seed_ref_modele.sql first.';
    END IF;
END $$;

WITH swat_model AS (
    SELECT model_id
    FROM metadata.ref_modele
    WHERE model_code = 'SWAT_PLUS'
),
seed_rows AS (
    SELECT *
    FROM (
        VALUES
            ('71111111-1111-4111-8111-111111111111'::uuid, 'NSURQ', 'NO3 in surface runoff', 'Nitrate transporte par ruissellement de surface', 'kg N/ha', 'MODEL_BASIN_YIELD', 'SUBBASIN', 'DAILY', 'MODELE_PUR', false, true, true, true, true, 'https://swatplus.gitbook.io/io-docs', 'REDA', 'A_VALIDER_REDA', true),
            ('72222222-2222-4222-8222-222222222222'::uuid, 'ORGN', 'Organic N yield', 'Rendement en azote organique', 'kg N/ha', 'MODEL_BASIN_YIELD', 'SUBBASIN', 'DAILY', 'MODELE_PUR', false, true, true, true, true, 'https://swatplus.gitbook.io/io-docs', 'REDA', 'A_VALIDER_REDA', true),
            ('73333333-3333-4333-8333-333333333333'::uuid, 'ORGP', 'Organic P yield', 'Rendement en phosphore organique', 'kg P/ha', 'MODEL_BASIN_YIELD', 'SUBBASIN', 'DAILY', 'MODELE_PUR', false, true, true, true, true, 'https://swatplus.gitbook.io/io-docs', 'REDA', 'A_VALIDER_REDA', true),
            ('74444444-4444-4444-8444-444444444444'::uuid, 'SEDP', 'P attached to sediment', 'Phosphore attache au sediment', 'kg P/ha', 'MODEL_BASIN_YIELD', 'SUBBASIN', 'DAILY', 'MODELE_PUR', false, true, true, true, true, 'https://swatplus.gitbook.io/io-docs', 'REDA', 'A_VALIDER_REDA', true),
            ('75555555-5555-4555-8555-555555555555'::uuid, 'SOLP', 'Soluble P in runoff', 'Phosphore soluble dans le ruissellement', 'kg P/ha', 'MODEL_BASIN_YIELD', 'SUBBASIN', 'DAILY', 'MODELE_PUR', false, true, true, true, true, 'https://swatplus.gitbook.io/io-docs', 'REDA', 'A_VALIDER_REDA', true)
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
CROSS JOIN swat_model m
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
