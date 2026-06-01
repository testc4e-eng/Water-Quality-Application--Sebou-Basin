-- ==============================================================================
-- SCRIPT : 07_sql_cleanup_prepare_A_VALIDER.sql
-- PHASE D.1C : Normalisation et Consolidation Post-Nodification
-- ==============================================================================
-- SCRIPT NON EXÉCUTÉ
-- VALIDATION YASSINE OBLIGATOIRE
-- BACKUP OBLIGATOIRE
-- AUCUNE MODIFICATION DE geo.reseau_hydrographique
-- ==============================================================================

-- 1. Création de la table FINALE consolidée
CREATE TABLE IF NOT EXISTS geo_work.reseau_hydro_edges_final (
    edge_id serial PRIMARY KEY,
    source int,
    target int,
    geom geometry(LineString, 26191),
    length_m float,
    flow_status text DEFAULT 'FLOW_PROBABLE',
    component_id int,
    qa_status text,
    is_cycle boolean DEFAULT false,
    is_micro_segment boolean DEFAULT false
);

-- 2. Import des segments valides (> 1m)
-- INSERT INTO geo_work.reseau_hydro_edges_final (geom, length_m, qa_status)
-- SELECT geom, ST_Length(geom), 'CLEANED'
-- FROM geo_work.reseau_hydro_edges_noded
-- WHERE ST_Length(geom) >= 1.0;

-- 3. Marquage des micro-segments résiduels (1-5m)
-- UPDATE geo_work.reseau_hydro_edges_final 
-- SET is_micro_segment = true 
-- WHERE length_m < 5.0;

-- 4. Reconstruction finale de la topologie
-- SELECT pgr_createTopology('geo_work.reseau_hydro_edges_final', 0.1, 'geom', 'edge_id');
