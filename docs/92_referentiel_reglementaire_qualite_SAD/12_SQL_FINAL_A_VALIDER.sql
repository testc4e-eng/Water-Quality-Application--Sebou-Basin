-- PROPOSITION UNIQUEMENT - NE PAS EXECUTER SANS VALIDATION METIER ET TECHNIQUE
-- Projet WQDSS / SAD Sebou
-- Référentiel réglementaire qualité basé exclusivement sur le Tableau n°1 officiel eaux de surface.
-- Aucun INSERT/UPDATE/DELETE n'est inclus dans ce fichier.
-- Compatible PostgreSQL 17. Extension attendue : pgcrypto pour gen_random_uuid().
-- Décisions intégrées : unités métaux, microbiologie, DBO5/DCO, alias NO3/O2, règle Hg, vrais absents non utilisables.

CREATE SCHEMA IF NOT EXISTS metadata;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS metadata.qualite_source_reglementaire (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_source text NOT NULL,
    source_document text NOT NULL,
    version_reglementaire text NOT NULL,
    titre text NOT NULL,
    page_pdf integer,
    tableau_pdf text,
    statut_operationnel text NOT NULL DEFAULT 'REGLEMENTAIRE_OPERATIONNEL',
    actif boolean NOT NULL DEFAULT true,
    commentaire text,
    validation_metier text NOT NULL DEFAULT 'A_VALIDER',
    validation_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_qualite_source_reglementaire UNIQUE (code_source, version_reglementaire),
    CONSTRAINT ck_qualite_source_validation CHECK (validation_metier IN ('A_VALIDER','VALIDATED_DEV','VALIDATED_METIER','REJECTED','ARCHIVED'))
);

CREATE TABLE IF NOT EXISTS metadata.qualite_type_eau (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_type_eau text NOT NULL,
    libelle_type_eau text NOT NULL,
    source_document text NOT NULL,
    version_reglementaire text NOT NULL,
    statut_operationnel text NOT NULL DEFAULT 'REGLEMENTAIRE_OPERATIONNEL',
    actif boolean NOT NULL DEFAULT true,
    commentaire text,
    validation_metier text NOT NULL DEFAULT 'A_VALIDER',
    validation_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_qualite_type_eau UNIQUE (code_type_eau, version_reglementaire),
    CONSTRAINT ck_qualite_type_eau_statut CHECK (statut_operationnel IN ('REGLEMENTAIRE_OPERATIONNEL','DOCUMENTAIRE_NON_OPERATIONNEL','OBSERVATIONNEL'))
);

CREATE TABLE IF NOT EXISTS metadata.qualite_classe_reglementaire (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_classe text NOT NULL,
    libelle_classe text NOT NULL,
    ordre_qualite integer NOT NULL,
    score_min numeric,
    score_max numeric,
    couleur_pdf text,
    couleur_sad text NOT NULL,
    couleur_hex text,
    source_document text NOT NULL,
    version_reglementaire text NOT NULL,
    actif boolean NOT NULL DEFAULT true,
    commentaire text,
    validation_metier text NOT NULL DEFAULT 'A_VALIDER',
    validation_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_qualite_classe_reglementaire UNIQUE (code_classe, version_reglementaire),
    CONSTRAINT ck_qualite_classe_ordre CHECK (ordre_qualite BETWEEN 1 AND 5),
    CONSTRAINT ck_qualite_classe_couleur_sad CHECK (couleur_sad IN ('bleu','vert','jaune/orange','rouge','violet'))
);

