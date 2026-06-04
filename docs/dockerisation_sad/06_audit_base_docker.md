# Audit read-only de la base Docker `sad-db`

## Perimetre

- Base inspectee : `abh_sad` dans le conteneur Docker `sad-db`
- Mode d'inspection : read-only uniquement
- Commandes autorisees et utilisees :
  - `SELECT`
  - `information_schema`
  - `pg_catalog`
  - introspection psql equivalente a `\dt` et `\dv`

## Commandes executees

```powershell
docker compose exec -T sad-db psql -U sad_user -d abh_sad -c "SELECT extname, extversion FROM pg_extension ORDER BY extname;"
docker compose exec -T sad-db psql -U sad_user -d abh_sad -c "SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;"
docker compose exec -T sad-db psql -U sad_user -d abh_sad -c "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema') ORDER BY table_schema, table_name;"
docker compose exec -T sad-db psql -U sad_user -d abh_sad -c "SELECT table_schema, table_name FROM information_schema.views WHERE table_schema NOT IN ('pg_catalog','information_schema') ORDER BY table_schema, table_name;"
docker compose exec -T sad-db psql -U sad_user -d abh_sad -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('api','qualite','infra','hydro','meteo','analytics','metadata','geo','wasp_output') ORDER BY schema_name;"
docker compose exec -T sad-db psql -U sad_user -d abh_sad -c "SELECT n.nspname AS schema_name, c.relkind, c.relname AS object_name FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname IN ('api','qualite','infra','hydro','meteo','analytics','metadata','geo','wasp_output') ORDER BY n.nspname, c.relkind, c.relname;"
docker compose exec -T sad-db psql -U sad_user -d abh_sad -c "SELECT postgis_full_version();"
```

## Extensions

| Extension | Statut |
|---|---|
| `plpgsql` | presente |
| `postgis` | presente |
| `postgis_tiger_geocoder` | presente |
| `postgis_topology` | presente |
| `fuzzystrmatch` | presente |

Version PostGIS observee :

```text
POSTGIS="3.4.3" PGSQL="160" ... TOPOLOGY
```

## Schemas existants

### Schemas detectes

- `public`
- `tiger`
- `tiger_data`
- `topology`
- schemas systeme PostgreSQL

### Schemas applicatifs attendus mais absents

- `api`
- `analytics`
- `geo`
- `hydro`
- `infra`
- `metadata`
- `meteo`
- `qualite`
- `wasp_output`
- `swat_output`

## Tables existantes

La base Docker ne contient que les tables techniques PostGIS par defaut :

- tables `tiger.*`
- tables `topology.*`
- quelques tables `public.*` liees a PostGIS

Aucune table metier du SAD n'est presente dans :

- `infra`
- `hydro`
- `meteo`
- `qualite`
- `metadata`
- `geo`

## Vues existantes

Seules les vues PostGIS techniques suivantes sont presentes :

- `public.geometry_columns`
- `public.geography_columns`

Aucune vue ou vue materialisee metier n'est presente dans :

- `api`
- `analytics`
- `metadata`

## Objets dans les schemas cibles

### Schema `api`

- absent

### Schema `qualite`

- absent

### Schema `infra`

- absent

### Schema `hydro`

- absent

### Schema `meteo`

- absent

### Schema `analytics`

- absent

### Schema `metadata`

- absent

### Schema `geo`

- absent

## Ecart avec la documentation projet

La documentation maitre du projet decrit une base `abh_sad` riche et structuree avec :

- schemas applicatifs complets
- vues `api.*`
- materialized views `analytics.*`
- tables metier `infra`, `hydro`, `meteo`, `qualite`

La base Docker observee n'est donc pas incoherente techniquement avec Docker, mais incomplete fonctionnellement par rapport au contrat applicatif documente.

## Conclusion

Le socle Docker a valide la conteneurisation, pas l'initialisation metier. Tant qu'aucun jeu minimal de schemas, vues et tables de demonstration n'est cree dans `sad-db`, les routes qui requierent des objets SQL metier continueront a retourner des 404/500.
