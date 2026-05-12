# SQL read-only extraction

Toutes les requetes ci-dessous sont en lecture seule.

## Colonnes tables concernees

```sql
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE (table_schema, table_name) IN (
  ('qualite','suivi_qualite_barrage_garde_hebdo'),
  ('qualite','mesure_qualite_nappe')
)
ORDER BY table_schema, table_name, ordinal_position;
```

## Extraction MO_METAL

La demande initiale mentionnait `date_mesure`; la colonne reelle de la table cible est `temps`.

```sql
SELECT *
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE parametre_ref_id IS NULL
  AND upper(trim(parametre_qualite)) = 'MO_METAL'
ORDER BY temps NULLS LAST;
```

## Extraction NUMEROTATION

```sql
SELECT *
FROM qualite.mesure_qualite_nappe
WHERE parametre_ref_id IS NULL
  AND upper(trim(parametre_qualite)) = 'NUMEROTATION'
ORDER BY temps NULLS LAST, source_row_id NULLS LAST;
```

## Statistiques MO_METAL

```sql
SELECT
  count(*) AS volume,
  min(temps) AS date_min,
  max(temps) AS date_max,
  count(DISTINCT station_id) AS stations_distinctes,
  count(DISTINCT ire_station) AS ire_station_distincts,
  count(DISTINCT barrage_id) AS barrages_distincts,
  count(DISTINCT valeur) AS valeurs_distinctes,
  min(valeur) AS valeur_min,
  max(valeur) AS valeur_max,
  count(*) FILTER (WHERE valeur IS NULL) AS valeurs_nulles,
  count(*) FILTER (WHERE observation IS NOT NULL AND trim(observation) <> '') AS observations_non_vides
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE parametre_ref_id IS NULL
  AND upper(trim(parametre_qualite)) = 'MO_METAL';
```

## Statistiques NUMEROTATION

```sql
SELECT
  count(*) AS volume,
  min(temps) AS date_min,
  max(temps) AS date_max,
  count(DISTINCT station_id) AS stations_distinctes,
  count(DISTINCT ire_station) AS ire_station_distincts,
  count(DISTINCT nappe_id) AS nappes_distinctes,
  count(DISTINCT code_nappe) AS codes_nappe_distincts,
  count(DISTINCT valeur) AS valeurs_distinctes,
  min(valeur) AS valeur_min,
  max(valeur) AS valeur_max,
  count(*) FILTER (WHERE valeur IS NULL) AS valeurs_nulles
FROM qualite.mesure_qualite_nappe
WHERE parametre_ref_id IS NULL
  AND upper(trim(parametre_qualite)) = 'NUMEROTATION';
```

## Contexte GEO

```sql
WITH mo AS (
  SELECT DISTINCT station_id, ire_station, barrage_id
  FROM qualite.suivi_qualite_barrage_garde_hebdo
  WHERE parametre_ref_id IS NULL
    AND upper(trim(parametre_qualite)) = 'MO_METAL'
), num AS (
  SELECT DISTINCT station_id, ire_station, nappe_id, code_nappe
  FROM qualite.mesure_qualite_nappe
  WHERE parametre_ref_id IS NULL
    AND upper(trim(parametre_qualite)) = 'NUMEROTATION'
)
SELECT 'MO_METAL station' AS contexte, mo.station_id, mo.ire_station,
       ms.legacy_station_id, s.nom_station, s.type_station, s.code_ressource, s.coord_x, s.coord_y, s.etat
FROM mo
LEFT JOIN metadata.mapping_station ms ON ms.station_id = mo.station_id
LEFT JOIN infra.stations s ON s.id_station = ms.legacy_station_id::integer
UNION ALL
SELECT 'NUMEROTATION station' AS contexte, num.station_id, num.ire_station,
       ms.legacy_station_id, s.nom_station, s.type_station, s.code_ressource, s.coord_x, s.coord_y, s.etat
FROM num
LEFT JOIN metadata.mapping_station ms ON ms.station_id = num.station_id
LEFT JOIN infra.stations s ON s.id_station = ms.legacy_station_id::integer;
```

## Source brute liee

```sql
SELECT q.temps::date, q.source_row_id, q.ire_station, s.nom_station, b.nom_barrage,
       q.milieu_prelevement, q.parametre_qualite, r.parametre_qualite AS raw_parametre,
       q.valeur, q.observation, q.pas_temps, q.source_system
FROM qualite.suivi_qualite_barrage_garde_hebdo q
LEFT JOIN staging.raw_suivi_qualite_brg_garde_hebdo r ON r.id = q.source_row_id
LEFT JOIN metadata.mapping_station ms ON ms.station_id = q.station_id
LEFT JOIN infra.stations s ON s.id_station = ms.legacy_station_id::integer
LEFT JOIN metadata.mapping_barrage mb ON mb.barrage_id = q.barrage_id
LEFT JOIN infra.barrages b ON b.id = mb.legacy_barrage_id
WHERE q.parametre_ref_id IS NULL
  AND upper(trim(q.parametre_qualite)) = 'MO_METAL'
ORDER BY q.temps NULLS LAST, q.source_row_id NULLS LAST;

SELECT q.temps::date, q.source_row_id, q.ire_station, s.nom_station,
       q.nappe_id, q.code_nappe, q.parametre_qualite, r.parametre_qualite AS raw_parametre,
       q.valeur, q.pas_temps, q.qa_flag_nappe_unmapped, q.source_system
FROM qualite.mesure_qualite_nappe q
LEFT JOIN staging.raw_mesures_qualite_nappes r ON r.id = q.source_row_id
LEFT JOIN metadata.mapping_station ms ON ms.station_id = q.station_id
LEFT JOIN infra.stations s ON s.id_station = ms.legacy_station_id::integer
WHERE q.parametre_ref_id IS NULL
  AND upper(trim(q.parametre_qualite)) = 'NUMEROTATION'
ORDER BY q.temps NULLS LAST, q.source_row_id NULLS LAST;
```
