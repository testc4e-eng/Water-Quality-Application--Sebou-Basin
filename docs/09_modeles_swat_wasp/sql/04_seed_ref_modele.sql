BEGIN;

INSERT INTO metadata.ref_modele (
    model_id,
    model_code,
    model_name,
    model_type,
    version,
    responsable,
    statut
)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'SWAT_PLUS', 'SWAT+ Watershed Model', 'HYDROLOGIC_WATERSHED', 'LEGACY_SANDBOX_2026', 'REDA', 'ACTIVE'),
    ('22222222-2222-4222-8222-222222222222', 'WASP', 'EPA Water Quality Analysis Simulation Program', 'WATER_QUALITY', 'LEGACY_SANDBOX_2026', 'ANAS', 'ACTIVE'),
    ('33333333-3333-4333-8333-333333333333', 'HEC_HMS', 'HEC-HMS Hydrologic Model', 'HYDROLOGIC_RAINFALL_RUNOFF', 'PLANNED_V1', 'A_DEFINIR', 'PLANNED'),
    ('44444444-4444-4444-8444-444444444444', 'HEC_RAS', 'HEC-RAS Hydraulic Model', 'HYDRAULIC_1D2D', 'PLANNED_V1', 'A_DEFINIR', 'PLANNED'),
    ('55555555-5555-4555-8555-555555555555', 'LSTM', 'Long Short-Term Memory Model', 'ML_SEQUENCE', 'PLANNED_V1', 'DATA_SCIENCE', 'PLANNED'),
    ('66666666-6666-4666-8666-666666666666', 'GNN', 'Graph Neural Network Model', 'GRAPH_ML', 'PLANNED_V1', 'DATA_SCIENCE', 'PLANNED')
ON CONFLICT (model_code) DO UPDATE
SET
    model_name = EXCLUDED.model_name,
    model_type = EXCLUDED.model_type,
    version = EXCLUDED.version,
    responsable = EXCLUDED.responsable,
    statut = EXCLUDED.statut,
    updated_at = now();

COMMIT;
