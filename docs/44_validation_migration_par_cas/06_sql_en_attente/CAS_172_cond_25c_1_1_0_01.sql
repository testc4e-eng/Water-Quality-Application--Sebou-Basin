-- Cas : CAS-172
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Cond 25°C *1,1*0,01
-- Nom standard proposé : à confirmer
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : UNIT_VALIDATION / Cond 25°C *1,1*0,01
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'Cond 25°C *1,1*0,01';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'Cond 25°C *1,1*0,01' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
