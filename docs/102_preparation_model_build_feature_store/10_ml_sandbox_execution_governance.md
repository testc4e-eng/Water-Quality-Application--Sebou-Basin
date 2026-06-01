# Phase E1 - First Real ML Sandbox Execution Governance

| Champ | Valeur |
|---|---|
| Statut | SANDBOX_EXECUTION_PREPARED |
| Mode | SAFE MODE / SANDBOX ONLY / NON DESTRUCTIVE / TRACE EVERYTHING |
| Date | 2026-05-22 |
| Dataset cible | `hydro_ml_baseline_v0_sandbox` |
| Résultats officiels | Interdits |
| Graph AI | Interdit |
| Source of truth | Non, document d'exécution sandbox |

## 1. Objectif

Phase E1 marque le passage de l'architecture théorique vers une expérimentation gouvernée.

L'objectif n'est pas de produire un bon modèle, ni une conclusion scientifique officielle. L'objectif est d'observer le comportement réel du pipeline ML hydro-temporel afin de révéler les problèmes que les audits et spécifications ne peuvent pas détecter complètement :

- gaps temporels cachés ;
- timestamps incohérents ;
- leakage réel ou caché ;
- features mortes ;
- stations dominantes ;
- séries inutilisables ;
- fraîcheur incohérente ;
- instabilité saisonnière ;
- splits temporels fragiles ;
- problèmes de lineage ou de reproductibilité.

## 2. Pourquoi E1 démarre avant E.1 complète

| Point | Décision |
|---|---|
| Gouvernance complète | continue en parallèle |
| Exécution E1 | autorisée en sandbox strict |
| Reda / SWAT | ne bloque pas, car E1 utilise l'hydro observé |
| Anas / WASP | ne bloque pas, car E1 ne produit pas de surrogate qualité officiel |
| SIG/QA | ne bloque pas le baseline hydro station, mais bloque toute propagation officielle graph |
| Outputs SWAT/WASP legacy | exclus comme vérité terrain |

ASSUMPTION: les tables hydro/météo observées contiennent assez de données pour un premier diagnostic sandbox.

TO_VALIDATE: disponibilité réelle des colonnes, granularités et clés station lors de l'extraction lecture seule.

## 3. Sandbox vs scientific vs official

| Niveau | Usage | Conditions | Interdictions |
|---|---|---|---|
| `ML_SANDBOX_ONLY` | observation pipeline, diagnostic technique | freeze minimal, logs, seed, config | publication métier, DG reporting |
| `ML_SCIENTIFIC` | analyse scientifique interne | QA validée, contrats dataset, review métier | usage décisionnel officiel |
| `ML_OFFICIAL` | support décisionnel / reporting | certification, validation DG, reproductibilité complète | toute donnée legacy non validée |

E1 ne peut produire que `ML_SANDBOX_ONLY`.

## 4. Risques acceptés et risques interdits

### Risques acceptés

| Risque | Justification | Garde-fou |
|---|---|---|
| colonnes à adapter | exploration réelle nécessaire | runbook et rapport d'observation |
| gaps temporels | objectif du run | métriques de complétude |
| features faibles | objectif du run | feature importance et trust levels |
| performance faible | acceptable | comparaison baseline naïve |

### Risques interdits

| Risque | Règle |
|---|---|
| modification DB | interdit |
| random split | interdit |
| overwrite de run | interdit |
| promotion scientifique | interdit |
| graph propagation officielle | interdit |
| GNN / embeddings | interdit |
| usage SWAT/WASP legacy comme vérité | interdit |

## 5. Dataset sandbox minimal

Dataset:

```text
hydro_ml_baseline_v0_sandbox
```

Sources candidates lecture seule:

| Source | Usage | Statut |
|---|---|---|
| `hydro.mesure_debit` | cible débit, lags débit | VERIFIED source available |
| `meteo.mesure_precipitation` | rainfall rolling | VERIFIED source available |
| `meteo.mesure_evaporation` | evaporation rolling | VERIFIED source available |

Cibles:

| Cible | Définition | Usage |
|---|---|---|
| `q_t_plus_1` | débit observé à J+1 | baseline court terme |
| `q_t_plus_7` | débit observé à J+7 | baseline horizon hebdomadaire |

Features minimales:

| Feature | Famille | Trust initial |
|---|---|---|
| `q_lag_1` | hydro observed | VERY_HIGH |
| `q_lag_7` | hydro observed | VERY_HIGH |
| `rainfall_1d` | meteo observed | HIGH |
| `rainfall_7d` | meteo observed rolling | HIGH |
| `rainfall_30d` | meteo observed rolling | HIGH |
| `evap_7d` | meteo observed rolling | HIGH |
| `evap_30d` | meteo observed rolling | HIGH |
| `month` | temporal deterministic | VERY_HIGH |
| `wet_season_flag` | temporal heuristic | MEDIUM |

