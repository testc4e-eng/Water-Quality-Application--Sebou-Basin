-- Objectif : détection des tables et colonnes candidates paramètre
-- Base : abh_sad / abh_sebou_070426
-- Table : information_schema.columns
-- Risque : aucun, lecture seule
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema IN ('public','staging','raw_import','qualite','hydro','meteo','infra','metadata','swat_output','wasp_output','swat_sebou','wasp_sebou','analytics','api')
  AND (column_name ILIKE '%param%' OR column_name ILIKE '%variable%' OR column_name ILIKE '%indicateur%' OR column_name ILIKE '%value%' OR column_name ILIKE '%valeur%')
ORDER BY table_schema, table_name, ordinal_position;

-- Objectif : lister les tables du périmètre
-- Base : abh_sad / abh_sebou_070426
-- Table : information_schema.tables
-- Risque : aucun, lecture seule
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type='BASE TABLE'
  AND table_schema IN ('public','staging','raw_import','qualite','hydro','meteo','infra','metadata','swat_output','wasp_output','swat_sebou','wasp_sebou','analytics','api')
ORDER BY table_schema, table_name;

-- Objectif : paramètres distincts d'une table avec colonne paramètre
-- Base : abh_sad
-- Table : qualite.mesure_qualite_riviere
-- Risque : aucun, lecture seule
SELECT parametre_qualite, COUNT(*)
FROM qualite.mesure_qualite_riviere
GROUP BY 1
ORDER BY 2 DESC;

-- Objectif : statistiques par paramètre
-- Base : abh_sad
-- Table : qualite.mesure_qualite_riviere
-- Risque : aucun, lecture seule
SELECT parametre_qualite, COUNT(*) AS volume, MIN(valeur) AS min_valeur, MAX(valeur) AS max_valeur, SUM(CASE WHEN valeur < 0 THEN 1 ELSE 0 END) AS nb_negatifs
FROM qualite.mesure_qualite_riviere
GROUP BY 1
ORDER BY volume DESC;

-- Objectif : unités issues du référentiel metadata
-- Base : abh_sad
-- Table : metadata.referentiel_parametre
-- Risque : aucun, lecture seule
SELECT *
FROM metadata.referentiel_parametre
ORDER BY 1;

-- Objectif : paramètres non résolus depuis les tables unresolved
-- Base : abh_sad
-- Table : metadata.mapping_parametre_unresolved_*
-- Risque : aucun, lecture seule
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema='metadata' AND table_name ILIKE 'mapping_parametre_unresolved%';

-- Objectif : valeurs non numériques sur une colonne texte
-- Base : abh_sebou_070426
-- Table : public.mesures_idp_2024_qualite_globale
-- Risque : aucun, lecture seule
SELECT parametre_qualite, COUNT(*)
FROM public.mesures_idp_2024_qualite_globale
WHERE NULLIF(TRIM(val_qual),'') IS NOT NULL
  AND REPLACE(TRIM(val_qual), ',', '.') !~ '^-?[0-9]+(?:\.[0-9]+)?$'
GROUP BY 1
ORDER BY 2 DESC;

-- Objectif : valeurs nulles par paramètre
-- Base : abh_sebou_070426
-- Table : public.mesures_idp_2024_qualite_marche_cadre
-- Risque : aucun, lecture seule
SELECT parametre_qualite, COUNT(*)
FROM public.mesures_idp_2024_qualite_marche_cadre
WHERE NULLIF(TRIM(val_qual),'') IS NULL
GROUP BY 1
ORDER BY 2 DESC;

-- Objectif : valeurs négatives par paramètre
-- Base : abh_sad
-- Table : hydro.mesure_debit
-- Risque : aucun, lecture seule
SELECT COUNT(*) AS nb_negatifs
FROM hydro.mesure_debit
WHERE valeur < 0;

-- Objectif : paramètres présents uniquement dans une base
-- Base : abh_sad / abh_sebou_070426
-- Table : à exécuter séparément puis comparer
-- Risque : aucun, lecture seule
SELECT LOWER(REGEXP_REPLACE(parametre_qualite, '[^a-zA-Z0-9]+', ' ', 'g')) AS parametre_normalise, COUNT(*)
FROM qualite.mesure_qualite_riviere
GROUP BY 1;
