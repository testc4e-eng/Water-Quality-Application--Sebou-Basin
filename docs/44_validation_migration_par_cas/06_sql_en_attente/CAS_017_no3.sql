-- Cas : CAS-017
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : NO3-
-- Nom standard proposé : NO3-
-- Type de cas : VALUE_ABERRANT
-- Action proposée : QUARANTINE

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : VALUE_ABERRANT / NO3-
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'NO3-';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'NO3-' LIMIT 20;
-- Contrôle plages extrêmes, non exécuté
SELECT MIN(val_qual_barr) AS min_val, MAX(val_qual_barr) AS max_val FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'NO3-';

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : VALUE_ABERRANT / NO3-
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'NO3-';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'NO3-' LIMIT 20;
-- Contrôle plages extrêmes, non exécuté
SELECT MIN(val_qual_nap) AS min_val, MAX(val_qual_nap) AS max_val FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'NO3-';

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : VALUE_ABERRANT / NO3-
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'NO3-';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'NO3-' LIMIT 20;
-- Contrôle plages extrêmes, non exécuté
SELECT MIN(val_qual_riv) AS min_val, MAX(val_qual_riv) AS max_val FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'NO3-';
