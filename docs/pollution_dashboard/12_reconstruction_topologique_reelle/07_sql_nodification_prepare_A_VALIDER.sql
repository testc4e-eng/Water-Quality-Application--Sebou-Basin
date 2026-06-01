-- ==============================================================================
-- SCRIPT : 07_sql_nodification_prepare_A_VALIDER.sql
-- PHASE D.1B : Reconstruction Topologique Réelle par ST_Node
-- ==============================================================================
-- SCRIPT NON EXÉCUTÉ
-- VALIDATION YASSINE OBLIGATOIRE
-- BACKUP OBLIGATOIRE
-- AUCUNE MODIFICATION DE geo.reseau_hydrographique
-- ==============================================================================

-- 1. Nettoyage et Collecte
-- On crée un seul objet géométrique contenant tous les oueds
-- pour que ST_Node puisse détecter tous les croisements.
CREATE TABLE IF NOT EXISTS geo_work.reseau_hydro_edges_noded AS
WITH collected AS (
    SELECT ST_Node(ST_Collect(geom)) as geom
    FROM geo.reseau_hydrographique
),
dumped AS (
    SELECT (ST_Dump(geom)).geom as geom
    FROM collected
)
SELECT 
    row_number() OVER () as edge_id,
    NULL::int as source,
    NULL::int as target,
    geom,
    ST_Length(geom) as length_m,
    'FLOW_PROBABLE'::text as flow_status
FROM dumped;

-- 2. Indexation Spatiale
CREATE INDEX idx_hydro_noded_geom ON geo_work.reseau_hydro_edges_noded USING gist(geom);

-- 3. Reconstruction des Nœuds (Topologie)
-- TODO : À exécuter après validation de la géométrie noded.
-- SELECT pgr_createTopology('geo_work.reseau_hydro_edges_noded', 0.1, 'geom', 'edge_id');
