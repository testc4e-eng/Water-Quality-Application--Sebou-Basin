# Audit load Phase 4

## Context

Table d'audit creee/alimentee :

- `audit.hydro_barrage_param_load_audit`

## Analysis

Schema logique de l'audit :

| Colonne | Role |
|---|---|
| `run_id` | identifiant UUID du run |
| `source_table` | source chargee |
| `target_table` | cible chargee |
| `volume_before` | volume cible avant load |
| `backup_table` | backup cree si necessaire |
| `volume_source_brut` | volume source brut |
| `volume_source_stable` | volume source apres exclusions source |
| `volume_insert_attendu` | volume attendu |
| `volume_exclu` | volume exclu |
| `volume_inserted` | volume insere |
| `volume_final` | volume final cible |
| `started_at` | debut execution |
| `finished_at` | fin execution |
| `status` | statut du run |
| `qa_json` | controles QA post-load |
| `metadata_json` | contexte d'execution |

Run charge :

| Champ | Valeur |
|---|---|
| `run_id` | `fb24228c-efdf-4b1c-bd1f-9d22a849b997` |
| `status` | `SUCCESS` |
| `volume_before` | 0 |
| `backup_table` | null |
| `volume_source_brut` | 85166 |
| `volume_source_stable` | 84831 |
| `volume_insert_attendu` | 272652 |
| `volume_exclu` | 335 |
| `volume_inserted` | 272652 |
| `volume_final` | 272652 |

QA auditee :

| Controle | Resultat |
|---|---:|
| `post_load_volume` | 272652 |
| `business_duplicates` | 0 |
| `null_barrage_id` | 0 |
| `null_temps` | 0 |
| `null_valeur` | 0 |
| `null_parametre_ref_id` | 0 |
| `unit_errors` | 0 |
| `debit_volume_mix` | 0 |
| `business_hash_collisions` | 0 |

## Solution

L'audit de chargement est complet et rattache le run a la source, a la cible, aux volumes et aux controles QA.

Decision audit :

- `AUDIT_LOAD_OK`

## Optional improvements

Lors des futurs reloads, conserver un lien entre `run_id` et tout backup cree dans `audit`.
