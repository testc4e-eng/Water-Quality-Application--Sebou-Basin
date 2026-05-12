-- Objectif : localiser les 4 tables IDP 2024 dans la base courante
-- Table : information_schema.tables
-- Risque : mauvaise hypothèse sur le schéma ou l'existence des tables
SELECT table_schema, table_name
FROM information_schema.tables
WHERE lower(table_name) IN (
  'mesures_idp_2024_qualite_globale',
  'mesures_idp_2024_qualite_marche_cadre',
  'mesures_idp_2024_src_pollution_globale',
  'mesures_idp_2024_src_pollution_marche_cadre'
)
ORDER BY 1, 2;

-- Objectif : auditer les colonnes et types des tables IDP
-- Table : information_schema.columns
-- Risque : confusion sur les clés, dates, paramètres et valeurs
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE lower(table_name) IN (
  'mesures_idp_2024_qualite_globale',
  'mesures_idp_2024_qualite_marche_cadre',
  'mesures_idp_2024_src_pollution_globale',
  'mesures_idp_2024_src_pollution_marche_cadre'
)
ORDER BY table_schema, table_name, ordinal_position;

-- Objectif : obtenir les volumes de chaque table IDP
-- Table : public.mesures_idp_2024_*
-- Risque : travailler sans base volumétrique fiable
SELECT 'public.mesures_idp_2024_qualite_globale' AS table_name, COUNT(*) FROM public.mesures_idp_2024_qualite_globale
UNION ALL
SELECT 'public.mesures_idp_2024_qualite_marche_cadre', COUNT(*) FROM public.mesures_idp_2024_qualite_marche_cadre
UNION ALL
SELECT 'public.mesures_idp_2024_src_pollution_globale', COUNT(*) FROM public.mesures_idp_2024_src_pollution_globale
UNION ALL
SELECT 'public.mesures_idp_2024_src_pollution_marche_cadre', COUNT(*) FROM public.mesures_idp_2024_src_pollution_marche_cadre;

-- Objectif : obtenir dates min/max, paramètres distincts et points distincts
-- Table : public.mesures_idp_2024_*
-- Risque : mauvaise lecture de la couverture réelle
SELECT 'public.mesures_idp_2024_qualite_globale', MIN(date_jr_prelevement), MAX(date_jr_prelevement), COUNT(DISTINCT pts_prelevement), COUNT(DISTINCT parametre_qualite)
FROM public.mesures_idp_2024_qualite_globale
UNION ALL
SELECT 'public.mesures_idp_2024_qualite_marche_cadre', MIN(date_jr_prelevement), MAX(date_jr_prelevement), COUNT(DISTINCT pts_prelevement), COUNT(DISTINCT parametre_qualite)
FROM public.mesures_idp_2024_qualite_marche_cadre
UNION ALL
SELECT 'public.mesures_idp_2024_src_pollution_globale', MIN(date_jr_prelevement), MAX(date_jr_prelevement), COUNT(DISTINCT pts_prelevement), COUNT(DISTINCT parametre)
FROM public.mesures_idp_2024_src_pollution_globale
UNION ALL
SELECT 'public.mesures_idp_2024_src_pollution_marche_cadre', MIN(date_jr_prelevement), MAX(date_jr_prelevement), COUNT(DISTINCT pts_prelevement), COUNT(DISTINCT parametre)
FROM public.mesures_idp_2024_src_pollution_marche_cadre;

-- Objectif : détecter les doublons exacts
-- Table : public.mesures_idp_2024_*
-- Risque : suppression ou fusion basée sur une hypothèse fausse
WITH d AS (
  SELECT md5(row_to_json(t)::text) AS sig, COUNT(*) AS c
  FROM public.mesures_idp_2024_qualite_globale t
  GROUP BY 1
  HAVING COUNT(*) > 1
)
SELECT COALESCE(SUM(c - 1), 0) AS duplicate_exact_rows, COUNT(*) AS duplicate_exact_groups
FROM d;

-- Objectif : détecter les doublons métier qualité
-- Table : public.mesures_idp_2024_qualite_globale
-- Risque : doublons utiles confondus avec lignes légitimes
WITH d AS (
  SELECT pts_prelevement, date_jr_prelevement, parametre_qualite, val_qual, COUNT(*) AS c
  FROM public.mesures_idp_2024_qualite_globale
  GROUP BY 1,2,3,4
  HAVING COUNT(*) > 1
)
SELECT *
FROM d
ORDER BY c DESC, pts_prelevement
LIMIT 100;

-- Objectif : lister les paramètres distincts et leurs fréquences
-- Table : public.mesures_idp_2024_qualite_*
-- Risque : sous-estimation des variantes de paramètres
SELECT parametre_qualite, COUNT(*) AS volume
FROM public.mesures_idp_2024_qualite_globale
GROUP BY 1
ORDER BY volume DESC, parametre_qualite;

