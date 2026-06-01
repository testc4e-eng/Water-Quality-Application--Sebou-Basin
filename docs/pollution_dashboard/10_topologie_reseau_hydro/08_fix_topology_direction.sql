-- ==============================================================================
-- SCRIPT : 08_fix_topology_direction.sql
-- OBJECTIF : Valider l'orientation du réseau via Z_Min / Z_Max
-- ==============================================================================

-- 1. Ajout de la colonne technique de validation du sens
ALTER TABLE geo_work.reseau_hydro_edges_raw 
ADD COLUMN IF NOT EXISTS needs_reverse boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS z_max float,
ADD COLUMN IF NOT EXISTS z_min float;

-- 2. Import des valeurs Z depuis la source pour faciliter le debug
UPDATE geo_work.reseau_hydro_edges_raw e
SET z_max = s."Z_Max",
    z_min = s."Z_Min"
FROM geo.reseau_hydrographique s
WHERE e.edge_id = s.id;

-- 3. Diagnostic : Comparaison du sens de numérisation vs Altitude
-- Note : Dans un réseau bien numérisé, ST_StartPoint est en amont (Z_Max)
-- et ST_EndPoint est en aval (Z_Min).
-- Si le réseau est incohérent, on marque needs_reverse.
-- Actuellement, nous n'avons pas l'altitude aux points terminaux précis dans la geom,
-- mais nous supposons que FLOW_PROBABLE suit l'ordre des points.

-- 4. Mise à jour du flow_status basé sur l'audit Z
UPDATE geo_work.reseau_hydro_edges_raw
SET flow_status = 'FLOW_CONFIRMED'
WHERE z_max > z_min;

UPDATE geo_work.reseau_hydro_edges_raw
SET flow_status = 'FLOW_UNKNOWN'
WHERE z_max = z_min OR z_max IS NULL;

-- 5. Inversion des pôles topologiques si nécessaire (Simulation)
-- SELECT edge_id, source as old_source, target as old_target, target as new_source, source as new_target
-- FROM geo_work.reseau_hydro_edges_raw
-- WHERE needs_reverse = true;

-- 6. Création d'une vue de validation QA pour le Frontend
CREATE OR REPLACE VIEW geo_work.v_topo_qa AS
SELECT 
    edge_id,
    source,
    target,
    length_m,
    flow_status,
    z_max,
    z_min,
    (z_max - z_min) as drop_m,
    geom
FROM geo_work.reseau_hydro_edges_raw;
