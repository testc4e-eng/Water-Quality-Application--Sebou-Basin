# Backlog de Réparation du Réseau (Network Repair Backlog)

## 1. Contexte
Le réseau hydrographique actuel contient des défauts (Analytics Graph). L'objectif est d'isoler ces défauts sans bloquer l'évolution du graphe ni les expérimentations ML.

## 2. Inventaire des Anomalies Structurées

| Catégorie | Description | Impact | Priorité | Blocage ML | Blocage Graph |
|---|---|---|---|---|---|
| **A** | Tronçons manquants | Rupture de la propagation en cascade | Haute | Non | Partiel |
| **B** | Tronçons inversés | Direction hydraulique erronée | Critique | Non | Oui |
| **C** | Points isolés | Pas de features de voisinage possibles | Faible | Non | Non |
| **D** | Composantes déconnectées | Graphes disjoints, sous-réseaux orphelins | Moyenne | Non | Partiel |
| **E** | Stations sans reach | Impossibilité de rattacher la mesure au graphe | Haute | Non | Oui |

## 3. Règle de Gestion Temporaire
Toutes les anomalies seront indexées. Les points de la catégorie C, D, et E seront placés dans une `GRAPH_QUARANTINE` le temps que le SIG (ou une inférence experte) résolve le problème.
