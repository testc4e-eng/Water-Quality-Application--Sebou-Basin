-- Cas : CAS-078
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : t_air
-- Nom standard proposé : T_air
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_globale
-- Cas : UNIT_VALIDATION / t_air
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_globale WHERE t_air IS NOT NULL;
SELECT t_air FROM public.idp_2024_src_pollution_globale WHERE t_air IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_marche_cadre
-- Cas : UNIT_VALIDATION / t_air
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_marche_cadre WHERE t_air IS NOT NULL;
SELECT t_air FROM public.idp_2024_src_pollution_marche_cadre WHERE t_air IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
