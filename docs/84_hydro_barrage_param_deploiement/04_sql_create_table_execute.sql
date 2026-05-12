\set ON_ERROR_STOP on

-- Phase 2 - Creation structurelle de hydro.mesure_barrage_param
-- Portee autorisee:
--   - CREATE TABLE cible si absente
--   - contraintes, index et commentaires strictement lies
-- Interdits:
--   - aucune insertion de donnees
--   - aucune modification de hydro.mesure_barrage legacy
--   - aucune modification hydro.mesure_debit, qualite.*, meteo.*, staging.*
--   - aucun usage de ctid

BEGIN;

CREATE TABLE IF NOT EXISTS hydro.mesure_barrage_param (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    barrage_id uuid NOT NULL,
    temps timestamptz NOT NULL,
    parametre_code text NOT NULL,
    parametre_ref_id uuid NOT NULL,
    valeur numeric NOT NULL,
    unite text NOT NULL,
    scenario text NOT NULL DEFAULT 'ACTUEL',
    scenario_id uuid NULL,
    source_table text NOT NULL,
    source_row_id text NULL,
    source_row_hash text NOT NULL,
    target_business_key_hash text NOT NULL,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_mesure_barrage_param_business_hash
        UNIQUE (target_business_key_hash),
    CONSTRAINT fk_mesure_barrage_param_ref_id
        FOREIGN KEY (parametre_ref_id)
        REFERENCES metadata.referentiel_parametre_canonique (parametre_ref_id),
    CONSTRAINT fk_mesure_barrage_param_code
        FOREIGN KEY (parametre_code)
        REFERENCES metadata.referentiel_parametre_canonique (code_parametre),
    CONSTRAINT chk_mesure_barrage_param_code
        CHECK (parametre_code IN ('NIVEAU_EAU', 'VOLUME', 'LACHER', 'APPORTS_HM3', 'TRANSFERT')),
    CONSTRAINT chk_mesure_barrage_param_unit
        CHECK (
            (parametre_code = 'NIVEAU_EAU' AND unite = 'm')
            OR (parametre_code = 'VOLUME' AND unite = 'Mm3')
            OR (parametre_code IN ('LACHER', 'APPORTS_HM3', 'TRANSFERT') AND unite = 'Mm3/j')
        ),
    CONSTRAINT chk_mesure_barrage_param_valeur_non_negative
        CHECK (valeur >= 0),
    CONSTRAINT chk_mesure_barrage_param_metadata_object
        CHECK (jsonb_typeof(metadata_json) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_mesure_barrage_param_barrage_temps
    ON hydro.mesure_barrage_param (barrage_id, temps DESC);

CREATE INDEX IF NOT EXISTS idx_mesure_barrage_param_barrage_temps_code
    ON hydro.mesure_barrage_param (barrage_id, temps DESC, parametre_code);

CREATE INDEX IF NOT EXISTS idx_mesure_barrage_param_code_temps
    ON hydro.mesure_barrage_param (parametre_code, temps DESC);

CREATE INDEX IF NOT EXISTS idx_mesure_barrage_param_source_row_hash
    ON hydro.mesure_barrage_param (source_row_hash);

COMMENT ON TABLE hydro.mesure_barrage_param IS
'Table parametrique des mesures barrage. Une ligne represente un parametre metier pour un barrage, un temps et un scenario.';

COMMENT ON COLUMN hydro.mesure_barrage_param.id IS 'Identifiant technique UUID de la ligne parametrique.';
COMMENT ON COLUMN hydro.mesure_barrage_param.barrage_id IS 'Identifiant UUID du barrage issu du mapping barrage canonique.';
COMMENT ON COLUMN hydro.mesure_barrage_param.temps IS 'Horodatage de mesure en timestamptz.';
COMMENT ON COLUMN hydro.mesure_barrage_param.parametre_code IS 'Code metier canonique: NIVEAU_EAU, VOLUME, LACHER, APPORTS_HM3 ou TRANSFERT.';
COMMENT ON COLUMN hydro.mesure_barrage_param.parametre_ref_id IS 'Reference vers metadata.referentiel_parametre_canonique.';
COMMENT ON COLUMN hydro.mesure_barrage_param.valeur IS 'Valeur numerique non negative du parametre.';
COMMENT ON COLUMN hydro.mesure_barrage_param.unite IS 'Unite canonique coherente avec parametre_code.';
COMMENT ON COLUMN hydro.mesure_barrage_param.scenario IS 'Scenario fonctionnel, ACTUEL par defaut.';
COMMENT ON COLUMN hydro.mesure_barrage_param.scenario_id IS 'Reference scenario optionnelle pour extensions futures.';
COMMENT ON COLUMN hydro.mesure_barrage_param.source_table IS 'Table source d origine de la ligne.';
COMMENT ON COLUMN hydro.mesure_barrage_param.source_row_id IS 'Identifiant source stable si disponible.';
COMMENT ON COLUMN hydro.mesure_barrage_param.source_row_hash IS 'Hash stable de la ligne source.';
COMMENT ON COLUMN hydro.mesure_barrage_param.target_business_key_hash IS 'Hash stable de la cle metier cible barrage, temps, parametre et scenario.';
COMMENT ON COLUMN hydro.mesure_barrage_param.metadata_json IS 'Trace JSON des informations source et controles de migration.';
COMMENT ON COLUMN hydro.mesure_barrage_param.created_at IS 'Date de creation technique de la ligne.';

COMMIT;

\echo '=== Controle Phase 2 - hydro.mesure_barrage_param ==='

SELECT
    EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'hydro'
          AND table_name = 'mesure_barrage_param'
    ) AS table_exists;

SELECT COUNT(*) AS volume_initial
FROM hydro.mesure_barrage_param;

SELECT
    conname,
    contype
FROM pg_constraint
WHERE conrelid = 'hydro.mesure_barrage_param'::regclass
ORDER BY conname;

SELECT
    indexname
FROM pg_indexes
WHERE schemaname = 'hydro'
  AND tablename = 'mesure_barrage_param'
ORDER BY indexname;
