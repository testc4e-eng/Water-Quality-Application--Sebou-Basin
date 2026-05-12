-- Cas : CAS-003
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : H_G
-- Nom standard proposé : HG / Hg
-- Type de cas : AMBIGUOUS_PARAMETER
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : AMBIGUOUS_PARAMETER / H_G
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'H_G';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'H_G' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : AMBIGUOUS_PARAMETER / H_G
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'H_G';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'H_G' LIMIT 20;

-- Source : abh_sebou_ismail.public.suivi_qualite_sebou_jr
-- Cas : AMBIGUOUS_PARAMETER / H_G
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'H_G';
SELECT parametre_qualite, val_qual_sebou_jr FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'H_G' LIMIT 20;
