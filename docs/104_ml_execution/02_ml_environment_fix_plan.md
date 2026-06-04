# Plan de Correction de l'Environnement ML

## 1. Objectif
Stabiliser l'environnement d'exécution Python 3.12 pour le sous-projet `sandbox/ml_hydro_baseline/` afin de permettre l'exécution des modèles ML tabulaires (XGBoost, LightGBM, Random Forest).

## 2. Fichier `requirements.txt` Cible

```text
# Environnement Sandbox ML Hydro
# Compatible Python 3.12

numpy>=1.26.0
pandas>=2.2.0
scikit-learn>=1.4.0
xgboost>=2.0.3
lightgbm>=4.3.0
matplotlib>=3.8.0
seaborn>=0.13.0
joblib>=1.3.2
```

## 3. Plan de Déploiement
1. Création d'un environnement virtuel isolé (venv ou conda).
2. Installation stricte via le `requirements.txt` défini.
3. Test d'import simple des 5 bibliothèques clés.
4. Lancement d'un mini-run (dry-run) avec XGBoost sur un échantillon de 100 lignes du dataset hydro pour validation technique.
