-- Cas : CAS-016
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : PT
-- Nom standard proposé : PT
-- Type de cas : NON_NUMERIC
-- Action proposée : QUARANTINE

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : NON_NUMERIC / PT
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'PT';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'PT' LIMIT 20;
