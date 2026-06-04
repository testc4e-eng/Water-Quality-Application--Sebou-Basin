# Sprint 1.5 — KPI / Alert / Recommendation Engine

## Périmètre

Ce dossier documente l'industrialisation de la couche d'intelligence métier du SAD :

- KPI Engine
- Alert Engine
- Recommendation Engine

Le Sprint 1.5 ne crée aucun nouveau dashboard et ne modifie pas l'architecture de navigation. Il alimente les écrans Sprint 1 déjà implémentés :

- Accueil SAD
- Carte Métier
- Qualité des Eaux
- Pollution

## Documents

1. [01_audit_kpi_existants.md](./01_audit_kpi_existants.md)
2. [02_architecture_kpi_engine.md](./02_architecture_kpi_engine.md)
3. [03_architecture_alert_engine.md](./03_architecture_alert_engine.md)
4. [04_architecture_recommendation_engine.md](./04_architecture_recommendation_engine.md)
5. [05_catalogue_kpi.md](./05_catalogue_kpi.md)
6. [06_catalogue_alertes.md](./06_catalogue_alertes.md)
7. [07_catalogue_recommandations.md](./07_catalogue_recommandations.md)
8. [08_plan_integration_frontend.md](./08_plan_integration_frontend.md)
9. [09_plan_migration_kpi_frontend.md](./09_plan_migration_kpi_frontend.md)
10. [10_decision_sprint_1_5.md](./10_decision_sprint_1_5.md)

## Décision

- Statut Sprint 1.5 : `GO_SPRINT_1_5_KPI_AND_ALERT_ENGINE`
- Hydraulique : hors périmètre, lecture seule sur résultats validés
- Propagation : consommation exclusive des endpoints MVP V1 existants
- Température : séparation stricte `AIR_TEMPERATURE != WATER_TEMPERATURE`
