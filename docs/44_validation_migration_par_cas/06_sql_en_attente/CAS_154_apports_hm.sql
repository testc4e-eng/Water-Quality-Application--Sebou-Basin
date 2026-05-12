-- Cas : CAS-154
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : apports_hm
-- Nom standard proposé : Apports_hm3
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.barrages_abhs
-- Cas : UNIT_VALIDATION / apports_hm
SELECT COUNT(*) AS volume_cas FROM public.barrages_abhs WHERE apports_hm IS NOT NULL;
SELECT apports_hm FROM public.barrages_abhs WHERE apports_hm IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
