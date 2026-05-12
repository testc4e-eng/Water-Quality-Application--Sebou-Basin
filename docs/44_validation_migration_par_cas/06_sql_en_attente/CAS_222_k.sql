-- Cas : CAS-222
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : K+
-- Nom standard proposé : K
-- Type de cas : VALUE_PARSING
-- Action proposée : MIGRATE_WITH_FLAG

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : VALUE_PARSING / K+
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'K+';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'K+' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'K+' AND val_qual::text ~ '[<>,]';

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : VALUE_PARSING / K+
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'K+';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'K+' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'K+' AND val_qual::text ~ '[<>,]';
