-- Cas : CAS-062
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : debit
-- Nom standard proposé : Debit_m / Debit_jr
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_debit_sources
-- Cas : UNIT_VALIDATION / debit
SELECT COUNT(*) AS volume_cas FROM public.mesures_debit_sources WHERE debit IS NOT NULL;
SELECT debit FROM public.mesures_debit_sources WHERE debit IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
