# Contrat API Home V2

## Objet

Ce dossier fige le contrat cible du futur endpoint :

- `GET /api/v1/dashboard/home`

Le contrat est conçu pour alimenter le **Home opérationnel V2** du SAD Sebou.

## Périmètre

- pas de modification BD ;
- pas de recodage des moteurs KPI / alertes / recommandations ;
- pas de nouvelle carte ;
- réutilisation maximale de l'existant.

## Documents

1. [01_contrat_api_dashboard_home.md](./01_contrat_api_dashboard_home.md)
2. [02_payload_json_exemple.md](./02_payload_json_exemple.md)
3. [03_mapping_sources_bd.md](./03_mapping_sources_bd.md)
4. [04_regles_metier_pluvio_qualite.md](./04_regles_metier_pluvio_qualite.md)
5. [05_plan_backend_implementation.md](./05_plan_backend_implementation.md)
6. [06_plan_frontend_implementation.md](./06_plan_frontend_implementation.md)
7. [07_tests_validation.md](./07_tests_validation.md)
8. [08_risques_et_points_ouverts.md](./08_risques_et_points_ouverts.md)

## Décision

- statut documentaire : `READY_FOR_IMPLEMENTATION_REVIEW`
- statut métier recommandé : `GO_CONDITIONNEL`
