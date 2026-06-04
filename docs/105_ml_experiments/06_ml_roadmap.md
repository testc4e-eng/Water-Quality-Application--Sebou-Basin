# Roadmap Officielle du Machine Learning

> [!WARNING]
> ML_SANDBOX_ONLY  
> NON_OPERATIONAL_RESULTS

## État d'Avancement (DONE)
- **E1.1 - Dataset Extraction :** Socle de données gelé (519 236 lignes, 38 stations, hash vérifié).
- **E1.3 - Tabular ML Execution :** Validation de l'environnement Python et obtention de la baseline ML (LightGBM, XGBoost, RandomForest) face à la persistance.
- **E1.4 - Hydrological Regime Evaluation :** Identification des failles critiques (Instabilité chronique à J+7 en période de crue par manque d'information géographique amont).

## Étape Actuelle / Suivante (NEXT)
- **E1.5 - Graph Snapshot V0 :** 
  *Priorité absolue*. Structuration de la topologie hydrographique pour agréger les variables spatiales (pluies amont, débits cumulés amont) avant toute nouvelle complexification algorithmique.

## Visions à Moyen / Long Terme (LATER)
- **Graph Features :** Intégration des features spatialisées au sein des modèles tabulaires.
- **Graph-aware ML :** Modèles hybrides.
- **LSTM (Deep Learning Temporal) :** Réseaux de neurones récurrents, une fois les features spatiales consolidées.
- **GNN (Graph Neural Networks) :** Algorithmes nativement topologiques.

---

## Rapport à l'attention du Directeur Général (DG)

**1. Investissements réalisés**
- Extraction sécurisée (Safe Mode / Read Only) d'un historique de 519k lignes couvrant la période 1956-2025.
- Mise en place de pipelines analytiques de nouvelle génération, isolés en environnement "Sandbox", ne perturbant pas l'IT opérationnelle actuelle.
- Étude exhaustive du comportement de 3 algorithmes de pointe par rapport à la méthode de référence existante.

**2. Résultats obtenus**
- Nous avons démontré la capacité algorithmique à devancer la persistance sur des horizons de 7 jours, grâce aux techniques arborescentes (LightGBM notamment).
- Le diagnostic des limites est scientifique et sans ambiguïté : la marge de progression dépend désormais de la topologie du réseau et non plus de l'algorithmique pure.

**3. Risques identifiés**
- Un déploiement immédiat en production d'un modèle tabulaire générerait de fausses alertes (lissage intempestif) lors des épisodes extrêmes de crue. Le risque d'erreur opérationnelle est réel si l'information spatiale n'est pas intégrée.

**4. Prochaines étapes**
- Suspension temporaire de l'exploitation purement statistique au profit de la construction du *Graph Snapshot V0*. Cette étape permettra aux algorithmes de "voir" l'onde de crue arriver de l'amont, condition essentielle pour passer à terme d'un statut Sandbox à un statut Opérationnel.
