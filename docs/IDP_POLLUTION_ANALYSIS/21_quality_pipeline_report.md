# Rapport pipeline qualite P0 DEV - IDP pollution

Date execution : 2026-05-18

SQL execute : `database/idp_pollution/13_build_quality_long_format.sql`.

Perimetre limite demande : `DBO5`, `DCO`, `NH4`, `NO3`, `MES`.

## Resultat

| Indicateur | Valeur |
|---|---:|
| Lignes inserees/actualisees dans `qualite.resultat_mesure` | 1409 |
| Sites rattaches automatiquement | 1338 |
| Mesures sans site/geometrie | 71 |

## Parametres canoniques reconnus

| Parametre canonique | Nombre |
|---|---:|
| `DCO` | 207 |
| `DBO5` | 202 |
| `MES` | 163 |

## Non-mappes principaux

| Code brut | Flag | Nombre |
|---|---|---:|
| `NH4+` | `PARAM_UNMAPPED` | 303 |
| `NO3-` | `PARAM_UNMAPPED` | 177 |
| `NH4+ Spect` | `PARAM_UNMAPPED` | 127 |
| `NO3-_Spectro` | `PARAM_UNMAPPED` | 127 |
| `MEST Filtr` | `PARAM_UNMAPPED` | 77 |

## Flags qualite

| Flag | Nombre |
|---|---:|
| `PARAM_UNMAPPED` | 813 |
| `UNIT_UNMAPPED` | 520 |
| `GEOMETRY_MISSING` | 71 |
| `VALUE_NON_NUMERIC` | 5 |

## Conclusion DEV

Le format long fonctionne et reutilise `metadata.mapping_parametre_source` + `metadata.referentiel_parametre`. Le blocage principal est referentiel : ajouter/valider les alias `NH4+`, `NO3-`, variantes spectro/titri et `MEST Filtr`, puis normaliser les unites.
