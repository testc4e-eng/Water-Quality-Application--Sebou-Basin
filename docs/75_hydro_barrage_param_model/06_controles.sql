-- Phase 1 - Controles de stabilisation

-- 1. Doublons metier cibles
SELECT
    barrage_id,
    temps,
    parametre_code,
    scenario,
    COUNT(*) AS n
FROM hydro.mesure_barrage_param
GROUP BY barrage_id, temps, parametre_code, scenario
HAVING COUNT(*) > 1;

-- 2. Null critiques
SELECT
    COUNT(*) FILTER (WHERE barrage_id IS NULL) AS barrage_id_null,
    COUNT(*) FILTER (WHERE temps IS NULL) AS temps_null,
    COUNT(*) FILTER (WHERE parametre_code IS NULL) AS parametre_code_null,
    COUNT(*) FILTER (WHERE valeur IS NULL) AS valeur_null,
    COUNT(*) FILTER (WHERE target_business_key_hash IS NULL) AS hash_null
FROM hydro.mesure_barrage_param;

-- 3. Coherence unites
SELECT
    parametre_code,
    unite,
    COUNT(*) AS n
FROM hydro.mesure_barrage_param
GROUP BY parametre_code, unite
ORDER BY parametre_code, unite;

-- 3b. Interdiction volume journalier -> debit
SELECT *
FROM hydro.mesure_barrage_param
WHERE (parametre_code = 'LACHER' AND unite IN ('m3/s', 'Mm3/s'))
   OR (parametre_code = 'APPORTS_HM3' AND unite IN ('m3/s', 'Mm3/s'))
   OR (parametre_code = 'TRANSFERT' AND unite IN ('m3/s', 'Mm3/s'));

-- 3c. Coherence parametre <-> unite
SELECT *
FROM hydro.mesure_barrage_param
WHERE (parametre_code = 'DEBIT' AND unite <> 'm3/s')
   OR (parametre_code = 'LACHER' AND unite <> 'Mm3/j')
   OR (parametre_code = 'APPORTS_HM3' AND unite <> 'Mm3/j')
   OR (parametre_code = 'TRANSFERT' AND unite <> 'Mm3/j')
   OR (parametre_code = 'VOLUME' AND unite <> 'Mm3')
   OR (parametre_code = 'NIVEAU_EAU' AND unite <> 'm');

-- 4. Coherence barrage_id
SELECT
    p.barrage_id,
    COUNT(*) AS n
FROM hydro.mesure_barrage_param p
LEFT JOIN api.v_barrage_dimension b
  ON b.barrage_id = p.barrage_id
WHERE b.barrage_id IS NULL
GROUP BY p.barrage_id;

-- 5. Collisions de hash
SELECT
    target_business_key_hash,
    COUNT(*) AS n
FROM hydro.mesure_barrage_param
GROUP BY target_business_key_hash
HAVING COUNT(*) > 1;

-- 6. Couverture vs source dedupee
WITH src AS (
    SELECT
        s.*,
        mb.barrage_id,
        ROW_NUMBER() OVER (PARTITION BY s.ire_barrage, s.date_jr ORDER BY s.id) AS rn
    FROM staging.raw_mesures_niv_eau_barrages s
    LEFT JOIN metadata.mapping_barrage mb
      ON mb.legacy_ire_barrage = s.ire_barrage
),
dedup AS (
    SELECT *
    FROM src
    WHERE rn = 1
      AND date_jr IS NOT NULL
      AND barrage_id IS NOT NULL
),
expected AS (
    SELECT 'NIVEAU_EAU' AS parametre_code, COUNT(*) AS n FROM dedup WHERE niveau_eau_m_ngm IS NOT NULL
    UNION ALL
    SELECT 'VOLUME', COUNT(*) FROM dedup WHERE volume_mm3 IS NOT NULL
    UNION ALL
    SELECT 'LACHER', COUNT(*) FROM dedup WHERE restitutions_mm3 IS NOT NULL
    UNION ALL
    SELECT 'APPORTS_HM3', COUNT(*) FROM dedup WHERE apports_mm3 IS NOT NULL
    UNION ALL
    SELECT 'TRANSFERT', COUNT(*) FROM dedup WHERE transfert_mm3 IS NOT NULL
),
actual AS (
    SELECT parametre_code, COUNT(*) AS n
    FROM hydro.mesure_barrage_param
    GROUP BY parametre_code
)
SELECT
    e.parametre_code,
    e.n AS expected_n,
    COALESCE(a.n, 0) AS actual_n,
    e.n - COALESCE(a.n, 0) AS delta_n
FROM expected e
LEFT JOIN actual a
  ON a.parametre_code = e.parametre_code
ORDER BY e.parametre_code;
