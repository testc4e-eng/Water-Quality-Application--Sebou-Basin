# Rapport rechargement qualite P0 - Phase 6

Date execution : 2026-05-18

## Scripts executes

1. `17_fix_p0_parameter_mappings.sql` : OK, `INSERT 0 21`
2. `18_fix_p0_unit_mappings.sql` : OK, `UPDATE 5`
3. `13_build_quality_long_format.sql` : premier run stoppe sur doublons internes d'upsert, SQL corrige, rerun OK `INSERT 0 1409`
4. `16_load_ref_site_pollution_dev.sql` : OK, rattachement sites relance

## Resultats apres rechargement

| Indicateur | Avant | Apres |
|---|---:|---:|
| `qualite.resultat_mesure` total | 1409 | 1409 |
| `PARAM_UNMAPPED` QA | 837 | 0 |
| `UNIT_UNMAPPED` QA | 572 | 0 |
| `OK` dans `qualite.resultat_mesure` | 0 | 1333 |
| `GEOMETRY_MISSING` | 71 | 71 |
| `VALUE_NON_NUMERIC` | 5 | 5 |

## Couverture parametres

| Parametre canonique | Nombre resultat_mesure |
|---|---:|
| `DBO5` | 202 |
| `DCO` | 207 |
| `MES` | 240 |
| `NH4` | 444 |
| `NO3-` | 316 |

## Latest results API

| Parametre API | Nombre |
|---|---:|
| `DBO5` | 189 |
| `DCO` | 182 |
| `MES` | 223 |
| `NH4` | 365 |
| `NO3-` | 300 |

## Correction technique appliquee

`13_build_quality_long_format.sql` mappe maintenant sur la table source exacte via `replace(c.source_layer, 'staging.', '')`. Cela evite qu'un mapping generique `idp_pollution` cree plusieurs lignes pour la meme cle d'upsert.
