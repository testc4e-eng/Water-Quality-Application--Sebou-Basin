# Pre-ML Readiness & First ML Pilot

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | specification / design |
| Périmètre | premier pilote ML hydro contrôlé, LSTM sandbox, graph-aware sandbox, readiness scoring |
| Source de vérité | Non - préparation avant entraînement réel et validation scientifique |
| Documents liés | `06_model_build_specification.md`, `07_feature_store_specification.md`, `08_qa_validation_framework.md`, `13_graph_governance.md`, `14_graph_model_build.md`, `15_graph_feature_store.md` |
| Dernière mise à jour | 2026-05-22 |

## 1. Objectif Phase E

La Phase E démarre maintenant parce que les couches de gouvernance, Model Build, Feature Store, QA/Lineage et Graph Ready sont suffisamment spécifiées pour préparer un premier pilote ML sans attendre les validations finales SWAT/WASP.

| Point | Décision |
|---|---|
| Reda / SWAT | ne bloque pas E1/E2, car le premier pilote hydro utilise des observations hydro/météo, pas les outputs SWAT finaux |
| Anas / WASP | ne bloque pas E1/E2, car WASP concerne surtout qualité/propagation et reste hors premier baseline hydro |
| SIG/QA | bloque seulement les features spatiales/graph validées, pas le baseline hydro station-centric |
| Graph AI | reste différé : Phase E autorise seulement des features graph-aware sandbox |
| SWAT/WASP legacy | restent `LEGACY_MODELING_TO_REPLACE`, non utilisables comme vérité officielle |

Différence de statuts ML :

| Statut | Définition | Usage |
|---|---|---|
| `ML_SANDBOX` | test méthodologique non officiel | exploration contrôlée |
| `ML_SCIENTIFIC` | modèle validé scientifiquement par domaine | décision technique limitée |
| `ML_OFFICIAL` | modèle certifié et publiable | SAD/DG/client |

Phase E prépare uniquement `ML_SANDBOX`.

## 2. Découpage Phase E

| Sous-phase | Objectif | Statut cible |
|---|---|---|
| E0 - Préparation et garde-fous | cadrer sources, exclusions, contracts, anti-leakage | READY_SANDBOX |
| E1 - Hydro ML baseline XGBoost/LightGBM | préparer baseline débit J+1/J+7 | READY_SANDBOX |
| E2 - LSTM hydro sandbox | préparer conditions séquentielles | NEAR_READY |
| E3 - Graph-aware ML sandbox | préparer features graph simples non officielles | WAIT_SPATIAL_QA |
| E4 - Feedback loop E vers D.1 | formaliser remontée des signaux ML vers Graph Governance | READY_SANDBOX |
| E5 - Readiness scoring et décisions | matrice de décision datasets | READY_SANDBOX |

## 3. Dataset hydro ML baseline

### Sources candidates

| Source | Usage | Statut |
|---|---|---|
| `hydro.mesure_debit` | cible débit et lags hydro | VERIFIED source available |
| `meteo.mesure_precipitation` | pluie cumulée / antecedent rainfall | VERIFIED source available |
| `meteo.mesure_evaporation` | évaporation rolling | VERIFIED source available |
| `infra.stations_mesure` | entités station | VERIFIED source available |
| `model_build.build_hydro_series` | future source gouvernée | SPECIFICATION_ONLY |
| `feature_store.fs_hydro_daily` | future features | SPECIFICATION_ONLY |
| `feature_store.fs_meteo_daily` | future features | SPECIFICATION_ONLY |

### Variables cibles

| Target | Définition | Usage |
|---|---|---|
| `q_m3s_t_plus_1` | débit station à J+1 | baseline forecasting court terme |
| `q_m3s_t_plus_7` | débit station à J+7 | horizon hebdomadaire |

### Features candidates

| Famille | Features | Anti-leakage |
|---|---|---|
| hydro lag | `q_lag_1d`, `q_lag_3d`, `q_lag_7d`, `q_lag_30d` | uniquement dates <= `as_of_date` |
| hydro rolling | mean/max/min/std 3/7/30 jours | fenêtre strictement passée |
| hydro variability | coefficient variation, peak flags | sans target window |
| meteo rainfall | pluie cumulée 1/3/7/30 jours | jusqu'à `as_of_date` |
| dry days | jours sans pluie avant `as_of_date` | strict passé |
| evaporation | rolling 7/30 jours | strict passé |
| seasonality | mois, saison hydrologique, jour année | autorisé |