CREATE TABLE IF NOT EXISTS metadata.qualite_parametre_reglementaire (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_reglementaire text NOT NULL,
    code_canonique_cible text,
    libelle_reglementaire text NOT NULL,
    parametre_pdf text NOT NULL,
    famille_parametre text,
    unite_reglementaire_source text,
    unite_moteur text,
    facteur_conversion_vers_unite_moteur numeric,
    classifiable boolean NOT NULL DEFAULT true,
    statut_operationnel text NOT NULL DEFAULT 'REGLEMENTAIRE_CLASSIFIABLE',
    source_document text NOT NULL,
    version_reglementaire text NOT NULL,
    actif boolean NOT NULL DEFAULT true,
    commentaire text,
    validation_metier text NOT NULL DEFAULT 'A_VALIDER',
    validation_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_qualite_parametre_reglementaire UNIQUE (code_reglementaire, version_reglementaire),
    CONSTRAINT ck_qualite_parametre_statut CHECK (statut_operationnel IN ('REGLEMENTAIRE_CLASSIFIABLE','OBSERVATIONNEL_NON_CLASSIFIABLE','DOCUMENTAIRE_NON_OPERATIONNEL','EXCLU_MOTEUR_QUALITE')),
    CONSTRAINT ck_qualite_parametre_conversion CHECK (facteur_conversion_vers_unite_moteur IS NULL OR facteur_conversion_vers_unite_moteur > 0)
);

CREATE TABLE IF NOT EXISTS metadata.qualite_mapping_canonique_reglementaire (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parametre_reglementaire_id uuid NOT NULL REFERENCES metadata.qualite_parametre_reglementaire(id),
    parametre_canonique_id uuid NULL REFERENCES metadata.referentiel_parametre_canonique(parametre_ref_id),
    code_reglementaire text NOT NULL,
    code_canonique text,
    statut_mapping text NOT NULL DEFAULT 'a_valider_metier',
    source_column text,
    source_system text NOT NULL DEFAULT 'REGLEMENTAIRE_QUALITE_ABH',
    source_document text NOT NULL,
    version_reglementaire text NOT NULL,
    actif boolean NOT NULL DEFAULT true,
    commentaire text,
    validation_metier text NOT NULL DEFAULT 'A_VALIDER',
    validation_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_qualite_mapping_statut CHECK (statut_mapping IN (
        'match_exact',
        'match_exact_unite_normalisee',
        'match_exact_unite_equivalente',
        'match_probable',
        'match_probable_fort',
        'alias_reglementaire_valide',
        'absent_non_utilisable',
        'conflit_libelle',
        'ambigu',
        'a_valider_metier'
    ))
);

CREATE TABLE IF NOT EXISTS metadata.qualite_seuil_reglementaire (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parametre_reglementaire_id uuid NOT NULL REFERENCES metadata.qualite_parametre_reglementaire(id),
    type_eau_id uuid NOT NULL REFERENCES metadata.qualite_type_eau(id),
    classe_id uuid NOT NULL REFERENCES metadata.qualite_classe_reglementaire(id),
    code_reglementaire text NOT NULL,
    code_canonique_cible text,
    code_classe text NOT NULL,
    borne_min_source numeric,
    operateur_min text,
    borne_max_source numeric,
    operateur_max text,
    borne_min_moteur numeric,
    borne_max_moteur numeric,
    valeur_intervalle_originale text NOT NULL,
    unite_reglementaire_source text,
    unite_moteur text,
    facteur_conversion_vers_unite_moteur numeric,
    regle_specifique text,
    indice_min numeric,
    indice_max numeric,
    confiance_extraction text NOT NULL DEFAULT 'moyenne',
    source_document text NOT NULL,
    version_reglementaire text NOT NULL,
    actif boolean NOT NULL DEFAULT true,
    commentaire text,
    validation_metier text NOT NULL DEFAULT 'A_VALIDER',
    validation_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_qualite_seuil_reglementaire UNIQUE (code_reglementaire, code_classe, version_reglementaire, valeur_intervalle_originale),
    CONSTRAINT ck_qualite_seuil_op_min CHECK (operateur_min IS NULL OR operateur_min IN ('>','>=','=','<','<=')),
    CONSTRAINT ck_qualite_seuil_op_max CHECK (operateur_max IS NULL OR operateur_max IN ('>','>=','=','<','<=')),
    CONSTRAINT ck_qualite_seuil_validation CHECK (validation_metier IN ('A_VALIDER','VALIDATED_DEV','VALIDATED_METIER','REJECTED','ARCHIVED')),
    CONSTRAINT ck_qualite_seuil_conversion CHECK (facteur_conversion_vers_unite_moteur IS NULL OR facteur_conversion_vers_unite_moteur > 0)
);

