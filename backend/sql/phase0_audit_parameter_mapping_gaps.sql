-- =============================================================================
-- PHASE 0 — AUDIT DES GAPS DE MAPPING PARAMÈTRE
-- Détecte tous les paramètres qualité en staging non mappés vers le référentiel
-- canonique metadata.referentiel_parametre
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. PARAMÈTRES QUALITÉ DISTINCTS DANS CHAQUE TABLE STAGING
-- ----------------------------------------------------------------------------
\echo '=== 1. Paramètres distincts — staging.mesures_qualite_barrages ==='

SELECT
    s.parametre_qualite                             AS param_brut,
    COUNT(*)                                        AS nb_mesures,
    MIN(s.date_prelevement)                         AS date_min,
    MAX(s.date_prelevement)                         AS date_max,
    CASE WHEN mp.source_value IS NOT NULL THEN '✅ mappé'
         ELSE '❌ NON mappé'
    END                                             AS statut_mapping,
    mp.code_canonique                               AS code_canonique
FROM staging.mesures_qualite_barrages s
LEFT JOIN metadata.mapping_parametre_source mp
    ON mp.source_value = s.parametre_qualite
GROUP BY s.parametre_qualite, mp.source_value, mp.code_canonique
ORDER BY nb_mesures DESC;


\echo '=== 2. Paramètres distincts — staging.mesures_qualite_nappes ==='

SELECT
    s.parametre_qualite,
    COUNT(*) AS nb_mesures,
    CASE WHEN mp.source_value IS NOT NULL THEN '✅ mappé' ELSE '❌ NON mappé' END AS statut,
    mp.code_canonique
FROM staging.mesures_qualite_nappes s
LEFT JOIN metadata.mapping_parametre_source mp
    ON mp.source_value = s.parametre_qualite
GROUP BY s.parametre_qualite, mp.source_value, mp.code_canonique
ORDER BY nb_mesures DESC;


\echo '=== 3. Paramètres distincts — staging._legacy_qualite_riviere ==='

SELECT
    s.parametre_qualite,
    COUNT(*) AS nb_mesures,
    CASE WHEN mp.source_value IS NOT NULL THEN '✅ mappé' ELSE '❌ NON mappé' END AS statut,
    mp.code_canonique
FROM staging._legacy_qualite_riviere s
LEFT JOIN metadata.mapping_parametre_source mp
    ON mp.source_value = s.parametre_qualite
GROUP BY s.parametre_qualite, mp.source_value, mp.code_canonique
ORDER BY nb_mesures DESC;


\echo '=== 4. Paramètres distincts — staging.suivi_qualite_brg_garde_hebdo ==='

SELECT
    s.parametre_qualite,
    COUNT(*) AS nb_mesures,
    CASE WHEN mp.source_value IS NOT NULL THEN '✅ mappé' ELSE '❌ NON mappé' END AS statut,
    mp.code_canonique
FROM staging.suivi_qualite_brg_garde_hebdo s
LEFT JOIN metadata.mapping_parametre_source mp
    ON mp.source_value = s.parametre_qualite
GROUP BY s.parametre_qualite, mp.source_value, mp.code_canonique
ORDER BY nb_mesures DESC;


-- ----------------------------------------------------------------------------
-- 2. SYNTHÈSE DES PARAMÈTRES NON MAPPÉS (TOUTES SOURCES)
-- ----------------------------------------------------------------------------
\echo '=== 5. SYNTHÈSE — Paramètres non mappés toutes sources ==='

WITH all_params AS (
    SELECT DISTINCT parametre_qualite, 'barrages' AS source FROM staging.mesures_qualite_barrages
    UNION
    SELECT DISTINCT parametre_qualite, 'nappes'   FROM staging.mesures_qualite_nappes
    UNION
    SELECT DISTINCT parametre_qualite, 'riviere'  FROM staging._legacy_qualite_riviere
    UNION
    SELECT DISTINCT parametre_qualite, 'sebou'    FROM staging.suivi_qualite_sebou
    UNION
    SELECT DISTINCT parametre_qualite, 'hebdo'    FROM staging.suivi_qualite_brg_garde_hebdo
)
SELECT
    ap.parametre_qualite,
    string_agg(DISTINCT ap.source, ', ') AS sources,
    CASE WHEN mp.source_value IS NOT NULL THEN '✅ mappé' ELSE '❌ NON mappé' END AS statut,
    mp.code_canonique,
    rp.libelle,
    rp.unite
FROM all_params ap
LEFT JOIN metadata.mapping_parametre_source mp ON mp.source_value = ap.parametre_qualite
LEFT JOIN metadata.referentiel_parametre rp    ON rp.code_canonique = mp.code_canonique
GROUP BY ap.parametre_qualite, mp.source_value, mp.code_canonique, rp.libelle, rp.unite
ORDER BY statut DESC, ap.parametre_qualite;


-- ----------------------------------------------------------------------------
-- 3. PARAMÈTRES SWAT vs RÉFÉRENTIEL
-- ----------------------------------------------------------------------------
\echo '=== 6. Codes SWAT vs référentiel canonique ==='

SELECT
    sp.param_code           AS code_swat,
    sp.description,
    sp.unite,
    rp.code_canonique,
    rp.libelle              AS libelle_canonique,
    CASE WHEN rp.id IS NOT NULL THEN '✅ lié' ELSE '❌ non lié' END AS statut
FROM swat_output.ref_parametre_qualite sp
LEFT JOIN metadata.referentiel_parametre rp
    ON rp.code_swat_output = sp.param_code   -- colonne à ajouter en Phase 1
    OR rp.code_canonique = sp.param_code
ORDER BY sp.param_code;


-- ----------------------------------------------------------------------------
-- 4. PARAMÈTRES WASP vs RÉFÉRENTIEL
-- ----------------------------------------------------------------------------
\echo '=== 7. Codes WASP vs référentiel canonique ==='

SELECT
    wp.code_parametre       AS code_wasp,
    wp.nom_parametre,
    wp.unite,
    wp.famille,
    rp.code_canonique,
    rp.libelle              AS libelle_canonique,
    CASE WHEN rp.id IS NOT NULL THEN '✅ lié' ELSE '❌ non lié' END AS statut
FROM wasp_output.ref_parametre_qualite wp
LEFT JOIN metadata.referentiel_parametre rp
    ON rp.code_wasp_output = wp.code_parametre  -- colonne à ajouter en Phase 1
    OR rp.code_canonique = wp.code_parametre
ORDER BY wp.code_parametre;
