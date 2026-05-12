-- Cas : CAS-074
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : CrT
-- Nom standard proposé : Cr
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : UNIT_VALIDATION / CrT
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'CrT';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'CrT' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / CrT
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'CrT';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'CrT' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : UNIT_VALIDATION / CrT
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'CrT';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'CrT' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
