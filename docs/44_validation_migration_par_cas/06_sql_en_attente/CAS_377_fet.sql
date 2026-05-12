-- Cas : CAS-377
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : FeT
-- Nom standard proposé : Fe
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : MIGRATE

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / FeT
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'FeT';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'FeT' LIMIT 20;
