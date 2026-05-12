-- Cas : CAS-313
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : transfert_mm3
-- Nom standard proposé : Transfert
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_niv_eau_barrages
-- Cas : PARAMETER_MAPPING / transfert_mm3
SELECT COUNT(*) AS volume_cas FROM public.mesures_niv_eau_barrages WHERE transfert_mm3 IS NOT NULL;
SELECT transfert_mm3 FROM public.mesures_niv_eau_barrages WHERE transfert_mm3 IS NOT NULL LIMIT 20;