## 6. Freeze minimal obligatoire

Chaque run E1 doit enregistrer les champs suivants avant entraînement:

| Champ | Obligatoire | Rôle |
|---|---:|---|
| `dataset_snapshot_date` | oui | date logique d'extraction |
| `dataset_hash` | oui | preuve d'immuabilité dataset |
| `feature_list_hash` | oui | preuve liste features |
| `split_config_hash` | oui | preuve split temporel |
| `model_config_hash` | oui | preuve config modèle |
| `random_seed` | oui | reproductibilité |
| `extraction_timestamp` | oui | horodatage exécution |
| `training_cutoff_date` | oui | anti-leakage |
| `run_id` | oui | identifiant immutable |

Règle: aucun run ne doit écraser un run antérieur. Un nouveau run crée un nouveau dossier horodaté.

## 7. Splits temporels stricts

Règles:

- split chronologique obligatoire ;
- aucune répartition aléatoire ;
- aucune observation future dans le train ;
- validation entre train et test ;
- test en dernière période ;
- les targets `J+1` et `J+7` doivent respecter le cutoff.

Configuration candidate:

| Split | Fenêtre candidate | Statut |
|---|---|---|
| train | début série à `2018-12-31` | TO_VALIDATE |
| validation | `2019-01-01` à `2020-12-31` | TO_VALIDATE |
| test | `2021-01-01` à dernière date exploitable | TO_VALIDATE |

TO_VALIDATE: les dates doivent être adaptées aux périodes réellement disponibles par station.

## 8. Hydrological regime splits

Le run doit produire une variable candidate:

```text
hydrological_regime_candidate
```

Heuristique provisoire:

| Régime | Règle candidate | Statut |
|---|---|---|
| `DRY_YEAR` | rainfall annuel < p33 station/bassin | ASSUMPTION |
| `WET_YEAR` | rainfall annuel > p66 station/bassin | ASSUMPTION |
| `NORMAL_YEAR` | entre p33 et p66 | ASSUMPTION |
| `FLOOD_PERIOD` | q > p95 station | ASSUMPTION |
| `LOW_FLOW_PERIOD` | q < p10 station | ASSUMPTION |

Ces classes servent au diagnostic, pas à une certification hydrologique.

## 9. Baseline models

Modèles autorisés en E1:

| Modèle | Statut | Règle |
|---|---|---|
| persistence baseline | REQUIRED | `q_hat_t_plus_1 = q_t` |
| rolling baseline | REQUIRED | moyenne glissante débit |
| XGBoost | SANDBOX_ONLY | tuning minimal |
| LightGBM | SANDBOX_ONLY | tuning minimal |

Interdit:

- tuning massif ;
- AutoML non contrôlé ;
- stacking ;
- deep learning officiel ;
- GNN ;
- embeddings graph.

## 10. Metrics

Métriques obligatoires:

| Metric | Usage |
|---|---|
| RMSE | erreur absolue sensible aux pics |
| MAE | erreur robuste |
| NSE | qualité hydrologique relative |
| R2 | variance expliquée |

Chaque métrique doit être calculée contre:

- validation ;
- test ;
- baseline persistence ;
- horizon `J+1` ;
- horizon `J+7`.

## 11. Feature importance analysis

E1 doit produire:

- feature importance native modèle ;
- permutation importance candidate si le coût reste acceptable ;
- liste des features mortes ;
- liste des features dominantes ;
- suspicion leakage si performance ou importance anormale.

Signaux suspects:

| Signal | Interprétation candidate |
|---|---|
| performance quasi parfaite | leakage possible |
| `rainfall_30d` domine tout | problème station/saison à inspecter |
| `month` domine | modèle saisonnier pauvre ou cible trop cyclique |
| feature graph domine | topology/leakage à remonter D.1 |
| `q_lag_1` trop dominant | baseline persistence forte, normal mais à comparer |

## 12. ML_TO_GRAPH_FEEDBACK

E1 doit produire des observations formelles vers D.1 Graph Governance.

| Observation ML | Action D.1 candidate |
|---|---|
| feature graph trop importante anormalement | marquer `graph_observation=LEAKAGE_SUSPECTED` |
| upstream lag suspect | réduire `propagation_confidence` provisoire |
| station amont incohérente | créer issue SIG/QA candidate |
| reach orphelin avec importance nulle | proposer graph quarantine |
| performance trop élevée | ouvrir contrôle anti-leakage |
| feature instable selon split | rétrograder feature trust level |

Règle: E1 ne corrige pas le graphe. E1 remonte des observations.

## 13. Feature trust levels

