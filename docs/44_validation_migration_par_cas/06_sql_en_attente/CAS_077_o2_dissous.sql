-- Cas : CAS-077
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : o2_dissous
-- Nom standard proposé : O2_dissous
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_globale
-- Cas : UNIT_VALIDATION / o2_dissous
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_globale WHERE o2_dissous IS NOT NULL;
SELECT o2_dissous FROM public.idp_2024_src_pollution_globale WHERE o2_dissous IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_marche_cadre
-- Cas : UNIT_VALIDATION / o2_dissous
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_marche_cadre WHERE o2_dissous IS NOT NULL;
SELECT o2_dissous FROM public.idp_2024_src_pollution_marche_cadre WHERE o2_dissous IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