CREATE TABLE IF NOT EXISTS metadata.qualite_regle_classification (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_regle text NOT NULL,
    libelle_regle text NOT NULL,
    type_regle text NOT NULL,
    ordre_execution integer NOT NULL DEFAULT 100,
    description text NOT NULL,
    source_document text NOT NULL,
    version_reglementaire text NOT NULL,
    actif boolean NOT NULL DEFAULT true,
    commentaire text,
    validation_metier text NOT NULL DEFAULT 'A_VALIDER',
    validation_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_qualite_regle_classification UNIQUE (code_regle, version_reglementaire),
    CONSTRAINT ck_qualite_regle_type CHECK (type_regle IN ('PARAMETRE','INTERVALLE','UNITE','GLOBAL','NON_CLASSIFIABLE','TRACE','REGLE_SPECIFIQUE'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_qualite_mapping_canonique_reg
    ON metadata.qualite_mapping_canonique_reglementaire (code_reglementaire, COALESCE(code_canonique, ''), version_reglementaire);

CREATE INDEX IF NOT EXISTS ix_qualite_source_reglementaire_actif ON metadata.qualite_source_reglementaire (actif, validation_metier);
CREATE INDEX IF NOT EXISTS ix_qualite_type_eau_code ON metadata.qualite_type_eau (code_type_eau, actif);
CREATE INDEX IF NOT EXISTS ix_qualite_classe_ordre ON metadata.qualite_classe_reglementaire (ordre_qualite, actif);
CREATE INDEX IF NOT EXISTS ix_qualite_parametre_reg_code ON metadata.qualite_parametre_reglementaire (code_reglementaire, actif, validation_metier);
CREATE INDEX IF NOT EXISTS ix_qualite_parametre_reg_canonique ON metadata.qualite_parametre_reglementaire (code_canonique_cible, actif);
CREATE INDEX IF NOT EXISTS ix_qualite_parametre_reg_famille ON metadata.qualite_parametre_reglementaire (famille_parametre);
CREATE INDEX IF NOT EXISTS ix_qualite_mapping_reg_canon ON metadata.qualite_mapping_canonique_reglementaire (code_reglementaire, code_canonique, statut_mapping);
CREATE INDEX IF NOT EXISTS ix_qualite_mapping_canonique_id ON metadata.qualite_mapping_canonique_reglementaire (parametre_canonique_id);
CREATE INDEX IF NOT EXISTS ix_qualite_seuil_lookup ON metadata.qualite_seuil_reglementaire (code_reglementaire, code_classe, actif, validation_metier);
CREATE INDEX IF NOT EXISTS ix_qualite_seuil_canonique_lookup ON metadata.qualite_seuil_reglementaire (code_canonique_cible, code_classe, actif, validation_metier);
CREATE INDEX IF NOT EXISTS ix_qualite_seuil_param_type ON metadata.qualite_seuil_reglementaire (parametre_reglementaire_id, type_eau_id, classe_id);
CREATE INDEX IF NOT EXISTS ix_qualite_regle_type ON metadata.qualite_regle_classification (type_regle, actif, ordre_execution);

-- Recommandation : ajouter un trigger générique updated_at si le projet dispose déjà d'une fonction commune.
-- Exemple à adapter après vérification :
-- CREATE TRIGGER trg_qualite_parametre_reglementaire_updated_at
-- BEFORE UPDATE ON metadata.qualite_parametre_reglementaire
-- FOR EACH ROW EXECUTE FUNCTION metadata.set_updated_at();
