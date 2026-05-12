-- Cas : CAS-039
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : val_remplies
-- Nom standard proposé : Val_remplies
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_precipitations_jr_traitees
-- Cas : UNIT_VALIDATION / val_remplies
SELECT COUNT(*) AS volume_cas FROM public.mesures_precipitations_jr_traitees WHERE val_remplies IS NOT NULL;
SELECT val_remplies FROM public.mesures_precipitations_jr_traitees WHERE val_remplies IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
