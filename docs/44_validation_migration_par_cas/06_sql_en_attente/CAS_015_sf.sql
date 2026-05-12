-- Cas : CAS-015
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : SF
-- Nom standard proposé : SF
-- Type de cas : NON_NUMERIC
-- Action proposée : QUARANTINE

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : NON_NUMERIC / SF
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'SF';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'SF' LIMIT 20;

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : NON_NUMERIC / SF
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'SF';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'SF' LIMIT 20;
