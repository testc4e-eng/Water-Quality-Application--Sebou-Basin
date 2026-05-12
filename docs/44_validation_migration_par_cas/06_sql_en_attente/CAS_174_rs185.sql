-- Cas : CAS-174
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : RS185
-- Nom standard proposé : RS185
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : UNIT_VALIDATION / RS185
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'RS185';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'RS185' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / RS185
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'RS185';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'RS185' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
