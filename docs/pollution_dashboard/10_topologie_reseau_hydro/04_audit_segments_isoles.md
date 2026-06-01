# Audit : Segments Isolés et Nœuds Morts

Les segments isolés (disconnected components) posent un risque majeur pour l'algorithme de routage : une pollution tombant sur un segment isolé n'atteindra jamais le barrage de garde.

## Typologie des isolements
1. **Micro-gaps** : L'affluent s'arrête à 10m du fleuve. (Gérable par `pgr_createTopology` avec tolérance).
2. **Sous-réseaux orphelins** : Un oued entier de plusieurs kilomètres n'est pas numérisé jusqu'à sa confluence.
3. **Segments Dangles** : Morceaux de lignes numérisés en trop, ne menant nulle part.

## Solution Technique (Phase B)
1. **Snapping Backend** : Lors d'un clic utilisateur, s'assurer que le point d'impact se snap sur le **composant principal** du graphe (le grand réseau interconnecté) via `pgr_connectedComponents`.
2. **Rapport QA** : Fournir une vue SQL `v_reseau_isole` pour l'équipe SIG afin de corriger la source.
