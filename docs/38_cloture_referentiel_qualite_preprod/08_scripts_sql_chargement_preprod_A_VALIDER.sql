-- CHARGEMENT PREPROD A_VALIDER - Referentiel qualite reglementaire SAD
-- PROPOSITION UNIQUEMENT. NE PAS EXECUTER SANS VALIDATION METIER + BACKUP.
-- Ce script ne recree pas les tables et ne contient aucun DROP/TRUNCATE.
-- Objectif : encadrer le chargement idempotent de la version REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19 en preproduction.

-- Préconditions obligatoires :
-- 1. Le DDL metadata.qualite_*_reglementaire est applique.
-- 2. Le script source DEV valide existe : docs/92_referentiel_reglementaire_qualite_SAD/15_SQL_LOAD_REGLEMENTAIRE_DEV.sql
-- 3. Le périmètre actif est accepté : 36 paramètres classifiables, 177 seuils actifs.
-- 4. Les vrais absents canonique restent non classifiables.
-- 5. MO et Mo restent distincts.

BEGIN;

-- Contrôle avant chargement : si la version active existe déjà, ne pas recharger sans arbitrage.
SELECT version_reglementaire, actif, statut, COUNT(*) OVER () AS active_sources
FROM metadata.qualite_source_reglementaire
WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';

-- Execution réelle à faire uniquement après validation explicite :
-- \i docs/92_referentiel_reglementaire_qualite_SAD/15_SQL_LOAD_REGLEMENTAIRE_DEV.sql

-- Contrôles post-chargement attendus.
SELECT 'sources' AS key, COUNT(*) AS total
FROM metadata.qualite_source_reglementaire
WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
UNION ALL SELECT 'types_eau', COUNT(*) FROM metadata.qualite_type_eau WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
UNION ALL SELECT 'classes', COUNT(*) FROM metadata.qualite_classe_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
UNION ALL SELECT 'parameters', COUNT(*) FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
UNION ALL SELECT 'parameters_classifiable', COUNT(*) FROM metadata.qualite_parametre_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND classifiable IS TRUE
UNION ALL SELECT 'mappings_active', COUNT(*) FROM metadata.qualite_mapping_canonique_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND actif IS TRUE
UNION ALL SELECT 'thresholds', COUNT(*) FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19'
UNION ALL SELECT 'thresholds_active', COUNT(*) FROM metadata.qualite_seuil_reglementaire WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19' AND actif IS TRUE
UNION ALL SELECT 'rules', COUNT(*) FROM metadata.qualite_regle_classification WHERE version_reglementaire = 'REGLEMENT_QUALITE_EAUX_SURFACE_TABLEAU_1_V1_DEV_2026_05_19';

-- Attendus DEV validés :
-- sources=1, types_eau=4, classes=5, parameters=41, parameters_classifiable=36,
-- mappings_active=36, thresholds=205, thresholds_active=177, rules=5.

-- Aucun COMMIT automatique dans ce squelette.
-- Remplacer ROLLBACK par COMMIT uniquement lors de l'exécution validée.
ROLLBACK;
