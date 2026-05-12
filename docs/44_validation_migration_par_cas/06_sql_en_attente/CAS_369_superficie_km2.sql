-- Cas : CAS-369
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : superficie_km2
-- Nom standard proposé : Superficie_km2
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.bassin_sebou
-- Cas : PARAMETER_MAPPING / superficie_km2
SELECT COUNT(*) AS volume_cas FROM public.bassin_sebou WHERE superficie_km2 IS NOT NULL;
SELECT superficie_km2 FROM public.bassin_sebou WHERE superficie_km2 IS NOT NULL LIMIT 20;

-- Source : abh_sebou_ismail.public.nappes_abhs
-- Cas : PARAMETER_MAPPING / superficie_km2
SELECT COUNT(*) AS volume_cas FROM public.nappes_abhs WHERE superficie_km2 IS NOT NULL;
SELECT superficie_km2 FROM public.nappes_abhs WHERE superficie_km2 IS NOT NULL LIMIT 20;
