# Simulation insertion Phase 3

## Context

Cette simulation prepare le futur chargement de `hydro.mesure_barrage_param`.

Important :

- aucune insertion reelle executee
- volume cible reste `0`
- les hash sont calcules en simulation uniquement

## Analysis

### Hash simules

Hash source :

```sql
md5('raw_mesures_niv_eau_barrages|' || source_row_id)
```

Hash metier cible :

```sql
md5(
  barrage_id || '|' ||
  temps || '|' ||
  parametre_code || '|' ||
  scenario
)
```

Scenario simule :

- `ACTUEL`

### Volumes

| Indicateur | Volume |
|---|---:|
| lignes source brutes | 85166 |
| lignes source stables | 84831 |
| lignes exclues | 335 |
| lignes backlog | 0 |
| lignes parametriques candidates | 272652 |
| lignes inserees reellement | 0 |

### Collisions

| Controle | Resultat |
|---|---:|
| collisions business hash | 0 |
| doublons `(barrage_id, temps, parametre_code, scenario)` | 0 |
| collisions FK referentiel | 0 |

### Exclusions

| Raison | Volume | Traitement Phase 4 |
|---|---:|---|
| `DATE_NULL` | 92 | exclusion documentee |
| `DUPLICATE_SOURCE_KEY` | 243 | exclusion documentee apres conservation du plus petit `id` |
| `BARRAGE_ID_NULL` | 0 | aucun cas |

## Solution

La simulation logique d'insertion est compatible avec les contraintes creees en Phase 2.

Decision simulation :

- `NORMALISATION_OK`

## Optional improvements

En Phase 4, l'audit d'insertion devra memoriser :

- volume source brut : `85166`
- volume stable : `84831`
- volume insere attendu : `272652`
- exclusions : `335`
- distribution par parametre
