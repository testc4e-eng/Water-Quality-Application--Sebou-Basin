-- Cas : CAS-162
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : somme anions_meq/l3
-- Nom standard proposé : Som_anions
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : UNIT_VALIDATION / somme anions_meq/l3
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE val_qual IS NOT NULL;
SELECT val_qual FROM public.idp_2024_mesures_qualite_globale WHERE val_qual IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
