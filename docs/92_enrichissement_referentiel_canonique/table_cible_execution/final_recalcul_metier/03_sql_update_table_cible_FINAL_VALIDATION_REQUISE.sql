-- PROPOSITION NON EXECUTEE
-- Recalcul final metier des valeurs table_cible.
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE.
-- Perimetre : metadata.referentiel_parametre_canonique.table_cible uniquement.
-- Interdits : unite_reference, aliases, statut, libelles, mesures.

BEGIN;

-- Backup logique obligatoire avant update.
CREATE SCHEMA IF NOT EXISTS audit;

CREATE TABLE audit.bkp_ref_table_cible_final_metier_20260513 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN (
  'NIVEAU_EAU',
  'EVAPO','PRECIP','TEMP_MAX','TEMP_MIN','TEMP_MOY',
  'PH','EH','T_AIR','T_EAU','DISQUE_SECCHI','LARGEUR','PROFONDEUR','COULEUR',
  'CA','MG','NA','K','CL','SO4','CO3','HCT','OH','S','S2','TA','TAC','TH',
  'AG','AL','AS','BA','BE','CD','CO','CU','FE','FE2','FET','LI','MN','Mo','NI','PB','SB','SE','SN','SR','TL','V','ZN',
  'DCO','DETERGENT','MES','MO','PHENOL',
  'CF','CT','SF',
  'CHLA','PHEOPIGMENT','IBD','IBGN',
  'FM','F_M_MES'
);

-- Hydrologie.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_barrage_parametres'
WHERE code_parametre = 'NIVEAU_EAU'
  AND statut = 'ACTIF';

-- Meteo.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_meteo_evaporation'
WHERE code_parametre = 'EVAPO'
  AND statut = 'ACTIF';

UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_meteo_precipitation'
WHERE code_parametre = 'PRECIP'
  AND statut = 'ACTIF';

UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_meteo_temperature'
WHERE code_parametre IN ('TEMP_MAX','TEMP_MIN','TEMP_MOY')
  AND statut = 'ACTIF';

-- Qualite physico-chimie.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_physicochimie'
WHERE code_parametre IN ('PH','EH')
  AND statut = 'ACTIF';

-- Qualite terrain.
-- T_AIR : table_cible principale pour les donnees qualite existantes.
-- La future temperature meteo reste portee par api.v_meteo_temperature via pipeline meteo.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_terrain'
WHERE code_parametre IN ('T_AIR','T_EAU')
  AND statut = 'ACTIF';

-- DISQUE_SECCHI : table_cible principale barrage qualite selon usage majoritaire actuel.
-- Les occurrences riviere devront aussi etre exposees par api.v_qualite_terrain via logique de vue/support.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_barrage_qualite'
WHERE code_parametre = 'DISQUE_SECCHI'
  AND statut = 'ACTIF';

-- Hydromorphologie / contexte station.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_contexte_station'
WHERE code_parametre IN ('LARGEUR','PROFONDEUR')
  AND statut = 'ACTIF';

-- Organoleptique.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_organoleptique'
WHERE code_parametre = 'COULEUR'
  AND statut = 'ACTIF';

-- Chimie minerale.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_chimie_minerale'
WHERE code_parametre IN ('CA','MG','NA','K','CL','SO4','CO3','HCT','OH','S','S2','TA','TAC','TH')
  AND statut = 'ACTIF';

-- Metaux et elements traces. Respect strict : MO != Mo.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_metaux'
WHERE code_parametre IN ('AG','AL','AS','BA','BE','CD','CO','CU','FE','FE2','FET','LI','MN','Mo','NI','PB','SB','SE','SN','SR','TL','V','ZN')
  AND statut = 'ACTIF';

-- Pollution organique.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_pollution_organique'
WHERE code_parametre IN ('DCO','DETERGENT','MES','MO','PHENOL')
  AND statut = 'ACTIF';

-- Microbiologie.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_microbiologie'
WHERE code_parametre IN ('CF','CT','SF')
  AND statut = 'ACTIF';

-- Biologique / indices.
UPDATE metadata.referentiel_parametre_canonique
SET table_cible = 'api.v_qualite_biologique'
WHERE code_parametre IN ('CHLA','PHEOPIGMENT','IBD','IBGN')
  AND statut = 'ACTIF';

-- FM et F_M_MES sont explicitement exclus : aucun UPDATE table_cible.

-- Controles dans transaction.
SELECT table_cible, count(*) AS nb
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN (
  'NIVEAU_EAU',
  'EVAPO','PRECIP','TEMP_MAX','TEMP_MIN','TEMP_MOY',
  'PH','EH','T_AIR','T_EAU','DISQUE_SECCHI','LARGEUR','PROFONDEUR','COULEUR',
  'CA','MG','NA','K','CL','SO4','CO3','HCT','OH','S','S2','TA','TAC','TH',
  'AG','AL','AS','BA','BE','CD','CO','CU','FE','FE2','FET','LI','MN','Mo','NI','PB','SB','SE','SN','SR','TL','V','ZN',
  'DCO','DETERGENT','MES','MO','PHENOL',
  'CF','CT','SF',
  'CHLA','PHEOPIGMENT','IBD','IBGN',
  'FM','F_M_MES'
)
GROUP BY table_cible
ORDER BY nb DESC, table_cible;

SELECT code_parametre, table_cible
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('FM','F_M_MES')
ORDER BY code_parametre;

SELECT count(*) AS backup_rows
FROM audit.bkp_ref_table_cible_final_metier_20260513;

ROLLBACK;
-- COMMIT;
