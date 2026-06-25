-- =============================================================================
-- PHASE 0 — AUDIT DE COUVERTURE STAGING → TABLES NORMALISÉES
-- Vérifie quelles données staging peuvent être migrées (station mappée, etc.)
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. COUVERTURE MAPPING STATIONS — DÉBIT JOURNALIER
-- ----------------------------------------------------------------------------
\echo '=== 1. Couverture stations — staging.mesures_debit_jr → hydro ==='

SELECT
    COUNT(*)                                            AS total_lignes,
    COUNT(sm.id)                                        AS lignes_mappees,
    COUNT(*) - COUNT(sm.id)                             AS lignes_orphelines,
    ROUND(100.0 * COUNT(sm.id) / COUNT(*), 1)           AS pct_mappees,
    COUNT(DISTINCT s.ire_station)                       AS stations_distinctes,
    COUNT(DISTINCT sm.id)                               AS stations_mappees
FROM staging.mesures_debit_jr s
LEFT JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station;


-- Stations débit non mappées
\echo '=== 1b. Stations débit non mappées (top 15) ==='
SELECT ire_station, COUNT(*) AS nb_lignes
FROM staging.mesures_debit_jr
WHERE ire_station NOT IN (
    SELECT code_station FROM infra.stations_mesure WHERE code_station IS NOT NULL
)
GROUP BY ire_station
ORDER BY nb_lignes DESC
LIMIT 15;


-- ----------------------------------------------------------------------------
-- 2. COUVERTURE MAPPING STATIONS — PRÉCIPITATIONS
-- ----------------------------------------------------------------------------
\echo '=== 2. Couverture stations — staging.mesures_precip → meteo ==='

SELECT
    COUNT(*)                                        AS total_lignes,
    COUNT(sm.id)                                    AS lignes_mappees,
    COUNT(*) - COUNT(sm.id)                         AS lignes_orphelines,
    ROUND(100.0 * COUNT(sm.id) / COUNT(*), 1)       AS pct_mappees
FROM staging.mesures_precip s
LEFT JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station;


-- ----------------------------------------------------------------------------
-- 3. COUVERTURE MAPPING STATIONS — ÉVAPORATION
-- ----------------------------------------------------------------------------
\echo '=== 3. Couverture stations — staging.mesures_evaporation_jr → meteo ==='

SELECT
    COUNT(*)                                        AS total_lignes,
    COUNT(sm.id)                                    AS lignes_mappees,
    COUNT(*) - COUNT(sm.id)                         AS lignes_orphelines,
    ROUND(100.0 * COUNT(sm.id) / COUNT(*), 1)       AS pct_mappees
FROM staging.mesures_evaporation_jr s
LEFT JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station;


-- ----------------------------------------------------------------------------
-- 4. COUVERTURE MAPPING BARRAGES — NIVEAUX EAU
-- ----------------------------------------------------------------------------
\echo '=== 4. Couverture barrages — staging.mesures_niv_eau_barrages → hydro ==='

SELECT
    COUNT(*)                                        AS total_lignes,
    COUNT(b.id)                                     AS lignes_mappees,
    COUNT(*) - COUNT(b.id)                          AS lignes_orphelines,
    ROUND(100.0 * COUNT(b.id) / COUNT(*), 1)        AS pct_mappees,
    COUNT(DISTINCT s.ire_barrage)                   AS barrages_distincts,
    COUNT(DISTINCT b.id)                            AS barrages_mappes
FROM staging.mesures_niv_eau_barrages s
LEFT JOIN infra.barrages b ON b.code_barrage = s.ire_barrage;


-- Barrages non mappés
\echo '=== 4b. Barrages non mappés ==='
SELECT ire_barrage, COUNT(*) AS nb_lignes
FROM staging.mesures_niv_eau_barrages
WHERE ire_barrage NOT IN (
    SELECT code_barrage FROM infra.barrages WHERE code_barrage IS NOT NULL
)
GROUP BY ire_barrage
ORDER BY nb_lignes DESC
LIMIT 15;


-- ----------------------------------------------------------------------------
-- 5. COUVERTURE MAPPING STATIONS — QUALITÉ BARRAGES
-- ----------------------------------------------------------------------------
\echo '=== 5. Couverture stations — staging.mesures_qualite_barrages → qualite ==='

SELECT
    COUNT(*)                                        AS total_lignes,
    COUNT(sm.id)                                    AS station_mappees,
    COUNT(*) - COUNT(sm.id)                         AS orphelines,
    ROUND(100.0 * COUNT(sm.id) / COUNT(*), 1)       AS pct_mappees
FROM staging.mesures_qualite_barrages s
LEFT JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station;


-- ----------------------------------------------------------------------------
-- 6. DOUBLONS POTENTIELS — VÉRIFICATION AVANT MIGRATION
-- ----------------------------------------------------------------------------
\echo '=== 6. Doublons dans staging.mesures_debit_jr ==='

SELECT date_jr, ire_station, COUNT(*) AS nb
FROM staging.mesures_debit_jr
GROUP BY date_jr, ire_station
HAVING COUNT(*) > 1
LIMIT 10;


-- ----------------------------------------------------------------------------
-- 7. SYNTHÈSE PRÊT-À-MIGRER
-- ----------------------------------------------------------------------------
\echo '=== 7. Synthèse — volumes prêts à migrer ==='

SELECT
    'meteo.mesure_precipitation'    AS cible,
    'staging.mesures_precip'        AS source,
    (SELECT COUNT(*) FROM staging.mesures_precip s
     JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station)   AS lignes_migrable
UNION ALL
SELECT
    'meteo.mesure_evaporation',
    'staging.mesures_evaporation_jr',
    (SELECT COUNT(*) FROM staging.mesures_evaporation_jr s
     JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station)
UNION ALL
SELECT
    'hydro.mesure_debit_journalier',
    'staging.mesures_debit_jr',
    (SELECT COUNT(*) FROM staging.mesures_debit_jr s
     JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station)
UNION ALL
SELECT
    'hydro.mesure_barrage_journalier',
    'staging.mesures_niv_eau_barrages',
    (SELECT COUNT(*) FROM staging.mesures_niv_eau_barrages s
     JOIN infra.barrages b ON b.code_barrage = s.ire_barrage)
UNION ALL
SELECT
    'qualite.mesure_qualite_barrage',
    'staging.mesures_qualite_barrages',
    (SELECT COUNT(*) FROM staging.mesures_qualite_barrages s
     JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station)
UNION ALL
SELECT
    'qualite.mesure_qualite_nappe',
    'staging.mesures_qualite_nappes',
    (SELECT COUNT(*) FROM staging.mesures_qualite_nappes s
     JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station)
ORDER BY 1;
