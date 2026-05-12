# Statistiques valeurs MO_METAL

## Synthese

| Indicateur | Resultat |
|---|---:|
| lignes | 11 |
| `parametre_ref_id IS NULL` | 11 |
| valeurs nulles | 0 |
| stations distinctes | 1 |
| barrages distincts | 1 |
| date min | 2024-11-20 |
| date max | 2025-09-08 |
| valeur min | 0.01 |
| valeur max | 0.01 |
| observation unique | `<0.010` |

## Contexte station / barrage

| Champ | Valeur |
|---|---|
| `station_id` | `4179b4bb-277c-4b29-80fa-300fd49eb9c2` |
| `barrage_id` | `4179b4bb-277c-4b29-80fa-300fd49eb9c2` |
| `ire_station` | `3323/8` |
| station infra | `brg de garde / sebou` |
| barrage infra | `garde du sebou` |
| milieu prelevement | `Surface` |

## Exemples

| Date | Valeur | Observation | Source row id |
|---|---:|---|---:|
| 2024-11-20 | 0.01 | `<0.010` | 1824 |
| 2024-12-11 | 0.01 | `<0.010` | 1941 |
| 2025-01-08 | 0.01 | `<0.010` | 2097 |
| 2025-02-10 | 0.01 | `<0.010` | 2292 |
| 2025-03-13 | 0.01 | `<0.010` | 2448 |
| 2025-04-14 | 0.01 | `<0.010` | 2643 |
| 2025-05-12 | 0.01 | `<0.010` | 2799 |
| 2025-06-09 | 0.01 | `<0.010` | 2955 |
| 2025-07-15 | 0.01 | `<0.010` | 3147 |
| 2025-08-11 | 0.01 | `<0.010` | 3302 |
| 2025-09-08 | 0.01 | `<0.010` | 3458 |

## Requete SELECT utilisee

```sql
SELECT
    COUNT(*) AS total_mo_metal,
    COUNT(*) FILTER (WHERE parametre_ref_id IS NULL) AS null_ref,
    COUNT(*) FILTER (WHERE valeur IS NULL) AS null_value,
    COUNT(DISTINCT station_id) AS stations,
    COUNT(DISTINCT barrage_id) AS barrages,
    MIN(temps)::date AS min_date,
    MAX(temps)::date AS max_date,
    MIN(valeur) AS min_valeur,
    MAX(valeur) AS max_valeur,
    string_agg(DISTINCT COALESCE(observation,''), ' | ') AS observations
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE upper(parametre_qualite)='MO_METAL';
```

