-- Cas : CAS-335
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : sup_tot_ha
-- Nom standard proposé : Superficie_ha
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.decharges_abhs
-- Cas : PARAMETER_MAPPING / sup_tot_ha
SELECT COUNT(*) AS volume_cas FROM public.decharges_abhs WHERE sup_tot_ha IS NOT NULL;
SELECT sup_tot_ha FROM public.decharges_abhs WHERE sup_tot_ha IS NOT NULL LIMIT 20;
