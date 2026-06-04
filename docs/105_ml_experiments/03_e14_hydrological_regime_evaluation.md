# E1.4 - Hydrological Regime Evaluation

> [!WARNING]
> ML_SANDBOX_ONLY  
> NON_OPERATIONAL_RESULTS

## Méthode de Classification
Afin de comprendre la robustesse hydrologique des modèles, les prédictions ont été évaluées selon deux typologies de régimes :

**Par année hydrologique (Cumul de précipitations) :**
- `DRY_YEAR` (Cumul annuel <= P33)
- `NORMAL_YEAR` (P33 < Cumul <= P66)
- `WET_YEAR` (Cumul > P66)

**Par période journalière (Percentiles de débits historiques) :**
- `LOW_FLOW_PERIOD` (Débit station <= P10)
- `NORMAL_FLOW_PERIOD` (P10 < Débit <= P95)
- `FLOOD_PERIOD` (Débit > P95)

## Résultats et Analyse par Régime

**1. Étiage (LOW_FLOW_PERIOD)**
La variance naturelle des débits y est très faible (rivières presque à sec). Bien que la MAE soit mathématiquement excellente, les modèles de ML produisent un léger "bruit" prédictif là où la persistance reste parfaitement plate, entraînant un NSE négatif.

**2. Crues (FLOOD_PERIOD)**
C'est le régime le plus critique. À J+7, la persistance génère une erreur massive (RMSE ~99, NSE < -5.8). Les modèles de ML, notamment LightGBM, amortissent fortement cette erreur (RMSE ~37, NSE ~0.03), mais ce lissage empêche de prévoir avec acuité le pic précis de la crue.

**3. Années Sèches vs Humides (DRY_YEAR / WET_YEAR)**
Les performances sont relativement asymétriques. En année sèche, les algorithmes de ML sont souvent sur-pénalisés sur le score NSE à cause du manque de variance des données, tandis qu'ils affichent une prédictibilité modérée en année humide.

## Limites Observées et Justification Scientifique
L'instabilité chronique à J+7 lors des épisodes de crue confirme que les features purement tabulaires et locales (pluie de la station, lag de la station) sont structurellement insuffisantes. Scientifiquement, une onde de crue est un événement spatialisé : le modèle "ne voit pas" la crue se former en amont ni le temps de parcours nécessaire pour atteindre la station. L'information topologique fait totalement défaut.
