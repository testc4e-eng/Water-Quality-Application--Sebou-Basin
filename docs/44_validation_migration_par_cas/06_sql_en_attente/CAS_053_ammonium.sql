-- Cas : CAS-053
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Ammonium
-- Nom standard proposé : NH4+
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.suivi_qualite_sebou_jr
-- Cas : UNIT_VALIDATION / Ammonium
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'Ammonium';
SELECT parametre_qualite, val_qual_sebou_jr FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'Ammonium' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
