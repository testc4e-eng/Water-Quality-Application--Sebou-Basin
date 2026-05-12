-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE

-- Controle 1 : volume total insere vs volume attendu
-- SELECT COUNT(*) FROM <tables_finales_union>
-- WHERE lot_run_id = '<RUN_ID_E1_REEL>';

-- Controle 2 : aucune ligne IDP dans le lot E1
-- SELECT source_table, COUNT(*)
-- FROM <tables_finales_union>
-- WHERE lot_run_id = '<RUN_ID_E1_REEL>'
--   AND source_table IN (
--     'staging.raw_idp_2024_mesures_qualite_globale',
--     'staging.raw_idp_2024_mesures_qualite_marche_cadre',
--     'staging.raw_idp_2024_src_pollution_globale',
--     'staging.raw_idp_2024_src_pollution_marche_cadre'
--   )
-- GROUP BY source_table;

-- Controle 3 : doublons station/date/parametre
-- SELECT ...

-- Controle 4 : valeurs nulles inattendues
-- SELECT ...

-- Controle 5 : toutes les lignes ont un rattachement geo unique
-- SELECT ...
