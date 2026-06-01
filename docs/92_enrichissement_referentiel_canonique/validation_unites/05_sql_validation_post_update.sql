-- CONTROLES POST-UPDATE PROPOSES - NON EXECUTES

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DISQUE_SECCHI';

SELECT count(*) AS actifs_sans_unite
FROM metadata.referentiel_parametre_canonique
WHERE statut='ACTIF'
  AND NULLIF(trim(coalesce(unite_reference,'')), '') IS NULL;

SELECT code_parametre, unite_reference
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('DISQUE_SECCHI', 'LARGEUR', 'PROFONDEUR', 'PH', 'T_AIR', 'T_EAU', 'CA', 'CF', 'CHLA', 'CL', 'CO3', 'COULEUR', 'CT', 'DCO', 'DETERGENT', 'EH', 'FE', 'FET', 'HCT', 'IBD', 'IBGN', 'K', 'MES', 'MG', 'MN', 'MO', 'NA', 'OH', 'PHENOL', 'PHEOPIGMENT', 'SF', 'SO4', 'TA', 'TAC', 'TH', 'S', 'S2');
