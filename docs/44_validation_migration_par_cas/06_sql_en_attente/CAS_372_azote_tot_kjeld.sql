-- Cas : CAS-372
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Azote_tot_kjeld
-- Nom standard proposé : NTK
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : PARAMETER_MAPPING / Azote_tot_kjeld
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'Azote_tot_kjeld';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'Azote_tot_kjeld' LIMIT 20;

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / Azote_tot_kjeld
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'Azote_tot_kjeld';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'Azote_tot_kjeld' LIMIT 20;
