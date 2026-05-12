-- =============================================================================
-- PHASE 0 — AUDIT DES DÉPENDANCES VUES API
-- Cartographie complète : api.* → tables sources → backend → frontend
-- Exécuter en lecture seule (SELECT uniquement)
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. INVENTAIRE DES VUES API ET LEURS DÉPENDANCES DIRECTES
-- ----------------------------------------------------------------------------
\echo '=== 1. Dépendances directes des vues API ==='

SELECT
    obj.relname                         AS vue,
    obj.relkind                         AS type,         -- 'v' = view, 'm' = matview
    dep.relname                         AS table_source,
    dep_ns.nspname                      AS schema_source
FROM pg_class obj
JOIN pg_namespace obj_ns ON obj_ns.oid = obj.relnamespace
JOIN pg_depend d ON d.classid = 'pg_class'::regclass AND d.objid = obj.oid
JOIN pg_rewrite r ON r.oid = d.refobjid AND d.refclassid = 'pg_rewrite'::regclass
JOIN pg_class dep ON dep.oid = r.ev_class
JOIN pg_namespace dep_ns ON dep_ns.oid = dep.relnamespace
WHERE obj_ns.nspname = 'api'
  AND dep.relkind IN ('r', 'm')   -- tables et matviews
  AND dep_ns.nspname != 'pg_catalog'
ORDER BY obj.relname, dep_ns.nspname, dep.relname;


-- ----------------------------------------------------------------------------
-- 2. INVENTAIRE DE TOUTES LES VUES DU SCHÉMA API
-- ----------------------------------------------------------------------------
\echo '=== 2. Inventaire vues schéma API ==='

SELECT
    c.relname       AS objet,
    CASE c.relkind
        WHEN 'v'  THEN 'vue'
        WHEN 'm'  THEN 'vue_materialisee'
    END             AS type,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS taille,
    COALESCE(c.reltuples::bigint, -1)             AS lignes_estimees
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'api'
  AND c.relkind IN ('v', 'm')
ORDER BY c.relname;


-- ----------------------------------------------------------------------------
-- 3. ÉTAT DE PEUPLEMENT DES TABLES NORMALISÉES VS STAGING
-- ----------------------------------------------------------------------------
\echo '=== 3. État de peuplement — tables normalisées vs staging ==='

SELECT 'meteo.mesure_precipitation'         AS table_cible, (SELECT COUNT(*) FROM meteo.mesure_precipitation)         AS lignes_cible, (SELECT COUNT(*) FROM staging.mesures_precip)                     AS lignes_staging
UNION ALL
SELECT 'meteo.mesure_evaporation',                          (SELECT COUNT(*) FROM meteo.mesure_evaporation),           (SELECT COUNT(*) FROM staging.mesures_evaporation_jr)
UNION ALL
SELECT 'meteo.mesure_temperature',                          (SELECT COUNT(*) FROM meteo.mesure_temperature),           NULL
UNION ALL
SELECT 'qualite.mesure_qualite_barrage',                    (SELECT COUNT(*) FROM qualite.mesure_qualite_barrage),     (SELECT COUNT(*) FROM staging.mesures_qualite_barrages)
UNION ALL
SELECT 'qualite.mesure_qualite_nappe',                      (SELECT COUNT(*) FROM qualite.mesure_qualite_nappe),       (SELECT COUNT(*) FROM staging.mesures_qualite_nappes)
UNION ALL
SELECT 'qualite.mesure_qualite_riviere',                    (SELECT COUNT(*) FROM qualite.mesure_qualite_riviere),     (SELECT COUNT(*) FROM staging._legacy_qualite_riviere)
UNION ALL
SELECT 'qualite.mesure_qualite_sebou',                      (SELECT COUNT(*) FROM qualite.mesure_qualite_sebou),       (SELECT COUNT(*) FROM staging.suivi_qualite_sebou)
UNION ALL
SELECT 'swat_output.mesure_qualite_subbasin_ts',            (SELECT COUNT(*) FROM swat_output.mesure_qualite_subbasin_ts), (SELECT COUNT(*) FROM swat_output.stg_swat_qualite_long)
UNION ALL
SELECT 'wasp_output.mesure_qualite_segment_ts',             (SELECT COUNT(*) FROM wasp_output.mesure_qualite_segment_ts),  (SELECT COUNT(*) FROM wasp_output.stg_wasp_qualite_long)
ORDER BY 1;


-- ----------------------------------------------------------------------------
-- 4. VÉRIFICATION DES FK CASSÉES (station_id non mappés)
-- ----------------------------------------------------------------------------
\echo '=== 4. Vérification FK stations — ire_station non mappés ==='

-- Stations staging sans correspondance dans infra.stations_mesure
SELECT 'staging.mesures_debit_jr' AS source, ire_station, COUNT(*) AS nb_lignes
FROM staging.mesures_debit_jr
WHERE ire_station NOT IN (SELECT code_station FROM infra.stations_mesure WHERE code_station IS NOT NULL)
GROUP BY ire_station
ORDER BY nb_lignes DESC
LIMIT 20;


-- ----------------------------------------------------------------------------
-- 5. VUES MATÉRIALISÉES — ÉTAT LAST REFRESH
-- ----------------------------------------------------------------------------
\echo '=== 5. État des vues matérialisées ==='

SELECT
    schemaname,
    matviewname,
    hasindexes,
    ispopulated,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || matviewname)) AS taille
FROM pg_matviews
WHERE schemaname IN ('api', 'metadata')
ORDER BY schemaname, matviewname;


-- ----------------------------------------------------------------------------
-- 6. RÉSUMÉ PAR SCHÉMA — TAILLE ET NOMBRE D'OBJETS
-- ----------------------------------------------------------------------------
\echo '=== 6. Résumé taille par schéma ==='

SELECT
    n.nspname                                                  AS schema,
    COUNT(c.oid)                                               AS nb_objets,
    pg_size_pretty(SUM(pg_total_relation_size(c.oid)))         AS taille_totale
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind IN ('r', 'm', 'v')
  AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
GROUP BY n.nspname
ORDER BY SUM(pg_total_relation_size(c.oid)) DESC;
