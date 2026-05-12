-- Cas : CAS-379
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : NO2-
-- Nom standard proposé : NO2-
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : MIGRATE

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / NO2-
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'NO2-';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'NO2-' LIMIT 20;
