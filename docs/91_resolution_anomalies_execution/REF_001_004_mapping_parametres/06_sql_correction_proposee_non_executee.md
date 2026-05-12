# SQL correction proposee non executee

```sql
-- PROPOSITION NON EXECUTEE
-- A EXECUTER UNIQUEMENT APRES VALIDATION EXPLICITE
-- Objet : corriger uniquement les mappings sûrs REF-001 a REF-004.
-- Interdiction : ne pas utiliser ctid.

BEGIN;

-- 1. Sauvegarde logique proposee des lignes qui seraient touchees.
CREATE TABLE audit.bkp_qualite_param_ref_safe_mapping_<YYYYMMDD_HHMMSS> AS
WITH safe_map(source_parametre, code_parametre) AS (
    VALUES
        ('COND','CONDUCTIVITE'),
        ('Conductivité','CONDUCTIVITE'),
        ('O2_DISSOUS','O2_DISS'),
        ('O2_dissous','O2_DISS'),
        ('NO3','NO3-'),
        ('Nitrates','NO3-'),
        ('NO2','NO2-'),
        ('PO4','PO4_3-'),
        ('HCO3','HCO3-'),
        ('SATURATION_OXYGENE','SAT'),
        ('HG_MERCURE','HG'),
        ('Ammonium','NH4'),
        ('Turbidité','TURBIDITE'),
        ('H_G','HUILES_GRAISSES')
),
target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM safe_map sm
    JOIN metadata.referentiel_parametre_canonique r
      ON r.code_parametre = sm.code_parametre
     AND r.statut = 'ACTIF'
),
all_rows AS (
    SELECT 'qualite.mesure_qualite_riviere' AS table_name, source_row_id::text AS source_row_id,
           parametre_qualite, parametre_ref_id AS old_parametre_ref_id, tr.parametre_ref_id AS new_parametre_ref_id
    FROM qualite.mesure_qualite_riviere q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_nappe', source_row_id::text,
           parametre_qualite, parametre_ref_id, tr.parametre_ref_id
    FROM qualite.mesure_qualite_nappe q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_sebou', source_row_id::text,
           parametre_qualite, parametre_ref_id, tr.parametre_ref_id
    FROM qualite.mesure_qualite_sebou q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', source_row_id::text,
           parametre_qualite, parametre_ref_id, tr.parametre_ref_id
    FROM qualite.suivi_qualite_barrage_garde_hebdo q
    JOIN target_ref tr ON tr.source_parametre = q.parametre_qualite
    WHERE q.parametre_ref_id IS NULL
)
SELECT *
FROM all_rows;

-- 2. Controle unicite candidat avant update.
WITH safe_map(source_parametre, code_parametre) AS (
    VALUES
        ('COND','CONDUCTIVITE'),
        ('Conductivité','CONDUCTIVITE'),
        ('O2_DISSOUS','O2_DISS'),
        ('O2_dissous','O2_DISS'),
        ('NO3','NO3-'),
        ('Nitrates','NO3-'),
        ('NO2','NO2-'),
        ('PO4','PO4_3-'),
        ('HCO3','HCO3-'),
        ('SATURATION_OXYGENE','SAT'),
        ('HG_MERCURE','HG'),
        ('Ammonium','NH4'),
        ('Turbidité','TURBIDITE'),
        ('H_G','HUILES_GRAISSES')
)
SELECT source_parametre, COUNT(DISTINCT r.parametre_ref_id) AS candidates
FROM safe_map sm
LEFT JOIN metadata.referentiel_parametre_canonique r
  ON r.code_parametre = sm.code_parametre
 AND r.statut = 'ACTIF'
GROUP BY source_parametre
HAVING COUNT(DISTINCT r.parametre_ref_id) <> 1;

-- Le SELECT ci-dessus doit retourner 0 ligne avant execution des UPDATE.

-- 3. Updates proposes, a executer seulement si validation explicite.
WITH safe_map(source_parametre, code_parametre) AS (
    VALUES
        ('COND','CONDUCTIVITE'), ('O2_DISSOUS','O2_DISS'), ('NO3','NO3-'), ('NO2','NO2-'),
        ('PO4','PO4_3-'), ('HCO3','HCO3-'), ('SATURATION_OXYGENE','SAT'), ('HG_MERCURE','HG')
),
target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM safe_map sm
    JOIN metadata.referentiel_parametre_canonique r ON r.code_parametre = sm.code_parametre AND r.statut='ACTIF'
)
UPDATE qualite.mesure_qualite_riviere q
SET parametre_ref_id = tr.parametre_ref_id
FROM target_ref tr
WHERE q.parametre_ref_id IS NULL
  AND q.parametre_qualite = tr.source_parametre;

WITH safe_map(source_parametre, code_parametre) AS (
    VALUES
        ('COND','CONDUCTIVITE'), ('O2_DISSOUS','O2_DISS'), ('NO3','NO3-'), ('NO2','NO2-'),
        ('PO4','PO4_3-'), ('HCO3','HCO3-'), ('SATURATION_OXYGENE','SAT'), ('HG_MERCURE','HG')
),
target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM safe_map sm
    JOIN metadata.referentiel_parametre_canonique r ON r.code_parametre = sm.code_parametre AND r.statut='ACTIF'
)
UPDATE qualite.mesure_qualite_nappe q
SET parametre_ref_id = tr.parametre_ref_id
FROM target_ref tr
WHERE q.parametre_ref_id IS NULL
  AND q.parametre_qualite = tr.source_parametre;

WITH safe_map(source_parametre, code_parametre) AS (
    VALUES
        ('Conductivité','CONDUCTIVITE'), ('O2_dissous','O2_DISS'), ('Nitrates','NO3-'),
        ('H_G','HUILES_GRAISSES'), ('Ammonium','NH4'), ('Turbidité','TURBIDITE')
),
target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM safe_map sm
    JOIN metadata.referentiel_parametre_canonique r ON r.code_parametre = sm.code_parametre AND r.statut='ACTIF'
)
UPDATE qualite.mesure_qualite_sebou q
SET parametre_ref_id = tr.parametre_ref_id
FROM target_ref tr
WHERE q.parametre_ref_id IS NULL
  AND q.parametre_qualite = tr.source_parametre;

WITH safe_map(source_parametre, code_parametre) AS (
    VALUES
        ('COND','CONDUCTIVITE'), ('O2_DISSOUS','O2_DISS'), ('PO4','PO4_3-'),
        ('NO3','NO3-'), ('HG_MERCURE','HG')
),
target_ref AS (
    SELECT sm.source_parametre, r.parametre_ref_id
    FROM safe_map sm
    JOIN metadata.referentiel_parametre_canonique r ON r.code_parametre = sm.code_parametre AND r.statut='ACTIF'
)
UPDATE qualite.suivi_qualite_barrage_garde_hebdo q
SET parametre_ref_id = tr.parametre_ref_id
FROM target_ref tr
WHERE q.parametre_ref_id IS NULL
  AND q.parametre_qualite = tr.source_parametre;

-- 4. Validation minimale dans transaction.
SELECT 'riviere_remaining_null' AS controle, COUNT(*) FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NULL
UNION ALL SELECT 'nappe_remaining_null', COUNT(*) FROM qualite.mesure_qualite_nappe WHERE parametre_ref_id IS NULL
UNION ALL SELECT 'sebou_remaining_null', COUNT(*) FROM qualite.mesure_qualite_sebou WHERE parametre_ref_id IS NULL
UNION ALL SELECT 'garde_remaining_null', COUNT(*) FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_ref_id IS NULL;

-- COMMIT a autoriser uniquement apres validation.
-- ROLLBACK;
```

## Estimation

Ce script corrigerait au maximum 50619 lignes sûres :

- riviere : 12677
- nappe : 10802
- Sebou : 26758
- garde hebdo : 382

