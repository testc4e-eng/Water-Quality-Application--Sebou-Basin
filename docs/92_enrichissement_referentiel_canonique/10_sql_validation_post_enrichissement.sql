-- Controles post-enrichissement proposes.

-- Parametres actifs sans unite.
SELECT domaine, COUNT(*) AS rows_without_unit
FROM metadata.referentiel_parametre_canonique
WHERE statut='ACTIF'
  AND NULLIF(TRIM(unite_reference), '') IS NULL
GROUP BY domaine;

-- Alias vides.
SELECT domaine, COUNT(*) AS rows_without_aliases
FROM metadata.referentiel_parametre_canonique
WHERE statut='ACTIF'
  AND (aliases IS NULL OR aliases='[]'::jsonb)
GROUP BY domaine;

-- Doublons code canonique.
SELECT code_parametre, COUNT(*) AS n
FROM metadata.referentiel_parametre_canonique
GROUP BY code_parametre
HAVING COUNT(*) > 1;

-- Collisions alias entre parametres.
WITH alias_flat AS (
    SELECT code_parametre, lower(trim(alias_value)) AS alias_norm
    FROM metadata.referentiel_parametre_canonique r
    CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(r.aliases,'[]'::jsonb)) AS a(alias_value)
    WHERE r.statut='ACTIF'
)
SELECT alias_norm, COUNT(DISTINCT code_parametre) AS candidate_count,
       string_agg(DISTINCT code_parametre, ', ' ORDER BY code_parametre) AS codes
FROM alias_flat
GROUP BY alias_norm
HAVING COUNT(DISTINCT code_parametre) > 1
ORDER BY candidate_count DESC, alias_norm;

-- Parametres sans domaine/type/table cible.
SELECT
    COUNT(*) FILTER (WHERE NULLIF(TRIM(domaine),'') IS NULL) AS domaine_missing,
    COUNT(*) FILTER (WHERE NULLIF(TRIM(type_metier),'') IS NULL) AS type_missing,
    COUNT(*) FILTER (WHERE NULLIF(TRIM(table_cible),'') IS NULL) AS table_cible_missing
FROM metadata.referentiel_parametre_canonique
WHERE statut='ACTIF';

-- Parametres actifs non mappes dans les mesures qualite.
WITH used_params AS (
    SELECT DISTINCT parametre_ref_id FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NOT NULL
    UNION SELECT DISTINCT parametre_ref_id FROM qualite.mesure_qualite_nappe WHERE parametre_ref_id IS NOT NULL
    UNION SELECT DISTINCT parametre_ref_id FROM qualite.mesure_qualite_sebou WHERE parametre_ref_id IS NOT NULL
    UNION SELECT DISTINCT parametre_ref_id FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_ref_id IS NOT NULL
)
SELECT r.code_parametre, r.nom_parametre
FROM metadata.referentiel_parametre_canonique r
LEFT JOIN used_params u ON u.parametre_ref_id = r.parametre_ref_id
WHERE r.statut='ACTIF'
  AND r.domaine='qualite'
  AND u.parametre_ref_id IS NULL
ORDER BY r.code_parametre;

-- Parametres source qualite encore non resolus apres enrichissement.
WITH src AS (
    SELECT parametre_qualite FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NULL
    UNION
    SELECT parametre_qualite FROM qualite.mesure_qualite_nappe WHERE parametre_ref_id IS NULL
    UNION
    SELECT parametre_qualite FROM qualite.mesure_qualite_sebou WHERE parametre_ref_id IS NULL
    UNION
    SELECT parametre_qualite FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_ref_id IS NULL
), ref_keys AS (
    SELECT upper(trim(code_parametre)) AS k FROM metadata.referentiel_parametre_canonique WHERE statut='ACTIF'
    UNION
    SELECT upper(trim(alias_value))
    FROM metadata.referentiel_parametre_canonique r
    CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(r.aliases,'[]'::jsonb)) AS a(alias_value)
    WHERE r.statut='ACTIF'
)
SELECT s.parametre_qualite
FROM src s
WHERE NOT EXISTS (
    SELECT 1 FROM ref_keys r WHERE r.k = upper(trim(s.parametre_qualite))
)
ORDER BY s.parametre_qualite;

