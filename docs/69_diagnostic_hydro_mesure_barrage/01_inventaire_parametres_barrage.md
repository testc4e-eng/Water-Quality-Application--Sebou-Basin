# Inventaire des paramètres barrage

## Paramètres validés métier à couvrir

1. `Niveau_eau_barrage`
   - symbole : `H_eau`
   - unité : `m`
   - attribut obligatoire : `reference_altitude = NGM`
2. `Volume_barrage`
   - unité : `Mm³`
3. `Restitution_barrage`
   - alias métier : `lâcher barrage`
   - unité : `Mm³`
4. `Apports_barrage`
   - unité : `Mm³`
5. `Transfert_barrage`
   - types métier : `inter_barrage`, `inter_bassin`, `inconnu`

## Paramètres réellement présents

### Dans `staging.raw_mesures_niv_eau_barrages`

| Colonne source | Paramètre métier | Volume non nul | Unité détectée / déduite |
|---|---|---:|---|
| `niveau_eau_m_ngm` | `NIVEAU_EAU` | 85 166 | `m NGM` |
| `volume_mm3` | `VOLUME` | 10 136 | `Mm³` |
| `restitutions_mm3` | `RESTITUTION` | 77 502 | `Mm³` |
| `apports_mm3` | `APPORTS_HM3` | 83 643 | `Mm³` |
| `transfert_mm3` | `TRANSFERT` | 8 276 | `Mm³` |

### Dans `qa_dry_run.e0_mesures_preparees`

| Code paramètre canonique | Volume |
|---|---:|
| `NIVEAU_EAU` | 85 166 |
| `APPORTS_HM3` | 83 643 |
| `RESTITUTION` | 77 502 |
| `VOLUME` | 10 136 |
| `TRANSFERT` | 8 276 |

Total `E0` pour ce flux : `264 723` lignes.

### Dans `hydro.mesure_barrage`

| Colonne cible | Lecture métier | Volume non nul |
|---|---|---:|
| `cote_m` | niveau d’eau | 84 831 |
| `volume_mm3` | volume barrage | 10 136 |
| `lacher_m3s` | lâcher / restitution supposé | 0 |

## Diagnostic

- la source brute est **multi-mesures** : plusieurs concepts sur une même ligne journalière
- la cible actuelle est **partiellement pivotée**
- `apports` et `transfert` n’ont aucun portage cible
- `restitution` est incompatible avec `lacher_m3s` tant que l’unité métier validée reste `Mm³`
