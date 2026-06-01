# Frontend pilote Métaux

| Fichier | Rôle |
|---|---|
| `01_architecture_front_pilote.md` | Architecture du pilote React et dépendances créées. |
| `02_api_usage.md` | Usage strict de l'API spécialisée `/api/v1/qualite/metaux`. |
| `03_composants_front.md` | Composants, hook, types et responsabilités. |
| `04_tests_frontend.md` | Résultats de compilation et validations frontend. |
| `05_validation_metier_front.md` | Contrôles métier visibles dans l'écran pilote. |
| `06_backlog_front_p1.md` | Backlog P1 pour les autres vues spécialisées. |

## Statut

Le pilote frontend Métaux est une extension isolée du frontend existant. Il ne remplace aucun dashboard legacy et consomme uniquement l'endpoint spécialisé `GET /api/v1/qualite/metaux`.
