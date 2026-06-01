-- ==============================================================================
-- SCRIPT NON EXÉCUTÉ
-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION YASSINE
-- BACKUP OBLIGATOIRE AVANT EXÉCUTION
-- Fichier: 08_scripts_sql_preparation_topologie_A_VALIDER.sql
-- ==============================================================================

-- 1. Création d'un schéma sécurisé de travail
CREATE SCHEMA IF NOT EXISTS geo_work;

-- 2. Création de la table des Edges (Lignes)
DROP TABLE IF EXISTS geo_work.reseau_hydro_edges_raw;
CREATE TABLE geo_work.reseau_hydro_edges_raw (
    edge_id SERIAL PRIMARY KEY,
    source_gid INTEGER,
    sous_bassi VARCHAR(100),
    geom geometry(LineString, 26191),
    length_m NUMERIC,
    start_geom geometry(Point, 26191),
    end_geom geometry(Point, 26191),
    source INTEGER,
    target INTEGER,
    flow_status VARCHAR(50) DEFAULT 'FLOW_UNKNOWN',
    needs_reverse BOOLEAN DEFAULT FALSE,
    qa_status VARCHAR(50),
    qa_comment TEXT
);

-- 3. Remplissage avec ST_Dump (Passage MultiLineString -> LineString)
INSERT INTO geo_work.reseau_hydro_edges_raw (source_gid, sous_bassi, geom, length_m)
SELECT 
    id as source_gid,
    sous_bassi,
    (ST_Dump(geom)).geom::geometry(LineString, 26191) as geom,
    ST_Length(geom) as length_m
FROM geo.reseau_hydrographique
WHERE geom IS NOT NULL;

-- 4. Extraction des extrémités pour QA
UPDATE geo_work.reseau_hydro_edges_raw
SET 
    start_geom = ST_StartPoint(geom),
    end_geom = ST_EndPoint(geom);

-- 5. Indexation
CREATE INDEX idx_geo_work_edges_geom ON geo_work.reseau_hydro_edges_raw USING GIST(geom);
CREATE INDEX idx_geo_work_edges_source ON geo_work.reseau_hydro_edges_raw(source);
CREATE INDEX idx_geo_work_edges_target ON geo_work.reseau_hydro_edges_raw(target);

-- 6. Inversion manuelle (Phase de QA ultérieure)
-- UPDATE geo_work.reseau_hydro_edges_raw SET geom = ST_Reverse(geom) WHERE needs_reverse = TRUE;

-- 7. Création des nœuds (Approximation sans pgRouting, ou via pgRouting si installé)
-- NOTE: Si pgRouting est finalement installé, décommenter la ligne suivante:
-- SELECT pgr_createTopology('geo_work.reseau_hydro_edges_raw', 5.0, 'geom', 'edge_id');
