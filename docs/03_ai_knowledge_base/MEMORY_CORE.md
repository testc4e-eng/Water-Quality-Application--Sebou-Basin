# MEMORY_CORE

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | noyau de mémoire projet pour agents IA |
| Source de vérité | Oui sur le périmètre IA |
| Documents liés | [QUICK_REFERENCE](./QUICK_REFERENCE.md), [AGENT_RULES](./AGENT_RULES.md), [SOURCE_OF_TRUTH](../01_project_reference/SOURCE_OF_TRUTH.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Mission du projet

Le projet met en place un système d’aide à la décision web pour la gestion de la qualité des eaux de surface du bassin du Sebou. La plateforme combine :

- données métier et SIG ;
- dashboards analytiques et cartographiques ;
- administration, audit et gouvernance ;
- intégration des résultats de modèles SWAT/WASP.

## 2. Ce qu’un agent doit lire en priorité

1. `docs/01_project_reference/SOURCE_OF_TRUTH.md`
2. `docs/01_project_reference/architecture/system_architecture.md`
3. `docs/01_project_reference/architecture/database_architecture.md`
4. `docs/01_project_reference/backend/api_contracts.md`
5. `docs/01_project_reference/frontend/frontend_reference.md`

## 3. Ce qui fait autorité

- la référence projet est dans `docs/01_project_reference/`
- le contractuel et les rapports sont dans `docs/02_contractual_and_reports/`
- la mémoire IA résume, mais ne remplace pas, les documents maîtres

## 4. Ce qui ne fait pas autorité

- `docs/04_working_prompts_and_runs/`
- `docs/99_legacy_archive/`
- les exports bureautiques `generated_exports/`

## 5. Modules critiques

| Zone | Points à préserver |
|---|---|
| Backend | contrats d’API consommés par le frontend, routes analytics/observatory/layers/ingestion/admin |
| Frontend | dashboards cartographiques et analytiques, écrans admin, logique de filtres et parcours protégés |
| Base | couche `api`, schémas `metadata`, `security`, `staging`, `swat_*`, `wasp_*` |
| Gouvernance | logs, popup rules, scan des données, data viewer, rôles utilisateurs |

## 6. Points de vigilance

- ne pas créer de nouvelle source documentaire concurrente ;
- ne pas modifier des endpoints sans vérifier le frontend consommateur ;
- ne pas utiliser `99_legacy_archive` comme base de vérité ;
- distinguer clairement données brutes, vues d’exposition et restitutions analytiques ;
- préserver la cohérence entre documentation active et code.

## 7. Logique d’intervention recommandée

1. identifier le document maître du sujet ;
2. lire le code concerné ;
3. limiter le changement au bon périmètre ;
4. mettre à jour la documentation active si le comportement change ;
5. compléter les preuves ou les pointeurs d’entrée si nécessaire.
