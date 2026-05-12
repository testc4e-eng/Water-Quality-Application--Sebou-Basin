-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Objectif : reconstruire une source stable pour hydro.mesure_debit
-- Aucune écriture finale vers hydro.mesure_debit dans ce script

-- Étape 1 — reconstruire la source brute stable
-- CREATE TABLE qa_dry_run.e1_1_hydro_debit_prepare_stable_proposee AS
WITH stable_raw AS (
    SELECT
        'raw_mesures_debit_jr'::text AS source_table,
        r.code_debit,
        r.ire_station,
        r.date_jr::timestamp AT TIME ZONE 'UTC' AS temps,
        r.debit_jr AS valeur_source_brute,
        ms.station_id,
        md5(
            'raw_mesures_debit_jr' || '|' ||
            r.code_debit::text || '|' ||
            r.ire_station || '|' ||
            r.date_jr::text || '|' ||
            r.debit_jr::text
        ) AS source_row_hash,
        md5(
            (r.date_jr::timestamp AT TIME ZONE 'UTC')::text || '|' ||
            ms.station_id::text
        ) AS target_business_key_hash
    FROM staging.raw_mesures_debit_jr r
    JOIN metadata.mapping_station ms
      ON ms.legacy_code_station = r.ire_station
),
e0_prepared AS (
    SELECT
        r.code_debit,
        r.ire_station,
        r.date_jr::timestamp AT TIME ZONE 'UTC' AS temps,
        e.valeur_brute,
        e.valeur_preparee,
        e.unite_source,
        e.unite_finale,
        e.conversion_regle,
        e.flags_qa,
        CASE
            WHEN r.debit_jr IS NULL OR r.debit_jr = 0 THEN NULL
            ELSE abs(e.valeur_preparee / r.debit_jr)
        END AS ratio_prepare_sur_brut
    FROM qa_dry_run.e0_mesures_preparees e
    JOIN staging.raw_mesures_debit_jr r
      ON r.ctid::text = e.source_row_id
    WHERE e.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
      AND e.source_table = 'raw_mesures_debit_jr'
),
e0_quarantine AS (
    SELECT
        r.code_debit,
        r.ire_station,
        r.date_jr::timestamp AT TIME ZONE 'UTC' AS temps,
        q.motif_quarantaine,
        q.flags_qa
    FROM qa_dry_run.e0_mesures_quarantaine q
    JOIN staging.raw_mesures_debit_jr r
      ON r.ctid::text = q.source_row_id
    WHERE q.run_id = 'f0f2a858-1c90-4b15-a6af-cc172bece071'::uuid
      AND q.source_table = 'raw_mesures_debit_jr'
),
target_existing AS (
    SELECT
        temps,
        station_id,
        valeur AS valeur_cible
    FROM hydro.mesure_debit
)
SELECT
    s.source_table,
    s.code_debit,
    s.ire_station,
    s.temps,
    s.station_id,
    s.valeur_source_brute,
    s.source_row_hash,
    s.target_business_key_hash,
    e0.valeur_brute,
    e0.valeur_preparee,
    e0.unite_source,
    e0.unite_finale,
    e0.conversion_regle,
    e0.flags_qa AS e0_flags_qa,
    q.motif_quarantaine,
    q.flags_qa AS quarantine_flags_qa,
    t.valeur_cible,
    CASE
        WHEN q.code_debit IS NOT NULL THEN 'BACKLOG'
        WHEN e0.code_debit IS NOT NULL
         AND abs(e0.valeur_preparee - s.valeur_source_brute) >= 1e-9
         AND e0.ratio_prepare_sur_brut IS NOT NULL
         AND e0.ratio_prepare_sur_brut >= 1000
            THEN 'PARSING_SCALING_ERROR'
        WHEN t.station_id IS NOT NULL
         AND abs(t.valeur_cible - s.valeur_source_brute) < 1e-9
            THEN 'ALREADY_PRESENT_OK'
        WHEN t.station_id IS NOT NULL
         AND abs(t.valeur_cible - s.valeur_source_brute) >= 1e-9
            THEN 'CONFLICT_VALUE_TO_REVIEW'
        WHEN t.station_id IS NULL
            THEN 'READY_INSERT_ONLY_MISSING'
        ELSE 'BACKLOG'
    END AS classification
FROM stable_raw s
LEFT JOIN e0_prepared e0
  USING (code_debit, ire_station, temps)
LEFT JOIN e0_quarantine q
  USING (code_debit, ire_station, temps)
LEFT JOIN target_existing t
  ON t.temps = s.temps
 AND t.station_id = s.station_id
;

-- Contrôle 1 — répartition des classes
-- SELECT classification, COUNT(*)
-- FROM qa_dry_run.e1_1_hydro_debit_prepare_stable_proposee
-- GROUP BY classification
-- ORDER BY classification;

-- Contrôle 2 — scope prêt à insérer
-- SELECT COUNT(*)
-- FROM qa_dry_run.e1_1_hydro_debit_prepare_stable_proposee
-- WHERE classification = 'READY_INSERT_ONLY_MISSING';

-- Contrôle 3 — conflits à arbitrer
-- SELECT *
-- FROM qa_dry_run.e1_1_hydro_debit_prepare_stable_proposee
-- WHERE classification IN ('CONFLICT_VALUE_TO_REVIEW', 'PARSING_SCALING_ERROR');
