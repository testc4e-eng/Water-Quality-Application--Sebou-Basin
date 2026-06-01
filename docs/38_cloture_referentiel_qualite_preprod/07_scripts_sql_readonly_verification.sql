-- Verification READ-ONLY - Referentiel qualite preproduction
-- Ne contient aucun INSERT/UPDATE/DELETE/DROP/TRUNCATE.
BEGIN READ ONLY;

-- 1. Tables reglementaires
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'metadata'
  AND table_name IN (
    'qualite_source_reglementaire',
    'qualite_type_eau',
    'qualite_classe_reglementaire',
    'qualite_parametre_reglementaire',
    'qualite_mapping_canonique_reglementaire',
    'qualite_seuil_reglementaire',
    'qualite_regle_classification'
  )
ORDER BY table_name;

-- 2. Volumetrie reglementaire
SELECT 'qualite_source_reglementaire' AS table_name, COUNT(*) FROM metadata.qualite_source_reglementaire
UNION ALL SELECT 'qualite_type_eau', COUNT(*) FROM metadata.qualite_type_eau
UNION ALL SELECT 'qualite_classe_reglementaire', COUNT(*) FROM metadata.qualite_classe_reglementaire
UNION ALL SELECT 'qualite_parametre_reglementaire', COUNT(*) FROM metadata.qualite_parametre_reglementaire
UNION ALL SELECT 'qualite_mapping_canonique_reglementaire', COUNT(*) FROM metadata.qualite_mapping_canonique_reglementaire
UNION ALL SELECT 'qualite_seuil_reglementaire', COUNT(*) FROM metadata.qualite_seuil_reglementaire
UNION ALL SELECT 'qualite_regle_classification', COUNT(*) FROM metadata.qualite_regle_classification;

-- 3. Version active
SELECT *
FROM metadata.qualite_source_reglementaire
WHERE actif = true
   OR statut ILIKE '%actif%'
   OR statut ILIKE '%active%'
ORDER BY created_at DESC NULLS LAST;

-- 4. Couverture active par version
WITH v AS (
  SELECT version_reglementaire
  FROM metadata.qualite_source_reglementaire
  WHERE actif = true
  ORDER BY created_at DESC NULLS LAST
  LIMIT 1
)
SELECT 'types_eau' AS key, COUNT(*) FROM metadata.qualite_type_eau t JOIN v USING (version_reglementaire)
UNION ALL SELECT 'classes', COUNT(*) FROM metadata.qualite_classe_reglementaire c JOIN v USING (version_reglementaire)
UNION ALL SELECT 'parameters', COUNT(*) FROM metadata.qualite_parametre_reglementaire p JOIN v USING (version_reglementaire)
UNION ALL SELECT 'parameters_classifiable', COUNT(*) FROM metadata.qualite_parametre_reglementaire p JOIN v USING (version_reglementaire) WHERE p.classifiable IS TRUE
UNION ALL SELECT 'mappings_active', COUNT(*) FROM metadata.qualite_mapping_canonique_reglementaire m JOIN v USING (version_reglementaire) WHERE m.actif IS TRUE
UNION ALL SELECT 'thresholds', COUNT(*) FROM metadata.qualite_seuil_reglementaire s JOIN v USING (version_reglementaire)
UNION ALL SELECT 'thresholds_active', COUNT(*) FROM metadata.qualite_seuil_reglementaire s JOIN v USING (version_reglementaire) WHERE s.actif IS TRUE
UNION ALL SELECT 'rules', COUNT(*) FROM metadata.qualite_regle_classification r JOIN v USING (version_reglementaire);

-- 5. Parametres sans mapping
SELECT p.*
FROM metadata.qualite_parametre_reglementaire p
LEFT JOIN metadata.qualite_mapping_canonique_reglementaire m
  ON m.parametre_reglementaire_id = p.id
WHERE m.parametre_reglementaire_id IS NULL;

-- 6. Seuils sans parametre
SELECT s.*
FROM metadata.qualite_seuil_reglementaire s
LEFT JOIN metadata.qualite_parametre_reglementaire p
  ON p.id = s.parametre_reglementaire_id
WHERE p.id IS NULL;

-- 7. Parametres sensibles, respecter MO != Mo
SELECT *
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('MO', 'Mo', 'MO_METAL', 'Hg', 'HG', 'H_G', 'sat', 'NO3', 'NO3-', 'O2_DISS', 'O2_DISSOUS')
   OR code_parametre ILIKE 'NO3%'
   OR code_parametre ILIKE 'O2%';

-- 8. Parametres qualite reels riviere
SELECT parametre_qualite, COUNT(*) AS n
FROM qualite.mesure_qualite_riviere
GROUP BY parametre_qualite
ORDER BY n DESC;

-- 9. Parametres qualite sans ref canonique
SELECT parametre_qualite, COUNT(*) AS n
FROM qualite.mesure_qualite_riviere
WHERE parametre_ref_id IS NULL
GROUP BY parametre_qualite
ORDER BY n DESC;

-- 10. Temperature meteo dediee
SELECT COUNT(*) AS temperature_count
FROM meteo.mesure_temperature;

ROLLBACK;
