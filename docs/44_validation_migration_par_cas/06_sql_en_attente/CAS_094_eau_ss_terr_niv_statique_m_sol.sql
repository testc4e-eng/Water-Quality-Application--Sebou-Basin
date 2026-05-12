-- Cas : CAS-094
-- Statut : PENDING - NE PAS EXECUTER SANS VALIDATION HUMAINE EXPLICITE
-- Paramètre observé : eau_ss_terr_niv_statique_m_sol
-- Nom standard proposé : Eau_ss_terr
-- Type de cas : UNIT_VALIDATION
-- Action proposée : STAGING_ONLY

-- Source : abh_sebou_ismail.public.idp_2024_src_pollution_globale
-- Cas : UNIT_VALIDATION / eau_ss_terr_niv_statique_m_sol
SELECT COUNT(*) AS volume_cas FROM public.idp_2024_src_pollution_globale WHERE eau_ss_terr_niv_statique_m_sol IS NOT NULL;
SELECT eau_ss_terr_niv_statique_m_sol FROM public.idp_2024_src_pollution_globale WHERE eau_ss_terr_niv_statique_m_sol IS NOT NULL LIMIT 20;
-- Vérifier l'unité réelle dans la documentation et les métadonnées avant migration
