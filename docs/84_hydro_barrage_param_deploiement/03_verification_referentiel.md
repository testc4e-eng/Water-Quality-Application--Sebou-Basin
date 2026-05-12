# Verification referentiel canonique

## Context

Le modele parametrique barrage depend de `metadata.referentiel_parametre_canonique`.

Parametres barrage requis :

- `NIVEAU_EAU`
- `VOLUME`
- `LACHER`
- `APPORTS_HM3`
- `TRANSFERT`

## Analysis

### Etat general

| Controle | Resultat |
|---|---:|
| lignes dans `metadata.referentiel_parametre_canonique` | 92 |
| lignes actives | 92 |
| collisions `code_parametre` | 0 |
| parametres barrage actifs requis | 5 |

### Parametres barrage

| Code | Type metier | Unite reference | GEO compatible | Statut |
|---|---|---|---|---|
| `APPORTS_HM3` | `volume_journalier` | `Mm3/j` | `barrage` | ACTIF |
| `LACHER` | `volume_journalier` | `Mm3/j` | `barrage` | ACTIF |
| `NIVEAU_EAU` | `niveau` | `m` | `station|barrage|source|segment|subbasin` | ACTIF |
| `TRANSFERT` | `volume_journalier` | `Mm3/j` | `barrage` | ACTIF |
| `VOLUME` | `volume_stockage` | `Mm3` | `barrage` | ACTIF |

### Regles verrouillees

| Regle | Statut |
|---|---|
| `RESTITUTION` est alias source de `LACHER` | OK |
| `LACHER` n'est pas un debit | OK |
| `APPORTS_HM3` est un volume journalier entrant | OK |
| `TRANSFERT` est un volume journalier transfere | OK |
| `Hm3/HM3/hm3` harmonise vers `Mm3` | OK |
| aucun `m3/s` pour `LACHER`, `APPORTS_HM3`, `TRANSFERT` | OK |

### Parametres orphelins simules

| Controle | Resultat |
|---|---:|
| lignes parametriques attendues sans `parametre_ref_id` | 0 |

## Solution

Le referentiel canonique est compatible avec la creation du modele parametrique barrage.

Decision referentiel :

- `READY_FOR_PARAM_MODEL`

## Optional improvements

La Phase 5 devra consommer le referentiel canonique pour afficher les unites :

- `NIVEAU_EAU` : `m`
- `VOLUME` : `Mm3`
- `LACHER` : `Mm3/j`
- `APPORTS_HM3` : `Mm3/j`
- `TRANSFERT` : `Mm3/j`
