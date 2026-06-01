# Graph Governance

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | specification / design |
| Périmètre | gouvernance graph-ready pour SAD Sebou |
| Source de vérité | Non - préparation avant validation topologique SIG/QA |
| Documents liés | `00_SOURCE_OF_TRUTH_MASTER.md`, `03_ai_knowledge_base/MEMORY_CORE.md`, `06_model_build_specification.md`, `07_feature_store_specification.md`, `08_qa_validation_framework.md` |
| Dernière mise à jour | 2026-05-22 |

## 1. Objectif

Ce document prépare la gouvernance Graph Ready sans lancer de Graph AI.

| Niveau | Définition | Statut SAD Sebou |
|---|---|---|
| graph-ready | données, QA, lineage et snapshots préparés pour un futur graphe | objectif actuel |
| graph-aware | features et modèles classiques utilisant voisinage/topologie | étape suivante |
| graph-native | GNN, embeddings, tenseurs graph temporels | futur, non lancé |

Le projet ne lance pas encore de GNN parce que :

- la topologie et la direction hydraulique ne sont pas officiellement validées ;
- les mappings stations/reaches/sites restent dépendants de SIG/QA ;
- les mappings SWAT/WASP restent dépendants de Reda et Anas ;
- les graph snapshots doivent être reproductibles avant tout entraînement.

Stratégie progressive :

```text
graph governance
→ graph features SQL
→ XGBoost spatial
→ temporal graph windows
→ LSTM hydro
→ Hybrid GNN/LSTM futur
```

## 2. Cross references

| Référence | Usage |
|---|---|
| `docs/00_SOURCE_OF_TRUTH_MASTER.md` | vision cible et garde-fous projet |
| `docs/03_ai_knowledge_base/MEMORY_CORE.md` | mémoire IA courte |
| `06_model_build_specification.md` | reaches, scenarios, lineage et status system |
| `07_feature_store_specification.md` | graph-aware features et training windows |
| `08_qa_validation_framework.md` | QA spatial, graph quarantine, certification |
| Mission Reda | validation SWAT/SWAT+ et sous-bassins/reaches |
| Mission Anas | validation WASP, segments, propagation |
| Audit spatial IDP | doublons, orphelins, conflits, sites pollution |
| Runtime hydrologique topologique | `geo_work.reseau_hydro_edges_final`, direction non validée |

## 3. Graph governance tables

```sql
-- NON EXECUTE - SPECIFICATION ONLY
CREATE TABLE metadata.graph_entity_types (
    graph_entity_type_id uuid PRIMARY KEY,
    entity_type_code text NOT NULL UNIQUE,
    description text NOT NULL,
    canonical_source text,
    validation_domain text NOT NULL,
    validation_authority text,
    graph_usage_status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metadata.graph_relationship_types (
    graph_relationship_type_id uuid PRIMARY KEY,
    relationship_type_code text NOT NULL UNIQUE,
    directionality text NOT NULL,
    default_edge_weight numeric,
    requires_hydraulic_validation boolean NOT NULL DEFAULT false,
    requires_causal_confidence boolean NOT NULL DEFAULT false,
    validation_domain text NOT NULL,
    description text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metadata.graph_semantic_rules (
    graph_semantic_rule_id uuid PRIMARY KEY,
    rule_code text NOT NULL UNIQUE,
    source_entity_type text NOT NULL,
    relationship_type_code text NOT NULL,
    target_entity_type text NOT NULL,
    allowed_direction text NOT NULL,
    validation_status text NOT NULL,
    qa_blocking_level text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metadata.graph_snapshots (
    graph_snapshot_id uuid PRIMARY KEY,
    graph_version text NOT NULL,
    topology_hash text NOT NULL,
    graph_valid_from timestamptz,
    graph_valid_to timestamptz,
    graph_freeze_status text NOT NULL,
    graph_certification_scope text NOT NULL,
    graph_reproducibility_level text NOT NULL,
    graph_lineage_id uuid,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (graph_version, topology_hash)
);

CREATE TABLE metadata.graph_certification_registry (
    graph_certification_id uuid PRIMARY KEY,
    graph_snapshot_id uuid NOT NULL,
    graph_certification_status text NOT NULL,
    graph_certification_scope text NOT NULL,
    topology_qa_status text NOT NULL,
    hydraulic_validation_status text NOT NULL,
    validation_authority text,
    certification_comment text,
    created_at timestamptz NOT NULL DEFAULT now()
);
```

## 4. Graph entity types

| Entity type | Description | Dépendance |
|---|---|---|
| `STATION` | station de mesure canonique | SIG/QA |
| `BARRAGE` | barrage / ouvrage | SIG/QA |
| `REACH` | tronçon réseau hydrographique | SIG/QA + Anas |
| `SUBBASIN` | sous-bassin ABH/SWAT | SIG/QA + Reda |
| `HRU` | unité hydrologique SWAT+ | Reda |
| `POLLUTION_SOURCE` | source de pollution ponctuelle | SIG/QA |
| `INDUSTRIAL_SITE` | site industriel | SIG/QA |
| `HYDRO_SENSOR` | capteur hydro | QA |
| `QUALITY_SENSOR` | point qualité/labo | QA |
| `SAMPLING_POINT` | point de prélèvement | SIG/QA |
| `EVENT_NODE` | événement crue/pollution/sécheresse | event ontology future |

