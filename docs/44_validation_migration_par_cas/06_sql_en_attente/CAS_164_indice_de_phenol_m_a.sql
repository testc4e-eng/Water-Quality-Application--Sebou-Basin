-- Cas : CAS-164
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : indice de phénol M:A
-- Nom standard proposé : Phenol
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_mesures_qualite_marche_cadre
-- Cas : UNIT_VALIDATION / indice de phénol M:A
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'indice de phénol M:A';
SELECT parametre_qualite, val_qual FROM public.idp_2024_mesures_qualite_marche_cadre WHERE parametre_qualite = 'indice de phénol M:A' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
