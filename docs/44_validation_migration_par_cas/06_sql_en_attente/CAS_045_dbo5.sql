-- Cas : CAS-045
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : DBO5
-- Nom standard proposé : DBO5
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : UNIT_VALIDATION / DBO5
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.mesures_qualite_nappes
-- Cas : UNIT_VALIDATION / DBO5
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual_nap FROM public.mesures_qualite_nappes WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / DBO5
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.suivi_qualite_sebou_jr
-- Cas : UNIT_VALIDATION / DBO5
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual_sebou_jr FROM public.suivi_qualite_sebou_jr WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : UNIT_VALIDATION / DBO5
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_globale
-- Cas : UNIT_VALIDATION / DBO5
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_globale WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : UNIT_VALIDATION / DBO5
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'DBO5';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'DBO5' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
