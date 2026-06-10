# Limites restantes

## 1. Validation navigateur authentifiée incomplète

Contrainte :

- l’outil navigateur disponible dans cette session permet navigation/snapshot/screenshot
- il ne permet pas une saisie de formulaire ou une injection simple de session pour finaliser les parcours login

Impact :

- `Données / QA` et `Administration` sont validés côté API et RBAC
- la preuve visuelle authentifiée complète reste à terminer avec une session browser réelle

## 2. Incohérence documentaire résiduelle sur les ports

Constat :

- `frontend/.env` local était encore sur `8000`
- `.env` racine et Docker SAD étaient déjà sur `8010`
- certaines références documentaires historiques parlent encore du mode natif `8000`

Action recommandée :

- harmoniser la documentation qui décrit l’usage local courant de cette machine / stack Docker

## 3. Bug RBAC hors périmètre observé

Bug constaté :

- `DELETE /api/v1/users/{id}` peut retourner `500` si l’utilisateur supprimé est aussi celui qui journalise l’action

Cause observée :

- insertion d’un `auth_log` avec `user_id` déjà supprimé
- violation de FK sur `security.auth_logs.user_id`

Impact :

- non bloquant pour les dashboards clôturés
- à corriger dans un chantier sécurité/RBAC dédié

## 4. Réserves UI mineures sur états asynchrones

Observations snapshot :

- l’écran Qualité affichait encore certains KPI à `0`/`N/D` au moment de la capture
- l’écran Pollution affichait encore `0 site affiché` et un état de chargement carte alors que l’API renvoie bien les données

Hypothèse probable :

- capture effectuée pendant la phase de chargement ou de dérivation locale
- vérification complémentaire utile avec une session utilisateur réelle et quelques secondes d’attente UI

## 5. Documentation à maintenir après cette intervention

Documents à mettre à jour ou à relier explicitement :

- `README.md`
- `docs/03_ai_knowledge_base/project_structure_for_agents.md`

Contenu à refléter :

- nouvelle preuve de vérité runtime SAD sur `8010`
- référence du dossier `docs/40_validation_runtime_dashboards/`
- rappel que `127.0.0.1:8000` peut pointer vers un autre service sur cette machine
