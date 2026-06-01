# Graph Feature Store

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | specification / design |
| Périmètre | graph-aware features, temporal graph windows, future Graph AI datasets |
| Source de vérité | Non |
| Documents liés | `13_graph_governance.md`, `14_graph_model_build.md`, `07_feature_store_specification.md`, `08_qa_validation_framework.md` |
| Dernière mise à jour | 2026-05-22 |

## 1. Objectif

Préparer :

- graph-aware features ;
- temporal graph windows ;
- datasets futurs Graph AI ;
- ML graph-safe ;
- XGBoost spatial et LSTM hydro pré-GNN.

Aucun embedding, aucun GNN et aucun entraînement ne sont lancés.

## 2. Graph feature families

### Graph structure features

| Feature | Description | Dépendance |
|---|---|---|
| `node_degree` | nombre de connexions | graph snapshot |
| `betweenness_centrality` | centralité réseau | topology validated |
| `graph_depth` | profondeur amont/aval | direction validée |
| `upstream_station_count` | stations amont | station/reach mapping |
| `downstream_barrage_distance` | distance barrage aval | SIG/QA |
| `upstream_pollution_pressure` | pression pollution amont | Anas + SIG/QA |
| `downstream_risk_score` | score risque aval | governance |
| `edge_flow_weight` | poids arête basé débit/longueur | hydraulic validation |

### Temporal graph features

| Feature | Description | Leakage risk |
|---|---|---|
| `upstream_NO3_lag_24h` | NO3 amont décalé 24h | lag leakage |
| `upstream_q_lag_t` | débit amont au lag t | delayed availability |
| `rolling_upstream_pollution` | pollution amont rolling | sparse quality leakage |
| `graph_temporal_gradient` | gradient temporel amont/aval | graph temporal mismatch |
| `event_wave_velocity` | vitesse vague événement | invalid transit delay |
| `temporal_neighbor_mean` | moyenne voisins temporels | future neighbor leakage |

### Graph quality features

| Feature | Description |
|---|---|
| `topology_confidence` | confiance topologique |
| `graph_quality_score` | score global graphe |
| `graph_connectivity_score` | connectivité exploitable |
| `orphan_risk_score` | risque entité orpheline |
| `propagation_consistency_score` | cohérence propagation |

## 3. Graph training windows

Table candidate :

```sql
-- NON EXECUTE - SPECIFICATION ONLY
CREATE TABLE feature_store.fs_graph_training_windows (
    graph_training_window_id uuid PRIMARY KEY,
    graph_snapshot_id uuid NOT NULL,
    sequence_id uuid NOT NULL,
    timestep_index integer NOT NULL,
    sequence_length integer NOT NULL,
    forecast_horizon integer NOT NULL,
    node_features jsonb NOT NULL,
    edge_features jsonb NOT NULL,
    target_values jsonb NOT NULL,
    graph_temporal_context jsonb NOT NULL,
    as_of_date date NOT NULL,
    target_date date NOT NULL,
    dataset_contract_code text NOT NULL,
    temporal_policy_code text NOT NULL,
    qa_status text NOT NULL,
    leakage_risk text NOT NULL,
    lineage_id uuid,
    created_at timestamptz NOT NULL DEFAULT now()
);
```

Règles :

- `graph_snapshot_id` obligatoire ;
- pas de fenêtre graph officielle sans topology hash ;
- `sequence_id` ne doit pas traverser un changement de snapshot non documenté ;
- `target_values` doivent respecter observed/modeled policy.

## 4. Graph anti-leakage

| Leakage | Exemple | Mitigation |
|---|---|---|
| upstream lag leakage | lag utilise observation future | `event_time + lag <= as_of_date` |
| future propagation leakage | propagation calculée avec état aval futur | cutoff strict |
| delayed upstream observations | mesure amont connue après coup | `data_available_at` |
| graph temporal mismatch | features d'un snapshot postérieur | `graph_snapshot_id` |
| invalid transit delay | délai arbitraire trop court | validation Anas/SIG |
| sparse quality graph leakage | NO3 amont après `as_of_date` | freshness + cutoff |

## 5. Graph QA features

Champs candidats :

| Champ | Usage |
|---|---|
| `graph_stability_score` | stabilité du snapshot |
| `feature_stability_score` | stabilité de la feature |
| `topology_confidence` | confiance topologique |
| `graph_freshness` | âge du snapshot/topology |
| `graph_drift_status` | drift topologique ou structurel |

Statuts :

- `GRAPH_FEATURE_SANDBOX` ;
- `GRAPH_FEATURE_QA_READY` ;
- `GRAPH_FEATURE_VALIDATED` ;
- `GRAPH_FEATURE_BLOCKED` ;
- `GRAPH_FEATURE_STALE`.

## 6. Graph Ready roadmap

| Horizon | Objectif |
|---|---|
| court terme | graph governance, graph QA, graph features SQL, topology validation |
| moyen terme | XGBoost spatial, LSTM hydro, temporal graph features |
| long terme | GNN, Hybrid Graph + LSTM, graph embeddings, causal propagation AI |

## 7. Risques

| Risque | Impact | Mitigation |
|---|---|---|
| graph leakage | performances fausses | anti-leakage graph |
| orphan propagation | propagation depuis entité non fiable | graph quarantine |
| topology drift | modèles non comparables | graph snapshots |
| unstable graph windows | séquences non reproductibles | snapshot freeze |
| invalid propagation lag | causalité fausse | propagation governance |
| stale graph snapshots | features obsolètes | graph freshness |
| graph contamination legacy | legacy utilisé official | certification scope |

## 8. TO_VALIDATE

| Domaine | Points à valider |
|---|---|
| SIG/QA | topology, direction, graph quarantine |
| Reda | sous-bassins SWAT/HRU et graph-aware SWAT |
| Anas | propagation, segments WASP, lag |
| Data governance | graph snapshots, contracts, feature status |
| DG | périmètre future publication graph |

