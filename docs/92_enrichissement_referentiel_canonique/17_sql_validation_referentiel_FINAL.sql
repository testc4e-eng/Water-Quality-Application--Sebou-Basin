-- CONTROLES POST-ENRICHISSEMENT REFERENTIEL
-- A executer apres execution validee de 16_sql_enrichissement_referentiel_FINAL_VALIDATION_REQUISE.sql.
-- Lecture seule.

-- 1. Nombre de parametres actifs.
SELECT domaine, COUNT(*) AS parametres_actifs
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
GROUP BY domaine
ORDER BY domaine;

-- 2. Presence des cibles obligatoires.
WITH expected(code_parametre) AS (
    VALUES
        ('F-'),('CN'),('SIO2'),('H2S'),('CO2_LIBRE'),('CL2_RES'),
        ('GERME_22'),('GERME_37'),('CLOSTRI'),('PSEUDO_AER'),('VIBRIO'),
        ('ODEUR'),('SAVEUR'),('PTD'),('PTP'),('DCO_DEC2H'),('BORE')
)
SELECT
    e.code_parametre,
    CASE WHEN r.parametre_ref_id IS NULL THEN 'ABSENT' ELSE 'PRESENT' END AS statut_presence,
    r.unite_reference,
    r.statut
FROM expected e
LEFT JOIN metadata.referentiel_parametre_canonique r
  ON r.code_parametre = e.code_parametre
 AND r.statut = 'ACTIF'
ORDER BY e.code_parametre;

-- 3. Nombre d'alias par parametre cible.
SELECT
    code_parametre,
    jsonb_array_length(COALESCE(aliases, '[]'::jsonb)) AS alias_count
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN (
    'CONDUCTIVITE','O2_DISS','NO3-','NO2-','PO4_3-','HCO3-','SAT','HG','NH4',
    'TURBIDITE','HUILES_GRAISSES','AZOTE_ORG','AZOTE_TOTAL','AZOTE_TOT_KJELD',
    'PHOSPHORE_TOTAL','SIO3','CRT','DBO5','RS105','F-','CN','SIO2','SO3','H2S',
    'CO2_LIBRE','CL2_RES','GERME_22','GERME_37','CLOSTRI','PSEUDO_AER','VIBRIO',
    'ODEUR','SAVEUR','BORE'
)
ORDER BY code_parametre;

-- 4. Alias collisionnels.
WITH alias_flat AS (
    SELECT
        code_parametre,
        lower(trim(alias_value)) AS alias_norm
    FROM metadata.referentiel_parametre_canonique r
    CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(r.aliases, '[]'::jsonb)) AS a(alias_value)
    WHERE r.statut = 'ACTIF'
)
SELECT
    alias_norm,
    COUNT(DISTINCT code_parametre) AS candidate_count,
    string_agg(DISTINCT code_parametre, ', ' ORDER BY code_parametre) AS codes
FROM alias_flat
GROUP BY alias_norm
HAVING COUNT(DISTINCT code_parametre) > 1
ORDER BY candidate_count DESC, alias_norm;

-- 5. Parametres sans unite.
SELECT domaine, code_parametre, nom_parametre
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
  AND NULLIF(TRIM(unite_reference), '') IS NULL
ORDER BY domaine, code_parametre;

-- 6. Parametres sans domaine.
SELECT code_parametre, nom_parametre
FROM metadata.referentiel_parametre_canonique
WHERE statut = 'ACTIF'
  AND NULLIF(TRIM(domaine), '') IS NULL
ORDER BY code_parametre;

-- 7. Parametres sans statut.
SELECT code_parametre, nom_parametre
FROM metadata.referentiel_parametre_canonique
WHERE NULLIF(TRIM(statut), '') IS NULL
ORDER BY code_parametre;

-- 8. Exclusions controlees : ces parametres ne doivent pas etre actifs automatiquement.
SELECT code_parametre, nom_parametre, statut
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('MO_METAL','MD')
ORDER BY code_parametre;

-- 9. Verification que FM existe seulement comme cas client/quarantaine si present.
SELECT code_parametre, nom_parametre, statut, aliases
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre = 'FM'
   OR aliases ? 'F_M_mes';

-- 10. Sources qualite encore non couvertes par code ou alias exact.
WITH src AS (
    SELECT parametre_qualite FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NULL
    UNION
    SELECT parametre_qualite FROM qualite.mesure_qualite_nappe WHERE parametre_ref_id IS NULL
    UNION
    SELECT parametre_qualite FROM qualite.mesure_qualite_sebou WHERE parametre_ref_id IS NULL
    UNION
    SELECT parametre_qualite FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_ref_id IS NULL
), ref_keys AS (
    SELECT upper(trim(code_parametre)) AS key_norm
    FROM metadata.referentiel_parametre_canonique
    WHERE statut = 'ACTIF'
    UNION
    SELECT upper(trim(alias_value)) AS key_norm
    FROM metadata.referentiel_parametre_canonique r
    CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(r.aliases, '[]'::jsonb)) AS a(alias_value)
    WHERE r.statut = 'ACTIF'
)
SELECT s.parametre_qualite
FROM src s
WHERE NOT EXISTS (
    SELECT 1 FROM ref_keys r WHERE r.key_norm = upper(trim(s.parametre_qualite))
)
ORDER BY s.parametre_qualite;

