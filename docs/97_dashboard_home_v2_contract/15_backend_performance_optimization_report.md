# Rapport optimisation performance backend

## Objectif

Optimiser `GET /api/v1/dashboard/home` sans modifier :

- le contrat JSON ;
- les sections obligatoires ;
- les moteurs `KPI`, `alerts`, `recommendations` ;
- le backend propagation ;
- la base de données officielle.

## Fichiers créés

- `docs/97_dashboard_home_v2_contract/14_backend_performance_audit.md`
- `docs/97_dashboard_home_v2_contract/15_backend_performance_optimization_report.md`

## Fichiers modifiés

- `backend/app/services/dashboard/home_service.py`
- `backend/tests/test_dashboard_home_v2.py`
- `docs/97_dashboard_home_v2_contract/05_plan_backend_implementation.md`
- `docs/97_dashboard_home_v2_contract/07_tests_validation.md`
- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/03_ai_knowledge_base/project_structure_for_agents.md`

## Causes des lenteurs

### 1. Requêtes SQL redondantes

- `_latest_dates()` relu dans plusieurs builders ;
- counts recalculés dans `hero` puis dans `map` ;
- qualité quotidienne relisant son dernier jour et son count.

### 2. Agrégation séquentielle sans cache backend

Chaque appel HTTP reconstruisait l'ensemble du payload.

### 3. Dépendances coûteuses de `alerts`

Le moteur alertes déclenche la première chauffe du `KPI Engine`, notamment les agrégats pollution.

## Optimisations appliquées

### Mutualisation intra-requête

- `latest_dates` mémorisé une seule fois par requête ;
- `layer_counts` mémorisé une seule fois par requête ;
- contexte réglementaire qualité mémorisé une seule fois par requête ;
- `quality_daily` réutilise la date déjà calculée au lieu de refaire `max(temps)`.

### Réduction des requêtes directes

- `hero` passe de `8` à `4` requêtes directes ;
- `map` passe de `8` à `0` requête directe ;
- `trends` supprime la relecture de la dernière date qualité ;
- l’ensemble `home_service` passe d’environ `44` à `17` requêtes directes.

### Cache backend court

Cache mémoire Python ajouté dans `home_service.py` :

- clé : `dashboard_home_v2`
- TTL par défaut : `120 s`
- variable d’environnement : `SAD_DASHBOARD_HOME_CACHE_SECONDS`
- désactivation : `SAD_DASHBOARD_HOME_CACHE_SECONDS=0`
- aucune exception n’est cachée
- le payload `partial` reste cacheable tel quel

## Temps avant / après

### Runtime HTTP observé

Avant optimisation :

- premier appel : `78.362 s`
- deuxième appel : `75.422 s`

Après optimisation :

- premier appel : `42.082 s`
- deuxième appel : `0.017 s`
- après expiration cache (`125 s`) : `39.547 s`

### Runtime direct service

- sans cache : `41.761 s`
- avec cache, premier appel : `22.343 s`
- avec cache, second appel : `0.001 s`

## Tests réalisés

- `python -m pytest C:\dev\WQDSS\repo_git\backend\tests\test_dashboard_home_v2.py -q`
- résultat : `13 passed`

Couvertures ajoutées :

- contrat inchangé ;
- cache renvoie la même structure ;
- cache ne casse pas `status` ;
- cache désactivable par variable d’environnement ;
- endpoint reste `200`.

## Limites restantes

1. Le premier appel reste coûteux.
   Cause principale résiduelle : `alerts` et la chauffe initiale de ses dépendances KPI.

2. `basin_status` et `trends` restent relativement lourds.
   Une optimisation supplémentaire demanderait soit des vues/matviews dédiées, soit une évolution contrôlée des moteurs KPI existants.

3. Le cache actuel est mémoire-process.
   Il accélère fortement un runtime mono-process, mais ne mutualise pas entre plusieurs workers/processus.

## Décision finale

- `GO_BACKEND_HOME_V2_PERFORMANCE_OPTIMIZED`
