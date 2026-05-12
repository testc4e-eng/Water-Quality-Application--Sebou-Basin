-- Cas : CAS-375
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Cl
-- Nom standard proposé : Cl-
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : MIGRATE

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / Cl
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'Cl';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'Cl' LIMIT 20;
