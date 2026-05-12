-- Cas : CAS-380
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : NO3-
-- Nom standard proposé : NO3-
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : MIGRATE

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / NO3-
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'NO3-';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'NO3-' LIMIT 20;
