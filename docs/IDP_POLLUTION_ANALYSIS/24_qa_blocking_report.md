# Rapport QA bloquant DEV - IDP pollution

Date execution : 2026-05-18

## Synthese QA

| Controle | Nombre | Niveau | Decision DEV |
|---|---:|---|---|
| `param_unmapped` | 837 | BLOQUANT | Bloque la couverture NH4/NO3 et variantes avant pre-production |
| `unit_unmapped` | 572 | BLOQUANT | Bloque l'interpretation analytique fiable |
| `measurements_without_geometry` | 71 | WARNING | Acceptable pour DEV, a arbitrer avant production |
| `points_without_site` | 71 | WARNING | Rattachement site impossible sans geometrie |
| `multi_source_conflicts` | 299 | WARNING | Arbitrage spatial/metier requis |
| `duplicate_exact` | 1316 | WARNING | Ne pas dedoublonner automatiquement |
| `duplicate_near` | 69 | WARNING | Validation metier requise |
| `geometry_missing` | 0 | INFO | Aucun site canonique sans geometrie expose |

## Risques bloquants

- Alias parametres `NH4+`, `NO3-`, `NH4+ Spect`, `NO3-_Spectro`, `MEST Filtr` non resolus dans le referentiel/mapping actuel.
- Unites brutes non mappees pour une part importante de `DBO5`, `DCO`, `MES`.
- La volumetrie de doublons exacts/proches doit rester en table QA/arbitrage, sans suppression automatique.

## Action immediate recommandee

Completer `metadata.mapping_parametre_source` et les mappings d'unites pour le perimetre P0, puis relancer uniquement `13_build_quality_long_format.sql` et les vues QA.
