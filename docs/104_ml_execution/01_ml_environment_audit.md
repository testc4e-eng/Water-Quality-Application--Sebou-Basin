# Audit de l'Environnement ML Sandbox

## 1. Contexte
Suite à l'exécution de E1.1, la baseline persistence a été lancée avec succès, mais les modèles XGBoost et LightGBM n'ont pas pu être exécutés en raison d'un environnement instable ou incomplet.

## 2. Statut des Librairies Cibles

| Librairie | Statut Actuel | Version Recommandée |
|---|---|---|
| Python | 3.12 | 3.12 |
| numpy | Conflits/Erreurs d'import | >= 1.26.0 |
| pandas | Conflits/Erreurs d'import | >= 2.2.0 |
| scikit-learn | Manquant / Non fonctionnel | >= 1.4.0 |
| xgboost | Manquant | >= 2.0.3 |
| lightgbm | Manquant | >= 4.3.0 |

## 3. Analyse des Conflits
L'import instable de `numpy` et `pandas` bloque l'intégralité du pipeline E1.2. Il est impératif de recréer un environnement Python sain pour la sandbox ML avant de lancer toute expérimentation avec XGBoost et LightGBM.
