-- Cas : CAS-104
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : Nickel(mg)/l
-- Nom standard proposé : Ni
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.suivi_qualite_brg_garde_hebdo
-- Cas : UNIT_VALIDATION / Nickel(mg)/l
SELECT COUNT(*) AS volume_cas FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'Nickel(mg)/l';
SELECT parametre_qualite, val_qual_brg_garde_hebdo FROM public.suivi_qualite_brg_garde_hebdo WHERE parametre_qualite = 'Nickel(mg)/l' LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
