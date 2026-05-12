-- PROPOSITION NON EXECUTEE
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE
-- Objet : synchroniser metadata.referentiel_parametre avec le canonique enrichi
--         pour satisfaire les FK existantes des tables qualite.
-- Constat : certaines tables qualite referencent metadata.referentiel_parametre(id),
--           pas metadata.referentiel_parametre_canonique(parametre_ref_id).
-- Perimetre : metadata.referentiel_parametre + audit uniquement.
-- Ne touche aucune table de mesures.

BEGIN;

CREATE TABLE audit.bkp_referentiel_parametre_sync_fk_20260508 AS
SELECT *
FROM metadata.referentiel_parametre
WHERE code_canonique IN (
    'F-','CN','CLOSTRI','CO2_LIBRE','H2S','PSEUDO_AER','VIBRIO',
    'GERME_22','GERME_37','CL2_RES','SIO2','SO3','ODEUR','SAVEUR','BORE'
);

CREATE TABLE IF NOT EXISTS audit.referentiel_parametre_sync_fk_journal (
    journal_id bigserial PRIMARY KEY,
    run_code text NOT NULL,
    code_parametre text NOT NULL,
    parametre_ref_id uuid NOT NULL,
    action text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

WITH required_codes(code_parametre) AS (
    VALUES
        ('F-'),('CN'),('CLOSTRI'),('CO2_LIBRE'),('H2S'),('PSEUDO_AER'),('VIBRIO'),
        ('GERME_22'),('GERME_37'),('CL2_RES'),('SIO2'),('SO3'),('ODEUR'),('SAVEUR'),('BORE')
), src AS (
    SELECT c.*
    FROM metadata.referentiel_parametre_canonique c
    JOIN required_codes rc ON rc.code_parametre = c.code_parametre
    WHERE c.statut = 'ACTIF'
), missing AS (
    SELECT s.*
    FROM src s
    LEFT JOIN metadata.referentiel_parametre r
      ON r.id = s.parametre_ref_id
      OR r.code_canonique = s.code_parametre
    WHERE r.id IS NULL
)
INSERT INTO metadata.referentiel_parametre (
    id,
    domaine,
    code_canonique,
    libelle,
    unite,
    description,
    actif,
    created_at,
    updated_at
)
SELECT
    parametre_ref_id,
    domaine,
    code_parametre,
    nom_parametre,
    unite_reference,
    description_metier,
    true,
    now(),
    now()
FROM missing;

INSERT INTO audit.referentiel_parametre_sync_fk_journal (
    run_code,
    code_parametre,
    parametre_ref_id,
    action
)
SELECT
    'SYNC_REF_PARAM_FK_REF001_004_20260508',
    c.code_parametre,
    c.parametre_ref_id,
    CASE WHEN r.id IS NULL THEN 'INSERTED_FOR_FK' ELSE 'ALREADY_PRESENT' END
FROM metadata.referentiel_parametre_canonique c
JOIN (
    VALUES
        ('F-'),('CN'),('CLOSTRI'),('CO2_LIBRE'),('H2S'),('PSEUDO_AER'),('VIBRIO'),
        ('GERME_22'),('GERME_37'),('CL2_RES'),('SIO2'),('SO3'),('ODEUR'),('SAVEUR'),('BORE')
) AS rc(code_parametre)
  ON rc.code_parametre = c.code_parametre
LEFT JOIN audit.bkp_referentiel_parametre_sync_fk_20260508 r
  ON r.id = c.parametre_ref_id
WHERE c.statut = 'ACTIF';

-- Controles.
WITH required_codes(code_parametre) AS (
    VALUES
        ('F-'),('CN'),('CLOSTRI'),('CO2_LIBRE'),('H2S'),('PSEUDO_AER'),('VIBRIO'),
        ('GERME_22'),('GERME_37'),('CL2_RES'),('SIO2'),('SO3'),('ODEUR'),('SAVEUR'),('BORE')
)
SELECT rc.code_parametre,
       CASE WHEN r.id IS NULL THEN 'MISSING_FK_REFERENTIEL' ELSE 'OK' END AS status,
       c.parametre_ref_id,
       r.id AS fk_id
FROM required_codes rc
LEFT JOIN metadata.referentiel_parametre_canonique c
  ON c.code_parametre = rc.code_parametre
 AND c.statut = 'ACTIF'
LEFT JOIN metadata.referentiel_parametre r
  ON r.id = c.parametre_ref_id
 AND r.code_canonique = c.code_parametre
 AND r.actif = true
ORDER BY status, rc.code_parametre;

SELECT COUNT(*) AS missing_after_sync
FROM (
    WITH required_codes(code_parametre) AS (
        VALUES
            ('F-'),('CN'),('CLOSTRI'),('CO2_LIBRE'),('H2S'),('PSEUDO_AER'),('VIBRIO'),
            ('GERME_22'),('GERME_37'),('CL2_RES'),('SIO2'),('SO3'),('ODEUR'),('SAVEUR'),('BORE')
    )
    SELECT rc.code_parametre
    FROM required_codes rc
    LEFT JOIN metadata.referentiel_parametre_canonique c
      ON c.code_parametre = rc.code_parametre
     AND c.statut = 'ACTIF'
    LEFT JOIN metadata.referentiel_parametre r
      ON r.id = c.parametre_ref_id
     AND r.code_canonique = c.code_parametre
     AND r.actif = true
    WHERE r.id IS NULL
) m;

ROLLBACK;
-- COMMIT; -- A decommenter uniquement apres validation explicite.

