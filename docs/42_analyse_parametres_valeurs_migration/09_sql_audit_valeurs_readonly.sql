-- Objectif : détecter les valeurs de type <x
-- Table : public.idp_2024_mesures_qualite_globale
-- Paramètre : tous
-- Requête read-only :
SELECT parametre_qualite, COUNT(*) AS nb_cas
FROM public.idp_2024_mesures_qualite_globale
WHERE regexp_replace(btrim(val_qual), '\s+', '', 'g') ~ '^[<≤][0-9]+([,.][0-9]+)?$'
GROUP BY parametre_qualite
ORDER BY nb_cas DESC;

-- Objectif : détecter les valeurs de type >x
-- Table : public.idp_2024_mesures_qualite_marche_cadre
-- Paramètre : tous
-- Requête read-only :
SELECT parametre_qualite, COUNT(*) AS nb_cas
FROM public.idp_2024_mesures_qualite_marche_cadre
WHERE regexp_replace(btrim(val_qual), '\s+', '', 'g') ~ '^[>≥][0-9]+([,.][0-9]+)?$'
GROUP BY parametre_qualite
ORDER BY nb_cas DESC;

-- Objectif : détecter les virgules décimales
-- Table : tables IDP qualité 2024
-- Paramètre : tous
-- Requête read-only :
SELECT 'globale' AS table_src, parametre_qualite, COUNT(*) AS nb_cas
FROM public.idp_2024_mesures_qualite_globale
WHERE regexp_replace(btrim(val_qual), '\s+', '', 'g') ~ '^[0-9]+,[0-9]+$'
GROUP BY parametre_qualite
UNION ALL
SELECT 'marche_cadre', parametre_qualite, COUNT(*)
FROM public.idp_2024_mesures_qualite_marche_cadre
WHERE regexp_replace(btrim(val_qual), '\s+', '', 'g') ~ '^[0-9]+,[0-9]+$'
GROUP BY parametre_qualite;

-- Objectif : détecter les valeurs non numériques non interprétables
-- Table : tables IDP qualité 2024
-- Paramètre : tous
-- Requête read-only :
SELECT 'globale' AS table_src, parametre_qualite, COUNT(*) AS nb_cas
FROM public.idp_2024_mesures_qualite_globale
WHERE val_qual IS NOT NULL
  AND btrim(val_qual) <> ''
  AND NOT (regexp_replace(btrim(val_qual), '\s+', '', 'g') ~ '^[<>≤≥]?[0-9]+([,.][0-9]+)?$')
GROUP BY parametre_qualite
UNION ALL
SELECT 'marche_cadre', parametre_qualite, COUNT(*)
FROM public.idp_2024_mesures_qualite_marche_cadre
WHERE val_qual IS NOT NULL
  AND btrim(val_qual) <> ''
  AND NOT (regexp_replace(btrim(val_qual), '\s+', '', 'g') ~ '^[<>≤≥]?[0-9]+([,.][0-9]+)?$')
GROUP BY parametre_qualite;

-- Objectif : min/max par paramètre sur tables numériques
-- Table : public.mesures_qualite_rivieres
-- Paramètre : tous
-- Requête read-only :
SELECT parametre_qualite, MIN(val_qual_riv) AS min_v, MAX(val_qual_riv) AS max_v, COUNT(*) AS volume
FROM public.mesures_qualite_rivieres
GROUP BY parametre_qualite
ORDER BY parametre_qualite;

-- Objectif : null par paramètre
-- Table : public.suivi_qualite_brg_garde_hebdo
-- Paramètre : tous
-- Requête read-only :
SELECT parametre_qualite, COUNT(*) AS volume_total,
       SUM(CASE WHEN val_qual_brg_garde_hebdo IS NULL THEN 1 ELSE 0 END) AS nb_null
FROM public.suivi_qualite_brg_garde_hebdo
GROUP BY parametre_qualite
ORDER BY nb_null DESC;

-- Objectif : distribution par paramètre
-- Table : public.suivi_qualite_sebou_jr
-- Paramètre : tous
-- Requête read-only :
SELECT parametre_qualite, COUNT(*) AS volume, MIN(val_qual_sebou_jr) AS min_v, MAX(val_qual_sebou_jr) AS max_v
FROM public.suivi_qualite_sebou_jr
GROUP BY parametre_qualite
ORDER BY volume DESC;
