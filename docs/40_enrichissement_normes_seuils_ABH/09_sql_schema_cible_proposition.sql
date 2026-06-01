-- PROPOSITION UNIQUEMENT - NE PAS EXECUTER SANS VALIDATION
-- Schéma cible documentaire pour les seuils qualité extraits du PDF client.

CREATE TABLE metadata.qualite_document_source (
    document_source_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_document text NOT NULL UNIQUE,
    source_path text,
    page_count integer,
    extraction_method text,
    statut_validation text NOT NULL DEFAULT 'TO_VALIDATE',
    commentaire_source text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metadata.qualite_classe (
    classe_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_classe text NOT NULL UNIQUE,
    libelle_classe text NOT NULL,
    score_min numeric,
    score_max numeric,
    couleur text,
    ordre_qualite integer NOT NULL,
    statut_validation text NOT NULL DEFAULT 'TO_VALIDATE',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metadata.qualite_type_eau (
    type_eau_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_type_eau text NOT NULL UNIQUE,
    libelle_type_eau text NOT NULL,
    milieu text,
    statut_validation text NOT NULL DEFAULT 'TO_VALIDATE',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metadata.qualite_seuil_parametre (
    seuil_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_source_id uuid NOT NULL REFERENCES metadata.qualite_document_source(document_source_id),
    type_eau_id uuid NOT NULL REFERENCES metadata.qualite_type_eau(type_eau_id),
    classe_id uuid NOT NULL REFERENCES metadata.qualite_classe(classe_id),
    page_pdf integer NOT NULL,
    tableau_pdf text NOT NULL,
    parametre_pdf text NOT NULL,
    parametre_code_propose text,
    unite_pdf text,
    borne_min numeric,
    operateur_min text,
    borne_max numeric,
    operateur_max text,
    valeur_intervalle_originale text NOT NULL,
    confiance_extraction text NOT NULL,
    statut_validation text NOT NULL DEFAULT 'TO_VALIDATE',
    commentaire_source text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (document_source_id, type_eau_id, tableau_pdf, parametre_pdf, classe_id)
);

CREATE TABLE metadata.qualite_parametre_mapping_pdf (
    mapping_pdf_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parametre_pdf text NOT NULL,
    parametre_code_propose text,
    parametre_ref_id uuid REFERENCES metadata.referentiel_parametre(id),
    code_canonique text,
    statut_mapping text NOT NULL DEFAULT 'TO_VALIDATE',
    commentaire text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (parametre_pdf, parametre_code_propose)
);

CREATE TABLE metadata.qualite_regle_classification (
    regle_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_regle text NOT NULL UNIQUE,
    libelle_regle text NOT NULL,
    description text NOT NULL,
    statut_validation text NOT NULL DEFAULT 'TO_VALIDATE',
    created_at timestamptz NOT NULL DEFAULT now()
);
