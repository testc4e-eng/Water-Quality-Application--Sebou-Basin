-- Cas : CAS-334
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : sup_occupee_ha
-- Nom standard proposé : Superficie_ha
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.decharges_abhs
-- Cas : PARAMETER_MAPPING / sup_occupee_ha
SELECT COUNT(*) AS volume_cas FROM public.decharges_abhs WHERE sup_occupee_ha IS NOT NULL;
SELECT sup_occupee_ha FROM public.decharges_abhs WHERE sup_occupee_ha IS NOT NULL LIMIT 20;
