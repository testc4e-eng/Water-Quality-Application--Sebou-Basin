-- =============================================================================
-- PHASE 1 — NORMALISATION DES RÉFÉRENTIELS
-- Enrichissement de metadata.* pour la gouvernance des paramètres
-- 
-- IMPORTANT : Script idempotent (safe à ré-exécuter)
-- Ordre d'exécution :
--   1. ALTER TABLE metadata.referentiel_parametre (nouvelles colonnes)
--   2. CREATE TABLE metadata.referentiel_unite
--   3. CREATE TABLE metadata.mapping_swat_parametre
--   4. CREATE TABLE metadata.mapping_wasp_parametre
--   5. Peuplement initial des unités canoniques
--   6. Peuplement liens SWAT/WASP → referentiel_parametre
-- =============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. ENRICHISSEMENT DE metadata.referentiel_parametre
-- Ajout des colonnes : domaine métier + codes modèles
-- ----------------------------------------------------------------------------

ALTER TABLE metadata.referentiel_parametre
    ADD COLUMN IF NOT EXISTS is_qualite          boolean         NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_hydro            boolean         NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_meteo            boolean         NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_modele_swat      boolean         NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_modele_wasp      boolean         NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS code_swat_output    text,
    ADD COLUMN IF NOT EXISTS code_wasp_output    text,
    ADD COLUMN IF NOT EXISTS seuils_reglementaires jsonb         DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS norme_marocaine     text,
    ADD COLUMN IF NOT EXISTS norme_oms           text;

-- Commentaires
COMMENT ON COLUMN metadata.referentiel_parametre.is_qualite          IS 'Paramètre utilisé dans le domaine qualité eau';
COMMENT ON COLUMN metadata.referentiel_parametre.is_hydro            IS 'Paramètre utilisé dans le domaine hydrologie';
COMMENT ON COLUMN metadata.referentiel_parametre.is_meteo            IS 'Paramètre utilisé dans le domaine météorologie';
COMMENT ON COLUMN metadata.referentiel_parametre.is_modele_swat      IS 'Paramètre produit ou consommé par le modèle SWAT';
COMMENT ON COLUMN metadata.referentiel_parametre.is_modele_wasp      IS 'Paramètre produit ou consommé par le modèle WASP';
COMMENT ON COLUMN metadata.referentiel_parametre.code_swat_output    IS 'Code exact dans swat_output.ref_parametre_qualite.param_code';
COMMENT ON COLUMN metadata.referentiel_parametre.code_wasp_output    IS 'Code exact dans wasp_output.ref_parametre_qualite.code_parametre';
COMMENT ON COLUMN metadata.referentiel_parametre.seuils_reglementaires IS 'Seuils réglementaires jsonb: {"oms": val, "maroc_classe2": val, ...}';

-- Mise à jour des flags domaine d'après le champ existant `domaine`
UPDATE metadata.referentiel_parametre SET is_qualite = true WHERE domaine IN ('qualite', 'eau', 'chimie', 'physico-chimie');
UPDATE metadata.referentiel_parametre SET is_hydro   = true WHERE domaine IN ('hydrologie', 'hydro');
UPDATE metadata.referentiel_parametre SET is_meteo   = true WHERE domaine IN ('meteo', 'climatologie', 'climat');

-- Index sur les nouveaux codes modèles
CREATE INDEX IF NOT EXISTS idx_metadata_ref_param_swat_code
    ON metadata.referentiel_parametre (code_swat_output)
    WHERE code_swat_output IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_metadata_ref_param_wasp_code
    ON metadata.referentiel_parametre (code_wasp_output)
    WHERE code_wasp_output IS NOT NULL;


