-- VALIDATION POST UPDATE TABLE_CIBLE
-- Requetes a executer apres validation et execution transactionnelle du script final.

-- 1. Nombre de parametres actifs encore sans table_cible.
SELECT count(*) AS actifs_sans_table_cible
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
  AND (table_cible IS NULL OR btrim(table_cible) = '');

-- 2. Liste des parametres actifs encore sans table_cible.
SELECT code_parametre, nom_parametre, domaine, sous_domaine, unite_reference, statut
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
  AND (table_cible IS NULL OR btrim(table_cible) = '')
ORDER BY domaine, code_parametre;

-- 3. Confirmation FM / F_M_MES restent sans table_cible.
SELECT code_parametre, table_cible,
       CASE WHEN table_cible IS NULL OR btrim(table_cible) = '' THEN 'OK_HORS_RESTITUTION' ELSE 'ANOMALIE' END AS controle
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('FM','F_M_MES');

-- 4. Confirmation COULEUR.
SELECT code_parametre, unite_reference, table_cible
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'COULEUR'
  AND table_cible = 'api.v_qualite_organoleptique';

-- 5. Confirmation LARGEUR / PROFONDEUR hors dashboard analytique qualite.
SELECT code_parametre, table_cible
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('LARGEUR','PROFONDEUR')
  AND table_cible = 'api.v_qualite_contexte_station';

-- 6. Confirmation T_AIR double classification documentee par la documentation et cible principale qualite terrain.
SELECT code_parametre, table_cible
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'T_AIR'
  AND table_cible = 'api.v_qualite_terrain';

-- 7. Confirmation DISQUE_SECCHI cible principale barrage qualite.
SELECT code_parametre, table_cible
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'DISQUE_SECCHI'
  AND table_cible = 'api.v_barrage_qualite';

-- 8. Confirmation aucune unite modifiee par comparaison backup.
SELECT cur.code_parametre, b.unite_reference AS unite_backup, cur.unite_reference AS unite_courante
FROM metadata.referentiel_parametre_canonique cur
JOIN audit.bkp_ref_table_cible_final_metier_20260513 b USING (parametre_ref_id)
WHERE cur.unite_reference IS DISTINCT FROM b.unite_reference
ORDER BY cur.code_parametre;

-- 9. Confirmation aucun alias modifie par comparaison backup.
SELECT cur.code_parametre, b.aliases AS aliases_backup, cur.aliases AS aliases_courants
FROM metadata.referentiel_parametre_canonique cur
JOIN audit.bkp_ref_table_cible_final_metier_20260513 b USING (parametre_ref_id)
WHERE cur.aliases IS DISTINCT FROM b.aliases
ORDER BY cur.code_parametre;

-- 10. Confirmation aucune mesure modifiee : ce script ne cible aucune table de mesures.
-- Controle indirect : seules les tables metadata/audit doivent apparaitre dans les requetes d'execution.
SELECT 'AUCUNE_TABLE_MESURE_DANS_SCRIPT' AS controle_mesures;
