# Extraction lignes restantes

## Volumes

| Cas | Volume | Table |
|---|---:|---|
| `MO_METAL` | 11 | `qualite.suivi_qualite_barrage_garde_hebdo` |
| `NUMEROTATION` | 1 | `qualite.mesure_qualite_nappe` |
| **Total** | **12** |  |

## Lignes `MO_METAL`

| Date | source_row_id | IRE station | Station | Barrage | Milieu | Parametre cible actuel | Parametre source brut | Valeur | Observation | Pas temps | Source system |
|---|---:|---|---|---|---|---|---|---:|---|---|---|
| 2024-11-20 | 1824 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2024-12-11 | 1941 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-01-08 | 2097 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-02-10 | 2292 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-03-13 | 2448 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-04-14 | 2643 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-05-12 | 2799 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-06-09 | 2955 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-07-15 | 3147 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-08-11 | 3302 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |
| 2025-09-08 | 3458 | 3323/8 | brg de garde / sebou | garde du sebou | Surface | `MO_METAL` | `Molybdene(mg/l)` | 0.01 | `<0.010` | hebdo | E1_1_GARDE_HEBDO |

## Ligne `NUMEROTATION`

| Date | source_row_id | IRE station | Station | Nappe id | Code nappe | Parametre cible actuel | Parametre source brut | Valeur | Pas temps | QA nappe unmapped | Source system |
|---|---:|---|---|---:|---|---|---|---:|---|---|---|
| 1991-03-27 | 183 | 2881/15 | my yaacoub |  |  | `NUMEROTATION` | `Numerotation_GT` | 110 | jour | true | E1_1_NAPPE |

## Note encodage

La sortie console `psql` affiche `MolybdÃ¨ne(mg/l)` sur le terminal Windows, mais le libelle source correspond au parametre metier `Molybdene(mg/l)` du dictionnaire C4E.
