# 🧩 Documentation des Vues SQL

## 1. `api.v_station_dimension`

**Type** : Vue simple  
**Schéma** : `api`  
**Dépendances** : `infra.station_mesure`, `admin.organisme`, `admin.commune`, `admin.province`, `admin.region`, `geo.sous_bassin`, `geo.bassin_versant`  
**Refresh** : temps réel  
**Volumétrie estimée** : nombre de stations

### Objectif
- Centraliser les jointures station + référentiels.
- Réduire la duplication SQL côté API.
- Alimenter les endpoints de filtres et de cartographie.

### Colonnes principales
| Colonne | Type | Nullable | Description | Exemple | Logique |
|---|---|---|---|---|---|
| `station_id` | UUID | Non | identifiant station | `550e...` | PK logique |
| `code_station` | varchar | Oui | code métier | `HYD-001` | source station |
| `station_nom` | varchar | Non | nom station | `Sebou amont` | source station |
| `type_station` | varchar | Oui | type métier | `Hydrologique` | source station |
| `commune_nom` | varchar | Oui | commune | `Fes` | jointure admin |
| `sous_bassin_nom` | varchar | Oui | sous-bassin | `Inaouene` | intersection spatiale |
| `longitude` | double precision | Oui | longitude WGS84 | `-5.01` | `ST_X` |
| `latitude` | double precision | Oui | latitude WGS84 | `34.04` | `ST_Y` |

### Performance
- Très légère en volumétrie.
- Dépend d'un `ST_Intersects` sur `geo.sous_bassin`.
- Index nécessaires: GiST sur géométries, index station par commune/type.

### Maintenance
- `ANALYZE infra.station_mesure;`
- Vérifier la cohérence spatiale si une station ne remonte pas de sous-bassin.

## 2. `api.v_qualite_mesures_enrichies`

**Type** : Vue simple  
**Dépendances** : `qualite.campagne_mesure`, `qualite.resultat_analyse`, `admin.catalogue_parametre`, `qualite.norme_qualite`, `api.v_station_dimension`  
**Refresh** : temps réel  
**Volumétrie estimée** : nombre de résultats d'analyse

### Objectif
- Pré-calculer l'enrichissement métier des résultats qualité.
- Exposer directement `param_code`, unité, conformité et contexte géographique.

### Colonnes clés
| Colonne | Type | Nullable | Description | Exemple | Logique |
|---|---|---|---|---|---|
| `campagne_id` | UUID | Non | campagne de prélèvement | `550e...` | source campagne |
| `date_prelevement` | timestamptz | Non | date prélèvement | `2025-01-05T09:00:00Z` | source campagne |
| `param_code` | varchar | Non | code paramètre | `NO3` | jointure catalogue |
| `valeur` | numeric(10,4) | Oui | valeur mesurée | `12.5000` | source analyse |
| `valeur_imperative` | numeric(10,4) | Oui | seuil norme | `10.0000` | jointure norme |
| `statut_conformite` | text | Oui | conforme/non conforme | `non_conforme` | `CASE` |

### Requêtes lourdes à éviter
- scans complets sans filtre date
- agrégation sur plusieurs années sans `date_prelevement`

## 3. `api.ca_hydro_debit_day`

**Type** : Continuous Aggregate  
**Dépendances** : `hydro.mesure_debit`  
**Refresh** : toutes les 15 min recommandées  
**Volumétrie estimée** : `stations x jours`

### Objectif
- Accélérer les séries de débit agrégées quotidiennes.
- Réduire la charge CPU sur l'hypertable brute.

### Colonnes
| Colonne | Type | Nullable | Description | Exemple | Logique |
|---|---|---|---|---|---|
| `bucket_start` | timestamptz | Non | début bucket jour | `2025-01-01T00:00:00Z` | `time_bucket` |
| `station_id` | UUID | Non | station | `550e...` | group by |
| `measure_count` | bigint | Non | nombre de points | `24` | `COUNT(*)` |
| `valeur_avg` | double precision | Oui | débit moyen | `45.2` | `AVG(valeur)` |
| `valeur_min` | double precision | Oui | débit min | `12.0` | `MIN(valeur)` |
| `valeur_max` | double precision | Oui | débit max | `120.1` | `MAX(valeur)` |

