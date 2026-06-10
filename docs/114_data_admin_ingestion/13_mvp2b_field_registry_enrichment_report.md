# MVP2-B Enrichissement du registre de champs `data_admin.field_registry`

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'execution |
| Source de vérité | Oui pour MVP2-B |
| Date | 2026-06-05 |

## Objectif

Basculer les canevas du mode `introspection_fallback` vers un dictionnaire de champs gouverne par `data_admin.field_registry`.

## Perimetre

La mission a modifie uniquement :

- `data_admin.field_registry`
- scripts SQL associes au schema `data_admin`

Les schemas metier `geo`, `infra`, `hydro`, `meteo`, `qualite`, `metadata`, `api`, `analytics` n'ont pas ete modifies.

## Audit initial

Etat avant execution :

- `data_admin.field_registry` existait mais contenait `0` ligne
- les colonnes suivantes etaient absentes :
  - `example_value`
  - `unit_expected`
  - `allowed_values_source`
  - `description`

## Scripts SQL

### Script execute 1

`backend/sql/2026_06_data_admin_template_fields.sql`

Effet :

- ajout idempotent de :
  - `example_value`
  - `unit_expected`
  - `allowed_values_source`
  - `description`

### Script cree et execute 2

`backend/sql/2026_06_data_admin_field_registry_seed.sql`

Effet :

- seed gouverne des champs metier
- `INSERT ... ON CONFLICT (class_code, field_name) DO UPDATE`
- mise a jour idempotente des metadonnees champ

## Classes enrichies

### Prioritaires

| Classe | Nb champs |
|---|---:|
| `HYDRO_DEBIT` | 4 |
| `METEO_PRECIPITATION` | 5 |
| `QUALITE_RIVIERE` | 5 |
| `POLLUTION_SITE` | 6 |
| `INFRA_STATION` | 6 |

### Secondaires

| Classe | Nb champs |
|---|---:|
| `INFRA_BARRAGE` | 4 |
| `QUALITE_NAPPE` | 4 |
| `QUALITE_BARRAGE` | 4 |

### Total

```text
38 champs seedes
```

## Preuves DB

Validation finale :

```sql
SELECT COUNT(*)::int FROM data_admin.field_registry;
```

Resultat :

```text
38
```

Validation par classe :

```sql
SELECT class_code, COUNT(*)::int
FROM data_admin.field_registry
GROUP BY class_code
ORDER BY class_code;
```

Resultat :

- `HYDRO_DEBIT = 4`
- `INFRA_BARRAGE = 4`
- `INFRA_STATION = 6`
- `METEO_PRECIPITATION = 5`
- `POLLUTION_SITE = 6`
- `QUALITE_BARRAGE = 4`
- `QUALITE_NAPPE = 4`
- `QUALITE_RIVIERE = 5`

## Validation API

Tests effectues :

- `GET /api/v1/data-admin/classes/HYDRO_DEBIT/template/spec`
- `GET /api/v1/data-admin/classes/QUALITE_RIVIERE/template/spec`
- `GET /api/v1/data-admin/classes/POLLUTION_SITE/template/spec`

Resultat attendu et observe :

```text
field_source = data_admin.field_registry
field_registry_incomplete = false
```

## Validation canevas

Tests effectues :

- `POST /api/v1/data-admin/classes/HYDRO_DEBIT/template/generate`
- `POST /api/v1/data-admin/classes/QUALITE_RIVIERE/template/generate`
- `POST /api/v1/data-admin/classes/POLLUTION_SITE/template/generate`
- `POST /api/v1/data-admin/classes/HYDRO_DEBIT/template/generate` en `csv`

Controles valides :

- feuille `DONNEES`
- feuille `INSTRUCTIONS`
- feuille `DICTIONNAIRE_CHAMPS`
- feuille `METADATA`
- presence de `validation_rule`
- presence de `example_value`
- presence de `unit_expected` ou `allowed_values_source` selon la classe

## Validation technique

- `python -m compileall backend/app` : succes
- `npm run build` : succes
- `GET /api/v1/data-admin/classes` : `200`, `count=8`
- `GET /api/v1/data-admin/classes/HYDRO_DEBIT/count` : `200`, `652446`

## Verdict

```text
114_MVP2_B_STATUS = FIELD_REGISTRY_ENRICHED
FIELD_REGISTRY = ENRICHED_FOR_MVP2
FIELD_REGISTRY_INCOMPLETE = FALSE
```

## Limites restantes

- le seed couvre les champs prioritaires et un noyau secondaire, pas encore l'integralite des colonnes de toutes les classes
- les listes de valeurs autorisees restent textuelles ; elles ne sont pas encore branchees sur des referentiels dynamiques
- le prochain chantier doit rester strictement `upload + validation + staging`, sans promotion automatique

## Etape suivante

```text
114_MVP2_C_UPLOAD_VALIDATION_STAGING
```
