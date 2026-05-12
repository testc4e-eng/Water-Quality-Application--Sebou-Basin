-- Cas : CAS-010
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Bore(mg/l)
-- Nom standard proposé : à confirmer
-- Type de cas : UNMAPPED_PARAMETER
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.suivi_qualite_brg_garde_hebdo
-- Cas : UNMAPPED_PARAMETER / Bore(mg/l)
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'Bore(mg/l)';
SELECT parametre_qualite, val_qual_brg_garde_hebdo FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'Bore(mg/l)' LIMIT 20;
