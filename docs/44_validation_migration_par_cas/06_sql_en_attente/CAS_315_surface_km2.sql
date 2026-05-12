-- Cas : CAS-315
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : surface_km2
-- Nom standard proposé : Superficie_km2
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.bathymetries_barrages_abhs
-- Cas : PARAMETER_MAPPING / surface_km2
SELECT COUNT(*) AS volume_cas FROM public.bathymetries_barrages_abhs WHERE surface_km2 IS NOT NULL;
SELECT surface_km2 FROM public.bathymetries_barrages_abhs WHERE surface_km2 IS NOT NULL LIMIT 20;
