# PUBLIC_SCHEMA_DEPENDENCY_REPORT

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit code + BD |
| Snapshot | 2026-06-04 |
| Source primaire | `abh_sad`, `backend/app`, `frontend/src` |

## Resume executif

Le schema `public` n'est plus un schema de donnees applicatives dans `abh_sad`.

Preuves BD :

```sql
SELECT c.relkind, c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'v', 'm')
ORDER BY c.relkind, c.relname;
```

Resultat verifie :

- table : `spatial_ref_sys`
- vues PostGIS : `geography_columns`, `geometry_columns`, `raster_columns`, `raster_overviews`
- aucune table metier `public.stations_abhs`, `public.barrages_abhs`, `public.mesures_qualite_rivieres`, etc.

## Verification runtime en base

```sql
SELECT table_schema, table_name
FROM information_schema.views
WHERE view_definition ILIKE '%public.%'
   OR view_definition ILIKE '%stations_abhs%'
   OR view_definition ILIKE '%barrages_abhs%'
   OR view_definition ILIKE '%mesures_qualite_rivieres%';

SELECT schemaname, matviewname
FROM pg_matviews
WHERE definition ILIKE '%public.%'
   OR definition ILIKE '%stations_abhs%'
   OR definition ILIKE '%barrages_abhs%'
   OR definition ILIKE '%mesures_qualite_rivieres%';
```

Resultat verifie :

- `0` vue applicative dependante ;
- `0` vue materialisee applicative dependante.

## Pivot runtime moderne confirme

```sql
SELECT definition
FROM pg_views
WHERE schemaname = 'api'
  AND viewname = 'v_station_dimension';
```

Definition verifiee :

- source : `infra.stations_mesure`
- mapping : `metadata.mapping_station`
- enrichissement spatial : `geo.sous_bassin_abh`, `geo.bassin_versant`
- aucune reference `public.*`

## Classification des dependances

| Objet | Preuve | Classification | Motif |
|---|---|---|---|
| `backend/app/util_dbmeta.py` | lecture de `public.geometry_columns` | `LOW` | dependance PostGIS systeme, pas une dette de donnees metier |
| `backend/app/api/v1/stations.py` | fallback sur `api.v_station_dimension` ; pas de `public.*` dans le fichier | `LOW` | runtime moderne, plus de dependance legacy directe |
| `backend/app/api/v1/measurements.py` | `STATIONS_TABLE=api.v_station_dimension`, `TBL_QUAL=qualite.mesure_qualite_riviere` | `LOW` | runtime moderne, plus de `public.mesures_qualite_rivieres` |
| `backend/app/api/v1/geojson.py` | couches resolues via `api.*`, `geo.*`, `infra.*` | `LOW` | runtime moderne, public purge deja appliquee |
| `backend/app/api/api_v1.py` | routeur principal monte sous `/api/v1` | `LOW` | ne monte pas les routeurs legacy `public.*` |
| `backend/app/api/v1/api_router.py` | assembleur alternatif montant `legacy_router` `/catalog` | `MEDIUM` | non monte aujourd'hui, mais peut reintroduire des chemins legacy si reutilise sans audit |
| `backend/app/routers/api.py` | SQL direct vers `public.stations_abhs`, `public.barrages_abhs` | `MEDIUM` | code legacy non monte ; dette de purge |
| `backend/app/routers/catalog.py` | SQL direct vers `public.*` | `MEDIUM` | code legacy non monte ; dette de purge |
| `backend/app/routers/geojson.py` | catalogue direct `public.*` | `MEDIUM` | code legacy non monte ; dette de purge |
| `backend/app/routers/measurements.py` | SQL direct vers `public.mesures_qualite_rivieres` | `MEDIUM` | code legacy non monte ; dette de purge |
| `backend/app/routers/objects.py` | SQL direct vers `public.stations_abhs`, `public.barrages_abhs` | `MEDIUM` | code legacy non monte ; dette de purge |
| `backend/app/routers/stations.py` | SQL direct vers `public.stations_abhs` | `MEDIUM` | code legacy non monte ; dette de purge |
| `backend/app/api/v1/swat_analysis.py` | commentaire historique sur `public.mesures_debit_jr` | `LOW` | commentaire documentaire, pas dependance runtime |

## Fichiers inspectes

- `backend/app/main.py`
- `backend/app/api/api_v1.py`
- `backend/app/api/v1/stations.py`
- `backend/app/api/v1/measurements.py`
- `backend/app/api/v1/geojson.py`
- `backend/app/api/v1/api_router.py`
- `backend/app/routers/api.py`
- `backend/app/routers/catalog.py`
- `backend/app/routers/geojson.py`
- `backend/app/routers/measurements.py`
- `backend/app/routers/objects.py`
- `backend/app/routers/stations.py`
- `backend/app/util_dbmeta.py`

## Verdict

```text
PUBLIC_SCHEMA_DEPENDENCY_REPORT = PUBLIC_LEGACY_RUNTIME_SAFE
```

Interpretation :

- aucune dependance `public.*` critique n'a ete constatee dans la chaine runtime principale montee sous `/api/v1` ;
- les six routeurs legacy non montes ciblant `public.*` ont ete deplaces dans `backend/app/routers_legacy_public/` ;
- l'assembleur alternatif `backend/app/api/v1/api_router.py` est maintenant marque explicitement `LEGACY / NON-RUNTIME ROUTER ASSEMBLER`.

## Priorisation de purge

1. supprimer ou archiver les routeurs legacy non montes de `backend/app/routers/*` qui ciblent `public.*` ;
2. retirer l'assembleur alternatif `backend/app/api/v1/api_router.py` ou le documenter explicitement comme non utilise ;
3. conserver `public.geometry_columns` comme dependance PostGIS systeme legitime.

## Execution P0-1 realisee

Routeurs deplaces vers `backend/app/routers_legacy_public/` :

- `api.py`
- `catalog.py`
- `geojson.py`
- `measurements.py`
- `objects.py`
- `stations.py`

Controles de validation executes :

```bash
python -m compileall backend/app
rg -n "from app\.routers import|app\.routers\.api|app\.routers\.catalog|app\.routers\.geojson|app\.routers\.measurements|app\.routers\.objects|app\.routers\.stations" backend/app
rg -n "public\.|stations_abhs|barrages_abhs|mesures_qualite_rivieres|mesures_debit_jr|mesures_temperatures_jr" backend/app
```

Resultat :

- compilation OK ;
- `0` import runtime vers les six routeurs legacy deplaces ;
- occurrences restantes limitees a :
  - `public.geometry_columns` dans `util_dbmeta.py` ;
  - commentaires ou libelles legacy ;
  - fichiers archives sous `routers_legacy_public/`.
