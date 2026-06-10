# Plan de tests connexion API / frontend

## Principe

Ce document décrit les tests à réaliser. Aucun test live n'a été exécuté dans cette phase d'audit.

| Module | Route frontend | Endpoint API | Test connexion | Résultat attendu | Statut |
| ------ | -------------- | ------------ | -------------- | ---------------- | ------ |
| Accueil | `/`, `/accueil-sad` | `GET /api/v1/dashboard/home` | chargement initial | payload Home V2 complet ou partiel avec message clair | à réaliser |
| Accueil | `/`, `/accueil-sad` | `GET /api/v1/dashboard/home` | erreur API | carte d'erreur et bouton recharger | à réaliser |
| Qualité réglementaire | `/dashboard-qualite-reglementaire` | `GET /api/v1/quality/regulatory-status` | chargement statut | version réglementaire et résumé chargés | à réaliser |
| Qualité réglementaire | `/dashboard-qualite-reglementaire` | `GET /api/v1/quality/thresholds` | chargement seuils | tableau des seuils surface générale | à réaliser |
| Qualité réglementaire | `/dashboard-qualite-reglementaire` | `GET /api/v1/quality/stations` | chargement stations | liste stations sans crash | à réaliser |
| Qualité réglementaire | `/dashboard-qualite-reglementaire` | `GET /api/v1/quality/timeseries` | station vide | état vide pédagogique | à réaliser |
| Qualité réglementaire | `/dashboard-qualite-reglementaire` | `POST /api/v1/quality/classify` | classification | classe et couleur cohérentes ou non classifiable | à réaliser |
| Carte Métier | `/dashboard-carto-metier` | `GET /api/v1/map/catalog` | chargement catalogue | groupes et supports visibles | à réaliser |
| Carte Métier | `/dashboard-carto-metier` | `GET /api/v1/map/entities` | affichage entités | GeoJSON et panneau métier synchronisés | à réaliser |
| Carte Métier | `/dashboard-carto-metier` | `GET /api/v1/map/entities` | erreur API | message détaillant endpoint et paramètres | à réaliser |
| Pollution | `/dashboard-pollution` | `GET /api/v1/pollution/sites.geojson` | chargement carte | sites pollution affichés | à réaliser |
| Pollution | `/dashboard-pollution` | `GET /api/v1/propagation/source-to-garde` | sélection site | distance/temps garde visibles | à réaliser |
| Pollution | `/dashboard-pollution` | `GET /api/v1/propagation/source-to-stations` | impacts stations | liste impacts cohérente | à réaliser |
| Pollution | `/dashboard-pollution` | `GET /api/v1/propagation/source-to-barrages` | impacts barrages | liste impacts cohérente | à réaliser |
| Pollution | `/dashboard-pollution` | `GET /api/v1/recommendations` | recommandations | actions affichées ou état vide clair | à réaliser |
| Analyses | `/analyses` | observatory / qualite specialized | chargement après clic | aucun appel initial inutile, affichage après filtrage | à réaliser |
| SWAT/WASP | `/dashboard-scenarios` | `/api/v1/swat/*` | test statut | l'écran doit afficher `en construction` et non rediriger | à réaliser après refonte |
| QA Data | `/admin/data-governance/audit` | `GET /api/v1/data-admin/classes` | token/auth | accès autorisé selon permission `data_admin.audit.read` | à réaliser |
| QA Data | `/admin/data-governance/audit` | `GET /api/v1/data-admin/classes/{class}/count` | chargement compteurs | compteurs par classe | à réaliser |
| QA Data | `/admin/data-governance/audit` | `GET /api/v1/admin/data-availability` | scan data | résumé et tableaux chargés | à réaliser |
| Administration / RBAC | `/admin/gestion-users` | `/api/v1/admin/users/*` | rôle utilisateur | refus propre si rôle insuffisant | à réaliser |
| Administration / RBAC | `/admin/password-resets` | `/api/v1/admin/password-reset-requests/*` | token/auth | liste chargée ou redirection login | à réaliser |
| Administration / RBAC | `/admin/data-governance/audit` | `/api/v1/data-admin/change-requests*` | rôle utilisateur | visibilité conforme au rôle | à réaliser |
| Ingestion legacy | `/admin/ingestion` | `/api/v1/ingestion/*` | disponibilité route | vérifier si l'API optionnelle est réellement activée | à réaliser |

## Cas de test obligatoires

- test appel API nominal
- test chargement de données réelles
- test erreur API 4xx/5xx
- test token/authentification
- test rôle utilisateur
- test affichage vide
- test affichage erreur

## Point d’attention majeur

`/admin/ingestion` doit être testé séparément car le routeur `/api/v1/ingestion/*` est optionnel et n'est pas la cible officielle du module 114.
