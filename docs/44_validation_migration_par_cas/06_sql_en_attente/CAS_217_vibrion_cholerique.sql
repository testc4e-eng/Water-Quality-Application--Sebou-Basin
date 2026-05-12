-- Cas : CAS-217
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Vibrion_Cholerique
-- Nom standard proposé : Vibrio
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / Vibrion_Cholerique
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'Vibrion_Cholerique';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'Vibrion_Cholerique' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