| Niveau | Définition | Exemples |
|---|---|---|
| VERY_HIGH | observation directe, unité claire, horodatage exploitable | débit observé |
| HIGH | observation directe ou dérivé simple | rainfall station rolling |
| MEDIUM | heuristique ou agrégation sensible | wet season flag |
| LOW | topologie inférée non validée | upstream_flow_lag |
| VERY_LOW | propagation estimée non validée | propagation estimate |

## 14. Topology confidence formula provisoire

Proposition non officielle:

```text
topology_confidence =
(
  connectivity_score
  + direction_consistency
  + orphan_penalty
  + spatial_alignment_score
  + graph_stability_score
) / weighted_sum
```

Cette formule est une base de discussion. Elle ne doit pas être utilisée pour certifier une propagation officielle.

## 15. Outputs sandbox

Structure préparée:

```text
sandbox/ml_hydro_baseline/
    datasets/
    configs/
    runs/
    reports/
    metrics/
    feature_importance/
    sql/
```

Tous les outputs sont `SANDBOX_ONLY`.

## 16. Observations à capturer

Le premier run doit capturer:

- gaps cachés ;
- fraîcheur incohérente ;
- timestamps invalides ;
- séries inutilisables ;
- dérives saisonnières ;
- features instables ;
- leakage ;
- domination station ;
- saisonnalité forte ;
- comportements hydrologiques réels ;
- problèmes de jointure hydro/météo ;
- limites des splits.

## 17. Décisions à valider après premier run

### TO_VALIDATE_WITH_SIG_QA

- stations utilisables pour graph-aware sandbox ;
- direction hydraulique inférée ;
- reaches orphelins ;
- conflits spatiaux révélés par ML.

### TO_VALIDATE_WITH_REDA

- cohérence débit observé pour SWAT ;
- stations calibrables ;
- périodes hydrologiquement pertinentes ;
- limites du baseline face à SWAT futur.

### TO_VALIDATE_WITH_ANAS

- usage futur des signaux hydro pour WASP ;
- risques de confusion hydro/qualité ;
- limites avant surrogate WASP.

### TO_VALIDATE_WITH_DATA_GOVERNANCE

- format de run immutable ;
- hashes obligatoires ;
- modèle de rapport sandbox ;
- promotion éventuelle vers `ML_SCIENTIFIC`.

### TO_VALIDATE_WITH_DG

- interdiction de reporting métier ;
- vocabulaire de communication ;
- séparation expérimentation / décision.

## 18. Références opérationnelles sandbox

| Artefact | Rôle |
|---|---|
| `sandbox/ml_hydro_baseline/sandbox_runbook.md` | procédure de run |
| `sandbox/ml_hydro_baseline/dataset_freeze_policy_sandbox.md` | freeze minimal |
| `sandbox/ml_hydro_baseline/feature_trust_levels.md` | trust features |
| `sandbox/ml_hydro_baseline/ml_feedback_to_graph.md` | boucle D.1 |
| `sandbox/ml_hydro_baseline/hydrological_regime_split_strategy.md` | splits régime |

## 19. E1.1 - First real sandbox training run

| Champ | Valeur |
|---|---|
| Statut | `SANDBOX_BASELINE_EXECUTED` |
| Run ID | `run_20260522_143742_hydro_ml_baseline_v0_sandbox` |
| Dataset | `hydro_ml_baseline_v0_sandbox_20260522_122901.csv` |
| Dataset hash | `a1d4a95709562a3c57c143b8bb982f1e010ffabf3817f4430ad3f3b38dcce26e` |
| Modèle exécuté | persistence baseline |
| XGBoost | non exécuté, dépendance absente |
| LightGBM | non exécuté, dépendance absente |
| scikit-learn | non exécuté, dépendance absente |
| NumPy / pandas | installés mais import instable dans l'environnement courant |
| Statut résultats | `ML_SANDBOX_ONLY` |

Constats sandbox :

- le pipeline minimal fonctionne avec un runner Python standard library ;
- les splits strictement temporels sont non vides ;
- aucune fuite temporelle évidente n'est détectée par la baseline persistence ;
- les features évaporation sont fortement lacunaires, environ 74% de valeurs nulles ;
- l'horizon `J+7` généralise mal sur test avec persistence baseline ;
- aucun signal graph ne peut être conclu, car E1.1 n'utilise pas de feature graph-aware.

Artefacts locaux :

- `sandbox/ml_hydro_baseline/runs/run_20260522_143742_hydro_ml_baseline_v0_sandbox/` ;
- `sandbox/ml_hydro_baseline/reports/ml_to_graph_feedback_run_20260522_143742_hydro_ml_baseline_v0_sandbox.md`.

Règle : ces artefacts restent `ML_SANDBOX_ONLY` et ne peuvent pas être utilisés pour une conclusion scientifique, métier, opérationnelle ou DG.
