# ML Feedback To Graph Governance

## Objectif

Transformer les signaux observés pendant E1 en observations utiles pour D.1 Graph Governance, sans corriger automatiquement la topologie.

## Règles

- E1 observe, D.1 gouverne.
- Aucun modèle ML ne valide une direction hydraulique.
- Aucun score ML ne certifie une propagation.
- Toute suspicion devient une observation QA, pas une correction.

## Signaux à remonter

| Signal E1 | Observation D.1 | Action candidate |
|---|---|---|
| performance irréaliste | `LEAKAGE_SUSPECTED` | audit anti-leakage |
| graph feature trop dominante | `GRAPH_FEATURE_DOMINANCE` | vérifier topology_confidence |
| upstream lag incohérent | `PROPAGATION_LAG_SUSPECT` | revoir délai hydraulique |
| station isolée très performante | `STATION_DOMINANCE` | contrôler représentativité |
| feature instable | `FEATURE_STABILITY_LOW` | rétrograder trust |
| reach orphelin détecté indirectement | `GRAPH_ORPHAN_SUSPECT` | proposer quarantine |

## Sortie recommandée

Chaque observation devrait contenir:

- `run_id` ;
- `feature_name` ;
- `canonical_entity_id` si disponible ;
- `station_id` si disponible ;
- `observation_type` ;
- `severity` ;
- `evidence` ;
- `recommended_d1_action` ;
- `created_at`.

