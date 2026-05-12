-- Cas : CAS-037
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : val_observees
-- Nom standard proposé : Val_obs
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_precipitations_jr_traitees
-- Cas : UNIT_VALIDATION / val_observees
SELECT COUNT(*) AS volume_cas FROM public.mesures_precipitations_jr_traitees WHERE val_observees IS NOT NULL;
SELECT val_observees FROM public.mesures_precipitations_jr_traitees WHERE val_observees IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
