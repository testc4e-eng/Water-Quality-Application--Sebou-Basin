-- Cas : CAS-363
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : profond_tot_m
-- Nom standard proposé : Profondeur
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.points_eau_abhs
-- Cas : PARAMETER_MAPPING / profond_tot_m
SELECT COUNT(*) AS volume_cas FROM public.points_eau_abhs WHERE profond_tot_m IS NOT NULL;
SELECT profond_tot_m FROM public.points_eau_abhs WHERE profond_tot_m IS NOT NULL LIMIT 20;
