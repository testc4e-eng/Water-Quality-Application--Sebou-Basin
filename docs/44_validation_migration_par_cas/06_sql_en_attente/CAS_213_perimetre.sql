-- Cas : CAS-213
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : perimetre
-- Nom standard proposé : Perimetre
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.bassin_sebou
-- Cas : UNIT_VALIDATION / perimetre
SELECT COUNT(*) AS volume_cas FROM public.bassin_sebou WHERE perimetre IS NOT NULL;
SELECT perimetre FROM public.bassin_sebou WHERE perimetre IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