### Règles anti-leakage

- `event_time <= as_of_date` pour toutes les features.
- `target_date = as_of_date + forecast_horizon_days`.
- aucune valeur hydro à `target_date` ou postérieure dans les features.
- aucune correction future sans `data_available_at`.
- splits temporels stricts : train < validation < test.

### Split temporel candidat

| Split | Règle candidate | Statut |
|---|---|---|
| train | historique ancien jusqu'à T1 | TO_VALIDATE |
| validation | période intermédiaire T1-T2 | TO_VALIDATE |
| test | période récente T2-T3 | TO_VALIDATE |
| hydrological split | années hydrologiques complètes | TO_VALIDATE |

### Baselines

| Baseline | Définition |
|---|---|
| persistence J+1 | `q_t_plus_1 = q_t` |
| rolling mean | moyenne 7 jours passée |
| seasonal climatology | moyenne même période historique |
| XGBoost sandbox | gradient boosting tabulaire |
| LightGBM sandbox | gradient boosting tabulaire alternatif |

### Métriques

| Métrique | Usage |
|---|---|
| RMSE | erreurs fortes |
| MAE | erreur moyenne robuste |
| NSE | performance hydrologique |
| R² | variance expliquée |

Limitations :

- pas de modèle officiel ;
- pas de spatial graph validé ;
- qualité eau exclue du baseline hydro initial ;
- les stations avec séries trop courtes ou trop discontinues sont exclues ou sandbox uniquement.

## 4. LSTM hydro sandbox

Conditions minimales :

| Condition | Exigence |
|---|---|
| séries continues | gaps documentés et imputations interdites sans policy |
| horizon | J+1 puis J+7 |
| window length | candidates 30, 60, 90 jours |
| features | débit, pluie, évaporation, saison |
| normalisation | par station ou globale, à documenter |
| split | strictement temporel |
| target leakage | interdit |
| statut | `SANDBOX` uniquement |

Préparation séquentielle :

```text
sequence_id
station_id
timestep_index
window_start
window_end
as_of_date
target_date
forecast_horizon_days
features[t-window:t]
target[t+h]
```

Exclusions :

- stations avec séries trop courtes ;
- fenêtres traversant gaps majeurs non qualifiés ;
- corrections futures ;
- graph features non validées ;
- outputs SWAT/WASP legacy comme target.

## 5. Graph-aware ML sandbox

Features graph simples candidates :

| Feature | Usage | Statut |
|---|---|---|
| `upstream_station_count` | densité observation amont | WAIT_SPATIAL_QA |
| `node_degree` | connectivité simple | WAIT_SPATIAL_QA |
| `distance_to_barrage` | contexte ouvrage | WAIT_SPATIAL_QA |
| `upstream_flow_lag` | signal amont retardé | SANDBOX_ONLY |
| `topology_confidence` | pondération QA | WAIT_SPATIAL_QA |

Champs obligatoires :

```text
hydraulic_direction_inferred = true
hydraulic_direction_validated = false
topology_confidence
propagation_confidence
graph_snapshot_id
```

Interdictions :

- aucun GNN ;
- aucun graph embedding ;
- aucune propagation officielle ;
- aucune publication décisionnelle ;
- aucune promotion au-delà de sandbox sans SIG/QA.

## 6. Graph anti-leakage

Règles :

| Risque | Règle de blocage |
|---|---|
| upstream lag leakage | `event_time + propagation_delay <= as_of_date` |
| delayed upstream observations | utiliser `data_available_at`, pas seulement `event_time` |
| transit delay uncertainty | lag sans incertitude = sandbox only |
| lag leakage | lag calibré sur test interdit |
| sparse quality graph leakage | dernière mesure qualité amont doit être <= `as_of_date` |
| graph temporal mismatch | `graph_snapshot_id` constant par training window |

Blocages :

- `hydraulic_direction_validated=false` interdit toute propagation officielle ;
- `topology_confidence` faible rétrograde les features graph en `DEGRADED` ou `BLOCKED`;
- observations amont retardées sans disponibilité connue = `QUARANTINE`.

## 7. Direction hydraulique inférée

| Statut | Définition | Usage autorisé | Usage interdit |
|---|---|---|---|
| inferred | direction dérivée topologiquement | sandbox, diagnostics, graph-aware exploratory | reporting, official propagation |
| validated | direction validée SIG/hydraulique | futures features scientifiques | non applicable aujourd'hui |

