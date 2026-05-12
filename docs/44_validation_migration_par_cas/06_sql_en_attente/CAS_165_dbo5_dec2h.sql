-- Cas : CAS-165
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : DBO5_dec2h
-- Nom standard proposé : DBO5_dec2h
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / DBO5_dec2h
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'DBO5_dec2h';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'DBO5_dec2h' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
