-- Cas : CAS-295
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Chrome
-- Nom standard proposé : Cr
-- Type de cas : VALUE_PARSING
-- Action proposée : MIGRATE_WITH_FLAG

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : VALUE_PARSING / Chrome
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'Chrome';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'Chrome' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'Chrome' AND val_qual::text ~ '[<>,]';
