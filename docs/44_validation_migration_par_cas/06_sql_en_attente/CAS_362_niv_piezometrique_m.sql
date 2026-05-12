-- Cas : CAS-362
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : niv_piezometrique_m
-- Nom standard proposé : Niveau_piezom
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.points_eau_abhs
-- Cas : PARAMETER_MAPPING / niv_piezometrique_m
SELECT COUNT(*) AS volume_cas FROM public.points_eau_abhs WHERE niv_piezometrique_m IS NOT NULL;
SELECT niv_piezometrique_m FROM public.points_eau_abhs WHERE niv_piezometrique_m IS NOT NULL LIMIT 20;
