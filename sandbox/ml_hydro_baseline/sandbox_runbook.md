# Sandbox Runbook - Hydro ML Baseline v0

## Objectif

Exécuter un premier pipeline ML hydro sandbox pour observer les problèmes réels du pipeline SAD Sebou.

## Préconditions

| Précondition | Statut attendu |
|---|---|
| DB accessible en lecture seule | TO_VALIDATE |
| colonnes hydro/météo confirmées | TO_VALIDATE |
| config figée | REQUIRED |
| run_id créé | REQUIRED |
| extraction timestamp enregistrée | REQUIRED |

## Séquence

1. Vérifier que la session DB est en lecture seule.
2. Extraire les données hydro/météo vers `datasets/` avec un nom horodaté.
3. Calculer `dataset_hash`.
4. Calculer `feature_list_hash`, `split_config_hash`, `model_config_hash`.
5. Construire les targets `q_t_plus_1` et `q_t_plus_7`.
6. Appliquer strict temporal split.
7. Entraîner persistence baseline.
8. Entraîner XGBoost sandbox si dépendance disponible.
9. Entraîner LightGBM sandbox si dépendance disponible.
10. Calculer RMSE, MAE, NSE, R2.
11. Produire feature importance.
12. Écrire observations `ML_TO_GRAPH_FEEDBACK` si signal graph ou temporel suspect.
13. Marquer le run `ML_SANDBOX_ONLY`.

## Règles de nommage run

```text
run_YYYYMMDD_HHMMSS_hydro_ml_baseline_v0_sandbox
```

## Critères de sortie

Un run est utile même si le modèle est mauvais, si le rapport capture clairement:

- gaps ;
- leakage suspect ;
- séries inutilisables ;
- features mortes ;
- split fragile ;
- limites d'extraction.

## Interdictions

- overwrite de run ;
- random split ;
- résultat officiel ;
- correction automatique des données ;
- propagation graph officielle.

