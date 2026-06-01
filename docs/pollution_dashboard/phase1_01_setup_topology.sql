-- ==============================================================================
-- SCRIPT DE MIGRATION : PHASE 1 - TOPOLOGIE DU RÉSEAU HYDROGRAPHIQUE
-- ATTENTION : Ne pas exécuter en production sans avoir validé les géométries !
-- ==============================================================================

-- 1. Installation de l'extension pgRouting (Nécessite des droits Superuser)
CREATE EXTENSION IF NOT EXISTS pgrouting;

-- 2. Ajout des colonnes topologiques à la table du réseau
ALTER TABLE geo.reseau_hydrographique 
ADD COLUMN IF NOT EXISTS source integer,
ADD COLUMN IF NOT EXISTS target integer,
ADD COLUMN IF NOT EXISTS cost double precision,
ADD COLUMN IF NOT EXISTS reverse_cost double precision;

-- 3. Mise à jour des coûts de parcours (longueur du tronçon en mètres)
-- Note : ST_Length() renvoie des mètres si la géométrie est projetée (ex: EPSG:26191)
UPDATE geo.reseau_hydrographique
SET cost = ST_Length(geom),
    -- Si le réseau est numérisé DANS LE SENS du courant, remonter le courant est impossible (-1)
    -- Si la numérisation est aléatoire, mettre reverse_cost = cost temporairement.
    reverse_cost = -1;

-- 4. Nettoyage des géométries MultiLineString vers LineString si nécessaire
-- pgRouting préfère les LineStrings simples. Si pgr_createTopology échoue, 
-- il faudra d'abord éclater les MultiLineStrings avec ST_Dump().

-- 5. Création de la Topologie
-- Cette fonction va analyser toutes les géométries, créer des nœuds aux intersections 
-- avec une tolérance de 0.001 (à adapter selon l'unité de la projection)
-- et peupler les colonnes 'source' et 'target'.
SELECT pgr_createTopology(
    'geo.reseau_hydrographique',
    0.001,
    'geom',
    'id'
);

-- 6. Création d'index pour optimiser le parcours de graphe
CREATE INDEX IF NOT EXISTS idx_reseau_source ON geo.reseau_hydrographique(source);
CREATE INDEX IF NOT EXISTS idx_reseau_target ON geo.reseau_hydrographique(target);

-- ==============================================================================
-- TEST DE ROUTAGE EN AVAL (Exemple d'utilisation de pgr_drivingDistance)
-- ==============================================================================
-- Sélectionner tous les tronçons en aval à partir du nœud source = 100
-- SELECT * FROM pgr_drivingDistance(
--    'SELECT id, source, target, cost, reverse_cost FROM geo.reseau_hydrographique',
--    100,      -- Nœud de départ
--    9999999,  -- Distance max (très grande pour tout le bassin aval)
--    true      -- Directed graph (prend en compte cost vs reverse_cost)
-- );
