-- Cas : CAS-188
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : FM
-- Nom standard proposé : FM
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_qualite_barrages
-- Cas : UNIT_VALIDATION / FM
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'FM';
SELECT parametre_qualite, val_qual_barr FROM public.mesures_qualite_barrages WHERE parametre_qualite = 'FM' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.mesures_qualite_rivieres
-- Cas : UNIT_VALIDATION / FM
SELECT COUNT(*) AS volume_cas FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'FM';
SELECT parametre_qualite, val_qual_riv FROM public.mesures_qualite_rivieres WHERE parametre_qualite = 'FM' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration

-- Source : abh_sebou_ismail.public.types_mesures
-- Cas : UNIT_VALIDATION / FM
SELECT COUNT(*) AS volume_cas FROM public.types_mesures WHERE parametre_qualite = 'FM';
SELECT parametre_qualite, valeur FROM public.types_mesures WHERE parametre_qualite = 'FM' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
