# Stratégie de Classification des Régimes Hydrologiques

## 1. Contexte
Afin d'éviter qu'un modèle performe globalement bien mais échoue sur des années atypiques, il est crucial d'identifier et de tagger les régimes hydrologiques avant tout entraînement ML (LSTM / GNN).

## 2. Classification Cible
- **DRY (Sec)** : Déficit pluviométrique sévère, débits d'étiage prolongés.
- **NORMAL (Normal)** : Année hydrologique standard proche des moyennes décennales.
- **WET (Humide)** : Excédent pluviométrique, forte recharge.
- **FLOOD (Crue extrême)** : Épisodes isolés mais massifs de crues historiques.

## 3. Critères Candidats et Variables Nécessaires
- **Cumul pluviométrique annuel / saisonnier** : Comparaison avec la moyenne historique.
- **Débit de base (Baseflow)** : Analyse de récession.
- **Indice de Précipitation Standardisé (SPI)**.
- **Niveau des retenues (Barrages)** : Optionnel mais très qualifiant.

## 4. Faisabilité avec Données Existantes
Le dataset de 1956 à 2025 permet de calculer statistiquement des percentiles de débits et de précipitations pour classer chaque année hydrologique. C'est réalisable *immédiatement* via une approche purement analytique (Pandas) sans ajout de données.

## 5. Résultats de la Phase E1.4 (Sandbox Evaluation)
L'évaluation E1.4 a mis en évidence la forte dépendance des performances prédictives au régime hydrologique :
- **En étiage (LOW_FLOW_PERIOD)** : Les modèles de Machine Learning (RF, XGB, LGBM) peinent à battre la persistance car ils sont pénalisés par la très faible variance naturelle. Ils ont tendance à prédire du bruit là où le débit est parfaitement plat.
- **En crue (FLOOD_PERIOD)** : La persistance s'effondre totalement (RMSE > 99, NSE < -5 à J+7). LightGBM démontre une résilience critique (RMSE divisée par 3, NSE positif) mais reste insuffisant pour anticiper finement le pic exact de l'onde de crue.

## 6. Limites Actuelles
L'instabilité chronique à J+7 lors des épisodes de crue confirme que les features purement tabulaires et locales (pluie de la station, lag de la station) sont insuffisantes. Le modèle "ne voit pas" la crue arriver depuis l'amont.

## 7. Recommandations (Vers E1.5)
1. Ne **pas** passer au LSTM immédiatement. Le LSTM avec les mêmes features locales échouera tout autant en crue.
2. Priorité absolue : **Graph Snapshot V0**. Il est impératif d'intégrer la dimension spatiale (débits amont, pluies amont routées par la topologie) pour capturer les ondes de crue avant de complexifier les algorithmes.
