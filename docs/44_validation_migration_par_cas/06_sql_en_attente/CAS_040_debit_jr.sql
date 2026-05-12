-- Cas : CAS-040
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : debit_jr
-- Nom standard proposé : Debit_m / Debit_jr
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_debit_jr
-- Cas : UNIT_VALIDATION / debit_jr
SELECT COUNT(*) AS volume_cas FROM public.mesures_debit_jr WHERE debit_jr IS NOT NULL;
SELECT debit_jr FROM public.mesures_debit_jr WHERE debit_jr IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
