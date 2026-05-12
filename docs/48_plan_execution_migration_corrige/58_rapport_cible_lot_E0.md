# Rapport cible - Lot E0 dry-run

## Objectif

Définir le format attendu du rapport dry-run avant autorisation du Lot E.

## Sections obligatoires

### 1. Résumé d'exécution

| Indicateur | Valeur attendue |
|---|---|
| id_run | identifiant unique du dry-run |
| date | horodatage d'exécution |
| périmètre | `scope_migration = MESURE` uniquement |
| tables finales alimentées | `0` |
| statut | `OK` / `BLOQUANT` |

### 2. Contrôle global des volumes

| Indicateur | Valeur cible |
|---|---:|
| Lignes mapping `MESURE` | 448 |
| `MIGRER` | 194 |
| `MIGRER_AVEC_FLAG` | 254 |
| Volume mapping total | 3 729 256 |
| Delta global attendu | 0 |

### 3. Contrôle par table source

| Table source | Volume mapping | Volume préparé | Volume quarantaine | Delta | Statut |
|---|---:|---:|---:|---:|---|
| `raw_mesures_precipitations_jr_traitees` | 1 638 021 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_mesures_precipitations_jr` | 669 880 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_mesures_debit_jr` | 521 433 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_mesures_niv_eau_barrages` | 425 830 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_bathymetries_barrages_abhs` | 187 077 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_mesures_qualite_nappes` | 63 087 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_mesures_qualite_rivieres` | 60 085 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_suivi_qualite_sebou_jr` | 59 436 | à mesurer | à mesurer | à calculer | PENDING |
| `raw_mesures_evaporation_jr` | 48 900 | à mesurer | à mesurer | à calculer | PENDING |

### 4. Conversions appliquées

| Conversion | Nombre de lignes à tracer |
|---|---:|
| `UNIT_ASSUMED` | 207 |
| `UNIT_CONVERTED` | 19 |
| `L/s -> m3/s` | à isoler |
| `°F -> meq/L` | à isoler |
| `µg/L -> mg/L` | à isoler |

### 5. Flags QA à tracer

| Flag | Occurrences actuelles dans le mapping |
|---|---:|
| `INFERIEUR` | 448 |
| `SUPERIEUR` | 448 |
| `DECIMAL_COMMA` | 448 |
| `SCIENTIFIC_NOTATION` | 448 |
| `NON_NUMERIC_QUARANTINE` | 448 |
| `UNIT_MISSING` | 200 |
| `UNIT_OK` | 172 |
| `UNIT_CONFLICT` | 50 |
| `FLAG_GAP_TIME_SERIES` | 22 |
| `FLAG_TIMESTEP_IRREGULAR` | 22 |
| `FLAG_DUPLICATE_TIMESTEP` | 22 |

### 6. Règles de blocage

- delta global non nul ;
- delta non nul sur une table critique ;
- valeurs négatives non routées ;
- parsing impossible non routé en quarantaine ;
- toute insertion détectée dans `qualite`, `hydro`, `meteo`, `infra` ou `metadata`.

## Décision de sortie

### Cas 1 - Lot E0 validé

Conditions :

- delta global = 0 ;
- aucune table finale alimentée ;
- logs complets ;
- quarantaine justifiée.

### Cas 2 - Lot E0 bloqué

Conditions :

- delta non nul ;
- conversion non tracée ;
- lignes perdues ;
- écritures hors périmètre dry-run.
