-- Cas : CAS-122
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : PT DECANTE
-- Nom standard proposé : PT
-- Type de cas : NON_NUMERIC
-- Action proposée : QUARANTINE

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : NON_NUMERIC / PT DECANTE
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'PT DECANTE';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'PT DECANTE' LIMIT 20;
