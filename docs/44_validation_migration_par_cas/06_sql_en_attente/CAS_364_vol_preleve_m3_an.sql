-- Cas : CAS-364
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : vol_preleve_m3_an
-- Nom standard proposé : Vol_preleve
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.points_eau_abhs
-- Cas : PARAMETER_MAPPING / vol_preleve_m3_an
SELECT COUNT(*) AS volume_cas FROM public.points_eau_abhs WHERE vol_preleve_m3_an IS NOT NULL;
SELECT vol_preleve_m3_an FROM public.points_eau_abhs WHERE vol_preleve_m3_an IS NOT NULL LIMIT 20;
