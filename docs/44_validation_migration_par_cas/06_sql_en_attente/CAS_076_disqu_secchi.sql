-- Cas : CAS-076
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : disqu_secchi
-- Nom standard proposé : Disque_Secchi
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_globale
-- Cas : UNIT_VALIDATION / disqu_secchi
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_globale WHERE disqu_secchi IS NOT NULL;
SELECT disqu_secchi FROM public.idp_2024_src_pollution_globale WHERE disqu_secchi IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_marche_cadre
-- Cas : UNIT_VALIDATION / disqu_secchi
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_marche_cadre WHERE disqu_secchi IS NOT NULL;
SELECT disqu_secchi FROM public.idp_2024_src_pollution_marche_cadre WHERE disqu_secchi IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
