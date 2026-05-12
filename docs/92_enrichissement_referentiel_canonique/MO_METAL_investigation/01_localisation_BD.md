# Localisation BD

## Resultat

`MO_METAL` est localise uniquement dans :

| Schema | Table | Colonne | Volume |
|---|---|---|---:|
| `qualite` | `suivi_qualite_barrage_garde_hebdo` | `parametre_qualite` | 11 |

Recherche executee sur les tables finales et sources principales avec colonne `parametre_qualite`.

## Requetes SELECT utilisees

```sql
SELECT table_schema, table_name, column_name
FROM information_schema.columns
WHERE table_schema IN ('qualite','staging','metadata')
  AND lower(column_name) LIKE '%param%'
ORDER BY table_schema, table_name, ordinal_position;
```

```sql
WITH hits AS (
    SELECT 'qualite.mesure_qualite_riviere' AS table_name, COUNT(*) AS rows
    FROM qualite.mesure_qualite_riviere
    WHERE upper(parametre_qualite)='MO_METAL'
    UNION ALL
    SELECT 'qualite.mesure_qualite_nappe', COUNT(*)
    FROM qualite.mesure_qualite_nappe
    WHERE upper(parametre_qualite)='MO_METAL'
    UNION ALL
    SELECT 'qualite.mesure_qualite_sebou', COUNT(*)
    FROM qualite.mesure_qualite_sebou
    WHERE upper(parametre_qualite)='MO_METAL'
    UNION ALL
    SELECT 'qualite.suivi_qualite_barrage_garde_hebdo', COUNT(*)
    FROM qualite.suivi_qualite_barrage_garde_hebdo
    WHERE upper(parametre_qualite)='MO_METAL'
    UNION ALL
    SELECT 'staging.raw_suivi_qualite_brg_garde_hebdo', COUNT(*)
    FROM staging.raw_suivi_qualite_brg_garde_hebdo
    WHERE upper(parametre_qualite)='MO_METAL'
)
SELECT table_name, rows
FROM hits
WHERE rows > 0
ORDER BY table_name;
```

## Observation

Aucune occurrence n'a ete trouvee dans `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_sebou`, `qualite.mesure_qualite_barrage` ni dans les tables staging controlees.

