# Rapport QA apres mapping P0 - Phase 6

Date execution : 2026-05-18

## Comparaison avant / apres

| Controle QA | Avant | Apres | Niveau |
|---|---:|---:|---|
| `param_unmapped` | 837 | 0 | INFO |
| `unit_unmapped` | 572 | 0 | INFO |
| `measurements_without_geometry` | 71 | 71 | WARNING |
| `points_without_site` | 71 | 71 | WARNING |
| `duplicate_exact` | 1316 | 1316 | WARNING |
| `duplicate_near` | 69 | 69 | WARNING |
| `multi_source_conflicts` | 299 | 299 | WARNING |
| `geometry_missing` | 0 | 0 | INFO |

## Bloquants restants

Aucun blocage P0 parametre/unite ne reste en DEV.

## Warnings restants

- 71 mesures sans geometrie/site : a arbitrer ou completer par rattachement metier.
- 1316 doublons exacts et 69 doublons proches : ne pas supprimer automatiquement.
- 299 conflits multi-sources : arbitrage metier requis avant pre-production.

## Decision QA

GO DEV demo.

NOGO pre-production tant que les warnings spatiaux ne sont pas traites par table d'arbitrage.