### Script source
Voir [12_api_views.sql](../../db_scripts/12_api_views.sql).

### Maintenance
- Surveiller `timescaledb_information.jobs`
- Vérifier le retard de refresh
- Réindexer si dérive forte de performance

## 4. `api.ca_meteo_precip_day`

**Type** : Continuous Aggregate  
**Dépendances** : `meteo.mesure_precipitation`  
**Refresh** : 15 min  
**Usage** : Dashboard Climat

### Colonnes utiles
- `bucket_start`
- `station_id`
- `valeur_sum`
- `valeur_avg`
- `valeur_max`

## 5. `api.ca_meteo_temp_day`

**Type** : Continuous Aggregate  
**Dépendances** : `meteo.mesure_temperature`  
**Refresh** : 15 min  
**Usage** : Dashboard Climat

### Colonnes utiles
- `bucket_start`
- `station_id`
- `temp_moy_avg`
- `temp_min`
- `temp_max`

## 6. `api.ca_hydro_barrage_day`

**Type** : Continuous Aggregate  
**Dépendances** : `hydro.mesure_barrage`  
**Refresh** : 15 min  
**Usage** : indicateurs barrages

## 7. `api.mv_qualite_month`

**Type** : Vue matérialisée  
**Dépendances** : `api.v_qualite_mesures_enrichies`  
**Refresh** : horaire ou sur import qualité  
**Volumétrie estimée** : `stations x paramètres x mois`

### Objectif
- Accélérer les graphiques mensuels qualité.
- Pré-calculer compteurs et non-conformités.

### Maintenance
```sql
REFRESH MATERIALIZED VIEW api.mv_qualite_month;
ANALYZE api.mv_qualite_month;
```

## 8. `api.mv_station_latest_status`

**Type** : Vue matérialisée  
**Dépendances** : `api.v_station_dimension`, `api.v_qualite_mesures_enrichies`, `hydro.mesure_debit`, `meteo.mesure_precipitation`, `meteo.mesure_temperature`  
**Refresh** : 5 min recommandé  
**Usage** : carte, KPI globaux, statut stations

### Objectif
- Consolider le dernier état utile par station.
- Éviter plusieurs sous-requêtes côté API.

### Colonnes métiers
| Colonne | Description |
|---|---|
| `hydro_last_value` | dernier débit valide |
| `precip_last_value` | dernière précipitation |
| `temp_last_value` | dernière température moyenne |
| `azote_last_value` | dernier indicateur azote |
| `oxygene_last_value` | dernier indicateur oxygène |
| `phosphore_last_value` | dernier indicateur phosphore |
| `has_quality_alert` | présence d'au moins une non-conformité récente |

## 9. `api.v_station_status_geojson`

**Type** : Vue simple  
**Dépendances** : `api.mv_station_latest_status`  
**Refresh** : temps réel vis-à-vis de la vue matérialisée source  
**Usage** : `/api/v1/map/layers/quality-status`

### Commandes de maintenance
```sql
VACUUM ANALYZE infra.station_mesure;
VACUUM ANALYZE qualite.campagne_mesure;
VACUUM ANALYZE qualite.resultat_analyse;
REFRESH MATERIALIZED VIEW api.mv_qualite_month;
REFRESH MATERIALIZED VIEW api.mv_station_latest_status;
```

## Recommandations d'exploitation SQL

```sql
-- Vérification des jobs TimescaleDB
SELECT * FROM timescaledb_information.jobs;

-- Vérification des hypertables
SELECT * FROM timescaledb_information.hypertables;

-- Vérification des dimensions de chunks
SELECT * FROM timescaledb_information.chunks;
```
