-- Cas : CAS-115
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : SO42-_IC
-- Nom standard proposé : SO4²-
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : UNIT_VALIDATION / SO42-_IC
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'SO42-_IC';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'SO42-_IC' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
