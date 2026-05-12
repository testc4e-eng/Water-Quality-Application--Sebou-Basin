-- Cas : CAS-215
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Saveur
-- Nom standard proposé : Saveur
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / Saveur
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'Saveur';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'Saveur' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
