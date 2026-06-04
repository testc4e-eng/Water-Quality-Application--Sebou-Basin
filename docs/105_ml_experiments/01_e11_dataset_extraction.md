# E1.1 - Dataset Extraction

> [!WARNING]
> ML_SANDBOX_ONLY  
> NON_OPERATIONAL_RESULTS

## Extraction et Paramétrage

- **Source :** PostgreSQL (Accès en lecture seule strict)
- **Cible :** `sandbox/ml_hydro_baseline/datasets/`
- **Taille du dataset :** 519 236 lignes
- **Stations :** 38 stations hydrologiques
- **Période historique :** 1956 → 2025

## Hash et Reproductibilité

Afin de garantir la stricte reproductibilité des expérimentations de la Sandbox, un freeze du dataset a été opéré.
- **Fichier de référence :** `hydro_ml_baseline_v0_sandbox_20260522_122901.csv`
- **Hash SHA-256 :** `a1d4a95709562a3c57c143b8bb982f1e010ffabf3817f4430ad3f3b38dcce26e`

## Politique de Freeze

Le dataset est figé (frozen). Toute expérimentation tabulaire de la phase E1 (E1.3, E1.4) utilise exclusivement ce hash. Toute divergence par rapport à ce hash entraîne l'échec des pipelines de validation.
