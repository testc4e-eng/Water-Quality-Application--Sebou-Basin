-- Cas : CAS-151
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : cap_equiv_hab
-- Nom standard proposé : Cap_equiv
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.step_abhs
-- Cas : UNIT_VALIDATION / cap_equiv_hab
SELECT COUNT(*) AS volume_cas FROM public.step_abhs WHERE cap_equiv_hab IS NOT NULL;
SELECT cap_equiv_hab FROM public.step_abhs WHERE cap_equiv_hab IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