Champs QA :

| Champ | Usage |
|---|---|
| `hydraulic_direction_inferred` | indique inférence topologique |
| `hydraulic_direction_validated` | doit rester false tant que non validé |
| `topology_confidence` | confiance structurelle |
| `propagation_confidence` | confiance de propagation |
| `qa_status` | statut QA global |

Règle : une feature peut utiliser une direction inférée uniquement si son statut est `SANDBOX` et si le risque est visible dans le dataset contract.

## 8. ML_TO_GRAPH_FEEDBACK

La Phase E doit produire des signaux de retour vers D.1 Graph Governance, sans corriger automatiquement le graphe.

| Observation ML | Feedback vers D.1 | Effet attendu |
|---|---|---|
| feature graph trop importante anormalement | créer suspicion `graph_leakage_or_shortcut` | revue anti-leakage |
| upstream lag suspect | signaler `lag_uncertainty_high` | graph quarantine possible |
| reach orphelin détecté par importance nulle | signaler `possible_orphan_or_unused_reach` | revue SIG/QA |
| performance trop élevée | suspicion leakage | bloquer certification |
| station amont incohérente | signaler mapping station/reach suspect | revue mapping |
| feature instable selon split | rétrograder `feature_stability_score` | feature DEGRADED |

Règles de boucle :

- aucun feedback ML ne modifie directement la topologie ;
- tout feedback devient anomalie/observation QA ;
- la graph quarantine reste décidée par SIG/QA ou Data Governance ;
- `topology_confidence` ne peut être améliorée que par validation, pas par performance ML ;
- une feature graph instable peut être rétrogradée automatiquement dans la documentation de readiness, pas en DB.

## 9. Pre-ML readiness score

| Dataset | Readiness | Blocages | Usage autorisé |
|---|---|---|---|
| hydro daily station baseline | READY_SANDBOX | contracts et QA à formaliser avant exécution | XGBoost/LightGBM sandbox |
| hydro LSTM sequences | NEAR_READY | gaps, normalisation, windows à figer | LSTM sandbox design |
| graph-aware hydro | WAIT_SPATIAL_QA | topology, direction, mappings | exploratory only |
| SWAT surrogate | WAIT_REDA | runs validés, variables, calibration | non lancé |
| WASP surrogate | WAIT_ANAS | segments, unités, scenarios | non lancé |
| quality sparse ML | NEAR_READY | freshness, sparse policy, targets | préparation future |
| pollution event ML | WAIT_SPATIAL_QA | events, sites, propagation | préparation future |

Statuts :

| Statut | Définition |
|---|---|
| READY_SANDBOX | peut être préparé/testé hors production |
| NEAR_READY | proche mais règles à verrouiller |
| WAIT_SPATIAL_QA | dépend validation spatiale/topologie |
| WAIT_REDA | dépend validation SWAT |
| WAIT_ANAS | dépend validation WASP |
| BLOCKED | non exploitable |

## 10. Décisions à valider

### TO_VALIDATE_WITH_SIG_QA

- station/reach mapping pour graph-aware features ;
- statut direction hydraulique inférée ;
- seuils `topology_confidence` ;
- graph quarantine triggers ;
- exclusion des reaches orphelins.

### TO_VALIDATE_WITH_REDA

- compatibilité future features hydro avec SWAT+ ;
- horizons utiles pour calibration ;
- conditions de surrogate SWAT ;
- exclusions outputs legacy ;
- variables SWAT candidates plus tard.

### TO_VALIDATE_WITH_ANAS

- lags et propagation WASP futurs ;
- usage de qualité sparse dans propagation ;
- conditions de surrogate WASP ;
- variables WASP candidates plus tard ;
- interdiction de propagation officielle tant que topology non validée.

### TO_VALIDATE_WITH_DATA_GOVERNANCE

- dataset contract hydro baseline ;
- temporal split final ;
- anti-leakage checklist ;
- feature stability et reproducibility scoring ;
- règles de rétrogradation des features instables ;
- ML_TO_GRAPH_FEEDBACK workflow.

### TO_VALIDATE_WITH_DG

- périmètre autorisé du pilote sandbox ;
- interdiction d'usage décisionnel ;
- conditions futures de passage à `ML_SCIENTIFIC` ;
- règles de communication des résultats ;
- critères d'arrêt si leakage suspecté.

