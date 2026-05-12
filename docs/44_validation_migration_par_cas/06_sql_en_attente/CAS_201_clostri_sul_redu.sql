-- Cas : CAS-201
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Clostri_sul_redu
-- Nom standard proposé : Clostri
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / Clostri_sul_redu
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'Clostri_sul_redu';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'Clostri_sul_redu' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
