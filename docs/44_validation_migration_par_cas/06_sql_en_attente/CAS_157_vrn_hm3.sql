-- Cas : CAS-157
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : vrn_hm3
-- Nom standard proposé : Volume
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.barrages_abhs
-- Cas : UNIT_VALIDATION / vrn_hm3
SELECT COUNT(*) AS volume_cas FROM public.barrages_abhs WHERE vrn_hm3 IS NOT NULL;
SELECT vrn_hm3 FROM public.barrages_abhs WHERE vrn_hm3 IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
