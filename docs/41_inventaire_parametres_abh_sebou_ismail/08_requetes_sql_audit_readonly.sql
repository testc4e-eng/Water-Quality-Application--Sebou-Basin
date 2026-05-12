-- Objectif : lister les tables métier de la base abh_sebou_ismail
-- Base : abh_sebou_ismail
-- Table : information_schema.tables
-- Risque : aucun, lecture seule
SELECT table_schema, table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Objectif : lister les paramètres distincts dans les tables qualité
-- Base : abh_sebou_ismail
-- Table : public.mesures_qualite_rivieres, public.mesures_qualite_nappes, public.mesures_qualite_barrages
-- Risque : aucun, lecture seule
SELECT 'mesures_qualite_rivieres' AS table_name, parametre_qualite, COUNT(*) AS volume
FROM public.mesures_qualite_rivieres
GROUP BY parametre_qualite
UNION ALL
SELECT 'mesures_qualite_nappes', parametre_qualite, COUNT(*)
FROM public.mesures_qualite_nappes
GROUP BY parametre_qualite
UNION ALL
SELECT 'mesures_qualite_barrages', parametre_qualite, COUNT(*)
FROM public.mesures_qualite_barrages
GROUP BY parametre_qualite;

-- Objectif : détecter les paramètres IDP 2024 et leurs volumes
-- Base : abh_sebou_ismail
-- Table : public.idp_2024_mesures_qualite_globale, public.idp_2024_mesures_qualite_marche_cadre
-- Risque : aucun, lecture seule
SELECT parametre_qualite, COUNT(*)
FROM public.idp_2024_mesures_qualite_globale
GROUP BY parametre_qualite
ORDER BY 2 DESC;

SELECT parametre_qualite, COUNT(*)
FROM public.idp_2024_mesures_qualite_marche_cadre
GROUP BY parametre_qualite
ORDER BY 2 DESC;

-- Objectif : vérifier les unités du dictionnaire local
-- Base : abh_sebou_ismail
-- Table : public.types_mesures
-- Risque : aucun, lecture seule
SELECT parametre_qualite, unite, type_mesure
FROM public.types_mesures
ORDER BY parametre_qualite, unite;

-- Objectif : détecter les valeurs non numériques dans les tables IDP 2024
-- Base : abh_sebou_ismail
-- Table : public.idp_2024_mesures_qualite_globale, public.idp_2024_mesures_qualite_marche_cadre
-- Risque : aucun, lecture seule
SELECT parametre_qualite, COUNT(*) AS nb_non_numeriques
FROM public.idp_2024_mesures_qualite_globale
WHERE NULLIF(replace(trim(val_qual), ',', '.'), '') IS NOT NULL
  AND NOT (NULLIF(replace(trim(val_qual), ',', '.'), '') ~ '^[-+]?[0-9]+(\.[0-9]+)?$')
GROUP BY parametre_qualite
ORDER BY nb_non_numeriques DESC;

SELECT parametre_qualite, COUNT(*) AS nb_non_numeriques
FROM public.idp_2024_mesures_qualite_marche_cadre
WHERE NULLIF(replace(trim(val_qual), ',', '.'), '') IS NOT NULL
  AND NOT (NULLIF(replace(trim(val_qual), ',', '.'), '') ~ '^[-+]?[0-9]+(\.[0-9]+)?$')
GROUP BY parametre_qualite
ORDER BY nb_non_numeriques DESC;
