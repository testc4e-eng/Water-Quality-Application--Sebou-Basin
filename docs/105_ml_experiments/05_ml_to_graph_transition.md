# Transition vers le Graph (ML to Graph)

> [!WARNING]
> ML_SANDBOX_ONLY  
> NON_OPERATIONAL_RESULTS

## Pourquoi le Graph Snapshot devient prioritaire

L'analyse de l'évaluation des régimes hydrologiques (E1.4) a mis en évidence un point de rupture fondamental :
**Les modèles tabulaires ne sont pas limités par l'algorithme (XGBoost, LightGBM, Random Forest) mais par l'absence d'information spatiale amont/aval.**

### L'Échec relatif en crue
Les crues à J+7 restent mal anticipées. Le modèle local observe les pluies de sa station, mais il ne peut pas quantifier la masse d'eau (débit et pluie) tombée en amont, ni estimer son temps d'arrivée (routing).

### Le besoin d'information spatiale et amont
Pour prévoir une crue, la donnée primordiale n'est pas le lag temporel local, mais la somme des débits actuellement observés sur le sous-bassin hydrographique en amont. L'information géographique est une condition *sine qua non* d'amélioration. Les features purement locales ont atteint leur asymptote de performance.

## Pourquoi le Graph Snapshot passe AVANT le Deep Learning

On pourrait être tenté de lancer immédiatement l'entraînement de réseaux de neurones (LSTM ou GNN). Cependant :
1. **L'échec du LSTM "Local" :** Un réseau LSTM entraîné sur les mêmes séries temporelles myopes subira le même échec algorithmique en période de crue, car il restera aveugle à la topologie.
2. **Le Graph Snapshot comme fondation (E1.5) :** Il est impératif d'industrialiser un "Graph Snapshot" afin d'agréger statiquement les features topologiques (ex: cumul des pluies des nœuds parents) pour les injecter sous forme tabulaire simple dans un premier temps.

**Conclusion :** Le prochain gain majeur ne viendra pas du Deep Learning, mais de la structuration des features spatiales. L'étape E1.5 consistera donc à forger cette topologie hydrographique.
