# Sprint 2.0 - Architecture Analytique Multi-Support

Ce dossier contient la spécification technique renforcée pour le Sprint 2.0. 
L'objectif est de définir l'architecture permettant l'analyse croisée (multi-support, multi-paramètres, multi-objets) avant le démarrage de tout développement.

## Structure de la documentation

- [01_specifications_multi_support.md](01_specifications_multi_support.md) : Modèle unifié `AnalyticalSeries`
- [02_modele_analysis_workspace.md](02_modele_analysis_workspace.md) : Modèle d'espace de travail `AnalysisWorkspace` et panneaux
- [03_store_zustand.md](03_store_zustand.md) : Stratégie de state management frontend (Zustand)
- [04_contrat_api_batch_series.md](04_contrat_api_batch_series.md) : Contrat du endpoint prioritaire `POST /batch`
- [05_regles_unites_axes.md](05_regles_unites_axes.md) : Règles de gestion des unités et multi-axes Y
- [06_panneaux_analytiques.md](06_panneaux_analytiques.md) : Typologie et comportement des panneaux V1
- [07_regles_metier_croisements.md](07_regles_metier_croisements.md) : Croisements autorisés et alertes
- [08_plan_implementation_sprint2.md](08_plan_implementation_sprint2.md) : Séquencement du Sprint 2
- [09_limites_et_reports.md](09_limites_et_reports.md) : Limites identifiées et endpoints reportés

## Critères GO Sprint 2
Le Sprint 2 pourra démarrer lorsque :
- le modèle `AnalysisWorkspace` est validé ;
- le contrat `/analysis/series/batch` est validé ;
- les règles unités/axes sont validées ;
- les croisements métier autorisés sont validés ;
- les reports sont explicitement listés.
