-- Cas : CAS-256
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Huiles Graisses
-- Nom standard proposé : HG
-- Type de cas : VALUE_PARSING
-- Action proposée : MIGRATE_WITH_FLAG

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : VALUE_PARSING / Huiles Graisses
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE val_qual IS NOT NULL;
SELECT val_qual FROM public.idp_2024_mesures_qualite_globale WHERE val_qual IS NOT NULL LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_globale WHERE val_qual IS NOT NULL AND val_qual::text ~ '[<>,]';
