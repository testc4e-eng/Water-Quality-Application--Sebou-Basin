# Parametres non trouves

## Mise a jour apres validation C4E

Les parametres initialement non trouves ont ete reclasses avec le dictionnaire C4E.

| Parametre source | Volume initial | Decision finale | Cible |
|---|---:|---|---|
| `CN` | 138 | mapping sur apres creation referentiel | `CN` |
| `GERME_22` | 4 | mapping sur apres creation referentiel | `GERME_22` |
| `GERME_37` | 2 | mapping sur apres creation referentiel | `GERME_37` |
| `PSEUDO_AER` | 2 | mapping sur apres creation referentiel | `PSEUDO_AER` |
| `VIBRIO` | 1 | mapping sur apres creation referentiel | `VIBRIO` |
| `CLOSTRI` | 2 | mapping sur apres creation referentiel | `CLOSTRI` |
| `H2S` | 4 | mapping sur apres creation referentiel | `H2S` |
| `CO2_LIBRE` | 2 | mapping sur apres creation referentiel | `CO2_LIBRE` |
| `CL2_RES` | 2 | mapping sur apres creation referentiel | `CL2_RES` |
| `SO3` | 3 | mapping sur apres creation referentiel | `SO3` |
| `ODEUR` | 1 | mapping sur apres creation referentiel | `ODEUR` |
| `SAVEUR` | 1 | mapping sur apres creation referentiel | `SAVEUR` |
| `UNREC_BORE_MG_L` | 11 | mapping sur apres creation referentiel | `BORE` |
| `NUMEROTATION` | 1 | legacy ignore | aucun mapping qualite |

## Decision

Aucun vrai parametre qualite non trouve ne reste apres enrichissement referentiel C4E. `NUMEROTATION` est une information de codification et doit rester `LEGACY_IGNORE`, hors dashboard qualite.

