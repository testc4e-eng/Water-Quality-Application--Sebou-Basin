# Résultat validation runtime

## Statut global

### 1. Accueil DG

Statut : `VALIDE_RUNTIME`

Éléments validés :

- endpoint `GET /api/v1/dashboard/home` en `200`
- payload complet conforme au dashboard implémenté
- route `/` chargée dans le navigateur local
- navigation DG visible et cohérente

### 2. Qualité réglementaire

Statut : `VALIDE_RUNTIME`

Éléments validés :

- endpoints qualité principaux en `200`
- classification runtime en `200`
- route `/dashboard-qualite-reglementaire` chargée
- badges et source API visibles

Réserve mineure :

- le snapshot navigateur a capté certains KPI encore à `0` ou `N/D` au moment de la prise de vue ; l’API en amont est pourtant bien alimentée

### 3. Pollution

Statut : `VALIDE_RUNTIME_AVEC_RESERVE`

Éléments validés :

- sites pollution en `200`
- derniers résultats en `200`
- recommandations en `200`
- propagation garde/stations/barrages en `200`
- route `/dashboard-pollution` chargée
- badges `DEV / TOPOLOGIQUE / NON HYDRAULIQUE SCIENTIFIQUE` visibles

Réserve mineure :

- le snapshot navigateur montre encore `0 site affiché` et un état de chargement carte au moment de la capture, alors que l’API renvoie bien les features

### 4. Données / QA

Statut : `VALIDE_API_ET_RBAC`

Éléments validés :

- `GET /api/v1/data-admin/classes` en `200`
- `GET /api/v1/admin/data-availability` en `200` après correction
- `GET /api/v1/data-admin/change-requests` en `200`
- la route `/dashboard-data-qa` redirige vers `/login?expired=true` sans session, ce qui est cohérent avec l’accès protégé

Réserve :

- validation visuelle authentifiée non finalisée dans le navigateur faute de capacité de login interactif dans l’outil disponible

### 5. Administration / RBAC

Statut : `VALIDE_API_ET_COMPORTEMENT_ANONYME`

Éléments validés :

- `GET /api/v1/users` en `200` pour `ROLE_SYS_ADMIN`
- `GET /api/v1/security/logs/activity` en `200` pour `ROLE_SYS_ADMIN`
- `GET /api/v1/admin/password-reset-requests` en `200`
- refus `403` confirmés pour `ROLE_CONSULTANT` sur `/users` et `/security/logs/activity`
- la route `/administration` charge sans crash en session anonyme et expose correctement les accès restreints

Réserve :

- validation visuelle authentifiée complète non finalisée dans le navigateur

## Build frontend

Commande :

```bash
npm run build
```

Résultat :

- `OK`
- build Vite réussi
- avertissement non bloquant sur la taille du chunk principal

## Conclusion

Le runtime SAD réel est désormais correctement reconnecté aux dashboards clôturés via `8010`.

Validation effective :

- DG / Qualité / Pollution : runtime exploitable
- QA / Administration : contrats API et comportements RBAC validés ; rendu authentifié navigateur à compléter avec une session UI réelle
