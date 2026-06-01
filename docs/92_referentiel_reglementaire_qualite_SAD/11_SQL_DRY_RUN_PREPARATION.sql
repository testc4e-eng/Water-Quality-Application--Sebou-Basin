-- PROPOSITION UNIQUEMENT - DRY-RUN A EXECUTER SEULEMENT EN DEV APRES VALIDATION
-- Projet WQDSS / SAD Sebou
-- Objectif : vérifier l'environnement avant création du référentiel réglementaire qualité.
-- Ce script est transactionnel et se termine par ROLLBACK.

BEGIN;

-- 1. Vérification extension UUID disponible.
SELECT extname
FROM pg_extension
WHERE extname IN ('pgcrypto', 'uuid-ossp');

-- 2. Vérification schéma metadata.
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'metadata';

-- 3. Vérification référentiel canonique cible et colonne PK réelle.
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'metadata'
  AND table_name = 'referentiel_parametre_canonique'
  AND column_name IN ('parametre_ref_id', 'code_parametre', 'nom_parametre', 'aliases');

-- 4. Vérification absence de collision avec futures tables réglementaires.
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'metadata'
  AND table_name IN (
    'qualite_classe_reglementaire',
    'qualite_parametre_reglementaire',
    'qualite_seuil_reglementaire',
    'qualite_type_eau',
    'qualite_mapping_canonique_reglementaire',
    'qualite_regle_classification',
    'qualite_source_reglementaire'
  );

-- 5. Vérification codes canoniques attendus après arbitrage métier.
SELECT code_parametre, nom_parametre, aliases
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN (
  'AS','BA','CD','CHLA','CRT','CF','CT','CN','DBO5','DCO','DETERGENT',
  'F-','HG','AZOTE_TOT_KJELD','NI','NO3-','O2_DISS','ODEUR','PHOSPHORE_TOTAL',
  'PO4_3-','PHENOL','PB','SE','SF'
)
ORDER BY code_parametre;

-- 6. Contrôle anti-confusion sensible à la casse.
SELECT code_parametre, nom_parametre
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('MO', 'Mo')
ORDER BY code_parametre;

-- 7. Dry-run DDL minimal en transaction seulement.
CREATE TEMP TABLE tmp_dry_run_qualite_reglementaire_check (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    check_name text NOT NULL,
    check_status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
) ON COMMIT DROP;

SELECT 'DRY_RUN_OK' AS status,
       'Rollback volontaire attendu après revue' AS commentaire;

ROLLBACK;
