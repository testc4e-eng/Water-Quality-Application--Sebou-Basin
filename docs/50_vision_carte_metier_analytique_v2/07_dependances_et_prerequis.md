# Dépendances et Prérequis

La fondation technologique pour la V2 repose sur l'intégrité de la classification des supports.

## 1. La règle de dépendance
```text
CORRECTION_CLASSIFICATION_SQL → GO_SPRINT_2C → VISION_V2
```

## 2. Pourquoi cette séquence
- **Mode Support (2C)** : Les widgets détachables nécessitent que chaque objet carte ait un `support_type` fiable, sans doublons ni mélange de responsabilités.
- **Mode Domaine (2D)** : La sélection d'un phénomène (ex: Qualité) nécessite que la séparation Qualité / Pollution soit irréprochable au niveau de la base de données.
- **Cartes Thématiques (2E)** : L'interpolation territoriale repose sur le fait que les données de chaque support soient propres et traçables spatialement.
