-- Cas : CAS-029
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Fer(mg/l)
-- Nom standard proposé : Fe
-- Type de cas : VALUE_ABERRANT
-- Action proposée : QUARANTINE

-- Source : abh_sebou_ismail.public.suivi_qualite_brg_garde_hebdo
-- Cas : VALUE_ABERRANT / Fer(mg/l)
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'Fer(mg/l)';
SELECT parametre_qualite, val_qual_brg_garde_hebdo FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'Fer(mg/l)' LIMIT 20;
-- Contrôle plages extrêmes, non exécuté
SELECT MIN(val_qual_brg_garde_hebdo) AS min_val, MAX(val_qual_brg_garde_hebdo) AS max_val FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'Fer(mg/l)';
