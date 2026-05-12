-- Cas : CAS-374
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : CF
-- Nom standard proposé : CF
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : MIGRATE

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / CF
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'CF';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'CF' LIMIT 20;
