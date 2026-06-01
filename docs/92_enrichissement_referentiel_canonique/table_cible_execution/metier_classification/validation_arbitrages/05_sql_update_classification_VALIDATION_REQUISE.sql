-- PROPOSITION NON EXECUTEE
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE DES 8 ARBITRAGES
-- Objectif : figer les valeurs table_cible / classification metier dans le referentiel.

BEGIN;

-- Backup logique propose.
-- CREATE TABLE audit.bkp_ref_table_cible_arbitrages_YYYYMMDD AS
-- SELECT *
-- FROM metadata.referentiel_parametre_canonique
-- WHERE code_parametre IN (
--   'T_AIR', 'T_EAU', 'LARGEUR', 'PROFONDEUR',
--   'DISQUE_SECCHI', 'COULEUR', 'FM', 'F_M_MES'
-- );

-- Propositions apres validation des 8 arbitrages.
-- Ces UPDATE ne doivent pas etre executes sans validation explicite.

-- T_AIR : double classification gouvernee par source.
-- Le referentiel canonique porte la cible des lignes qualite existantes.
-- La regle meteo future doit etre portee par le pipeline d'ingestion temperature.
-- UPDATE metadata.referentiel_parametre_canonique
-- SET domaine = 'QUALITE_EAU',
--     sous_domaine = 'terrain',
--     table_cible = 'api.v_qualite_terrain',
--     metadata_json = coalesce(metadata_json, '{}'::jsonb) || jsonb_build_object(
--       'classification_rule', 'DOUBLE_CLASSIFICATION_SOURCE',
--       'meteo_future_view', 'api.v_meteo_temperature'
--     )
-- WHERE code_parametre = 'T_AIR'
--   AND statut = 'ACTIF';

-- T_EAU : terrain qualite.
-- UPDATE metadata.referentiel_parametre_canonique
-- SET domaine = 'QUALITE_EAU',
--     sous_domaine = 'terrain',
--     table_cible = 'api.v_qualite_terrain'
-- WHERE code_parametre = 'T_EAU'
--   AND statut = 'ACTIF';

-- LARGEUR / PROFONDEUR : contexte station hydromorphologie.
-- UPDATE metadata.referentiel_parametre_canonique
-- SET domaine = 'HYDROMORPHOLOGIE',
--     sous_domaine = 'contexte station',
--     table_cible = 'api.v_qualite_contexte_station'
-- WHERE code_parametre IN ('LARGEUR', 'PROFONDEUR')
--   AND statut = 'ACTIF';

-- DISQUE_SECCHI : double classification selon support.
-- UPDATE metadata.referentiel_parametre_canonique
-- SET domaine = 'QUALITE_EAU',
--     sous_domaine = 'transparence',
--     table_cible = 'api.v_qualite_terrain',
--     metadata_json = coalesce(metadata_json, '{}'::jsonb) || jsonb_build_object(
--       'classification_rule', 'DOUBLE_CLASSIFICATION_SUPPORT',
--       'barrage_view', 'api.v_barrage_qualite',
--       'riviere_view', 'api.v_qualite_terrain'
--     )
-- WHERE code_parametre = 'DISQUE_SECCHI'
--   AND statut = 'ACTIF';

-- COULEUR : organoleptique consultation only, hors analytics.
-- UPDATE metadata.referentiel_parametre_canonique
-- SET domaine = 'QUALITE_EAU',
--     sous_domaine = 'organoleptique',
--     table_cible = 'api.v_qualite_organoleptique',
--     metadata_json = coalesce(metadata_json, '{}'::jsonb) || jsonb_build_object(
--       'restitution_status', 'CONSULTATION_ONLY',
--       'exclude_analytics', true
--     )
-- WHERE code_parametre = 'COULEUR'
--   AND statut = 'ACTIF';

-- FM / F_M_MES : client required et hors restitution.
-- UPDATE metadata.referentiel_parametre_canonique
-- SET sous_domaine = 'non_classe',
--     table_cible = NULL,
--     metadata_json = coalesce(metadata_json, '{}'::jsonb) || jsonb_build_object(
--       'governance_status', 'CLIENT_REQUIRED',
--       'restitution_status', 'HORS_RESTITUTION'
--     )
-- WHERE code_parametre IN ('FM', 'F_M_MES')
--   AND statut = 'ACTIF';

-- Controle propose.
-- SELECT code_parametre, domaine, sous_domaine, table_cible, statut
-- FROM metadata.referentiel_parametre_canonique
-- WHERE code_parametre IN (
--   'T_AIR', 'T_EAU', 'LARGEUR', 'PROFONDEUR',
--   'DISQUE_SECCHI', 'COULEUR', 'FM', 'F_M_MES'
-- )
-- ORDER BY code_parametre;

ROLLBACK;
-- COMMIT;
