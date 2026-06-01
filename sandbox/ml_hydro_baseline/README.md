# ML Hydro Baseline Sandbox

Statut: `SANDBOX_ONLY`

Ce dossier prépare le premier run réel ML hydro SAD Sebou. Il sert à observer le comportement du pipeline, pas à produire un modèle officiel.

## Règles

- aucune écriture en base ;
- aucune table permanente ;
- aucune publication métier ;
- aucun GNN ;
- aucun embedding graph ;
- aucun output SWAT/WASP legacy utilisé comme vérité officielle ;
- chaque run est immutable.

## Structure

| Dossier | Rôle |
|---|---|
| `configs/` | configurations sandbox versionnées |
| `datasets/` | datasets temporaires sandbox, non versionnés si volumineux |
| `runs/` | dossiers immutables par run |
| `reports/` | rapports sandbox |
| `metrics/` | métriques par run |
| `feature_importance/` | importance features |
| `sql/` | SQL lecture seule, non exécuté par défaut |
| `scripts/` | scripts sandbox locaux |

## Dataset cible

```text
hydro_ml_baseline_v0_sandbox
```

## Documentation

- `sandbox_runbook.md`
- `dataset_freeze_policy_sandbox.md`
- `feature_trust_levels.md`
- `ml_feedback_to_graph.md`
- `hydrological_regime_split_strategy.md`

