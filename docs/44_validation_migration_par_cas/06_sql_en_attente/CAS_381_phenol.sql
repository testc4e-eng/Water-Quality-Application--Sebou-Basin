-- Cas : CAS-381
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Phénol
-- Nom standard proposé : Phenol
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / Phénol
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'Phénol';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'Phénol' LIMIT 20;
