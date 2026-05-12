-- Cas : CAS-361
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : dist_pt_eau_foyer_pollut_m
-- Nom standard proposé : Dist_foyer
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.points_eau_abhs
-- Cas : PARAMETER_MAPPING / dist_pt_eau_foyer_pollut_m
SELECT COUNT(*) AS volume_cas FROM public.points_eau_abhs WHERE dist_pt_eau_foyer_pollut_m IS NOT NULL;
SELECT dist_pt_eau_foyer_pollut_m FROM public.points_eau_abhs WHERE dist_pt_eau_foyer_pollut_m IS NOT NULL LIMIT 20;
