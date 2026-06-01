# SQL read-only audit temporalité

## Règle

Toutes les requêtes ci-dessous sont strictement en lecture seule.

## 1. Profil de base par table

```sql
SELECT
  'meteo.mesure_precipitation' AS table_name,
  MIN(temps) AS date_min,
  MAX(temps) AS date_max,
  COUNT(*) AS volume_total,
  MAX(temps) AS derniere_valeur,
  COUNT(*) FILTER (WHERE temps >= NOW() - INTERVAL '30 days') AS volume_30j,
  COUNT(*) FILTER (WHERE temps >= NOW() - INTERVAL '90 days') AS volume_90j,
  COUNT(*) FILTER (WHERE temps >= NOW() - INTERVAL '365 days') AS volume_365j
FROM meteo.mesure_precipitation;
```

Dupliquer pour :

- `meteo.mesure_evaporation`
- `hydro.mesure_debit`
- `hydro.mesure_barrage_param`
- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_sebou`
- `qualite.suivi_qualite_barrage_garde_hebdo`

## 2. Fréquence dominante

```sql
WITH diffs AS (
  SELECT
    station_id,
    temps,
    LEAD(temps) OVER (PARTITION BY station_id ORDER BY temps) - temps AS delta
  FROM hydro.mesure_debit
)
SELECT
  delta,
  COUNT(*) AS nb
FROM diffs
WHERE delta IS NOT NULL
GROUP BY delta
ORDER BY nb DESC
LIMIT 20;
```

## 3. Trous temporels

```sql
WITH diffs AS (
  SELECT
    station_id,
    temps,
    LEAD(temps) OVER (PARTITION BY station_id ORDER BY temps) AS next_temps
  FROM meteo.mesure_precipitation
)
SELECT
  station_id,
  temps,
  next_temps,
  next_temps - temps AS gap
FROM diffs
WHERE next_temps IS NOT NULL
  AND next_temps - temps > INTERVAL '7 days'
ORDER BY gap DESC
LIMIT 200;
```

## 4. Histogramme mensuel

```sql
SELECT
  date_trunc('month', temps) AS mois,
  COUNT(*) AS nb
FROM hydro.mesure_barrage_param
GROUP BY 1
ORDER BY 1;
```

## 5. Récent vs archive

```sql
SELECT
  COUNT(*) FILTER (WHERE temps >= NOW() - INTERVAL '12 months') AS recent,
  COUNT(*) FILTER (WHERE temps <  NOW() - INTERVAL '12 months'
                   AND temps >= NOW() - INTERVAL '5 years') AS moyen_terme,
  COUNT(*) FILTER (WHERE temps < NOW() - INTERVAL '5 years') AS historique_archive
FROM qualite.mesure_qualite_riviere;
```

## 6. Pollution / IDP

```sql
SELECT
  MIN(date_reception) AS date_min,
  MAX(date_reception) AS date_max,
  COUNT(*) AS nb_constats
FROM qualite.source_pollution_prelevement;
```

```sql
SELECT
  MIN(p.date_reception) AS date_min,
  MAX(p.date_reception) AS date_max,
  COUNT(*) AS nb_mesures
FROM qualite.source_pollution_mesure_param m
JOIN qualite.source_pollution_prelevement p
  ON p.id = m.prelevement_id;
```

## 7. SWAT / WASP

```sql
SELECT
  scenario_id,
  MIN(date) AS date_min,
  MAX(date) AS date_max,
  COUNT(*) AS volume
FROM wasp_sebou.wasp_results
GROUP BY scenario_id
ORDER BY volume DESC;
```

## 8. Vue consolidée d'audit à exécuter manuellement

```sql
WITH audit AS (
  SELECT 'meteo.mesure_precipitation' AS table_name, MIN(temps) AS date_min, MAX(temps) AS date_max, COUNT(*) AS volume FROM meteo.mesure_precipitation
  UNION ALL
  SELECT 'meteo.mesure_evaporation', MIN(temps), MAX(temps), COUNT(*) FROM meteo.mesure_evaporation
  UNION ALL
  SELECT 'hydro.mesure_debit', MIN(temps), MAX(temps), COUNT(*) FROM hydro.mesure_debit
  UNION ALL
  SELECT 'hydro.mesure_barrage_param', MIN(temps), MAX(temps), COUNT(*) FROM hydro.mesure_barrage_param
)
SELECT * FROM audit ORDER BY table_name;
```
