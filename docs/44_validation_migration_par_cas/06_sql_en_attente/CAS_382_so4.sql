-- Cas : CAS-382
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : SO4
-- Nom standard proposé : SO4²-
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : MIGRATE

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / SO4
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'SO4';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'SO4' LIMIT 20;
