-- Cas : CAS-316
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : T_eau
-- Nom standard proposé : T_eau
-- Type de cas : PARAMETER_MAPPING
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : PARAMETER_MAPPING / T_eau
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'T_eau';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'T_eau' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : PARAMETER_MAPPING / T_eau
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'T_eau';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'T_eau' LIMIT 20;

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : PARAMETER_MAPPING / T_eau
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'T_eau';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'T_eau' LIMIT 20;

-- Source : abh_sebou_ismail.public.suivi_qualite_brg_garde_hebdo
-- Cas : PARAMETER_MAPPING / T_eau
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'T_eau';
SELECT parametre_qualite, val_qual_brg_garde_hebdo FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'T_eau' LIMIT 20;

-- Source : abh_sebou_ismail.public.suivi_qualite_sebou_jr
-- Cas : PARAMETER_MAPPING / T_eau
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'T_eau';
SELECT parametre_qualite, val_qual_sebou_jr FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'T_eau' LIMIT 20;

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : PARAMETER_MAPPING / T_eau
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'T_eau';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'T_eau' LIMIT 20;
