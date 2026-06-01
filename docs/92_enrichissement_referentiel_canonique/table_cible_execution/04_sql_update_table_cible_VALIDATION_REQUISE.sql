-- PROPOSITION NON EXECUTEE
-- Objectif : affecter `table_cible` aux parametres referentiels audites.
-- Ne pas executer sans validation explicite.

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_table_cible_65_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
  AND NULLIF(trim(coalesce(table_cible, '')), '') IS NULL
  AND code_parametre IN (
    'NIVEAU_EAU','EVAPO','PRECIP','TEMP_MAX','TEMP_MIN','TEMP_MOY',
    'AG','AL','AS','BA','BE','CA','CD','CF','CHLA','CL','CO','CO3','COULEUR','CT','CU',
    'DCO','DETERGENT','DISQUE_SECCHI','EH','FE','FE2','FET','HCT','IBD','IBGN','K',
    'LARGEUR','LI','MES','MG','MN','Mo','MO','NA','NI','OH','PB','PH','PHENOL',
    'PHEOPIGMENT','PROFONDEUR','S','S2','SB','SE','SF','SN','SO4','SR','T_AIR','T_EAU',
    'TA','TAC','TH','TL','V','ZN','FM','F_M_MES'
  );

WITH affectations(code_parametre, table_cible) AS (
  VALUES
    ('NIVEAU_EAU', 'api.v_barrage_dashboard'),
    ('EVAPO', 'api.v_meteo_dashboard'),
    ('PRECIP', 'api.v_meteo_dashboard'),
    ('TEMP_MAX', 'api.v_meteo_dashboard'),
    ('TEMP_MIN', 'api.v_meteo_dashboard'),
    ('TEMP_MOY', 'api.v_meteo_dashboard'),
    ('AG', 'api.v_qualite_dashboard'), ('AL', 'api.v_qualite_dashboard'),
    ('AS', 'api.v_qualite_dashboard'), ('BA', 'api.v_qualite_dashboard'),
    ('BE', 'api.v_qualite_dashboard'), ('CA', 'api.v_qualite_dashboard'),
    ('CD', 'api.v_qualite_dashboard'), ('CF', 'api.v_qualite_dashboard'),
    ('CHLA', 'api.v_qualite_dashboard'), ('CL', 'api.v_qualite_dashboard'),
    ('CO', 'api.v_qualite_dashboard'), ('CO3', 'api.v_qualite_dashboard'),
    ('COULEUR', 'api.v_qualite_dashboard'), ('CT', 'api.v_qualite_dashboard'),
    ('CU', 'api.v_qualite_dashboard'), ('DCO', 'api.v_qualite_dashboard'),
    ('DETERGENT', 'api.v_qualite_dashboard'), ('DISQUE_SECCHI', 'api.v_qualite_dashboard'),
    ('EH', 'api.v_qualite_dashboard'), ('FE', 'api.v_qualite_dashboard'),
    ('FE2', 'api.v_qualite_dashboard'), ('FET', 'api.v_qualite_dashboard'),
    ('HCT', 'api.v_qualite_dashboard'), ('IBD', 'api.v_qualite_dashboard'),
    ('IBGN', 'api.v_qualite_dashboard'), ('K', 'api.v_qualite_dashboard'),
    ('LARGEUR', 'api.v_qualite_dashboard'), ('LI', 'api.v_qualite_dashboard'),
    ('MES', 'api.v_qualite_dashboard'), ('MG', 'api.v_qualite_dashboard'),
    ('MN', 'api.v_qualite_dashboard'), ('Mo', 'api.v_qualite_dashboard'),
    ('MO', 'api.v_qualite_dashboard'), ('NA', 'api.v_qualite_dashboard'),
    ('NI', 'api.v_qualite_dashboard'), ('OH', 'api.v_qualite_dashboard'),
    ('PB', 'api.v_qualite_dashboard'), ('PH', 'api.v_qualite_dashboard'),
    ('PHENOL', 'api.v_qualite_dashboard'), ('PHEOPIGMENT', 'api.v_qualite_dashboard'),
    ('PROFONDEUR', 'api.v_qualite_dashboard'), ('S', 'api.v_qualite_dashboard'),
    ('S2', 'api.v_qualite_dashboard'), ('SB', 'api.v_qualite_dashboard'),
    ('SE', 'api.v_qualite_dashboard'), ('SF', 'api.v_qualite_dashboard'),
    ('SN', 'api.v_qualite_dashboard'), ('SO4', 'api.v_qualite_dashboard'),
    ('SR', 'api.v_qualite_dashboard'), ('T_AIR', 'api.v_qualite_dashboard'),
    ('T_EAU', 'api.v_qualite_dashboard'), ('TA', 'api.v_qualite_dashboard'),
    ('TAC', 'api.v_qualite_dashboard'), ('TH', 'api.v_qualite_dashboard'),
    ('TL', 'api.v_qualite_dashboard'), ('V', 'api.v_qualite_dashboard'),
    ('ZN', 'api.v_qualite_dashboard')
)
UPDATE metadata.referentiel_parametre_canonique r
SET table_cible = a.table_cible
FROM affectations a
WHERE r.code_parametre = a.code_parametre
  AND r.statut = 'ACTIF'
  AND NULLIF(trim(coalesce(r.table_cible, '')), '') IS NULL
  AND r.code_parametre NOT IN ('FM', 'F_M_MES', 'MD');

-- Validation proposee avant commit.
SELECT table_cible, count(*) AS volume
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN (
  'NIVEAU_EAU','EVAPO','PRECIP','TEMP_MAX','TEMP_MIN','TEMP_MOY',
  'AG','AL','AS','BA','BE','CA','CD','CF','CHLA','CL','CO','CO3','COULEUR','CT','CU',
  'DCO','DETERGENT','DISQUE_SECCHI','EH','FE','FE2','FET','HCT','IBD','IBGN','K',
  'LARGEUR','LI','MES','MG','MN','Mo','MO','NA','NI','OH','PB','PH','PHENOL',
  'PHEOPIGMENT','PROFONDEUR','S','S2','SB','SE','SF','SN','SO4','SR','T_AIR','T_EAU',
  'TA','TAC','TH','TL','V','ZN'
)
GROUP BY table_cible
ORDER BY table_cible;

ROLLBACK;
-- COMMIT;
