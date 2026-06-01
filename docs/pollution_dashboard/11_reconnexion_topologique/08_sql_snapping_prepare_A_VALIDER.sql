-- ==============================================================================
-- SCRIPT : 08_sql_snapping_prepare_A_VALIDER.sql
-- PHASE D.1 : Préparation de la reconnexion topologique par snapping
-- ==============================================================================
-- SCRIPT NON EXÉCUTÉ
-- VALIDATION YASSINE OBLIGATOIRE
-- BACKUP OBLIGATOIRE
-- NE PAS MODIFIER geo.reseau_hydrographique
-- ==============================================================================

-- 1. Création des tables de travail "CLEAN"
CREATE TABLE IF NOT EXISTS geo_work.reseau_hydro_edges_clean (
    LIKE geo_work.reseau_hydro_edges_raw INCLUDING ALL
);

CREATE TABLE IF NOT EXISTS geo_work.reseau_hydro_nodes_clean (
    LIKE geo_work.reseau_hydro_nodes INCLUDING ALL
);

-- 2. Initialisation des données
-- INSERT INTO geo_work.reseau_hydro_edges_clean SELECT * FROM geo_work.reseau_hydro_edges_raw;

-- 3. [PASS 1] Snapping Micro (Dist < 5m)
-- Cette opération consiste à projeter l'extrémité d'un segment (undershoot) 
-- sur le segment le plus proche s'il est à moins de 5m.
-- UPDATE geo_work.reseau_hydro_edges_clean e
-- SET geom = ST_Snap(e.geom, target_line.geom, 5.0)
-- FROM geo_work.reseau_hydro_edges_clean target_line
-- WHERE ST_DWithin(ST_EndPoint(e.geom), target_line.geom, 5.0)
--   AND e.edge_id != target_line.edge_id;

-- 4. [NODE RECONSTRUCTION]
-- Une fois le snapping géométrique fait, il faut reconstruire les nœuds 
-- pour que l'intersection devienne un nœud partagé (Topology).
-- SELECT pgr_createTopology('geo_work.reseau_hydro_edges_clean', 1.0, 'geom', 'edge_id');

-- 5. Marquage des segments modifiés
-- ALTER TABLE geo_work.reseau_hydro_edges_clean ADD COLUMN IF NOT EXISTS snap_dist_m float;
