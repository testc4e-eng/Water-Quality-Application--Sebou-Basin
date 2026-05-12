-- Cas : CAS-081
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : debit_l_s
-- Nom standard proposé : Debit_m / Debit_jr
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.rejets_domestiques_abhs
-- Cas : UNIT_VALIDATION / debit_l_s
SELECT COUNT(*) AS volume_cas FROM public.rejets_domestiques_abhs WHERE debit_l_s IS NOT NULL;
SELECT debit_l_s FROM public.rejets_domestiques_abhs WHERE debit_l_s IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
