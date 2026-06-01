# DEV environment check - IDP pollution

## Résultat

| Contrôle | Statut |
|---|---|
| PostgreSQL accessible | OK |
| Base cible | `abh_sad` |
| Version PostgreSQL | 17.9 |
| PostGIS | OK, 3.5.3 |
| `psql` local | OK |
| `ogr2ogr` local | OK, sans driver PostgreSQL |
| Droits schéma `staging` | USAGE OK, CREATE OK |
| Droits schéma `geo` | USAGE OK, CREATE OK |
| Droits schéma `qualite` | USAGE OK, CREATE OK |
| Droits schéma `metadata` | USAGE OK, CREATE OK |
| Droits schéma `qa` | USAGE OK, CREATE OK |
| Droits schéma `api` | USAGE OK, CREATE OK |

## Objets existants confirmés

- `infra.step`
- `infra.step_industrielle`
- `infra.stm`
- `infra.huilerie_inventaire_pollution`
- `infra.mine_inventaire_pollution`
- `infra.decharge_inventaire_pollution`
- `infra.decharge_inventaire_pollution_general`
- `infra.rejet_inventaire_pollution`
- `infra.rejet_abattoir_inventaire_pollution`
- `infra.fosses_septiques_abhs`
- `metadata.referentiel_parametre`
- `metadata.mapping_parametre_source`
- `qualite.source_pollution_prelevement`

## Corrections nécessaires

Aucune correction bloquante détectée avant exécution DEV. Le driver PostgreSQL GDAL est absent localement ; l'import staging utilise donc le fallback reproductible `ogr2ogr CSV stdout` + insertion `psycopg2`.

## Commandes de correction si un autre poste échoue

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS geo;
CREATE SCHEMA IF NOT EXISTS qualite;
CREATE SCHEMA IF NOT EXISTS metadata;
CREATE SCHEMA IF NOT EXISTS qa;
CREATE SCHEMA IF NOT EXISTS api;
```
