# Requetes diagnostic read-only

## Bloc 1

```sql
SELECT 'rq_riviere_param_ref_null' AS diagnostic, COUNT(*)::bigint AS volume
FROM qualite.mesure_qualite_riviere
WHERE parametre_ref_id IS NULL;

SELECT parametre_qualite, COUNT(*) AS n
FROM qualite.mesure_qualite_riviere
WHERE parametre_ref_id IS NULL
GROUP BY parametre_qualite
ORDER BY n DESC;

SELECT code_parametre, nom_parametre, domaine
FROM metadata.referentiel_parametre_canonique
WHERE statut='ACTIF'
  AND NULLIF(TRIM(unite_reference),'') IS NULL;
```

## Bloc 2

```sql
SELECT COUNT(*) FROM meteo.mesure_evaporation WHERE valeur IS NULL;

SELECT valeur_raw, valeur_qualifier, COUNT(*)
FROM qualite.source_pollution_mesure_param
WHERE valeur_num IS NULL
GROUP BY valeur_raw, valeur_qualifier;

SELECT COUNT(*) FROM hydro.mesure_debit WHERE valeur < 0;
SELECT COUNT(*) FROM meteo.mesure_temperature;
```

## Bloc 3

```sql
SELECT COUNT(*) FROM metadata.mapping_nappe_unresolved_qualite_nappes;
SELECT COUNT(*) FROM metadata.mapping_point_eau_unresolved_nappe;
SELECT COUNT(*) FROM metadata.mapping_point_eau_unresolved_station;
SELECT COUNT(*) FROM metadata.mapping_profil_unresolved_nappe;
SELECT COUNT(*) FROM qualite.source_pollution_prelevement WHERE geom IS NULL;
```

## Bloc 4

```sql
SELECT COUNT(*) FROM swat_output.mesure_qualite_subbasin_ts;
SELECT COUNT(*) FROM wasp_output.mesure_qualite_segment_ts;
SELECT COUNT(*) FROM swat_output.ref_scenario;
SELECT COUNT(DISTINCT scenario_code) FROM wasp_output.ref_run_modele;

SELECT code_parametre, COUNT(*) AS duplicate_groups
FROM (
    SELECT code_parametre, run_id, reseau_id, bucket_day, COUNT(*) n
    FROM wasp_output.mesure_qualite_segment_ts
    GROUP BY 1,2,3,4
    HAVING COUNT(*) > 1
) d
GROUP BY code_parametre;
```

## Garantie

Toutes les requetes executees dans cette premiere passe sont des `SELECT`.

