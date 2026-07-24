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

### 5.2 Configuration backend URL — normalisée (mise à jour 2026-07-24)

Ports de référence :

- **`8000`** : backend natif (`http://127.0.0.1:8000/api/v1`).
- **`8010`** : stack SAD Docker locale (`http://127.0.0.1:8010/api/v1`) —
  valeur par défaut de `frontend/src/config/api.ts` et cible du proxy Vite
  (`frontend/vite.config.ts`). Surchargeable via `VITE_API_BASE_URL` /
  `VITE_API_PROXY`.
- **`8011`** : **port abandonné**. Plus aucune référence dans `frontend/src/`.

Le fallback runtime qui basculait `client.ts` sur `:8011` en cas de
« Network Error » a été **supprimé** le 2026-07-24 (voir
`docs/115_nettoyage_dette_technique/03_fallback_port_8011.md`) : il retentait
une requête vouée à l'échec vers un port mort, ajoutant latence et un
avertissement trompeur. La dette de port `8011` est donc **soldée** côté
frontend.

### 5.3 Dépendances backend legacy

Le frontend consomme encore des domaines backend dont la stabilité dépend de modules reliés à des objets SQL legacy ou absents :

- `/api/v1/quality/*`
- une partie des endpoints station-centric
- certains accès measurements/entities

Ces zones ne doivent pas être présentées comme pleinement stabilisées tant que les références `public.*` n’ont pas été purgées côté backend.

### 5.4 SWAT analysis — préfixe vérifié (2026-07-24)

Vérification terrain (voir `docs/115_nettoyage_dette_technique/01_double_montage_swat.md`) :
le routeur `swat_analysis` est défini avec `prefix="/swat/analysis"` et monté
sans préfixe additionnel, soit un chemin réel `/api/v1/swat/analysis/*`
(**pas** de préfixe doublé). Le frontend attend bien `/swat/analysis/*` : les
deux sont alignés.

Le défaut réellement présent était un **double montage** du routeur SWAT
principal dans `backend/app/api/api_v1.py` (routes `/api/v1/swat/*`
enregistrées deux fois) — corrigé le 2026-07-24.

## 6. Règle documentaire

Pour toute évolution frontend :

1. vérifier `frontend/src/App.tsx` pour la vérité des routes ;
2. vérifier `frontend/src/api/**` pour la vérité des intégrations backend ;
3. mettre à jour ce document ;
4. répercuter uniquement ensuite dans les résumés IA ou les guides dérivés.
