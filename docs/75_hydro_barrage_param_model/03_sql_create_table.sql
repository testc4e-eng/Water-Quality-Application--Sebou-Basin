-- Phase 1 - Creation proposee de hydro.mesure_barrage_param
-- Aucun DROP implicite.
-- A executer seulement apres validation metier du referentiel canonique.

BEGIN;

CREATE TABLE IF NOT EXISTS hydro.mesure_barrage_param (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    barrage_id uuid NOT NULL,
    temps timestamptz NOT NULL,
    parametre_code text NOT NULL,
    parametre_ref_id uuid NULL,
    valeur numeric NOT NULL,
    unite text NOT NULL,
    source_donnee text NOT NULL DEFAULT 'staging.raw_mesures_niv_eau_barrages',
    scenario text NOT NULL DEFAULT 'ACTUEL',
    scenario_id uuid NULL,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    source_table text NOT NULL DEFAULT 'staging.raw_mesures_niv_eau_barrages',
    source_row_hash text NOT NULL,
    target_business_key_hash text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_mesure_barrage_param_target_hash
    ON hydro.mesure_barrage_param (target_business_key_hash);

CREATE UNIQUE INDEX IF NOT EXISTS uq_mesure_barrage_param_source_hash_param
    ON hydro.mesure_barrage_param (source_row_hash, parametre_code, scenario);

CREATE INDEX IF NOT EXISTS idx_mesure_barrage_param_barrage_temps
    ON hydro.mesure_barrage_param (barrage_id, temps DESC, parametre_code);

CREATE INDEX IF NOT EXISTS idx_mesure_barrage_param_param_temps
    ON hydro.mesure_barrage_param (parametre_code, temps DESC);

CREATE INDEX IF NOT EXISTS idx_mesure_barrage_param_ref
    ON hydro.mesure_barrage_param (parametre_ref_id);

COMMENT ON TABLE hydro.mesure_barrage_param IS
'Structure normalisee 1 ligne = 1 parametre barrage, derivee de staging.raw_mesures_niv_eau_barrages avec traçabilite source et hash metier.';

COMMENT ON COLUMN hydro.mesure_barrage_param.metadata_json IS
'Contient les attributs legacy utiles a la traçabilite: ire_barrage, source_id, source_unite, source_unite_harmonisee, source_parametre, duplicate_count, notes QA.';

COMMIT;
