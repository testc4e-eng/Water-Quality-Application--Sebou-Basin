-- PROPOSITION NON EXECUTEE
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE
-- Objet : mapping final REF-001 a REF-004 apres enrichissement du referentiel C4E.
-- Perimetre : parametre_ref_id uniquement dans les quatre tables qualite ciblees.
-- Interdictions : ne pas utiliser ctid, ne pas mapper MO_METAL, FM/F_M_mes, MD.
-- Securite : transaction ouverte, backup logique, ROLLBACK actif, COMMIT commente.

BEGIN;

-- 1. Table temporaire des mappings surs.
CREATE TEMP TABLE tmp_ref001_004_safe_map (
    source_parametre text PRIMARY KEY,
    target_code text NOT NULL,
    methode_analytique text NULL,
    decision_source text NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_ref001_004_safe_map (source_parametre, target_code, methode_analytique, decision_source)
VALUES
    ('COND','CONDUCTIVITE',NULL,'premiere_passe_sure'),
    ('Conductivité','CONDUCTIVITE',NULL,'premiere_passe_sure'),
    ('O2_DISSOUS','O2_DISS',NULL,'premiere_passe_sure'),
    ('O2_dissous','O2_DISS',NULL,'premiere_passe_sure'),
    ('NO3','NO3-',NULL,'premiere_passe_sure'),
    ('Nitrates','NO3-',NULL,'premiere_passe_sure'),
    ('NO2','NO2-',NULL,'premiere_passe_sure'),
    ('PO4','PO4_3-',NULL,'premiere_passe_sure'),
    ('HCO3','HCO3-',NULL,'premiere_passe_sure'),
    ('SATURATION_OXYGENE','SAT',NULL,'premiere_passe_sure'),
    ('HG_MERCURE','HG',NULL,'premiere_passe_sure'),
    ('Ammonium','NH4',NULL,'premiere_passe_sure'),
    ('Turbidité','TURBIDITE',NULL,'premiere_passe_sure'),
    ('H_G','HUILES_GRAISSES',NULL,'c4e_valide'),
    ('NTK','AZOTE_TOT_KJELD',NULL,'c4e_valide'),
    ('PT','PHOSPHORE_TOTAL',NULL,'c4e_valide'),
    ('PT décant. 2h','PHOSPHORE_TOTAL','DECANTE_2H','c4e_valide_methode'),
    ('PT DECANTE','PHOSPHORE_TOTAL','DECANTE_2H','c4e_valide_methode'),
    ('F','F-',NULL,'c4e_valide'),
    ('CN','CN',NULL,'c4e_valide'),
    ('CLOSTRI','CLOSTRI',NULL,'c4e_valide'),
    ('CO2_LIBRE','CO2_LIBRE',NULL,'c4e_valide'),
    ('H2S','H2S',NULL,'c4e_valide'),
    ('PSEUDO_AER','PSEUDO_AER',NULL,'c4e_valide'),
    ('VIBRIO','VIBRIO',NULL,'c4e_valide'),
    ('GERME_22','GERME_22',NULL,'c4e_valide'),
    ('GERME_37','GERME_37',NULL,'c4e_valide'),
    ('CL2_RES','CL2_RES',NULL,'c4e_valide'),
    ('SIO2','SIO2',NULL,'c4e_valide'),
    ('SO3','SO3',NULL,'c4e_valide'),
    ('ODEUR','ODEUR',NULL,'c4e_valide'),
    ('SAVEUR','SAVEUR',NULL,'c4e_valide'),
    ('CR','CRT',NULL,'c4e_valide'),
    ('Cr','CRT',NULL,'c4e_valide'),
    ('CrT','CRT',NULL,'c4e_valide'),
    ('DBO5_DEC2H','DBO5','DECANTE_2H','c4e_valide_methode'),
    ('DBO5_dec2h','DBO5','DECANTE_2H','c4e_valide_methode'),
    ('N_TOT','AZOTE_TOTAL',NULL,'c4e_valide'),
    ('N_ORG','AZOTE_ORG',NULL,'c4e_valide'),
    ('UNREC_BORE_MG_L','BORE',NULL,'c4e_valide'),
    ('RESIDUS_SECS','RS105',NULL,'c4e_valide');

-- 2. Controle exclusions.
SELECT *
FROM tmp_ref001_004_safe_map
WHERE upper(source_parametre) IN ('MO_METAL','FM','F_M_MES','MD');

-- Le SELECT ci-dessus doit retourner 0 ligne.

-- 3. Controle unicite referentiel cible.
SELECT
    sm.source_parametre,
    sm.target_code,
    COUNT(DISTINCT r.parametre_ref_id) AS candidate_count
FROM tmp_ref001_004_safe_map sm
LEFT JOIN metadata.referentiel_parametre_canonique r
  ON r.code_parametre = sm.target_code
 AND r.statut = 'ACTIF'
GROUP BY sm.source_parametre, sm.target_code
HAVING COUNT(DISTINCT r.parametre_ref_id) <> 1;

-- Le SELECT ci-dessus doit retourner 0 ligne apres enrichissement du referentiel.

-- 4. Backup logique des lignes candidates.
CREATE TABLE IF NOT EXISTS audit.bkp_qualite_ref001_004_mapping_final_20260508 AS
WITH target_ref AS (
    SELECT sm.source_parametre, sm.target_code, sm.methode_analytique, sm.decision_source, r.parametre_ref_id
    FROM tmp_ref001_004_safe_map sm
    JOIN metadata.referentiel_parametre_canonique r
      ON r.code_parametre = sm.target_code
     AND r.statut = 'ACTIF'
), candidates AS (
    SELECT 'qualite.mesure_qualite_riviere' AS table_name, q.source_row_id::text AS source_row_id,
           q.temps, q.station_id::text AS station_id, q.ire_station, NULL::text AS barrage_id,
           NULL::text AS milieu_prelevement, q.parametre_qualite, q.parametre_ref_id AS old_parametre_ref_id,
           tr.parametre_ref_id AS new_parametre_ref_id, tr.target_code, tr.methode_analytique,
           q.valeur::text AS valeur
    FROM qualite.mesure_qualite_riviere q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
    UNION ALL
    SELECT 'qualite.mesure_qualite_nappe', q.source_row_id::text,
           q.temps, q.station_id::text, q.ire_station, NULL::text,
           NULL::text, q.parametre_qualite, q.parametre_ref_id,
           tr.parametre_ref_id, tr.target_code, tr.methode_analytique,
           q.valeur::text
    FROM qualite.mesure_qualite_nappe q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
    UNION ALL
    SELECT 'qualite.mesure_qualite_sebou', q.source_row_id::text,
           q.temps, q.station_id::text, q.ire_station, NULL::text,
           NULL::text, q.parametre_qualite, q.parametre_ref_id,
           tr.parametre_ref_id, tr.target_code, tr.methode_analytique,
           q.valeur::text
    FROM qualite.mesure_qualite_sebou q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
    UNION ALL
    SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', q.source_row_id::text,
           q.temps, q.station_id::text, q.ire_station, q.barrage_id::text,
           q.milieu_prelevement, q.parametre_qualite, q.parametre_ref_id,
           tr.parametre_ref_id, tr.target_code, tr.methode_analytique,
           q.valeur::text
    FROM qualite.suivi_qualite_barrage_garde_hebdo q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
)
SELECT *
FROM candidates;

-- 5. Volume candidat attendu.
SELECT COUNT(*) AS candidate_rows
FROM audit.bkp_qualite_ref001_004_mapping_final_20260508;

-- Attendu apres enrichissement referentiel : 62361 lignes candidates.

-- 6. UPDATE qualite.mesure_qualite_riviere.
WITH target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM tmp_ref001_004_safe_map sm
    JOIN metadata.referentiel_parametre_canonique r
      ON r.code_parametre = sm.target_code
     AND r.statut = 'ACTIF'
), candidates AS (
    SELECT q.source_row_id, q.parametre_qualite, tr.parametre_ref_id
    FROM qualite.mesure_qualite_riviere q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
)
UPDATE qualite.mesure_qualite_riviere q
SET parametre_ref_id = c.parametre_ref_id
FROM candidates c
WHERE q.source_row_id = c.source_row_id
  AND q.parametre_qualite = c.parametre_qualite
  AND q.parametre_ref_id IS NULL;

