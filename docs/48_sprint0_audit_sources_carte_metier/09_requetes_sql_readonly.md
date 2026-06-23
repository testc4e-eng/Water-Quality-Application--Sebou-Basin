# 9. Requêtes SQL Read-Only d'Exemple

Ces requêtes devront inspirer le backend pour la génération des contrats d'API.

## Exemple : Calculer la matrice `availability` pour la qualité
```sql
SELECT 
    'STATION_QUALITE' as support_type,
    'QUALITE' as domain,
    'PHYSICO_CHIMIE' as subdomain,
    trim(m.parametre_qualite) as parameter_code,
    ref.nom_parametre as parameter_label,
    ref.unite as unit,
    count(DISTINCT m.station_id) as object_count,
    count(m.*) as measure_count,
    min(m.temps::date) as date_min,
    max(m.temps::date) as date_max,
    true as has_geometry,
    true as has_timeseries,
    (seuil.id IS NOT NULL) as has_thresholds
FROM qualite.mesure_qualite_riviere m
JOIN infra.stations_mesure s ON s.id = m.station_id
LEFT JOIN metadata.referentiel_parametre ref ON ref.id = m.parametre_ref_id
LEFT JOIN metadata.qualite_seuil_reglementaire seuil ON seuil.parametre_ref_id = ref.id
WHERE s.geom IS NOT NULL
GROUP BY 1, 2, 3, 4, 5, 6, 11, 12, 13;
```

## Exemple : Requête `AnalyticalSeries` (Débit mensuel)
```sql
SELECT 
    station_id as object_id,
    date_trunc('month', temps) as date,
    avg(valeur) as value
FROM hydro.mesure_debit
WHERE station_id = :id
  AND temps >= :date_start AND temps <= :date_end
GROUP BY 1, 2
ORDER BY 2 ASC;
```
