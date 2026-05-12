-- Cas : CAS-356
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : PTD
-- Nom standard proposé : PTD
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : PARAMETER_MAPPING / PTD
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'PTD';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'PTD' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : PARAMETER_MAPPING / PTD
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'PTD';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'PTD' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : PARAMETER_MAPPING / PTD
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'PTD';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'PTD' LIMIT 20;

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / PTD
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'PTD';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'PTD' LIMIT 20;
