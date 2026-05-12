-- Cas : CAS-278
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Li
-- Nom standard proposé : Li
-- Type de cas : VALUE_PARSING
-- Action proposée : MIGRATE_WITH_FLAG

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : VALUE_PARSING / Li
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'Li';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'Li' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'Li' AND val_qual::text ~ '[<>,]';
