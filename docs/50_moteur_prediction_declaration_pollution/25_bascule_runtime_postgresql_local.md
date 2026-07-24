# 25  Bascule runtime PostgreSQL local

Date : 2026-07-13

## 1. Statut

Statut : `RUNTIME_LOCAL_DB_READY_AVEC_RESERVES`

La bascule runtime du backend vers PostgreSQL local est effective et validee par tests API.

## 2. Sauvegardes

Dossier :

```text
C:\dev\WQDSS\backups\runtime_switch_20260713_192703
```

Fichiers crees :

- `.env.before_runtime_switch`
- `docker-compose.before_runtime_switch.yml`
- `docker_inspect_sad-backend.json`
- `docker_inspect_sad-db.json`
- `local_abh_sad_before_runtime_switch.dump`
- `local_abh_sad_schema_before_runtime_switch.sql`
- `docker_abh_sad_before_runtime_switch.dump`
- `docker_abh_sad_schema_before_runtime_switch.sql`

Les dumps custom format ont ete controles avec `pg_restore --list`.

## 3. Compte applicatif

Role utilise :

```text
sad_app
```

Proprietes :

- login autorise ;
- pas superuser ;
- pas createdb ;
- pas createrole ;
- droits limites aux usages applicatifs necessaires pour la demonstration.

## 4. Configuration backend

Avant :

```text
DB_HOST=sad-db
DB_PORT=5432
DB_NAME=abh_sad
DB_USER=sad_user
```

Apres :

```text
DB_HOST=host.docker.internal
DB_PORT=5432
DB_NAME=abh_sad
DB_USER=sad_app
```

Le frontend continue de consommer uniquement `/api/v1`.

## 5. Verification PostgreSQL local

Depuis le conteneur `sad-backend` :

```text
host.docker.internal:5432 reachable
```

Depuis le role applicatif local :

```text
current_user = sad_app
geo_work.reseau_hydro_edges_final_candidate_20260602 = present
count = 746
```

## 6. Endpoints backend

| Endpoint | Resultat |
|---|---:|
| `GET /docs` | 200 |
| `GET /api/v1/map/catalog` | 200 |
| `GET /api/v1/quality/unified/stations` | 200 |
| `GET /api/v1/propagation/network.geojson` | 200 |

## 7. Topologie

Point teste :

```text
lng = -6.30540031
lat = 34.515619453
```

| Endpoint | Resultat |
|---|---:|
| `GET /api/v1/propagation/snap-diagnostic?lng=...&lat=...` | 200 |
| `GET /api/v1/propagation/source-to-garde?lng=...&lat=...` | 200 |
| `GET /api/v1/propagation/source-to-stations?lng=...&lat=...` | 200 |

Observations :

- `source-to-garde` retourne un GeoJSON non vide ;
- `source-to-stations` retourne 11 cibles ;
- plus aucune erreur `TOPOLOGY_ENGINE_UNAVAILABLE`.

## 8. Recette Declaration Pollution

### Cas suffisant

Scenario Excel :

```text
SC_QR01_C01_QS01_QI01_QO01
```

Resultats :

| Etape | Resultat |
|---|---:|
| create | 200 |
| submit | 200 |
| evaluate | 200 |
| report | 200 |

Details :

```text
status = RISQUE_FAIBLE
barrage_garde_atteint = true
sidi_allal_tazi_detectee = true
parcours_geojson.features = 1
report_available = true
```

### Cas insuffisant

Scenario Excel :

```text
SC_QR02_C04_QS01_QI01_QO01
```

Resultats :

```text
status = RECOMMANDATION_PROPOSEE
risk = HIGH
matrix_status = INSUFFISANT
recommendations = 3
axes = SEBOU, INNAOUEN, OUERGHA
```

## 9. Dashboards et frontend

Smoke tests HTTP :

| Route | Resultat |
|---|---:|
| `/` | 200 |
| `/dashboard-quality` | 200 |
| `/dashboard-pollution` | 200 |
| `/dashboard-pollution?view=declaration` | 200 |
| `/dashboard-pollution-campagnes` | 200 |

Tests frontend :

```text
6 fichiers
29 tests OK
```

Build frontend :

```text
npm run build OK
```

Reserve : warning Vite sur la taille du bundle, sans impact fonctionnel immediat.

## 10. Etat de sad-db Docker

`sad-db` est conserve.

```text
aucune suppression
aucun volume supprime
aucune migration massive Docker -> local
```

Il reste fallback temporaire jusqu'a validation utilisateur finale.

## 11. Rollback

Rollback configuration :

1. Restaurer `.env.before_runtime_switch` depuis le dossier de backup.
2. Reexecuter :

```powershell
docker compose up -d --force-recreate sad-backend
```

Rollback base :

- dumps local et Docker disponibles dans le dossier de backup ;
- ne pas restaurer sans validation DBA explicite.

## 12. Reserves

- Le role `sad_app` a ete active pour la demonstration avec droits applicatifs limites ; une revue fine des privileges doit suivre.
- La matrice Excel est auditee mais pas encore integree au moteur runtime.
- Le frontend utilise encore des scenarios techniques tant que `MATRIX_V1` n'est pas implemente.
- `sad-db` Docker ne doit pas etre supprime avant recette utilisateur complete.

