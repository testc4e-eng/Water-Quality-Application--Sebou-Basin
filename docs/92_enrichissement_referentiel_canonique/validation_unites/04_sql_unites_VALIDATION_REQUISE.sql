-- PROPOSITIONS NON EXECUTEES
-- Validation manuelle unites referentiel.
-- Garder ROLLBACK actif. COMMIT interdit sans validation explicite.

BEGIN;

-- ============================================================
-- DISQUE_SECCHI - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'm'
-- Attention : verifier si les valeurs historiques riviere sont en cm ou m.
-- ============================================================

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_disque_secchi_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DISQUE_SECCHI';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'm',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: m (Disque de Secchi).'
WHERE code_parametre = 'DISQUE_SECCHI'
  AND statut = 'ACTIF';

-- Validation proposee
SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DISQUE_SECCHI';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- CO3 - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_co3_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CO3';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Carbonates).'
WHERE code_parametre = 'CO3'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CO3';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- COULEUR - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'qualitatif'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_couleur_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'COULEUR';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'qualitatif',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: qualitatif (Couleur de l eau).'
WHERE code_parametre = 'COULEUR'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'COULEUR';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- CT - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'UFC/100 mL'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_ct_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CT';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'UFC/100 mL',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: UFC/100 mL (Coliformes totaux).'
WHERE code_parametre = 'CT'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CT';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- DCO - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_dco_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DCO';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Demande chimique en oxygene).'
WHERE code_parametre = 'DCO'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DCO';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- DETERGENT - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_detergent_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DETERGENT';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Detergents tensioactifs).'
WHERE code_parametre = 'DETERGENT'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DETERGENT';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- EH - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mV'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_eh_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'EH';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mV',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mV (Potentiel redox).'
WHERE code_parametre = 'EH'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'EH';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- FE - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_fe_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'FE';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Fer total et dissous).'
WHERE code_parametre = 'FE'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'FE';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- FET - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_fet_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'FET';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Fer total, compatibilite ingestion historique).'
WHERE code_parametre = 'FET'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'FET';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- HCT - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_hct_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'HCT';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Bicarbonates / hydrogenocarbonates, compatibilite ingestion historique).'
WHERE code_parametre = 'HCT'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'HCT';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- IBD - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'indice /20'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_ibd_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'IBD';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'indice /20',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: indice /20 (Indice biologique diatomees).'
WHERE code_parametre = 'IBD'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'IBD';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- IBGN - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'indice /20'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_ibgn_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'IBGN';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'indice /20',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: indice /20 (Indice biologique global normalise).'
WHERE code_parametre = 'IBGN'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'IBGN';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- K - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_k_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'K';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Potassium).'
WHERE code_parametre = 'K'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'K';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- MES - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_mes_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'MES';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Matieres en suspension).'
WHERE code_parametre = 'MES'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'MES';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- MG - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_mg_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'MG';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Magnesium).'
WHERE code_parametre = 'MG'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'MG';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- MN - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_mn_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'MN';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Manganese).'
WHERE code_parametre = 'MN'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'MN';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- MO - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ATTENTION : ne pas confondre MO (matieres organiques) avec Mo (molybdene)
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_mo_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'MO';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Matieres organiques / carbone organique). Attention: MO distinct de Mo = molybdene.'
WHERE code_parametre = 'MO'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('MO', 'Mo')
ORDER BY code_parametre;

ROLLBACK;
-- COMMIT;

-- ============================================================
-- NA - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_na_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'NA';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Sodium).'
WHERE code_parametre = 'NA'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'NA';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- S - VALIDE PAR YASSINE
-- Proposition retenue : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_s_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'S';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Arbitrage explicite Yassine sur code historique S).'
WHERE code_parametre = 'S'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'S';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- S2 - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_s2_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'S2';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Sulfures).'
WHERE code_parametre = 'S2'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'S2';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- OH - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_oh_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'OH';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Ions hydroxyde, gouvernance referentiel / ingestion future).'
WHERE code_parametre = 'OH'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'OH';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- PHENOL - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_phenol_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PHENOL';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Phenols / indice phenol).'
WHERE code_parametre = 'PHENOL'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PHENOL';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- PHEOPIGMENT - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'µg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_pheopigment_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PHEOPIGMENT';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'µg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: µg/L (Pheopigments / degradation chlorophyllienne).'
WHERE code_parametre = 'PHEOPIGMENT'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PHEOPIGMENT';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- SF - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'UFC/100 mL'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_sf_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'SF';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'UFC/100 mL',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: UFC/100 mL (Streptocoques fecaux / enterocoques).'
WHERE code_parametre = 'SF'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'SF';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- SO4 - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_so4_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'SO4';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Sulfates).'
WHERE code_parametre = 'SO4'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'SO4';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- TA - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'meq/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_ta_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'TA';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'meq/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: meq/L (Titre alcalimetrique).'
WHERE code_parametre = 'TA'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'TA';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- TAC - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'meq/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_tac_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'TAC';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'meq/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: meq/L (Titre alcalimetrique complet).'
WHERE code_parametre = 'TAC'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'TAC';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- TH - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'meq/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_th_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'TH';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'meq/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: meq/L (Titre hydrotimetrique / durete totale).'
WHERE code_parametre = 'TH'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'TH';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- CL - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_cl_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CL';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Chlorures).'
WHERE code_parametre = 'CL'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CL';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- CHLA - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'µg/L'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_chla_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CHLA';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'µg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: µg/L (Chlorophylle a).'
WHERE code_parametre = 'CHLA'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CHLA';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- CF - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'UFC/100 mL'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_cf_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CF';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'UFC/100 mL',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: UFC/100 mL (Coliformes fecaux).'
WHERE code_parametre = 'CF'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CF';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- CA - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'mg/L'
-- Note QA : 2 lignes riviere montrent une valeur cible x1 000 000 vs source brute 53.106 / 52.104.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_ca_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CA';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'mg/L',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: mg/L (Calcium).'
WHERE code_parametre = 'CA'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'CA';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- T_EAU - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = '°C'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_t_eau_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'T_EAU';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = '°C',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: °C (Temperature de l eau).'
WHERE code_parametre = 'T_EAU'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'T_EAU';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- T_AIR - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = '°C'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_t_air_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'T_AIR';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = '°C',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: °C (Temperature de l air).'
WHERE code_parametre = 'T_AIR'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'T_AIR';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- PH - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'sans unite'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_ph_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PH';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'sans unite',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: sans unite (pH).'
WHERE code_parametre = 'PH'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PH';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- PROFONDEUR - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'm'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_profondeur_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PROFONDEUR';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'm',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: m (Profondeur).'
WHERE code_parametre = 'PROFONDEUR'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'PROFONDEUR';

ROLLBACK;
-- COMMIT;

-- ============================================================
-- LARGEUR - EN ATTENTE VALIDATION YASSINE
-- Proposition : unite_reference = 'm'
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS audit.bkp_ref_unite_largeur_20260512 AS
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'LARGEUR';

UPDATE metadata.referentiel_parametre_canonique
SET unite_reference = 'm',
    description_metier = COALESCE(description_metier, '') || ' | Unite validee manuellement: m (Largeur du cours d eau).'
WHERE code_parametre = 'LARGEUR'
  AND statut = 'ACTIF';

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'LARGEUR';

ROLLBACK;
-- COMMIT;
