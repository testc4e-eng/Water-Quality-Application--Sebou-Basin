BEGIN;

CREATE TABLE IF NOT EXISTS metadata.ref_parametre_modele (
    param_model_id uuid PRIMARY KEY,
    model_id uuid NOT NULL,
    code_modele text NOT NULL,
    nom_modele text NOT NULL,
    description_officielle text,
    unite_modele text,
    type_variable_modele text NOT NULL,
    echelle_spatiale text NOT NULL,
    echelle_temporelle text NOT NULL,
    type_convergence text NOT NULL,
    comparable_mesure_terrain boolean NOT NULL DEFAULT false,
    utilisable_api boolean NOT NULL DEFAULT false,
    utilisable_dashboard boolean NOT NULL DEFAULT false,
    utilisable_prediction boolean NOT NULL DEFAULT false,
    utilisable_recommandation boolean NOT NULL DEFAULT false,
    source_documentaire text,
    responsable_validation text NOT NULL,
    statut_validation text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_ref_parametre_modele_model
        FOREIGN KEY (model_id)
        REFERENCES metadata.ref_modele(model_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT uq_ref_parametre_modele_model_code UNIQUE (model_id, code_modele),
    CONSTRAINT ck_ref_parametre_modele_code_upper CHECK (code_modele ~ '^[A-Z0-9_]+$'),
    CONSTRAINT ck_ref_parametre_modele_type_variable CHECK (
        type_variable_modele IN (
            'MODEL_STATE_VARIABLE',
            'MODEL_STATE_VARIABLE_DERIVED',
            'MODEL_HYDRAULIC_VARIABLE',
            'MODEL_BASIN_YIELD',
            'MODEL_INDICATOR'
        )
    ),
    CONSTRAINT ck_ref_parametre_modele_echelle_spatiale CHECK (
        echelle_spatiale IN ('SUBBASIN', 'SEGMENT', 'BASIN', 'REACH', 'GRID', 'SCENARIO')
    ),
    CONSTRAINT ck_ref_parametre_modele_echelle_temporelle CHECK (
        echelle_temporelle IN ('DAILY', 'MONTHLY', 'ANNUAL', 'SCENARIO', 'EVENT')
    ),
    CONSTRAINT ck_ref_parametre_modele_type_convergence CHECK (
        type_convergence IN ('DIRECTE', 'DERIVEE', 'MODELE_PUR', 'NON_UTILISE')
    ),
    CONSTRAINT ck_ref_parametre_modele_responsable_validation CHECK (
        responsable_validation IN ('REDA', 'ANAS', 'REDA_ET_ANAS', 'AUCUN')
    ),
    CONSTRAINT ck_ref_parametre_modele_statut_validation CHECK (
        statut_validation IN (
            'VALIDE_OFFICIEL',
            'VALIDE_AVEC_CONVERSION',
            'MODELE_PUR_VALIDE',
            'NON_UTILISE_JUSTIFIE',
            'A_VALIDER_REDA',
            'A_VALIDER_ANAS',
            'A_VALIDER_REDA_ET_ANAS'
        )
    )
);

CREATE INDEX IF NOT EXISTS ix_ref_parametre_modele_model_id
    ON metadata.ref_parametre_modele (model_id);

CREATE INDEX IF NOT EXISTS ix_ref_parametre_modele_type_convergence
    ON metadata.ref_parametre_modele (type_convergence);

CREATE INDEX IF NOT EXISTS ix_ref_parametre_modele_statut_validation
    ON metadata.ref_parametre_modele (statut_validation);

CREATE INDEX IF NOT EXISTS ix_ref_parametre_modele_active
    ON metadata.ref_parametre_modele (active);

COMMENT ON TABLE metadata.ref_parametre_modele IS
'Referentiel des parametres de modelisation. Aucun lien automatique vers le moteur metier.';

COMMENT ON COLUMN metadata.ref_parametre_modele.type_convergence IS
'DIRECTE, DERIVEE, MODELE_PUR ou NON_UTILISE. Ne pas confondre avec un mapping actif.';

COMMENT ON COLUMN metadata.ref_parametre_modele.statut_validation IS
'Statut de validation scientifique attendu. Les valeurs A_VALIDER_* ne doivent pas activer le metier.';

COMMIT;
