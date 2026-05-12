-- Cas : CAS-005
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : MO
-- Nom standard proposé : MO / Mo
-- Type de cas : AMBIGUOUS_PARAMETER
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : AMBIGUOUS_PARAMETER / MO
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'MO';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'MO' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : AMBIGUOUS_PARAMETER / MO
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'MO';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'MO' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : AMBIGUOUS_PARAMETER / MO
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'MO';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'MO' LIMIT 20;

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : AMBIGUOUS_PARAMETER / MO
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'MO';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'MO' LIMIT 20;
