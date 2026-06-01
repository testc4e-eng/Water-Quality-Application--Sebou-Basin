-- ==============================================================================
-- AUDIT TOPOLOGIQUE DU RÉSEAU (READ-ONLY)
-- Fichier: 07_scripts_sql_audit_readonly.sql
-- ==============================================================================

-- 1. Estimation du nombre de LineStrings après ST_Dump
-- Objectif: Vérifier combien de segments simples existent.
-- Résultat: Actuellement 697 (1 LineString par MultiLineString).
SELECT COUNT(*) as nb_linestrings
FROM (SELECT ST_Dump(geom) FROM geo.reseau_hydrographique) dump;

-- 2. Dénombrement des nœuds distincts (sans tolérance)
-- Objectif: Mesurer la connectivité pure (si Start = End).
WITH points AS (
  SELECT ST_StartPoint((ST_Dump(geom)).geom) as p FROM geo.reseau_hydrographique
  UNION
  SELECT ST_EndPoint((ST_Dump(geom)).geom) as p FROM geo.reseau_hydrographique
)
SELECT COUNT(*) as nb_noeuds_stricts FROM points;

-- 3. Vérification des altitudes et pentes
-- Objectif: Déterminer si le sens d'écoulement peut être déduit de la base.
-- Résultat: Présence de Z_Min, Z_Max, Pente confirmée.
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'reseau_hydrographique' AND column_name IN ('z_min', 'z_max', 'pente');

-- 4. Audit des Barrages de Garde (Cible de routage)
-- Objectif: Identifier formellement la cible du routage.
SELECT 'Station' as type, legacy_station_id as id, station_nom as nom, code_station as code
FROM api.v_station_dimension 
WHERE station_nom ILIKE '%garde%' OR station_nom ILIKE '%Allal Tazi%'
UNION ALL
SELECT 'Barrage' as type, legacy_barrage_id as id, barrage_nom as nom, NULL as code
FROM api.v_barrage_dimension 
WHERE barrage_nom ILIKE '%garde%' OR barrage_nom ILIKE '%Allal Tazi%';

-- 5. Mesure de distance (Snapping) pour le Barrage de Garde
-- Objectif: Savoir à quelle distance le barrage est de la rivière.
WITH barrage_garde AS (
    SELECT geom FROM api.v_station_dimension WHERE legacy_station_id = 52 LIMIT 1
)
SELECT id as edge_id_proche, ST_Distance(r.geom, b.geom) as distance_m
FROM geo.reseau_hydrographique r, barrage_garde b
ORDER BY r.geom <-> b.geom
LIMIT 5;
