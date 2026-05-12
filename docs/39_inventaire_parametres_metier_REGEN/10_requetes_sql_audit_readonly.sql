-- Objectif : lister les tables métier candidates
-- Base : abh_sad / abh_sebou_070426
-- Table : information_schema.tables
-- Risque : aucun, lecture seule
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type='BASE TABLE'
  AND table_schema IN ('qualite','hydro','meteo','infra','geo','metadata','swat_output','wasp_output','swat_sebou','wasp_sebou','staging','raw','raw_import','tmp','temp','backup','public')
ORDER BY table_schema, table_name;

-- Objectif : lister les colonnes candidates paramètre
-- Base : abh_sad / abh_sebou_070426
-- Table : information_schema.columns
-- Risque : aucun, lecture seule
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema IN ('qualite','hydro','meteo','infra','geo','metadata','swat_output','wasp_output','swat_sebou','wasp_sebou','staging','raw','raw_import','tmp','temp','backup','public')
  AND (
      column_name ILIKE '%parametre%'
      OR column_name ILIKE '%variable%'
      OR column_name ILIKE '%indicateur%'
      OR column_name ILIKE '%value%'
      OR column_name ILIKE '%valeur%'
  )
ORDER BY table_schema, table_name, ordinal_position;

-- Objectif : paramètres distincts d'une table qualité
-- Base : abh_sad
-- Table : qualite.mesure_qualite_riviere
-- Risque : aucun, lecture seule
SELECT parametre_qualite, COUNT(*)
FROM qualite.mesure_qualite_riviere
GROUP BY 1
ORDER BY 2 DESC;

-- Objectif : paramètres distincts du mapping source
-- Base : abh_sad
-- Table : metadata.mapping_parametre_source
-- Risque : aucun, lecture seule
SELECT source_value, COUNT(*)
FROM metadata.mapping_parametre_source
GROUP BY 1
ORDER BY 2 DESC;

-- Objectif : statistiques d'une colonne large
-- Base : abh_sad
-- Table : hydro.mesure_debit
-- Risque : aucun, lecture seule
SELECT COUNT(*) AS volume_lignes,
       COUNT(valeur) AS volume_valeurs_non_nulles,
       COUNT(*) - COUNT(valeur) AS nb_valeurs_nulles,
       SUM(CASE WHEN valeur < 0 THEN 1 ELSE 0 END) AS nb_valeurs_negatives,
       MIN(valeur) AS min_valeur,
       MAX(valeur) AS max_valeur
FROM hydro.mesure_debit;

-- Objectif : contrôler les schémas présents dans le fichier final
-- Base : abh_sad / abh_sebou_070426
-- Table : information_schema.schemata
-- Risque : aucun, lecture seule
SELECT schema_name
FROM information_schema.schemata
ORDER BY schema_name;
