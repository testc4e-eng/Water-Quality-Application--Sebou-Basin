-- Cas : CAS-067
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : p_annuelle
-- Nom standard proposé : P_annuelle
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_precipitations_jr_max
-- Cas : UNIT_VALIDATION / p_annuelle
SELECT COUNT(*) AS volume_cas FROM public.mesures_precipitations_jr_max WHERE p_annuelle IS NOT NULL;
SELECT p_annuelle FROM public.mesures_precipitations_jr_max WHERE p_annuelle IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
