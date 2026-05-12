-- Cas : CAS-276
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : NTK Spectr
-- Nom standard proposé : NTK
-- Type de cas : VALUE_PARSING
-- Action proposée : MIGRATE_WITH_FLAG

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : VALUE_PARSING / NTK Spectr
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'NTK Spectr';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'NTK Spectr' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'NTK Spectr' AND val_qual::text ~ '[<>,]';
