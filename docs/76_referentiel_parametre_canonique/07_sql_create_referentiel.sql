-- Phase 2 - Creation du referentiel canonique final

BEGIN;

CREATE TABLE IF NOT EXISTS metadata.referentiel_parametre_canonique (
    parametre_ref_id uuid PRIMARY KEY,
    code_parametre text NOT NULL UNIQUE,
    nom_parametre text NOT NULL,
    type_metier text NOT NULL,
    aliases jsonb NOT NULL DEFAULT '[]'::jsonb,
    domaine text NOT NULL,
    sous_domaine text NULL,
    famille text NULL,
    unite_reference text NULL,
    type_geo_supporte text NOT NULL,
    table_cible text NULL,
    source_origine text NOT NULL,
    type_source text NOT NULL,
    categorie_dashboard text NULL,
    seuil_min numeric NULL,
    seuil_max numeric NULL,
    norme text NULL,
    scenario_compatible boolean NOT NULL DEFAULT true,
    description_metier text NULL,
    statut text NOT NULL DEFAULT 'ACTIF',
    date_creation timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_ref_param_canonique_aliases_array
        CHECK (jsonb_typeof(aliases) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_ref_param_canonique_domaine
    ON metadata.referentiel_parametre_canonique (domaine, sous_domaine);

CREATE INDEX IF NOT EXISTS idx_ref_param_canonique_geo
    ON metadata.referentiel_parametre_canonique (type_geo_supporte);

CREATE INDEX IF NOT EXISTS idx_ref_param_canonique_type_metier
    ON metadata.referentiel_parametre_canonique (type_metier);

COMMENT ON TABLE metadata.referentiel_parametre_canonique IS
'Referentiel metier unique et definitif de tous les parametres exposes par SAD Sebou.';

COMMIT;