-- 7. UPDATE qualite.mesure_qualite_nappe.
WITH target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM tmp_ref001_004_safe_map sm
    JOIN metadata.referentiel_parametre_canonique r
      ON r.code_parametre = sm.target_code
     AND r.statut = 'ACTIF'
), candidates AS (
    SELECT q.source_row_id, q.parametre_qualite, tr.parametre_ref_id
    FROM qualite.mesure_qualite_nappe q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
)
UPDATE qualite.mesure_qualite_nappe q
SET parametre_ref_id = c.parametre_ref_id
FROM candidates c
WHERE q.source_row_id = c.source_row_id
  AND q.parametre_qualite = c.parametre_qualite
  AND q.parametre_ref_id IS NULL;

-- 8. UPDATE qualite.mesure_qualite_sebou.
WITH target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM tmp_ref001_004_safe_map sm
    JOIN metadata.referentiel_parametre_canonique r
      ON r.code_parametre = sm.target_code
     AND r.statut = 'ACTIF'
), candidates AS (
    SELECT q.source_row_id, q.parametre_qualite, tr.parametre_ref_id
    FROM qualite.mesure_qualite_sebou q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
)
UPDATE qualite.mesure_qualite_sebou q
SET parametre_ref_id = c.parametre_ref_id
FROM candidates c
WHERE q.source_row_id = c.source_row_id
  AND q.parametre_qualite = c.parametre_qualite
  AND q.parametre_ref_id IS NULL;

