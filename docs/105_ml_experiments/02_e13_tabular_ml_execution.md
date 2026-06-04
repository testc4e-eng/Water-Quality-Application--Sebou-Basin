# E1.3 - Tabular ML Execution

> [!WARNING]
> ML_SANDBOX_ONLY  
> NON_OPERATIONAL_RESULTS

## Objectifs
Passer d'une simple ligne de base (Persistance) à l'évaluation de véritables algorithmes d'apprentissage tabulaire (Random Forest, XGBoost, LightGBM) en mesurant leur capacité à prédire les débits à J+1 et J+7.

## Features Utilisées (V1)
- **Hydro :** `q_lag_1`, `q_lag_3`, `q_lag_7`, `q_lag_14`, `q_lag_30`, `rolling_mean_7`, `rolling_mean_30`, `rolling_std_30`.
- **Météo :** `rain_1d`, `rain_3d`, `rain_7d`, `rain_30d`, `dry_days`, `wet_season_flag`.
- *(Note : L'évaporation a été exclue de la V1 en raison d'environ 74 % de valeurs nulles).*

## Protocole
- **Split temporel strict :** Entraînement avant 2019-01-01, Validation avant 2021-01-01, Test à partir de 2021-01-01. Aucun shuffle pour éviter tout *leakage*.

## Modèles Entraînés et Résultats
Modèles testés : Persistance (Baseline), Random Forest, XGBoost, LightGBM.

**J+1 :**
- Persistance : NSE = 0.7161
- LightGBM : NSE = 0.7214
- *Analyse : La persistance est déjà très compétitive à court terme.*

**J+7 :**
- Persistance : NSE = -0.2090
- LightGBM : NSE = 0.1934
- *Analyse : Effondrement total de la persistance. LightGBM améliore nettement la prévision en rattrapant la tendance (inertie).*

## Limites Observées
Les algorithmes sont très dépendants des features inertielles locales (`rolling_mean_7` et `q_lag_1` dominent). À J+7, bien que LightGBM soit meilleur que la persistance, le modèle plafonne très vite, démontrant les limites de l'approche purement temporelle sans spatialisation.
