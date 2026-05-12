-- Cas : CAS-156
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : montant_md
-- Nom standard proposé : Montant_MD
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.barrages_abhs
-- Cas : UNIT_VALIDATION / montant_md
SELECT COUNT(*) AS volume_cas FROM public.barrages_abhs WHERE montant_md IS NOT NULL;
SELECT montant_md FROM public.barrages_abhs WHERE montant_md IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
