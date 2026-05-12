-- Cas : CAS-068
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : p_max
-- Nom standard proposé : P_max
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_precipitations_jr_max
-- Cas : UNIT_VALIDATION / p_max
SELECT COUNT(*) AS volume_cas FROM public.mesures_precipitations_jr_max WHERE p_max IS NOT NULL;
SELECT p_max FROM public.mesures_precipitations_jr_max WHERE p_max IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
