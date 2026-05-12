-- Cas : CAS-190
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : DCO  2h décant.
-- Nom standard proposé : DCO
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : UNIT_VALIDATION / DCO  2h décant.
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE val_qual IS NOT NULL;
SELECT val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE val_qual IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
