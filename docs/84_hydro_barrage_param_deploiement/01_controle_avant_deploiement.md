# Controle avant deploiement

## Context

Controle realise avant toute creation de `hydro.mesure_barrage_param`.

Base controlee :

- `abh_sad`

Tables controlees :

- `hydro.mesure_barrage`
- `staging.raw_mesures_niv_eau_barrages`
- `metadata.mapping_barrage`
- `metadata.referentiel_parametre_canonique`
- `api.v_barrage_dimension`

## Analysis

### Existence objets

| Objet | Type | Statut |
|---|---|---|
| `hydro.mesure_barrage` | table | OK |
| `metadata.referentiel_parametre_canonique` | table | OK |
| `staging.raw_mesures_niv_eau_barrages` | table | OK |
| `metadata.mapping_barrage` | table | OK |
| `hydro.mesure_barrage_param` | table cible | ABSENTE, attendu avant Phase 2 |

### Colonnes source confirmees

| Source | Colonne | Role |
|---|---|---|
| `staging.raw_mesures_niv_eau_barrages` | `id` | cle source stable |
| `staging.raw_mesures_niv_eau_barrages` | `date_jr` | temps source |
| `staging.raw_mesures_niv_eau_barrages` | `ire_barrage` | cle legacy barrage |
| `staging.raw_mesures_niv_eau_barrages` | `niveau_eau_m_ngm` | source `NIVEAU_EAU` |
| `staging.raw_mesures_niv_eau_barrages` | `volume_mm3` | source `VOLUME` |
| `staging.raw_mesures_niv_eau_barrages` | `restitutions_mm3` | alias source `RESTITUTION` vers `LACHER` |
| `staging.raw_mesures_niv_eau_barrages` | `apports_mm3` | source `APPORTS_HM3` |
| `staging.raw_mesures_niv_eau_barrages` | `transfert_mm3` | source `TRANSFERT` |

### Controle barrage_id

| Controle | Resultat |
|---|---:|
| lignes source brutes | 85166 |
| lignes source mappees vers `barrage_id` | 85166 |
| lignes source non mappees | 0 |
| barrages distincts couverts | 10 |
| mappings `metadata.mapping_barrage` | 11 |
| `legacy_ire_barrage` distincts dans mapping | 11 |
| mapping casse vers `api.v_barrage_dimension` | 0 |

### Controle dates

| Controle | Resultat |
|---|---:|
| lignes source avec `date_jr` nulle | 92 |
| periode min source exploitable | 1996-12-01 |
| periode max source exploitable | 2025-09-01 |

### Controle doublons source

La cle source stable de deduplication est :

```text
(ire_barrage, date_jr) order by id
```

| Controle | Resultat |
|---|---:|
| groupes source dupliques `(ire_barrage, date_jr)` | 244 |
| lignes supplementaires brutes dans ces groupes | 334 |
| lignes exclues par doublon apres priorite `DATE_NULL` | 243 |
| maximum lignes pour une meme cle source | 92 |

### Controle legacy

| Controle `hydro.mesure_barrage` | Resultat |
|---|---:|
| lignes legacy | 84831 |
| `barrage_id` null | 0 |
| `temps` null | 0 |
| `cote_m` non null | 84831 |
| `volume_mm3` non null | 10136 |
| `lacher_m3s` non null | 0 |

## Solution

Anomalies classees :

| Classe | Anomalie | Impact Phase 2 |
|---|---|---|
| INFO | `hydro.mesure_barrage_param` absente | attendu avant creation |
| BACKLOG | 92 lignes source avec `date_jr` nulle | exclues du chargement parametrique |
| BACKLOG | 243 lignes source dupliquees apres priorite `DATE_NULL` | exclues par cle stable `(ire_barrage, date_jr) order by id` |
| INFO | `lacher_m3s` legacy vide | confirme l'interdiction de l'exposer comme flux metier |

Decision :

- `READY_FOR_PARAM_MODEL`

## Optional improvements

La Phase 3 devra produire `09_lignes_exclues.csv` avec les identifiants source exclus :

- `DATE_NULL`
- `DUPLICATE_SOURCE_KEY`
