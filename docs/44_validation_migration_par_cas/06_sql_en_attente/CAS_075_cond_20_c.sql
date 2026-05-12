-- Cas : CAS-075
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : cond_20_c
-- Nom standard proposé : Cond
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_globale
-- Cas : UNIT_VALIDATION / cond_20_c
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_globale WHERE cond_20_c IS NOT NULL;
SELECT cond_20_c FROM public.idp_2024_src_pollution_globale WHERE cond_20_c IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_marche_cadre
-- Cas : UNIT_VALIDATION / cond_20_c
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_marche_cadre WHERE cond_20_c IS NOT NULL;
SELECT cond_20_c FROM public.idp_2024_src_pollution_marche_cadre WHERE cond_20_c IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
