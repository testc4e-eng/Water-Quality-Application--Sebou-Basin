# Graph Model Build

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | specification / design |
| Périmètre | intégration graph-aware dans `model_build` |
| Source de vérité | Non |
| Documents liés | `13_graph_governance.md`, `06_model_build_specification.md`, `08_qa_validation_framework.md` |
| Dernière mise à jour | 2026-05-22 |

## 1. Objectif

Ce document prépare l'intégration graph-aware dans :

- `model_build.build_reaches` ;
- topology et voisinage amont/aval ;
- propagation ;
- hydraulic routing ;
- QA et quarantine graph.

Aucune table n'est créée et aucune topologie n'est validée par ce document.

## 2. `build_reaches` enrichment

Champs conceptuels à ajouter plus tard à `model_build.build_reaches` ou à une table auxiliaire :

```sql
-- NON EXECUTE - SPECIFICATION ONLY
graph_node_id uuid,
upstream_reach_ids uuid[],
downstream_reach_ids uuid[],
edge_weight numeric,
propagation_time_estimate numeric,
graph_quality_score numeric,
graph_valid_from timestamptz,
graph_valid_to timestamptz,
graph_snapshot_id uuid,
topology_confidence numeric,
hydraulic_validation_status text
```

Règles :

- `graph_snapshot_id` est obligatoire pour toute feature graph-aware ;
- `hydraulic_validation_status` reste `PENDING` tant que SIG/QA ne valide pas la direction ;
- `edge_weight` ne doit pas être interprété comme causal sans `causal_confidence`.

## 3. Propagation governance

Champs candidats :

| Champ | Usage | Dépendance |
|---|---|---|
| `propagation_delay_hours` | délai estimé entre deux reaches/nœuds | Anas + SIG/QA |
| `hydraulic_travel_time` | temps de transit hydraulique | validation hydraulique |
| `seasonal_connectivity` | connectivité saisonnière | hydrologie |
| `lag_uncertainty_hours` | incertitude sur le lag | QA |
| `propagation_confidence` | confiance globale propagation | Anas + QA |

Règle : aucune propagation officielle ne doit être calculée avec un lag non documenté.

## 4. Graph QA

| Contrôle | Description | Blocking |
|---|---|---|
| cycle detection | cycles topologiques suspects | selon contexte |
| orphan reach | reach sans connexion attendue | oui pour Graph AI |
| disconnected node | nœud isolé | selon usage |
| invalid edge direction | direction incohérente | oui propagation |
| propagation inconsistency | lag ou influence impossible | oui |
| topology drift | changement snapshot non certifié | oui publication |
| unstable neighborhood | voisinage changeant sans version | oui ML |

## 5. Graph lineage

Champs / concepts :

| Élément | Usage |
|---|---|
| `graph_snapshot_lineage` | relie snapshot, sources et transformations |
| `edge_generation_method` | méthode de création arêtes |
| `neighbor_selection_logic` | règle voisinage amont/aval |
| `graph_construction_version` | version du pipeline graph |
| `propagation_lineage` | source des délais/poids propagation |

Règles :

- tout reach graph-aware doit pointer vers un snapshot ;
- tout changement de voisinage doit produire une nouvelle version ;
- lineage incomplet = `SANDBOX_GRAPH` maximum.

## 6. Graph quarantine

Raisons candidates :

| Quarantine reason | Description | Impact |
|---|---|---|
| `topology_partial_failure` | sous-graphe incomplet | bloque Graph AI |
| `upstream_sensor_missing` | observation amont absente | dégrade features |
| `unresolved_spatial_conflict` | conflit station/site/reach | bloque publication |
| `graph_dependency_failure` | snapshot/lineage/contract absent | bloque ML |
| `invalid_edge_direction` | direction non crédible | bloque propagation |
| `seasonal_connectivity_unknown` | régime non défini | limite forecasting |

Impacts :

- ML : features graph exclues ou sandbox ;
- features : `graph_quality_score` dégradé ;
- forecasting : pas de propagation officielle ;
- publication : interdite au-delà d'`INTERNAL_ANALYTICS`.

## 7. Dépendances ouvertes

| Domaine | Dépendance |
|---|---|
| SIG/QA | topology, orphelins, conflits, direction |
| Reda | sous-bassins/reaches SWAT+ et HRU |
| Anas | segments WASP et propagation |
| Data governance | graph snapshot, topology hash, certification |

