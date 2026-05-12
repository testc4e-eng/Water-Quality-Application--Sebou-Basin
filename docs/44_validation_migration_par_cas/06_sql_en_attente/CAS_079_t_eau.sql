-- Cas : CAS-079
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : t_eau
-- Nom standard proposé : T_eau
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_globale
-- Cas : UNIT_VALIDATION / t_eau
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_globale WHERE t_eau IS NOT NULL;
SELECT t_eau FROM public.idp_2024_src_pollution_globale WHERE t_eau IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_marche_cadre
-- Cas : UNIT_VALIDATION / t_eau
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_marche_cadre WHERE t_eau IS NOT NULL;
SELECT t_eau FROM public.idp_2024_src_pollution_marche_cadre WHERE t_eau IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