-- Objectif : détecter les paramètres absents du mapping actuel de abh_sad
-- Table : public.mesures_idp_2024_qualite_*, metadata.mapping_parametre_source
-- Risque : fusion de paramètres non stabilisés
-- Requête read-only à exécuter séparément sur chaque base si besoin.
-- Dans abh_sebou_070426 :
SELECT DISTINCT TRIM(parametre_qualite)
FROM public.mesures_idp_2024_qualite_globale
UNION
SELECT DISTINCT TRIM(parametre_qualite)
FROM public.mesures_idp_2024_qualite_marche_cadre;

-- Dans abh_sad :
SELECT DISTINCT TRIM(source_value)
FROM metadata.mapping_parametre_source
WHERE source_value IS NOT NULL;

-- Objectif : détecter les valeurs NULL et vides
-- Table : public.mesures_idp_2024_qualite_marche_cadre
-- Risque : lignes inexploitables dans les synthèses
SELECT parametre_qualite, val_qual, pts_prelevement, date_jr_prelevement
FROM public.mesures_idp_2024_qualite_marche_cadre
WHERE val_qual IS NULL
   OR TRIM(COALESCE(val_qual, '')) = '';

-- Objectif : détecter les valeurs non numériques dans val_qual
-- Table : public.mesures_idp_2024_qualite_*
-- Risque : impossibilité de convertir ou d’agréger correctement
SELECT parametre_qualite, val_qual, pts_prelevement, date_jr_prelevement
FROM public.mesures_idp_2024_qualite_globale
WHERE val_qual !~ '^\s*-?\d+(?:[\.,]\d+)?\s*$'
  AND TRIM(COALESCE(val_qual, '')) <> ''
ORDER BY parametre_qualite, date_jr_prelevement
LIMIT 200;

-- Objectif : détecter les valeurs négatives numériques
-- Table : public.mesures_idp_2024_qualite_*
-- Risque : valeur impossible ou code labo non clarifié
SELECT parametre_qualite, val_qual, pts_prelevement, date_jr_prelevement
FROM public.mesures_idp_2024_qualite_globale
WHERE replace(val_qual, ',', '.') ~ '^\s*-\d+(?:\.\d+)?\s*$';

-- Objectif : vérifier les dates futures suspectes
-- Table : public.mesures_idp_2024_*
-- Risque : migration ou saisie incohérente
SELECT *
FROM public.mesures_idp_2024_qualite_globale
WHERE date_jr_prelevement > CURRENT_DATE;

-- Objectif : comparer globale vs marché cadre sur les lignes qualité
-- Table : public.mesures_idp_2024_qualite_globale / marche_cadre
-- Risque : doublons si UNION ALL sans contrôle
WITH a AS (
  SELECT pts_prelevement, date_jr_prelevement, parametre_qualite, val_qual
  FROM public.mesures_idp_2024_qualite_globale
),
b AS (
  SELECT pts_prelevement, date_jr_prelevement, parametre_qualite, val_qual
  FROM public.mesures_idp_2024_qualite_marche_cadre
)
SELECT *
FROM a
JOIN b USING (pts_prelevement, date_jr_prelevement, parametre_qualite, val_qual)
LIMIT 200;

-- Objectif : comparer globale vs marché cadre sur les lignes source pollution
-- Table : public.mesures_idp_2024_src_pollution_globale / marche_cadre
-- Risque : doublons si fusion sans traçabilité
WITH a AS (
  SELECT pts_prelevement, date_jr_prelevement, commune, COALESCE(nature, '[null]') AS nature
  FROM public.mesures_idp_2024_src_pollution_globale
),
b AS (
  SELECT pts_prelevement, date_jr_prelevement, commune, COALESCE(nature, '[null]') AS nature
  FROM public.mesures_idp_2024_src_pollution_marche_cadre
)
SELECT *
FROM a
JOIN b USING (pts_prelevement, date_jr_prelevement, commune, nature)
LIMIT 200;

-- Objectif : lister les points source pollution déjà présents dans abh_sad
-- Table : public.mesures_idp_2024_src_pollution_* ; qualite.source_pollution_prelevement
-- Risque : réingestion créant des doublons fonctionnels
-- Requête à exécuter séparément sur les deux bases :
-- abh_sebou_070426 :
SELECT DISTINCT lower(trim(pts_prelevement))
FROM public.mesures_idp_2024_src_pollution_globale
UNION
SELECT DISTINCT lower(trim(pts_prelevement))
FROM public.mesures_idp_2024_src_pollution_marche_cadre;

-- abh_sad :
SELECT DISTINCT lower(trim(point_prelevement))
FROM qualite.source_pollution_prelevement
WHERE point_prelevement IS NOT NULL;
