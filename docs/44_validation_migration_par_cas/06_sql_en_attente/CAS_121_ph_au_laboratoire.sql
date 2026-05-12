-- Cas : CAS-121
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : pH au laboratoire
-- Nom standard proposé : pH
-- Type de cas : NON_NUMERIC
-- Action proposée : QUARANTINE

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : NON_NUMERIC / pH au laboratoire
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'pH au laboratoire';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'pH au laboratoire' LIMIT 20;
