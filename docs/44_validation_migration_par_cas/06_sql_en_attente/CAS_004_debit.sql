-- Cas : CAS-004
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : debit
-- Nom standard proposé : Debit_m / Debit_jr
-- Type de cas : AMBIGUOUS_PARAMETER
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_debit_sources
-- Cas : AMBIGUOUS_PARAMETER / debit
SELECT COUNT(*) AS volume_cas FROM public.mesures_debit_sources WHERE debit IS NOT NULL;
SELECT debit FROM public.mesures_debit_sources WHERE debit IS NOT NULL LIMIT 20;
