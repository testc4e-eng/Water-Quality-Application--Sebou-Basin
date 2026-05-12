-- Cas : CAS-082
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : dimension
-- Nom standard proposé : Dimension
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.rejets_domestiques_abhs
-- Cas : UNIT_VALIDATION / dimension
SELECT COUNT(*) AS volume_cas FROM public.rejets_domestiques_abhs WHERE dimension IS NOT NULL;
SELECT dimension FROM public.rejets_domestiques_abhs WHERE dimension IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
