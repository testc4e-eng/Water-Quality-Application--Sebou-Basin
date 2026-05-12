-- Cas : CAS-378
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Mn
-- Nom standard proposé : Mn
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : MIGRATE

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / Mn
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'Mn';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'Mn' LIMIT 20;
