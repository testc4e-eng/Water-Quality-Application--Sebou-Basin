-- Cas : CAS-055
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Nitrates
-- Nom standard proposé : Nitrates
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.suivi_qualite_sebou_jr
-- Cas : UNIT_VALIDATION / Nitrates
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'Nitrates';
SELECT parametre_qualite, val_qual_sebou_jr FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'Nitrates' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