-- 9. UPDATE qualite.suivi_qualite_barrage_garde_hebdo.
WITH target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM tmp_ref001_004_safe_map sm
    JOIN metadata.referentiel_parametre_canonique r
      ON r.code_parametre = sm.target_code
     AND r.statut = 'ACTIF'
), candidates AS (
    SELECT q.source_row_id, q.parametre_qualite, tr.parametre_ref_id
    FROM qualite.suivi_qualite_barrage_garde_hebdo q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
      AND q.parametre_qualite NOT IN ('MO_METAL','FM','F_M_mes','MD')
)
UPDATE qualite.suivi_qualite_barrage_garde_hebdo q
SET parametre_ref_id = c.parametre_ref_id
FROM candidates c
WHERE q.source_row_id = c.source_row_id
  AND q.parametre_qualite = c.parametre_qualite
  AND q.parametre_ref_id IS NULL;

-- 10. Validation dans transaction.
SELECT 'remaining_null_riviere' AS controle, COUNT(*) AS rows
FROM qualite.mesure_qualite_riviere
WHERE parametre_ref_id IS NULL
UNION ALL
SELECT 'remaining_null_nappe', COUNT(*)
FROM qualite.mesure_qualite_nappe
WHERE parametre_ref_id IS NULL
UNION ALL
SELECT 'remaining_null_sebou', COUNT(*)
FROM qualite.mesure_qualite_sebou
WHERE parametre_ref_id IS NULL
UNION ALL
SELECT 'remaining_null_garde', COUNT(*)
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE parametre_ref_id IS NULL;

-- Attendu apres correction finale :
-- riviere : 0
-- nappe : 1 (NUMEROTATION legacy)
-- sebou : 0
-- garde : 11 (MO_METAL client required)
-- total restant : 12

SELECT parametre_qualite, COUNT(*) AS rows
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE parametre_ref_id IS NULL
GROUP BY parametre_qualite
ORDER BY rows DESC, parametre_qualite;

ROLLBACK;
-- COMMIT; -- A decommenter uniquement apres validation explicite et controles OK.

