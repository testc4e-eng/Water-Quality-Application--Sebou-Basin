-- Cas : CAS-365
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : superficie_ha
-- Nom standard proposé : Superficie_ha
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.step_abhs
-- Cas : PARAMETER_MAPPING / superficie_ha
SELECT COUNT(*) AS volume_cas FROM public.step_abhs WHERE superficie_ha IS NOT NULL;
SELECT superficie_ha FROM public.step_abhs WHERE superficie_ha IS NOT NULL LIMIT 20;
