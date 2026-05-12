-- Cas : CAS-314
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : hauteur_m
-- Nom standard proposé : Hauteur
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.bathymetries_barrages_abhs
-- Cas : PARAMETER_MAPPING / hauteur_m
SELECT COUNT(*) AS volume_cas FROM public.bathymetries_barrages_abhs WHERE hauteur_m IS NOT NULL;
SELECT hauteur_m FROM public.bathymetries_barrages_abhs WHERE hauteur_m IS NOT NULL LIMIT 20;
