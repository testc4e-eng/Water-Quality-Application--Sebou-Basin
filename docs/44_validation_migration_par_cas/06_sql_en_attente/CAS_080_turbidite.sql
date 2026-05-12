-- Cas : CAS-080
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : turbidite
-- Nom standard proposé : Turbidite
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_globale
-- Cas : UNIT_VALIDATION / turbidite
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_globale WHERE turbidite IS NOT NULL;
SELECT turbidite FROM public.idp_2024_src_pollution_globale WHERE turbidite IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_marche_cadre
-- Cas : UNIT_VALIDATION / turbidite
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_marche_cadre WHERE turbidite IS NOT NULL;
SELECT turbidite FROM public.idp_2024_src_pollution_marche_cadre WHERE turbidite IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
