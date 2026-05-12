# Frontend Reference

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | frontend React, routes UI, modules principaux et dépendances API |
| Source de vérité | Oui |
| Documents liés | [../../00_SOURCE_OF_TRUTH_MASTER.md](../../00_SOURCE_OF_TRUTH_MASTER.md), [../backend/backend_overview.md](../backend/backend_overview.md), [../../03_ai_knowledge_base/api_for_agents.md](../../03_ai_knowledge_base/api_for_agents.md) |
| Dernière mise à jour | 2026-04-17 |

## 1. Socle technique

Le frontend repose sur :

- React 18 ;
- Vite ;
- TypeScript ;
- `@tanstack/react-query` pour l’orchestration des appels ;
- TailwindCSS et composants UI ;
- bibliothèques dédiées à la cartographie et aux graphiques selon les écrans.

La photographie réelle doit être lue dans `frontend/src/App.tsx`, `frontend/src/pages/**` et `frontend/src/api/**`.

## 2. Routes UI réellement déclarées

Les routes effectivement présentes dans `frontend/src/App.tsx` sont :

| Route | Rôle | État |
|---|---|---|
| `/` | accueil institutionnel | Actif |
| `/dashboard` | dashboard historique | Actif |
| `/dashboard-cartographique` | dashboard cartographique principal | Actif |
| `/dashboard-2` | variante dashboard / zone de test métier conservée | Actif |
| `/carte` | accès cartographique dédié | Actif |
| `/dashboard-analytique` | dashboard analytique | Actif |
| `/dashboard-scenarios` | scénarios et modèles | Actif |
| `/admin/data-scan` | diagnostic de disponibilité des données | Actif |
| `/admin/gestion-users` | hub réel d’administration utilisateurs et audit | Actif |
| `/admin/users` | redirection vers `/admin/gestion-users?mode=users` | Redirect |
| `/admin/password-resets` | gestion des demandes de réinitialisation | Actif |
| `/admin/audit` | redirection vers `/admin/gestion-users?mode=audit` | Redirect |
| `/admin/ingestion` | centre d’ingestion et QA scénarios | Actif |
| `/admin/popup-rules` | configuration des popups cartographiques | Actif |
| `/about` | page institutionnelle | Actif |
| `/contact` | page de contact | Actif |
| `/data` | exploration des données brutes | Actif |
| `/login` | authentification | Actif |
| `/register` | création de compte | Actif |
| `/change-password` | changement de mot de passe | Actif |

## 3. Modules frontend principaux

### Dashboards et visualisation

- `Dashboard`
- `DashboardCartographique`
- `DashboardAnalytique`
- `DashboardScenarios`
- composants climat / hydro / qualité / observatoire dans `src/components/**`

### Administration

- `DataScanPage`
- `UsersAuditHubPage`
- `UserManagementPage`
- `PasswordResetRequestsPage`
- `IngestionPage`
- `PopupRulesPage`

### Data access

- `DataViewer`
- clients API dans `src/api/`

## 4. Correspondance UI -> API

| Module UI | API consommée | Observations |
|---|---|---|
| `DataScanPage` | `/api/v1/admin/data-availability/*` | Aligné avec le backend |
| `UsersAuditHubPage`, `UserManagementPage` | `/api/v1/users/*`, `/api/v1/security/logs/*` | Aligné |
| `PasswordResetRequestsPage` | `/api/v1/admin/password-reset-requests/*` | Aligné |
| `IngestionPage` | `/api/v1/ingestion/*` | Aligné |
| `PopupRulesPage` | `/api/v1/layers/configs/*` | Aligné |
| `DataViewer` | `/api/v1/raw/*` | Aligné |
| dashboards analytiques / observatoire | `/api/v1/analytics/*`, `/api/v1/observatory/*`, `/api/v1/climate/*`, `/api/v1/hydro/*`, `/api/v1/quality/*` | Partiellement aligné selon le domaine |
| scénarios SWAT | `/api/v1/swat/*`, usage attendu de `/api/v1/swat/analysis/*` | Risque sur le préfixe réel |

## 5. Écarts et risques documentés

### 5.1 Références de routes obsolètes dans la documentation

Les documents antérieurs omettaient plusieurs routes réellement présentes :

- `/dashboard-2`
- `/carte`
- `/about`
- `/contact`
- `/admin/gestion-users`

Ils présentaient aussi `/admin/users` et `/admin/audit` comme des pages autonomes alors qu’il s’agit de redirections.

### 5.2 Dette de configuration backend URL

La normalisation documentaire du projet pointe le backend local vers `http://127.0.0.1:8011/api/v1`, mais certains clients frontend restent configurés ou codés avec le port `8000`, notamment :

- `frontend/src/api/client.ts`
- `frontend/src/api/climate.ts`

Cette incohérence doit être considérée comme une dette technique tant qu’elle n’est pas corrigée dans le code.

### 5.3 Dépendances backend legacy

Le frontend consomme encore des domaines backend dont la stabilité dépend de modules reliés à des objets SQL legacy ou absents :

- `/api/v1/quality/*`
- une partie des endpoints station-centric
- certains accès measurements/entities

Ces zones ne doivent pas être présentées comme pleinement stabilisées tant que les références `public.*` n’ont pas été purgées côté backend.

### 5.4 Incohérence SWAT analysis

Le frontend attend un usage de type `/swat/analysis/*`, alors que le routeur backend observé est susceptible d’être monté sous un préfixe doublé `/api/v1/api/v1/swat/analysis/*`.

## 6. Règle documentaire

Pour toute évolution frontend :

1. vérifier `frontend/src/App.tsx` pour la vérité des routes ;
2. vérifier `frontend/src/api/**` pour la vérité des intégrations backend ;
3. mettre à jour ce document ;
4. répercuter uniquement ensuite dans les résumés IA ou les guides dérivés.
