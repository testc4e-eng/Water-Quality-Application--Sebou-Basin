# SQL validation post-correction

Requetes a executer apres correction, si la correction des mappings sûrs est validee.

```sql
-- 1. Volumes NULL restants par table.
SELECT 'qualite.mesure_qualite_riviere' AS table_name, COUNT(*) AS null_rows
FROM qualite.mesure_qualite_riviere
WHERE parametre_ref_id IS NULL
UNION ALL
SELECT 'qualite.mesure_qualite_nappe', COUNT(*)
FROM qualite.mesure_qualite_nappe
WHERE parametre_ref_id IS NULL
UNION ALL
SELECT 'qualite.mesure_qualite_sebou', COUNT(*)
FROM qualite.mesure_qualite_sebou
WHERE parametre_ref_id IS NULL
UNION ALL
SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', COUNT(*)
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE parametre_ref_id IS NULL;

-- 2. Top parametres restants non mappes.
WITH remaining AS (
    SELECT 'qualite.mesure_qualite_riviere' AS table_name, parametre_qualite
    FROM qualite.mesure_qualite_riviere
    WHERE parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_nappe', parametre_qualite
    FROM qualite.mesure_qualite_nappe
    WHERE parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_sebou', parametre_qualite
    FROM qualite.mesure_qualite_sebou
    WHERE parametre_ref_id IS NULL
    UNION ALL
    SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', parametre_qualite
    FROM qualite.suivi_qualite_barrage_garde_hebdo
    WHERE parametre_ref_id IS NULL
)
SELECT table_name, parametre_qualite, COUNT(*) AS rows
FROM remaining
GROUP BY table_name, parametre_qualite
ORDER BY rows DESC, table_name, parametre_qualite;

-- 3. Verification absence de FK orpheline logique.
WITH checked AS (
    SELECT 'qualite.mesure_qualite_riviere' AS table_name, q.parametre_ref_id
    FROM qualite.mesure_qualite_riviere q
    WHERE q.parametre_ref_id IS NOT NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_nappe', q.parametre_ref_id
    FROM qualite.mesure_qualite_nappe q
    WHERE q.parametre_ref_id IS NOT NULL
    UNION ALL
    SELECT 'qualite.mesure_qualite_sebou', q.parametre_ref_id
    FROM qualite.mesure_qualite_sebou q
    WHERE q.parametre_ref_id IS NOT NULL
    UNION ALL
    SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', q.parametre_ref_id
    FROM qualite.suivi_qualite_barrage_garde_hebdo q
    WHERE q.parametre_ref_id IS NOT NULL
)
SELECT table_name, COUNT(*) AS orphan_ref_rows
FROM checked c
LEFT JOIN metadata.referentiel_parametre_canonique r
  ON r.parametre_ref_id = c.parametre_ref_id
 AND r.statut = 'ACTIF'
WHERE r.parametre_ref_id IS NULL
GROUP BY table_name;

-- 4. Verification correction attendue.
-- Attendu apres mapping sûr :
-- riviere NULL restant : 4610
-- nappe NULL restant : 2468
-- Sebou NULL restant : 4519
-- garde NULL restant : 157
-- total restant : 11754
```

