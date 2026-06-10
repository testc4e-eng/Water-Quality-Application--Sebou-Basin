# MVP3-D - Extension controlee vers INFRA et POLLUTION

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'implementation et de preuves |
| Date | 2026-06-05 |
| Decision | `114_MVP3_D_STATUS = INFRA_POLLUTION_EXTENSION_ACTIVE` |

## Contexte

Le module `114_data_admin_ingestion` etait stabilise jusqu'a `MVP3-C` pour les classes :

- `HYDRO_DEBIT`
- `METEO_PRECIPITATION`
- `QUALITE_RIVIERE`

L'objectif de `MVP3-D` etait d'etendre le meme flux controle a :

- `INFRA_STATION`
- `POLLUTION_SITE`

sans activer `UPSERT`, `UPDATE_EXISTING`, `DELETE` libre, `MERGE`, auto-fusion IDP ou creation automatique de `source_link`.

## Audit DB prealable

Verification sur `abh_sad` :

### `infra.stations_mesure`

- `geom` : `POINT`, `SRID 4326`, `NOT NULL`
- colonnes non nulles sans defaut :
  - `nom`
  - `geom`
- `id` est genere par defaut (`uuid_generate_v4()`)

### `geo.ref_site_pollution`

- `geom` : `POINT`, `SRID 26191`, `NOT NULL`
- `geom_4326` : `POINT`, `SRID 4326`, nullable
- colonnes non nulles sans defaut :
  - `source_origin`
  - `geom`
- `site_id` est genere par defaut (`gen_random_uuid()`)
- garde IDP verifiee :
  - `75` sites `site_code LIKE 'IDP-C1B-%'`

Conclusion audit :

- `INFRA_STATION` : mapping promotion fiable
- `POLLUTION_SITE` : mapping promotion fiable si :
  - `source_origin` est force cote `data_admin`
  - la geometie source est normalisee depuis `geom_wkt + srid`
  - `target_pk` de rollback repose sur `site_id` retourne par la base, pas sur `site_code`

## Evolutions appliquees

### Registre de champs

Script execute :

- `backend/sql/2026_06_data_admin_field_registry_seed.sql`

Resultat :

- `INFRA_STATION` : `7` champs
  - `code_station`
  - `nom`
  - `type_station`
  - `altitude_m`
  - `date_mise_service`
  - `geom_wkt`
  - `srid`
- `POLLUTION_SITE` : `8` champs
  - `site_code`
  - `site_name`
  - `commune`
  - `province`
  - `bassin`
  - `validation_status`
  - `geom_wkt`
  - `srid`

### Regles dynamiques geospatiales

Script execute :

- `backend/sql/2026_06_data_admin_dynamic_validation_rules_seed.sql`

Regles ajoutees :

- `INFRA_STATION`
  - `INFRA_STATION_CODE_UNIQUE`
  - `INFRA_GEOM_WKT_VALID`
  - `INFRA_SRID_ALLOWED`
  - `INFRA_GEOM_NOT_EMPTY`
  - `INFRA_GEOM_WITHIN_MOROCCO_BOUNDS`
- `POLLUTION_SITE`
  - `POLLUTION_SITE_CODE_UNIQUE`
  - `POLLUTION_GEOM_WKT_VALID`
  - `POLLUTION_SRID_ALLOWED`
  - `POLLUTION_GEOM_NOT_EMPTY`
  - `POLLUTION_GEOM_WITHIN_MOROCCO_BOUNDS`
  - `POLLUTION_GEOMETRY_DUPLICATE_WARNING`

### Normalisation et promotion

Le backend accepte maintenant :

- `geom_wkt`
- `srid`

et produit une ecriture controlee :

- `INFRA_STATION`
  - `geom = ST_Transform(ST_GeomFromText(geom_wkt, srid), 4326)`
- `POLLUTION_SITE`
  - `geom = ST_Transform(ST_GeomFromText(geom_wkt, srid), 26191)`
  - `geom_4326 = ST_Transform(ST_GeomFromText(geom_wkt, srid), 4326)`
  - `source_origin = 'data_admin_mvp3d'`

Protection IDP explicite :

- `site_code LIKE 'IDP-C1B-%'` refuse en validation metier
- aucune ecriture dans `geo.ref_site_pollution_source_link`
- aucune fusion automatique

## Preuves d'execution

### Compteurs de registre

- `data_admin.field_registry` = `41`
- `data_admin.validation_rule_registry` = `24`

### Canevas

Specs confirmees :

- `INFRA_STATION`
  - `code_station, nom, type_station, altitude_m, date_mise_service, geom_wkt, srid`
- `POLLUTION_SITE`
  - `site_code, site_name, commune, province, bassin, validation_status, geom_wkt, srid`

### Upload / validation / staging

Cas verifies :

- `INFRA_STATION_invalid_geom.csv`
  - `run_status = VALIDATION_FAILED`
  - erreurs : `GEOM_WKT_VALID`, `GEOM_NOT_EMPTY`, `GEOM_WITHIN_MOROCCO_BOUNDS`
- `POLLUTION_SITE_invalid_srid.csv`
  - `run_status = VALIDATION_FAILED`
  - erreurs : `INVALID_SRID`, `GEOM_SRID_ALLOWED`, `GEOM_WITHIN_MOROCCO_BOUNDS`
- `POLLUTION_SITE_duplicate_geom.csv`
  - `run_status = VALIDATED_WITH_WARNINGS`
  - warning : `POLLUTION_GEOMETRY_DUPLICATE_WARNING`
- `INFRA_STATION_valid.csv`
  - `run_status = STAGED`
- `POLLUTION_SITE_valid.csv`
  - `run_status = STAGED`

### Promotion et rollback

Campagne nominale `INFRA_STATION` :

- cardinalite avant : `390`
- apres apply : `392`
- apres rollback : `390`
- delta net : `0`

Campagne nominale `POLLUTION_SITE` :

- cardinalite avant : `2026`
- apres apply : `2028`
- apres rollback : `2026`
- delta net : `0`

### Non-regression IDP

Controles verifies :

- `geo.ref_site_pollution_source_link` = `105`
- `site_code LIKE 'IDP-C1B-%'` = `75`

Interpretation :

- `NO_IDP_REGRESSION = CONFIRMED`
- `NO_AUTO_MERGE = CONFIRMED`
- `NO_AUTOMATIC_SOURCE_LINK = CONFIRMED`

## Decision finale

```text
114_MVP3_D_STATUS = INFRA_POLLUTION_EXTENSION_ACTIVE

INFRA_STATION = INSERT_ONLY_PROMOTION_ACTIVE
POLLUTION_SITE = INSERT_ONLY_PROMOTION_ACTIVE

NO_IDP_REGRESSION = CONFIRMED
NO_AUTO_MERGE = CONFIRMED
NO_AUTOMATIC_SOURCE_LINK = CONFIRMED
```

## Limites restantes

- `INSERT_ONLY` uniquement
- pas de `UPSERT`
- pas de `UPDATE_EXISTING`
- pas de `DELETE` libre
- `RBAC_SIMULATED` toujours en place
- pas d'extension `INFRA_BARRAGE`
- pas d'extension `SWAT/WASP/REALTIME`

## Prochaine etape recommandee

```text
114_MVP4_RBAC_REEL_ET_CONTRATS_OPERATEURS
```

ou, si la priorite reste metier :

```text
114_MVP3_E_EXTEND_TO_INFRA_BARRAGE
```