## 5. Graph relationship types

| Relation | Direction | Edge weight | Causal confidence | Hydraulic confidence | Validation status | Lineage source |
|---|---|---|---|---|---|---|
| `UPSTREAM_OF` | directed | distance/travel time | required | required | TO_VALIDATE | topology |
| `DOWNSTREAM_OF` | directed | distance/travel time | required | required | TO_VALIDATE | topology |
| `CONNECTED_TO` | undirected/directed | distance | optional | optional | TO_VALIDATE | spatial |
| `DISCHARGES_INTO` | directed | load/flow | required | required | TO_VALIDATE | pollution + topology |
| `MONITORS` | directed | relevance | optional | optional | TO_VALIDATE | station/site mapping |
| `INFLUENCES` | directed | influence score | required | optional | TO_VALIDATE | model/QA |
| `PROPAGATES_TO` | directed | lag/confidence | required | required | TO_VALIDATE | Anas + topology |
| `HYDRAULICALLY_CONNECTED` | directed | hydraulic confidence | required | required | TO_VALIDATE | SIG/QA |
| `SEMANTICALLY_LINKED` | directed/undirected | semantic score | optional | no | TO_VALIDATE | metadata |

## 6. Topology hash policy

Topology hash candidate :

```text
topology_hash = SHA256(
  sorted(reach_ids)
  + sorted(upstream_reach_ids)
  + sorted(downstream_reach_ids)
  + graph_version
)
```

Règles :

- l'ordre des entrées doit être déterministe ;
- tout changement de reach, voisinage ou version change le hash ;
- un snapshot certifié doit être gelé ;
- rollback = retour à un `graph_snapshot_id` et `topology_hash` connus ;
- retraining ML/Graph doit référencer le snapshot utilisé ;
- deux modèles ne sont comparables que si leurs graph snapshots sont compatibles ou explicitement documentés.

## 7. Graph snapshots

Champs candidats :

| Champ | Usage |
|---|---|
| `graph_snapshot_id` | identifiant immutable du graphe |
| `graph_version` | version fonctionnelle |
| `topology_hash` | reproductibilité topologique |
| `graph_valid_from` | début validité |
| `graph_valid_to` | fin validité |
| `graph_freeze_status` | DRAFT/FROZEN/DEPRECATED |
| `graph_certification_scope` | SANDBOX_GRAPH/SCIENTIFIC_GRAPH/OFFICIAL_GRAPH |
| `graph_reproducibility_level` | PARTIAL/FULL/SCIENTIFIC_GRADE |
| `graph_lineage_id` | lineage de construction |

## 8. Seasonal graph topology

Le Sebou peut présenter une connectivité variable selon le régime hydrologique. La gouvernance graph doit prévoir :

| Champ | Usage |
|---|---|
| `hydrological_regime` | dry, wet, flood, drought, normal |
| `seasonal_connectivity` | connectivité par saison/régime |
| `graph_activation_condition` | condition d'activation d'une relation |
| `hydraulic_state` | flowing, intermittent, dry, unknown |

Implications :

- un oued intermittent peut être connecté en saison humide et non propagatif en saison sèche ;
- les features de propagation doivent porter leur régime ;
- un snapshot officiel doit déclarer si la saisonnalité est modélisée ou ignorée ;
- les modèles ML ne doivent pas mélanger des graphes saisonniers sans `graph_snapshot_id`.

## 9. Graph certification machine

```text
UNVALIDATED
→ SANDBOX_GRAPH
→ ANALYTICS_GRAPH
→ SCIENTIFIC_GRAPH
→ OFFICIAL_GRAPH
```

| Transition | QA minimum | Autorité | Conditions |
|---|---|---|---|
| `UNVALIDATED` -> `SANDBOX_GRAPH` | structure chargeable | Data governance | lineage minimal |
| `SANDBOX_GRAPH` -> `ANALYTICS_GRAPH` | spatial QA non bloquante | SIG/QA | graph snapshot hashé |
| `ANALYTICS_GRAPH` -> `SCIENTIFIC_GRAPH` | topology + hydraulic validation | SIG/QA + Anas/Reda selon usage | reproductibilité FULL |
| `SCIENTIFIC_GRAPH` -> `OFFICIAL_GRAPH` | certification + freeze | DG / ABH | publication contrôlée |

Blocages :

- drift topologique non résolu ;
- orphelins critiques ;
- direction hydraulique non validée pour usage propagation ;
- lineage incomplet ;
- graph snapshot non gelé.

## 10. Graph risks

| Risque | Impact | Mitigation |
|---|---|---|
| topology hallucination | propagation inventée | certification et QA topology |
| false connectivity | liens faux | validation SIG/QA |
| graph leakage | voisinage futur utilisé | graph snapshots + temporal windows |
| unstable graph snapshots | modèles non comparables | topology hash |
| graph reproducibility illusion | audit impossible | freeze + lineage |
| seasonal mismatch | propagation hors régime | seasonal graph topology |
| unresolved topology | Graph AI non fiable | quarantine |
| invalid propagation | causalité erronée | causal/hydraulic confidence |

