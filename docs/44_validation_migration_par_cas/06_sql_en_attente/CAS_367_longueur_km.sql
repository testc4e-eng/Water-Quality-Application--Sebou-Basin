-- Cas : CAS-367
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : longueur_km
-- Nom standard proposé : Longueur
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.reseau_hydro_abhs
-- Cas : PARAMETER_MAPPING / longueur_km
SELECT COUNT(*) AS volume_cas FROM public.reseau_hydro_abhs WHERE longueur_km IS NOT NULL;
SELECT longueur_km FROM public.reseau_hydro_abhs WHERE longueur_km IS NOT NULL LIMIT 20;
