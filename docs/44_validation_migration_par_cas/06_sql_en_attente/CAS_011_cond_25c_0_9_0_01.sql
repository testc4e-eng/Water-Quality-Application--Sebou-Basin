-- Cas : CAS-011
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Cond 25°C *0,9*0,01
-- Nom standard proposé : à confirmer
-- Type de cas : UNMAPPED_PARAMETER
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : UNMAPPED_PARAMETER / Cond 25°C *0,9*0,01
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'Cond 25°C *0,9*0,01';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'Cond 25°C *0,9*0,01' LIMIT 20;
