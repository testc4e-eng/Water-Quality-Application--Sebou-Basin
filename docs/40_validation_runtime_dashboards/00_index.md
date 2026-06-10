# Validation Runtime Dashboards SAD

## Périmètre

Validation runtime des dashboards déjà implémentés dans `docs/39_implementation_dashboards_clotures/` contre la vraie instance backend SAD.

Modules couverts :

- Accueil DG
- Qualité réglementaire
- Pollution
- Données / QA
- Administration / RBAC

Modules explicitement exclus :

- SWAT
- WASP
- Prédiction pollution
- Recommandations autonomes
- Reporting autonome

## Fichiers du dossier

- [01_backend_sad_identifie.md](./01_backend_sad_identifie.md)
- [02_configuration_frontend_api.md](./02_configuration_frontend_api.md)
- [03_tests_endpoints_dashboards.md](./03_tests_endpoints_dashboards.md)
- [04_corrections_appliquees.md](./04_corrections_appliquees.md)
- [05_resultat_validation_runtime.md](./05_resultat_validation_runtime.md)
- [06_limites_restantes.md](./06_limites_restantes.md)

## Résumé exécutif

- La vraie API SAD active localement est `http://localhost:8010/api/v1`, servie par le conteneur Docker `sad-backend`.
- `http://127.0.0.1:8000` pointait vers un autre service (`agent-swat-api`) et expliquait les anciens `404`.
- Les endpoints DG, Qualité et Pollution répondent correctement sur la vraie API.
- Les endpoints QA/RBAC répondent correctement avec authentification et droits adaptés.
- Une correction backend mineure a été nécessaire sur `admin/data-availability`.
- Une correction de configuration frontend locale a été nécessaire pour sortir de `8000` et pointer vers `8010`.
