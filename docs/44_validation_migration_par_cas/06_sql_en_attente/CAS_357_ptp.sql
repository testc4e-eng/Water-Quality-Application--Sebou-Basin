-- Cas : CAS-357
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : PTP
-- Nom standard proposé : PTP
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : PARAMETER_MAPPING / PTP
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'PTP';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'PTP' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : PARAMETER_MAPPING / PTP
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'PTP';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'PTP' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : PARAMETER_MAPPING / PTP
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'PTP';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'PTP' LIMIT 20;

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / PTP
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'PTP';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'PTP' LIMIT 20;
