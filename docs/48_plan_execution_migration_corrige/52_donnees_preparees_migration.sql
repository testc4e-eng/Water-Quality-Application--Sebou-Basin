-- ATTENTION : SCRIPT PREPARE, NON EXECUTE
-- EXECUTION INTERDITE SANS VALIDATION HUMAINE EXPLICITE
-- Objet : preparer le chargement controle depuis staging.raw_* vers les tables metadata et les tables finales.
-- Toutes les lignes ci-dessous sont commentees volontairement.

-- 1. Charger le referentiel parametre final dans metadata.parametre_master
-- COPY metadata.parametre_master FROM 'docs/48_plan_execution_migration_corrige/50_parametre_master_final.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 2. Charger le mapping final nettoye dans metadata.mapping_parametre_source_new
-- COPY metadata.mapping_parametre_source_new FROM 'docs/48_plan_execution_migration_corrige/51_mapping_final_nettoye.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 3. Exemple de parsing valeurs <x / >x / virgule decimale / notation scientifique
-- CASE WHEN raw_valeur ~ '^\s*<' THEN regexp_replace(raw_valeur, '[^0-9,.-]', '', 'g')::numeric END AS valeur_inferieure,
-- CASE WHEN raw_valeur ~ '^\s*>' THEN regexp_replace(raw_valeur, '[^0-9,.-]', '', 'g')::numeric END AS valeur_superieure,
-- REPLACE(trim(raw_valeur), ',', '.') AS valeur_decimal_point,

-- 4. Exemple de conversions unites
-- CASE WHEN unite_source = 'L/s' THEN valeur_num / 1000.0 ELSE valeur_num END AS valeur_m3s,
-- CASE WHEN unite_source IN ('°F','degF') AND code_parametre_canonique IN ('TA','TAC','TH') THEN valeur_num / 5.0 ELSE valeur_num END AS valeur_meq_l,
-- CASE WHEN unite_source IN ('µg/L','ug/L') THEN valeur_num / 1000.0 ELSE valeur_num END AS valeur_mg_l,

-- 5. Exemple de quarantaine controlee
-- INSERT INTO qa.quarantaine_mesures (...) SELECT ... WHERE action_migration = 'QUARANTAINE';

-- 6. Exemple de migration controlee
-- INSERT INTO qualite.mesure_preparee (...) SELECT ... WHERE action_migration IN ('MIGRER','MIGRER_AVEC_FLAG');

-- 7. Controle volumes avant toute execution
-- SELECT action_migration, COUNT(*), SUM(volume_total::bigint) FROM metadata.mapping_parametre_source_new GROUP BY action_migration;
