# Execution load Phase 4

## Context

Chargement reel controle de `hydro.mesure_barrage_param`.

Script execute :

- `backend/sql/2026_05_load_hydro_barrage_param.sql`

Le script reprend les regles de normalisation de :

- `docs/84_hydro_barrage_param_deploiement/07_sql_prepare_normalisation.sql`

## Analysis

Audit run :

| Champ | Valeur |
|---|---|
| `run_id` | `fb24228c-efdf-4b1c-bd1f-9d22a849b997` |
| source | `staging.raw_mesures_niv_eau_barrages` |
| cible | `hydro.mesure_barrage_param` |
| status | `SUCCESS` |
| started_at | `2026-05-07 16:07:40.595441+00` |
| finished_at | `2026-05-07 16:08:23.609109+00` |

Volumes :

| Indicateur | Volume |
|---|---:|
| volume avant load | 0 |
| volume source brut | 85166 |
| volume source stable | 84831 |
| volume insert attendu | 272652 |
| volume exclu | 335 |
| volume insere | 272652 |
| volume final | 272652 |

Exclusions non inserees :

| Raison | Volume |
|---|---:|
| `DATE_NULL` | 92 |
| `DUPLICATE_SOURCE_KEY` | 243 |

## Solution

Le chargement reel a insere exactement `272652` lignes normalisees.

Decision execution :

- `LOAD_EXECUTED`

## Optional improvements

La Phase 5 devra consommer `hydro.mesure_barrage_param` par `parametre_code`, sans reprendre les colonnes legacy `cote_m`, `volume_mm3`, `lacher_m3s` comme contrat metier.
