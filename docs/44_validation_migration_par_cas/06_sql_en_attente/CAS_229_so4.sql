-- Cas : CAS-229
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : SO4--
-- Nom standard proposé : SO4²-
-- Type de cas : VALUE_PARSING
-- Action proposée : MIGRATE_WITH_FLAG

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : VALUE_PARSING / SO4--
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'SO4--';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'SO4--' LIMIT 20;
-- Contrôle parsing proposé, non exécuté
SELECT val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'SO4--' AND val_qual::text ~ '[<>,]';
