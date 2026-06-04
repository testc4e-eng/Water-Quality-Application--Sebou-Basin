BEGIN;

CREATE TABLE IF NOT EXISTS metadata.ref_parametre_modele_mapping (
    mapping_id uuid PRIMARY KEY,
    param_model_id uuid NOT NULL,
    parametre_canonique_id uuid NOT NULL,
    relation_type text NOT NULL,
    formule_conversion text,
    niveau_confiance numeric(5,4) NOT NULL DEFAULT 0.0000,
    justification_scientifique text,
    validation_status text NOT NULL,
    validated_by text,
    validated_at timestamptz,
    active boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_ref_param_modele_mapping_param_modele
        FOREIGN KEY (param_model_id)
        REFERENCES metadata.ref_parametre_modele(param_model_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_ref_param_modele_mapping_param_canonique
        FOREIGN KEY (parametre_canonique_id)
        REFERENCES metadata.referentiel_parametre_canonique(parametre_ref_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT uq_ref_parametre_modele_mapping UNIQUE (
        param_model_id,
        parametre_canonique_id,
        relation_type
    ),
    CONSTRAINT ck_ref_param_modele_mapping_relation_type CHECK (
        relation_type IN ('DIRECTE', 'DERIVEE')
    ),
    CONSTRAINT ck_ref_param_modele_mapping_niveau_confiance CHECK (
        niveau_confiance >= 0.0000 AND niveau_confiance <= 1.0000
    ),
    CONSTRAINT ck_ref_param_modele_mapping_validation_status CHECK (
        validation_status IN (
            'PENDING_SCIENTIFIC_VALIDATION',
            'VALIDATED_SCIENTIFIC',
            'REJECTED_SCIENTIFIC',
            'RETIRED'
        )
    ),
    CONSTRAINT ck_ref_param_modele_mapping_activation_requires_validation CHECK (
        NOT active OR validation_status = 'VALIDATED_SCIENTIFIC'
    ),
    CONSTRAINT ck_ref_param_modele_mapping_validated_payload CHECK (
        validation_status <> 'VALIDATED_SCIENTIFIC'
        OR (validated_by IS NOT NULL AND validated_at IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS ix_ref_param_modele_mapping_param_model_id
    ON metadata.ref_parametre_modele_mapping (param_model_id);

CREATE INDEX IF NOT EXISTS ix_ref_param_modele_mapping_parametre_canonique_id
    ON metadata.ref_parametre_modele_mapping (parametre_canonique_id);

CREATE INDEX IF NOT EXISTS ix_ref_param_modele_mapping_validation_status
    ON metadata.ref_parametre_modele_mapping (validation_status);

CREATE INDEX IF NOT EXISTS ix_ref_param_modele_mapping_active
    ON metadata.ref_parametre_modele_mapping (active);

COMMENT ON TABLE metadata.ref_parametre_modele_mapping IS
'Table de propositions de convergence entre parametre modele et parametre canonique SAD.';

COMMENT ON COLUMN metadata.ref_parametre_modele_mapping.active IS
'Doit rester FALSE tant que validation_status = PENDING_SCIENTIFIC_VALIDATION.';

COMMIT;
