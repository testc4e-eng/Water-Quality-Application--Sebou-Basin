BEGIN;

CREATE TABLE IF NOT EXISTS metadata.ref_modele (
    model_id uuid PRIMARY KEY,
    model_code text NOT NULL,
    model_name text NOT NULL,
    model_type text NOT NULL,
    version text NOT NULL DEFAULT 'UNSPECIFIED',
    responsable text NOT NULL,
    statut text NOT NULL DEFAULT 'PLANNED',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_ref_modele_model_code UNIQUE (model_code),
    CONSTRAINT ck_ref_modele_model_code_upper CHECK (model_code = upper(model_code)),
    CONSTRAINT ck_ref_modele_model_type CHECK (
        model_type IN (
            'HYDROLOGIC_WATERSHED',
            'WATER_QUALITY',
            'HYDROLOGIC_RAINFALL_RUNOFF',
            'HYDRAULIC_1D2D',
            'ML_SEQUENCE',
            'GRAPH_ML'
        )
    ),
    CONSTRAINT ck_ref_modele_responsable CHECK (
        responsable IN ('REDA', 'ANAS', 'DATA_SCIENCE', 'PLATEFORME', 'A_DEFINIR')
    ),
    CONSTRAINT ck_ref_modele_statut CHECK (
        statut IN ('ACTIVE', 'PLANNED', 'LEGACY', 'INACTIVE')
    )
);

CREATE INDEX IF NOT EXISTS ix_ref_modele_model_type
    ON metadata.ref_modele (model_type);

CREATE INDEX IF NOT EXISTS ix_ref_modele_statut
    ON metadata.ref_modele (statut);

COMMENT ON TABLE metadata.ref_modele IS
'Referentiel des modeles SAD. Cette table ne porte pas les mappings metier/canonique.';

COMMENT ON COLUMN metadata.ref_modele.model_code IS
'Code stable du modele, en majuscules. Exemple: SWAT_PLUS, WASP.';

COMMENT ON COLUMN metadata.ref_modele.statut IS
'Statut de gouvernance du modele, sans impact automatique sur les APIs metier.';

COMMIT;
