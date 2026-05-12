-- Cas : CAS-042
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : val_evaporation
-- Nom standard proposé : Evaporation
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_evaporation_jr
-- Cas : UNIT_VALIDATION / val_evaporation
SELECT COUNT(*) AS volume_cas FROM public.mesures_evaporation_jr WHERE val_evaporation IS NOT NULL;
SELECT val_evaporation FROM public.mesures_evaporation_jr WHERE val_evaporation IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
