# Volumetrie attendue

## Context

La volumetrie cible est calculee depuis `staging.raw_mesures_niv_eau_barrages`, apres application des exclusions de preparation :

- `barrage_id` null exclu
- `date_jr` null exclu
- doublons source exclus par `row_number() over (partition by ire_barrage, date_jr order by id)`
- valeurs nulles exclues par parametre

La cle source stable utilisee est `id`. Aucun `ctid` n'est utilise.

## Analysis

### Volume source

| Indicateur | Volume |
|---|---:|
| lignes source brutes | 85166 |
| lignes date nulle | 92 |
| lignes barrage non mappe | 0 |
| lignes doublons source exclues apres priorite `DATE_NULL` | 243 |
| lignes source stables | 84831 |

### Volume par parametre

| Parametre | Volume brut non null | Volume stable attendu |
|---|---:|---:|
| NIVEAU_EAU | 85166 | 84831 |
| VOLUME | 10136 | 10136 |
| LACHER | 85165 | 84830 |
| APPORTS_HM3 | 85155 | 84820 |
| TRANSFERT | 8278 | 8035 |

Volume parametrique attendu :

```text
84831 + 10136 + 84830 + 84820 + 8035 = 272652
```

### Tableau metier requis

| Parametre | Volume | Unite source | Unite cible | Statut |
|---|---:|---|---|---|
| NIVEAU_EAU | 84831 | `m NGM` | `m` | OK |
| VOLUME | 10136 | `Mm3` | `Mm3` | OK |
| LACHER | 84830 | `Mm3` implicite par jour via `restitutions_mm3` | `Mm3/j` | OK |
| APPORTS_HM3 | 84820 | `HM3/Hm3/hm3` ou `Mm3` implicite par jour | `Mm3/j` | OK |
| TRANSFERT | 8035 | `HM3/Hm3/hm3` ou `Mm3` implicite par jour | `Mm3/j` | OK |

### Controle cible simule

| Controle | Resultat |
|---|---:|
| lignes parametriques attendues | 272652 |
| doublons `(barrage_id, temps, parametre_code, scenario)` | 0 |
| lignes avec `barrage_id` null | 0 |
| lignes avec `temps` null | 0 |
| lignes avec `valeur` null | 0 |
| lignes avec parametre hors referentiel | 0 |
| lignes avec unite incoherente | 0 |

## Solution

La volumetrie attendue est stable et chargeable en Phase 4 apres creation de la table cible et controle de normalisation.

Decision volumetrie :

- `READY_FOR_PARAM_MODEL`

## Optional improvements

La Phase 3 devra figer les hash suivants avant insertion :

- `source_row_hash = md5('staging.raw_mesures_niv_eau_barrages|' || source_id)`
- `target_business_key_hash = md5(barrage_id || '|' || temps || '|' || parametre_code || '|ACTUEL')`