-- ----------------------------------------------------------------------------
-- 2. TABLE metadata.referentiel_unite
-- Référentiel canonique des unités de mesure
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS metadata.referentiel_unite (
    code_unite      text        PRIMARY KEY,
    libelle         text        NOT NULL,
    symbole         text,
    systeme         text        NOT NULL DEFAULT 'SI',  -- SI | imperial | custom
    grandeur        text,       -- masse, débit, concentration, température, etc.
    facteur_si      double precision DEFAULT 1.0,
    description     text,
    actif           boolean     NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE metadata.referentiel_unite IS 'Référentiel canonique des unités de mesure utilisées dans la plateforme SAD Sebou.';

-- Peuplement initial des unités courantes
INSERT INTO metadata.referentiel_unite (code_unite, libelle, symbole, systeme, grandeur, facteur_si) VALUES
    ('mm',          'Millimètre',                       'mm',      'SI',      'longueur / hauteur eau', 0.001),
    ('m',           'Mètre',                            'm',       'SI',      'longueur',               1.0),
    ('m_ngm',       'Mètre NGM (côte altitude)',        'm NGM',   'custom',  'altitude',               1.0),
    ('m3s',         'Mètre cube par seconde',           'm³/s',    'SI',      'débit',                  1.0),
    ('m3',          'Mètre cube',                       'm³',      'SI',      'volume',                  1.0),
    ('mm3',         'Million de mètres cubes (hm³)',    'Mm³',     'custom',  'volume barrage',          1e6),
    ('ls',          'Litre par seconde',                'l/s',     'SI',      'débit',                   0.001),
    ('mgl',         'Milligramme par litre',            'mg/l',    'SI',      'concentration',           1.0),
    ('ugl',         'Microgramme par litre',            'µg/l',    'SI',      'concentration',           0.001),
    ('ueqL',        'Micro-équivalent par litre',       'µéq/l',   'SI',      'concentration ionique',   1.0),
    ('ntu',         'Unité de turbidité néphélométrique','NTU',    'custom',  'turbidité',               1.0),
    ('us_cm',       'Microsiemens par centimètre',      'µS/cm',   'SI',      'conductivité',            1.0),
    ('degC',        'Degré Celsius',                    '°C',      'SI',      'température',             1.0),
    ('pct',         'Pourcentage',                      '%',       'custom',  'ratio',                   0.01),
    ('pH',          'Potentiel Hydrogène',              'pH',      'custom',  'acidité',                 1.0),
    ('ufc_100ml',   'UFC par 100 mL',                   'UFC/100mL','custom', 'bactériologie',           1.0),
    ('mgO2l',       'Milligramme O2 par litre',         'mgO2/l',  'SI',      'oxygène dissous / DBO',   1.0),
    ('th_caCO3',    'Degré hydrotimétrique (CaCO3)',     '°f',      'custom',  'dureté',                  1.0),
    ('mm_an',       'Millimètre par an',                'mm/an',   'custom',  'précipitation annuelle',  1.0),
    ('sans_unite',  'Sans unité (adimensionnel)',        '-',       'custom',  'adimensionnel',           1.0)
ON CONFLICT (code_unite) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 3. TABLE metadata.mapping_swat_parametre
-- Correspondance swat_output → metadata.referentiel_parametre
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS metadata.mapping_swat_parametre (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    param_code_swat     text        NOT NULL UNIQUE,  -- swat_output.ref_parametre_qualite.param_code
    parametre_id        uuid        REFERENCES metadata.referentiel_parametre(id),
    code_canonique      text,       -- cache dénormalisé pour lisibilité
    mapping_confidence  numeric(3,2) NOT NULL DEFAULT 1.0,
    notes               text,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE metadata.mapping_swat_parametre IS 'Correspondance entre les codes paramètre SWAT (swat_output) et le référentiel canonique metadata.referentiel_parametre.';

CREATE INDEX IF NOT EXISTS idx_mapping_swat_param_code
    ON metadata.mapping_swat_parametre (param_code_swat);


-- ----------------------------------------------------------------------------
-- 4. TABLE metadata.mapping_wasp_parametre
-- Correspondance wasp_output → metadata.referentiel_parametre
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS metadata.mapping_wasp_parametre (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    code_parametre_wasp text        NOT NULL UNIQUE,  -- wasp_output.ref_parametre_qualite.code_parametre
    parametre_id        uuid        REFERENCES metadata.referentiel_parametre(id),
    code_canonique      text,
    mapping_confidence  numeric(3,2) NOT NULL DEFAULT 1.0,
    notes               text,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE metadata.mapping_wasp_parametre IS 'Correspondance entre les codes paramètre WASP (wasp_output) et le référentiel canonique metadata.referentiel_parametre.';

CREATE INDEX IF NOT EXISTS idx_mapping_wasp_param_code
    ON metadata.mapping_wasp_parametre (code_parametre_wasp);


-- ----------------------------------------------------------------------------
-- 5. PEUPLEMENT DES MAPPINGS SWAT → RÉFÉRENTIEL CANONIQUE
-- À compléter après exécution du script d'audit Phase 0 section 6
-- Les valeurs ci-dessous sont les correspondances les plus probables
-- ----------------------------------------------------------------------------

-- D'abord, récupérer les param_code existants dans swat_output
-- (à adapter selon le résultat de l'audit -- exécuter SELECT * FROM swat_output.ref_parametre_qualite)

-- Insertion des mappings SWAT connus
INSERT INTO metadata.mapping_swat_parametre 
    (param_code_swat, code_canonique, mapping_confidence, notes)
VALUES
    ('NO3',    'no3',          1.0,  'Nitrates - correspondance directe'),
    ('NO3_OUT','no3',          0.95, 'Nitrates en sortie de reach SWAT'),
    ('ORGN',   'azote_org',    0.9,  'Azote organique SWAT'),
    ('ORGP',   'phosphore_org',0.9,  'Phosphore organique SWAT'),
    ('ORGP_OUT','phosphore_org',0.9, 'Phosphore organique sortie reach'),
    ('MINP',   'phosphore',    0.85, 'Phosphore minéral SWAT'),
    ('SOLP',   'phosphore',    0.85, 'Phosphore soluble SWAT'),
    ('CHLA',   'chlorophylle_a',0.9,'Chlorophylle-a SWAT'),
    ('CHLA_OUT','chlorophylle_a',0.9,'Chlorophylle-a sortie reach'),
    ('SED',    'mes',          0.85, 'Sédiments / MES SWAT'),
    ('SED_IN', 'mes',          0.85, 'Sédiments entrants reach'),
    ('SED_OUT','mes',          0.85, 'Sédiments sortants reach'),
    ('FLOW',   'debit',        1.0,  'Débit SWAT général'),
    ('FLOW_IN','debit',        1.0,  'Débit entrant reach SWAT'),
    ('FLOW_OUT','debit',       1.0,  'Débit sortant reach SWAT'),
    ('PRECIP', 'precipitation',1.0,  'Précipitation sous-bassin SWAT'),
    ('WYLD',   'lame_eau',     0.9,  'Rendement en eau SWAT (water yield)'),
    ('SURQ',   'ruissellement',0.9,  'Ruissellement de surface SWAT'),
    ('GWQ',    'eaux_souterraines',0.85,'Apport nappe SWAT'),
    ('ET',     'evapotranspiration',1.0,'ETP/ETR SWAT')
ON CONFLICT (param_code_swat) DO UPDATE SET
    code_canonique     = EXCLUDED.code_canonique,
    mapping_confidence = EXCLUDED.mapping_confidence,
    updated_at         = now();


-- ----------------------------------------------------------------------------
-- 6. PEUPLEMENT DES MAPPINGS WASP → RÉFÉRENTIEL CANONIQUE
-- ----------------------------------------------------------------------------

INSERT INTO metadata.mapping_wasp_parametre 
    (code_parametre_wasp, code_canonique, mapping_confidence, notes)
VALUES
    ('DO',     'oxygene_dissous',    1.0,  'Dissolved Oxygen — WASP standard'),
    ('BOD',    'dbo5',               0.95, 'Biochemical Oxygen Demand (DBO5)'),
    ('BOD5',   'dbo5',               1.0,  'DBO5 — correspondance directe'),
    ('COD',    'dco',                1.0,  'Chemical Oxygen Demand (DCO)'),
    ('NO3',    'no3',                1.0,  'Nitrates WASP'),
    ('NH4',    'nh4',                1.0,  'Ammonium WASP'),
    ('TN',     'azote_total',        0.95, 'Total Nitrogen WASP'),
    ('TP',     'phosphore_total',    0.95, 'Total Phosphorus WASP'),
    ('PO4',    'phosphates',         1.0,  'Phosphates ortho WASP'),
    ('TSS',    'mes',                1.0,  'Total Suspended Solids = MES'),
    ('TEMP',   'temperature_eau',    1.0,  'Température eau WASP'),
    ('CHLFA',  'chlorophylle_a',     1.0,  'Chlorophylle-a WASP'),
    ('ALGAE',  'chlorophylle_a',     0.8,  'Algues / proxy chlorophylle-a'),
    ('CBOD',   'dbo5',               0.85, 'Carbonaceous BOD WASP'),
    ('pH',     'ph',                 1.0,  'pH WASP'),
    ('EC',     'conductivite',       1.0,  'Electrical Conductivity / conductivité'),
    ('NAPH',   'hydrocarbures',      0.8,  'Naphtalène / hydrocarbures WASP'),
    ('FLOW',   'debit',              1.0,  'Débit WASP')
ON CONFLICT (code_parametre_wasp) DO UPDATE SET
    code_canonique     = EXCLUDED.code_canonique,
    mapping_confidence = EXCLUDED.mapping_confidence,
    updated_at         = now();


-- ----------------------------------------------------------------------------
-- 7. LIAISON RETOUR : mettre à jour referentiel_parametre avec les codes modèles
-- ----------------------------------------------------------------------------

UPDATE metadata.referentiel_parametre rp
SET
    code_swat_output = ms.param_code_swat,
    is_modele_swat   = true
FROM metadata.mapping_swat_parametre ms
WHERE ms.code_canonique = rp.code_canonique
  AND ms.mapping_confidence >= 0.9;

UPDATE metadata.referentiel_parametre rp
SET
    code_wasp_output = mw.code_parametre_wasp,
    is_modele_wasp   = true
FROM metadata.mapping_wasp_parametre mw
WHERE mw.code_canonique = rp.code_canonique
  AND mw.mapping_confidence >= 0.9;


-- ----------------------------------------------------------------------------
-- 8. MISE À JOUR DU CATALOGUE API POUR LES NOUVELLES TABLES
-- ----------------------------------------------------------------------------

INSERT INTO metadata.api_view_catalog 
    (view_name, object_type, domain, subdomain, grain, description_metier, refresh_strategy, is_active)
VALUES
    ('metadata.referentiel_unite',        'table', 'metadata', 'referentiel', 'entite', 
     'Référentiel canonique des unités de mesure',         'static', true),
    ('metadata.mapping_swat_parametre',   'table', 'metadata', 'mapping',     'entite',
     'Correspondance codes SWAT vers paramètres canoniques','static', true),
    ('metadata.mapping_wasp_parametre',   'table', 'metadata', 'mapping',     'entite',
     'Correspondance codes WASP vers paramètres canoniques','static', true)
ON CONFLICT (view_name) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 9. VUE DE DIAGNOSTIC — COUVERTURE DES PARAMÈTRES PAR DOMAINE
-- ----------------------------------------------------------------------------

CREATE OR REPLACE VIEW metadata.v_referentiel_parametre_enrichi AS
SELECT
    rp.id,
    rp.domaine,
    rp.code_canonique,
    rp.libelle,
    rp.unite,
    rp.description,
    rp.actif,
    rp.is_qualite,
    rp.is_hydro,
    rp.is_meteo,
    rp.is_modele_swat,
    rp.is_modele_wasp,
    rp.code_swat_output,
    rp.code_wasp_output,
    rp.seuils_reglementaires,
    rp.norme_marocaine,
    rp.norme_oms,
    -- Stats mapping
    (SELECT COUNT(*) FROM metadata.mapping_parametre_source mps WHERE mps.code_canonique = rp.code_canonique) AS nb_sources_stagees,
    rp.updated_at
FROM metadata.referentiel_parametre rp
ORDER BY rp.domaine, rp.code_canonique;

COMMENT ON VIEW metadata.v_referentiel_parametre_enrichi IS 'Vue enrichie du référentiel paramètre, incluant les flags domaine, codes modèles et statistiques de mapping.';


COMMIT;

-- Rapport final
\echo '=== Phase 1 terminée — Vérification ==='

SELECT 
    COUNT(*)                                                        AS total_params,
    COUNT(*) FILTER (WHERE is_qualite)                              AS params_qualite,
    COUNT(*) FILTER (WHERE is_hydro)                                AS params_hydro,
    COUNT(*) FILTER (WHERE is_meteo)                                AS params_meteo,
    COUNT(*) FILTER (WHERE is_modele_swat)                          AS params_swat,
    COUNT(*) FILTER (WHERE is_modele_wasp)                          AS params_wasp,
    COUNT(*) FILTER (WHERE code_swat_output IS NOT NULL)            AS avec_code_swat,
    COUNT(*) FILTER (WHERE code_wasp_output IS NOT NULL)            AS avec_code_wasp
FROM metadata.referentiel_parametre;

SELECT COUNT(*) AS nb_unites  FROM metadata.referentiel_unite;
SELECT COUNT(*) AS nb_map_swat FROM metadata.mapping_swat_parametre;
SELECT COUNT(*) AS nb_map_wasp FROM metadata.mapping_wasp_parametre;
