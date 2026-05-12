-- Cas : CAS-310
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : volume_mm3
-- Nom standard proposé : Volume
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.bathymetries_barrages_abhs
-- Cas : PARAMETER_MAPPING / volume_mm3
SELECT COUNT(*) AS volume_cas FROM public.bathymetries_barrages_abhs WHERE volume_mm3 IS NOT NULL;
SELECT volume_mm3 FROM public.bathymetries_barrages_abhs WHERE volume_mm3 IS NOT NULL LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_niv_eau_barrages
-- Cas : PARAMETER_MAPPING / volume_mm3
SELECT COUNT(*) AS volume_cas FROM public.mesures_niv_eau_barrages WHERE volume_mm3 IS NOT NULL;
SELECT volume_mm3 FROM public.mesures_niv_eau_barrages WHERE volume_mm3 IS NOT NULL LIMIT 20;
