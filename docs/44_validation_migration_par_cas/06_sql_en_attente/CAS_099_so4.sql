-- Cas : CAS-099
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : SO4--
-- Nom standard proposé : SO4²-
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : UNIT_VALIDATION / SO4--
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'SO4--';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'SO4--' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
