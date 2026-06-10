# Rapport d'implémentation RBAC réel MVP4

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport d'exécution |
| Source de vérité | Oui pour le lot MVP4 |
| Date | 2026-06-05 |

## Résultat

```text
114_MVP4_STATUS = RBAC_REAL_ACTIVE
```

## Scripts SQL appliqués

- `backend/sql/2026_06_rbac_roles_permissions.sql`

## Objets de sécurité réutilisés

- `security.users`
- `security.roles`
- `security.permissions`
- `security.role_permissions`

## Rôles activés

- `ROLE_DECIDEUR`
- `ROLE_EXPERT`
- `ROLE_CONSULTANT`
- `ROLE_DATA_ADMIN`
- `ROLE_SYS_ADMIN`
- `ROLE_AI_AGENT`

## Comptes de démonstration créés

- `demo_decideur`
- `demo_expert`
- `demo_consultant`
- `demo_data_admin`
- `demo_sys_admin`
- `demo_ai_agent`

## Modifications backend

- les permissions sont maintenant résolues depuis la base ;
- `/api/v1/auth/login` et `/api/v1/auth/me` retournent `role_label`, `permissions` et `rbac_status` ;
- les routes `data-admin` ne reposent plus sur `RBAC_SIMULATED` ;
- `approve`, `apply` et `rollback/apply` vérifient des permissions réelles ;
- les routes de gestion utilisateurs, reset et logs utilisent des permissions réelles ;
- les acteurs tracés sont de type `user:{id}:{email}` ;
- le fallback `system:data_admin_ui` reste contrôlé mais n'est plus le chemin nominal.

## Modifications frontend

- la session stocke rôle, libellé de rôle, permissions et statut RBAC ;
- l'interface affiche le rôle connecté et les permissions actives ;
- les menus et boutons sensibles sont masqués ou désactivés selon permissions réelles ;
- `/admin/data-governance/audit` reste protégé et piloté par permissions.

## Campagnes de test réelles

### Authentification

Les six comptes de démonstration se connectent avec succès sur le backend réel via `TestClient` :

- `demo_decideur`
- `demo_expert`
- `demo_consultant`
- `demo_data_admin`
- `demo_sys_admin`
- `demo_ai_agent`

Chaque login retourne :

- `status=success`
- un JWT valide
- `rbac_status=RBAC_REAL`
- la liste réelle des permissions.

### Contrôles d'accès validés

- `demo_decideur` : lecture audit OK, upload refusé ;
- `demo_consultant` : génération canevas et upload OK, approbation refusée ;
- `demo_expert` : approbation OK, application refusée ;
- `demo_data_admin` : application et rollback OK ;
- `demo_sys_admin` : gestion utilisateurs OK ;
- `demo_ai_agent` : audit/canevas/upload/soumission OK, approbation et apply refusés.

### Campagnes E2E validées

Flux complet testé sur :

- `HYDRO_DEBIT`
- `METEO_PRECIPITATION`
- `QUALITE_RIVIERE`

Workflow prouvé :

```text
upload -> change request -> submit -> approve -> apply -> rollback
```

Résultat :

- contrôles RBAC conformes ;
- audit log créé ;
- delta net final `0` après rollback contrôlé.

## Incidents trouvés et corrigés pendant le lot

### Normalisation IP login

Le backend persistait `request.client.host` tel quel. En test local, la valeur `testclient` n'était pas compatible avec la colonne IP en base. Le service normalise maintenant les IP invalides vers `NULL`.

### Validation email des comptes de démonstration

Le suffixe initial non standard a été remplacé par `@example.com` pour rester compatible avec la validation `EmailStr`.

### Apply sans `RETURNING`

Le service de promotion essayait de lire un résultat de requête `INSERT` sans `RETURNING`. Le flux a été corrigé pour ne consommer des lignes SQL que lorsqu'un mapping expose explicitement des colonnes retournées.

## Limites restantes

- le modèle reste `single-role` via `security.users.role_id` ;
- aucune table `security.user_role` n'a été introduite ;
- `UPSERT`, `UPDATE_EXISTING`, `DELETE` libre et `MERGE` restent désactivés ;
- le test UI navigateur complet n'a pas été mené dans cette session car le runtime local `uvicorn` n'était pas disponible sur le Python courant ;
- le backend et le frontend ont néanmoins été validés via `TestClient` et `npm run build`.
