# ML_TO_GRAPH_FEEDBACK - run_20260522_143742_hydro_ml_baseline_v0_sandbox

| Champ | Valeur |
|---|---|
| Statut | ML_SANDBOX_ONLY |
| Run ID | `run_20260522_143742_hydro_ml_baseline_v0_sandbox` |
| Dataset | `hydro_ml_baseline_v0_sandbox_20260522_122901.csv` |
| Dataset SHA256 | `a1d4a95709562a3c57c143b8bb982f1e010ffabf3817f4430ad3f3b38dcce26e` |
| Graph features utilisées | non |
| Graph correction automatique | interdite |

## Synthèse

Ce run E1.1 n'utilise aucune feature graph-aware. Il ne peut donc pas valider ou invalider la direction hydraulique, la propagation, les reaches orphelins ou la connectivité amont/aval.

Le feedback vers D.1 est indirect : il concerne surtout les conditions nécessaires avant un futur run graph-aware.

## Observations

| Signal | Sévérité | Evidence | Action D.1 candidate |
|---|---|---|---|
| `NO_GRAPH_SIGNAL` | INFO | aucune feature graph utilisée | ne pas modifier `topology_confidence` |
| `FEATURE_STABILITY_LOW` | WARNING | `evap_7d` null ratio 0.7412 ; `evap_30d` null ratio 0.7409 | exiger freshness/completeness policy avant features graph-temporal |
| `TEMPORAL_GENERALIZATION_WEAK` | WARNING | persistence `q_t_plus_7` test NSE = -0.382369 | ne pas utiliser lag propagation officiel sans validation temporelle |
| `DEPENDENCY_BLOCKER` | DEGRADED | XGBoost/LightGBM/sklearn absents ; numpy/pandas import crash | figer environnement ML avant graph-aware run |

## Signaux non détectés

| Signal attendu | Résultat | Raison |
|---|---|---|
| `GRAPH_FEATURE_DOMINANCE` | non vérifiable | aucune feature graph |
| `PROPAGATION_LAG_SUSPECT` | non vérifiable | aucun upstream lag |
| `GRAPH_ORPHAN_SUSPECT` | non vérifiable | aucune entité reach/node utilisée |
| `STATION_DOMINANCE` | non détecté | top station environ 4.8% des lignes, sous seuil 20% |
| `LEAKAGE_SUSPECTED` | non détecté automatiquement | persistence test J+1 NSE = 0.3925, J+7 NSE = -0.3824 |

## Recommandations D.1

- Garder `hydraulic_direction_validated=false`.
- Ne pas créer de propagation officielle à partir de E1.1.
- Préparer un futur run E1.2 graph-aware uniquement après environnement ML stable.
- Ajouter un contrôle D.1 : une feature graph ou lag propagation ne peut être évaluée que si les sources hydro/météo ont une complétude temporelle acceptable.
- Ajouter un statut `GRAPH_NOT_TESTED` pour les runs ML station-level sans feature graph.

## Conclusion

E1.1 fournit un feedback négatif utile : le pipeline hydro station-level fonctionne, mais le socle n'est pas encore prêt pour un run graph-aware robuste. La priorité avant E1.2 est l'environnement ML reproductible et la politique de missing/freshness.
