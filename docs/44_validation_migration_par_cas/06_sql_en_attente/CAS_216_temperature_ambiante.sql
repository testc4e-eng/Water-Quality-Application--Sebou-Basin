-- Cas : CAS-216
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Temperature_Ambiante
-- Nom standard proposé : T_air
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : UNIT_VALIDATION / Temperature_Ambiante
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'Temperature_Ambiante';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'Temperature_Ambiante' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
