-- Cas : CAS-036
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : precipitation_jr
-- Nom standard proposé : Precip_jr
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_precipitations_jr
-- Cas : UNIT_VALIDATION / precipitation_jr
SELECT COUNT(*) AS volume_cas FROM public.mesures_precipitations_jr WHERE precipitation_jr IS NOT NULL;
SELECT precipitation_jr FROM public.mesures_precipitations_jr WHERE precipitation_jr IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
