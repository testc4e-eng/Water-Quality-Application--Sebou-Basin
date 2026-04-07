-- backend/fix_labels.sql
SET client_encoding = 'UTF8';

DROP MATERIALIZED VIEW IF EXISTS analytics.mv_dashboard_climat_meteo_menu;

CREATE MATERIALIZED VIEW analytics.mv_dashboard_climat_meteo_menu AS
WITH labels AS (
    SELECT 
        'temperature' as sub_c,
        convert_from(decode('54656d70c3a9726174757265', 'hex'), 'UTF8') as sub_l, -- Température
        'precipitation' as pre_c,
        convert_from(decode('5072c3a963697069746174696f6e', 'hex'), 'UTF8') as pre_l, -- Précipitation
        'evaporation' as eva_c,
        'Evaporation' as eva_l
)
-- Part 1: Température Moyenne
SELECT 
    'actuel' as scenario_code,
    s.station_id as site_id,
    s.code_station as site_code,
    s.station_nom as site_name,
    s.type_station as station_type,
    l.sub_c as submenu_code,
    l.sub_l as submenu_label,
    m.temps as date_obs,
    m.val_moy as value_num,
    convert_from(decode('c2b043', 'hex'), 'UTF8') as unit, -- °C
    'temperature_moyenne' as variable_code,
    convert_from(decode('54656d70c3a9726174757265206d6f79656e6e65', 'hex'), 'UTF8') as variable_label, -- Température moyenne
    true as variable_enabled
FROM api.v_station_dimension s
INNER JOIN meteo.mesure_temperature m ON m.station_id = s.station_id
CROSS JOIN labels l

UNION ALL

-- Part 1: Température Min
SELECT 
    'actuel' as scenario_code,
    s.station_id as site_id,
    s.code_station as site_code,
    s.station_nom as site_name,
    s.type_station as station_type,
    l.sub_c as submenu_code,
    l.sub_l as submenu_label,
    m.temps as date_obs,
    m.val_min as value_num,
    convert_from(decode('c2b043', 'hex'), 'UTF8') as unit, -- °C
    'temperature_min' as variable_code,
    convert_from(decode('54656d70c3a9726174757265206d696e', 'hex'), 'UTF8') as variable_label, -- Température min
    true as variable_enabled
FROM api.v_station_dimension s
INNER JOIN meteo.mesure_temperature m ON m.station_id = s.station_id
CROSS JOIN labels l

UNION ALL

-- Part 1: Température Max
SELECT 
    'actuel' as scenario_code,
    s.station_id as site_id,
    s.code_station as site_code,
    s.station_nom as site_name,
    s.type_station as station_type,
    l.sub_c as submenu_code,
    l.sub_l as submenu_label,
    m.temps as date_obs,
    m.val_max as value_num,
    convert_from(decode('c2b043', 'hex'), 'UTF8') as unit, -- °C
    'temperature_max' as variable_code,
    convert_from(decode('54656d70c3a9726174757265206d6178', 'hex'), 'UTF8') as variable_label, -- Température max
    true as variable_enabled
FROM api.v_station_dimension s
INNER JOIN meteo.mesure_temperature m ON m.station_id = s.station_id
CROSS JOIN labels l

UNION ALL

-- Part 2: Précipitation
SELECT 
    'actuel' as scenario_code,
    s.station_id as site_id,
    s.code_station as site_code,
    s.station_nom as site_name,
    s.type_station as station_type,
    l.pre_c as submenu_code,
    l.pre_l as submenu_label,
    m.temps as date_obs,
    m.val_observees as value_num,
    'mm' as unit,
    'precipitation_obs' as variable_code,
    l.pre_l as variable_label, -- Précipitation
    true as variable_enabled
FROM api.v_station_dimension s
INNER JOIN meteo.mesure_precipitation m ON m.station_id = s.station_id
CROSS JOIN labels l

UNION ALL

-- Part 3: Evaporation
SELECT 
    'actuel' as scenario_code,
    s.station_id as site_id,
    s.code_station as site_code,
    s.station_nom as site_name,
    s.type_station as station_type,
    l.eva_c as submenu_code,
    l.eva_l as submenu_label,
    m.temps as date_obs,
    m.valeur as value_num,
    'mm' as unit,
    NULL as variable_code,
    l.eva_l as variable_label, -- Evaporation
    true as variable_enabled
FROM api.v_station_dimension s
INNER JOIN meteo.mesure_evaporation m ON m.station_id = s.station_id
CROSS JOIN labels l;

-- Indexation
CREATE INDEX idx_mv_climat_scenario ON analytics.mv_dashboard_climat_meteo_menu(scenario_code);
CREATE INDEX idx_mv_climat_submenu ON analytics.mv_dashboard_climat_meteo_menu(submenu_code);
CREATE INDEX idx_mv_climat_variable ON analytics.mv_dashboard_climat_meteo_menu(variable_code);
CREATE INDEX idx_mv_climat_site ON analytics.mv_dashboard_climat_meteo_menu(site_id);
CREATE INDEX idx_mv_climat_date ON analytics.mv_dashboard_climat_meteo_menu(date_obs);
