# Hydrological Regime Split Strategy

## Objectif

Préparer une lecture des performances par régime hydrologique, sans prétendre certifier les régimes.

## Variables candidates

| Variable | Définition candidate |
|---|---|
| `hydrological_year` | année hydrologique candidate |
| `hydrological_regime_candidate` | DRY_YEAR, NORMAL_YEAR, WET_YEAR |
| `flow_regime_candidate` | LOW_FLOW_PERIOD, NORMAL_FLOW_PERIOD, FLOOD_PERIOD |
| `season_candidate` | DRY_SEASON, WET_SEASON |

## Heuristiques provisoires

| Classe | Règle candidate | Statut |
|---|---|---|
| `DRY_YEAR` | rainfall annuel < p33 | ASSUMPTION |
| `WET_YEAR` | rainfall annuel > p66 | ASSUMPTION |
| `NORMAL_YEAR` | p33 <= rainfall <= p66 | ASSUMPTION |
| `FLOOD_PERIOD` | débit > p95 station | ASSUMPTION |
| `LOW_FLOW_PERIOD` | débit < p10 station | ASSUMPTION |

## Usage

- calculer métriques par régime ;
- détecter performance artificielle ;
- détecter échec sur crues ou étiages ;
- préparer discussion Reda/SWAT ;
- préparer discussion SIG/QA si comportement station incohérent.

## Interdictions

- ne pas certifier les régimes ;
- ne pas publier comme classification hydrologique officielle ;
- ne pas utiliser pour DG reporting.

