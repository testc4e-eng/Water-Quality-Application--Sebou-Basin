-- Cas : CAS-225
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : DBO5
-- Nom standard proposé : DBO5
-- Type de cas : VALUE_PARSING
-- Action proposée : MIGRATE_WITH_FLAG

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : VALUE_PARSING / DBO5
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'DBO5' AND val_qual::text ~ '[<>,]';

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : VALUE_PARSING / DBO5
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'DBO5' AND val_qual::text ~ '[<>,]';
