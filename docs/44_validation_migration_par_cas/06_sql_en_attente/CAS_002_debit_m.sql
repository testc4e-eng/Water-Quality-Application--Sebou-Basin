-- Cas : CAS-002
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : debit_m
-- Nom standard proposé : Debit_m / Debit_jr
-- Type de cas : AMBIGUOUS_PARAMETER
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_debit_m
-- Cas : AMBIGUOUS_PARAMETER / debit_m
SELECT COUNT(*) AS volume_cas FROM public.mesures_debit_m WHERE debit_m IS NOT NULL;
SELECT debit_m FROM public.mesures_debit_m WHERE debit_m IS NOT NULL LIMIT 20;
