# ML Lessons Learned

> [!WARNING]
> ML_SANDBOX_ONLY  
> NON_OPERATIONAL_RESULTS

## Synthèse des Enseignements (Phases E1.1 à E1.4)

### Ce qui fonctionne
- **L'infrastructure ML locale :** L'extraction, le paramétrage du split temporel strict et la mise en œuvre de la baseline tabulaire (Random Forest, XGBoost, LightGBM) s'opèrent avec fiabilité.
- **Les tendances court terme :** À J+1, la persistance et les moyennes mobiles courtes (`rolling_mean_7`, `q_lag_1`) suffisent à obtenir d'excellents scores.
- **La robustesse de LightGBM :** Comparativement, LightGBM a montré la meilleure résilience mathématique face aux effondrements de performance de la persistance (notamment à J+7).

### Ce qui ne fonctionne pas
- **L'anticipation des crues à long terme (J+7) :** Les modèles tabulaires sont incapables de prédire avec précision le pic d'une crue majeure à J+7. Ils ont tendance à "lisser" excessivement pour éviter l'explosion de l'erreur.
- **La prédiction en période de sécheresse sévère :** L'optimisation algorithmique est contre-productive lors des très basses eaux où la persistance absolue est la méthode la plus fiable.

### Données utiles vs inutiles
- **Données utiles :** `q_lag_1` (J+1), `rolling_mean_7` (Tendance forte), `q_lag_30` (Contexte hydrologique), précipitations temporelles (`dry_days`, `rain_3d`).
- **Données inutiles/exclues (V1) :** Évaporation (plus de 74% de données nulles dans les séries historiques).

### Limites du ML purement temporel
Les expérimentations E1.3 et E1.4 prouvent définitivement qu'un modèle tabulaire reposant uniquement sur les séries temporelles locales d'une station souffre de *myopie spatiale*. Les dynamiques hydrologiques du bassin du Sebou exigent la prise en compte explicite des flux amont-aval et des temps de routage géographiques.
