-- Cas : CAS-038
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : val_power_nasa
-- Nom standard proposé : Val_power
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_precipitations_jr_traitees
-- Cas : UNIT_VALIDATION / val_power_nasa
SELECT COUNT(*) AS volume_cas FROM public.mesures_precipitations_jr_traitees WHERE val_power_nasa IS NOT NULL;
SELECT val_power_nasa FROM public.mesures_precipitations_jr_traitees WHERE val_power_nasa IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
