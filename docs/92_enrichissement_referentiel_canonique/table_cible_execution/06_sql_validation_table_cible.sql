-- CONTROLES POST-UPDATE PROPOSES - NON EXECUTES

-- 1. Parametres actifs encore sans table_cible.
SELECT count(*) AS actifs_sans_table_cible
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
  AND NULLIF(trim(coalesce(table_cible, '')), '') IS NULL;

-- 2. Liste des restants.
SELECT code_parametre, domaine, unite_reference, statut
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
  AND NULLIF(trim(coalesce(table_cible, '')), '') IS NULL
ORDER BY domaine, code_parametre;

-- 3. Verification des affectations par vue.
SELECT table_cible, count(*) AS volume
FROM metadata.referentiel_parametre_canonique
WHERE table_cible IN (
  'api.v_qualite_dashboard',
  'api.v_meteo_dashboard',
  'api.v_barrage_dashboard'
)
GROUP BY table_cible
ORDER BY table_cible;

-- 4. Verification qu'aucun cas client n'a ete affecte.
SELECT code_parametre, table_cible, unite_reference, statut
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('FM', 'F_M_MES', 'MD')
ORDER BY code_parametre;

-- 5. Absence de modification hors perimetre via comparaison backup.
SELECT count(*) AS modifications_hors_perimetre
FROM metadata.referentiel_parametre_canonique r
JOIN audit.bkp_ref_table_cible_65_20260512 b USING (parametre_ref_id)
WHERE r.code_parametre NOT IN (
  'NIVEAU_EAU','EVAPO','PRECIP','TEMP_MAX','TEMP_MIN','TEMP_MOY',
  'AG','AL','AS','BA','BE','CA','CD','CF','CHLA','CL','CO','CO3','COULEUR','CT','CU',
  'DCO','DETERGENT','DISQUE_SECCHI','EH','FE','FE2','FET','HCT','IBD','IBGN','K',
  'LARGEUR','LI','MES','MG','MN','Mo','MO','NA','NI','OH','PB','PH','PHENOL',
  'PHEOPIGMENT','PROFONDEUR','S','S2','SB','SE','SF','SN','SO4','SR','T_AIR','T_EAU',
  'TA','TAC','TH','TL','V','ZN','FM','F_M_MES'
);

-- 6. Coherence table_cible -> API recommandee.
SELECT
  table_cible,
  CASE table_cible
    WHEN 'api.v_qualite_dashboard' THEN '/api/qualite/dashboard'
    WHEN 'api.v_meteo_dashboard' THEN '/api/meteo/dashboard'
    WHEN 'api.v_barrage_dashboard' THEN '/api/hydro/barrages/parametres'
    ELSE 'NON_SPECIFIE'
  END AS api_candidate,
  count(*) AS volume
FROM metadata.referentiel_parametre_canonique
GROUP BY table_cible
ORDER BY table_cible NULLS FIRST;
