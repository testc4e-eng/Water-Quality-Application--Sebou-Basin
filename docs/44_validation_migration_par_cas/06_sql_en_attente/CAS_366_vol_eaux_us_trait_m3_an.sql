-- Cas : CAS-366
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : vol_eaux_us_trait_m3_an
-- Nom standard proposé : Vol_trait
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.step_abhs
-- Cas : PARAMETER_MAPPING / vol_eaux_us_trait_m3_an
SELECT COUNT(*) AS volume_cas FROM public.step_abhs WHERE vol_eaux_us_trait_m3_an IS NOT NULL;
SELECT vol_eaux_us_trait_m3_an FROM public.step_abhs WHERE vol_eaux_us_trait_m3_an IS NOT NULL LIMIT 20;
