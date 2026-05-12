-- Cas : CAS-097
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : quantite_t_j
-- Nom standard proposé : Quantite_tj
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.decharges_abhs
-- Cas : UNIT_VALIDATION / quantite_t_j
SELECT COUNT(*) AS volume_cas FROM public.decharges_abhs WHERE quantite_t_j IS NOT NULL;
SELECT quantite_t_j FROM public.decharges_abhs WHERE quantite_t_j IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
