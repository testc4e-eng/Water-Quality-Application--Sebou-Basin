-- Cas : CAS-041
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : niveau_eau_m_ngm
-- Nom standard proposé : Niveau_eau
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.mesures_niv_eau_barrages
-- Cas : UNIT_VALIDATION / niveau_eau_m_ngm
SELECT COUNT(*) AS volume_cas FROM public.mesures_niv_eau_barrages WHERE niveau_eau_m_ngm IS NOT NULL;
SELECT niveau_eau_m_ngm FROM public.mesures_niv_eau_barrages WHERE niveau_eau_m_ngm IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
