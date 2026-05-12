-- Cas : CAS-056
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : O2_dissous
-- Nom standard proposé : O2_dissous
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.suivi_qualite_sebou_jr
-- Cas : UNIT_VALIDATION / O2_dissous
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'O2_dissous';
SELECT parametre_qualite, val_qual_sebou_jr FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'O2_dissous' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
