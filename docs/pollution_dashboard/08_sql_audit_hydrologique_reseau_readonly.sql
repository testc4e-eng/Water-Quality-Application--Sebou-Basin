-- ==============================================================================
-- AUDIT HYDROLOGIQUE DU RÉSEAU (READ-ONLY)
-- Ne contient aucune clause DROP, ALTER, UPDATE ou INSERT.
-- ==============================================================================

-- 1. Identifier la table réseau et compter les tronçons
-- Objectif : Connaître la volumétrie globale.
-- Table : geo.reseau_hydrographique
-- Résultat attendu : 697
SELECT COUNT(*) as total_segments FROM geo.reseau_hydrographique;

-- 2. Vérifier le SRID
-- Objectif : S'assurer du système de projection.
-- Résultat attendu : 26191 (Lambert Maroc)
SELECT ST_SRID(geom) as srid FROM geo.reseau_hydrographique LIMIT 1;

-- 3. Vérifier le type géométrique
-- Objectif : Savoir si le réseau est en LineString (requis par pgRouting) ou MultiLineString.
-- Résultat attendu : MULTILINESTRING
SELECT GeometryType(geom) as geom_type FROM geo.reseau_hydrographique LIMIT 1;

-- 4. Compter les géométries nulles ou vides
-- Objectif : Détecter des anomalies d'intégrité spatiale.
SELECT COUNT(*) as geom_vides FROM geo.reseau_hydrographique WHERE geom IS NULL OR ST_IsEmpty(geom);

-- 5. Compter les géométries invalides
-- Objectif : Détecter des auto-intersections ou défauts OGC.
SELECT COUNT(*) as geom_invalides FROM geo.reseau_hydrographique WHERE NOT ST_IsValid(geom);

-- 6. Longueur min / max / moyenne
-- Objectif : Analyser la segmentation du réseau (idéalement les tronçons doivent être homogènes).
SELECT 
    MIN(ST_Length(geom)) as min_len, 
    MAX(ST_Length(geom)) as max_len, 
    AVG(ST_Length(geom)) as avg_len 
FROM geo.reseau_hydrographique;

-- 7. Détecter les doublons géométriques exacts
-- Objectif : Identifier les tronçons empilés (nettoyage topologique).
SELECT geom, COUNT(*) 
FROM geo.reseau_hydrographique 
GROUP BY geom 
HAVING COUNT(*) > 1;

-- 8. Vérifier la présence de colonnes topologiques (source, target)
-- Objectif : Vérifier si la topologie a déjà été calculée.
-- Résultat attendu : 0 ligne (les colonnes n'existent pas)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'reseau_hydrographique' 
  AND column_name IN ('source', 'target', 'direction', 'cost');

-- 9. Détecter des segments très courts (Micro-segments)
-- Objectif : Identifier les dangles ou scissions erronées (< 5 mètres).
-- Limite : L'unité dépend du SRID (ici 26191 = mètres).
SELECT id, ST_Length(geom) 
FROM geo.reseau_hydrographique 
WHERE ST_Length(geom) < 5.0;

-- 10. Croisement des stations avec les tronçons (Snapping)
-- Objectif : Mesurer la distance moyenne entre les stations et le réseau.
-- Limite : Très gourmand, nécessite ST_DWithin ou <->
WITH station_distances AS (
    SELECT s.station_id,
           MIN(ST_Distance(s.geom, r.geom)) as dist_to_network
    FROM api.v_station_dimension s
    CROSS JOIN LATERAL (
        SELECT geom FROM geo.reseau_hydrographique
        ORDER BY geom <-> s.geom LIMIT 1
    ) r
    GROUP BY s.station_id
)
SELECT AVG(dist_to_network) as distance_moyenne_snapping FROM station_distances;
