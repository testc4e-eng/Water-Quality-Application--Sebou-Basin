-- Cas : CAS-155
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : hauteur
-- Nom standard proposé : Hauteur
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.barrages_abhs
-- Cas : UNIT_VALIDATION / hauteur
SELECT COUNT(*) AS volume_cas FROM public.barrages_abhs WHERE hauteur IS NOT NULL;
SELECT hauteur FROM public.barrages_abhs WHERE hauteur IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
