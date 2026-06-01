# Phase E.1-E.4 — Stabilisation Runtime du Moteur Hydrologique

## Statut

Date : 2026-05-14  
Statut : `RUNTIME_TOPOLOGY_STABILIZED__HYDRAULIC_DIRECTION_NOT_VALIDATED`

## Objectif

Stabiliser le moteur hydrologique comme moteur topologique robuste et auditable, sans le présenter comme moteur hydraulique scientifique.

## Architecture runtime réelle

Le runtime consomme un contrat unique :

| Élément | Table / module |
|---|---|
| Arêtes runtime | `geo_work.reseau_hydro_edges_final` |
| Nœuds runtime | `geo_work.reseau_hydro_edges_final_vertices_pgr` |
| Résolution contrat | `backend/app/services/hydrology/runtime_config.py` |
| Graphe mémoire | `backend/app/services/hydrology/graph_builder.py` |
| Routage | `backend/app/services/hydrology/routing_service.py` |
| QA | `backend/app/services/hydrology/topology_qa.py` |

Les tables `raw`, `noded` et `noded_preview` restent des artefacts d'audit/reconstruction. Elles ne doivent pas être mélangées avec le runtime courant.

## Règle d'orientation

Aucune inversion automatique d'arête n'est autorisée sur la base de `Z_Max > Z_Min`.

Le runtime conserve `source -> target` tel que produit par la topologie active. Le contrat expose :

- `hydraulic_direction_validated = false`
- `direction_validated = false`
- `scientific_mode = topology_visual_demo`

## Logique de fallback

1. Essayer un chemin dirigé `source -> target`.
2. Si aucun chemin n'existe, essayer un chemin non orienté.
3. Si le fallback réussit, retourner `used_fallback = true` et `routing_quality = topology_connected_undirected_fallback`.
4. Ne jamais présenter le fallback comme un écoulement hydraulique validé.

## Contrat API runtime

Les réponses de `/api/v1/routing/downstream-to-garde` exposent explicitement :

| Champ | Signification |
|---|---|
| `routing_quality` | Qualité topologique du chemin |
| `direction_validated` | Toujours `false` en Phase E |
| `hydraulic_direction_validated` | Toujours `false` en Phase E |
| `used_fallback` | `true` si chemin non orienté utilisé |
| `scientific_mode` | `topology_visual_demo` |
| `network_component` | Composant du nœud de départ |
| `topology_status` | Statut global du runtime |
| `runtime_contract` | Tables runtime utilisées |

## Contrat QA frontend

Le frontend doit afficher :

- `Routage topologique visuel`
- `Direction hydraulique non validée`
- `Fallback non orienté utilisé` si `used_fallback = true`

Le mode QA cartographique conserve :

- composant principal en vert ;
- composants secondaires colorés ;
- cycles en violet ;
- micro-segments en rouge ;
- flèches comme indicateur de direction topologique, pas de direction hydraulique validée.

## Limites scientifiques

Le runtime ne calcule pas :

- vitesse hydraulique réelle ;
- temps de transfert physique ;
- dilution ;
- concentration ;
- interaction barrage/rejet ;
- validation MNT ;
- modèle SWAT/WASP.

Les ETA et scores de risque restent fictifs.

## Risques résiduels

| Risque | Niveau | Mitigation |
|---|---|---|
| Confusion entre topologie et hydraulique | Critique | Champs API + badges frontend |
| Source/target topologique non hydraulique | Critique | `direction_validated=false` |
| Fallback perçu comme scientifique | Élevé | `used_fallback=true` visible |
| Composants encore fragmentés | Élevé | QA + backlog snapping contrôlé |
| Tables de reconstruction réutilisées par erreur | Moyen | `TopologyRuntimeConfig` |

## Roadmap suivante

1. Consolider les composants résiduels sans snapping inter-bassin automatique.
2. Introduire le parentage des segments finalisés.
3. Construire une validation hydraulique basée MNT.
4. Passer seulement ensuite à un routage orienté hydrauliquement validé.
