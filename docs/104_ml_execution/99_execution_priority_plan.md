# Rapport de Priorisation d'Exécution ML (Phase E1.2)

Suite à l'exécution de la baseline (E1.1), voici le plan priorisé pour exécuter la suite de manière contrôlée, avec les ressources et données existantes.

## P1 : ML Environment (Correction & Stabilisation)
- **Effort :** Faible
- **Risque :** Faible (isolation Python)
- **Dépendances :** Aucune
- **Gains attendus :** Débloque l'exécution de XGBoost, LightGBM et l'extraction de l'importance des variables.
- **Exécutable immédiatement :** OUI

## P2 : Feature Inventory (Inventaire & Feature Engineering)
- **Effort :** Moyen (Code Pandas analytique)
- **Risque :** Faible
- **Dépendances :** Stabilisation P1
- **Gains attendus :** Amélioration massive des performances vs persistence grâce aux variables décalées (lags) et glissantes (rolling).
- **Exécutable immédiatement :** OUI

## P3 : Hydrological Regimes (Classification des années)
- **Effort :** Faible à Moyen
- **Risque :** Faible
- **Dépendances :** Aucune
- **Gains attendus :** Permet d'évaluer la robustesse des modèles sur des années sèches vs années humides.
- **Exécutable immédiatement :** OUI

## P4 : Network Repair Backlog (Audit topologique organisé)
- **Effort :** Faible (Catégorisation existante)
- **Risque :** Faible
- **Dépendances :** SIG (pour la résolution future)
- **Gains attendus :** Sanctuarise la qualité du graphe sans en bloquer l'usage analytique.
- **Exécutable immédiatement :** OUI

## P5 : Graph Snapshot V0 (Working Graph)
- **Effort :** Moyen
- **Risque :** Moyen (Bruit possible lié à l'incomplétude)
- **Dépendances :** P4 (identification de la quarantaine)
- **Gains attendus :** Introduction de `topology_confidence` et extraction de `node_degree` pour améliorer les modèles tabulaires P2.
- **Exécutable immédiatement :** OUI

## P6 : LSTM Readiness (Préparation Deep Learning)
- **Effort :** Moyen
- **Risque :** Élevé (complexité temporelle, hyperparamètres)
- **Dépendances :** P1, P2 (Feature Store temporel prêt)
- **Gains attendus :** Capture de la dynamique temporelle non-linéaire sur du long terme.
- **Exécutable immédiatement :** NON (Préparation uniquement, l'implémentation requiert P1 et P2).
