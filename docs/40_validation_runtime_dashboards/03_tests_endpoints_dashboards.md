# Tests endpoints dashboards

## Méthode

Tests réalisés sur `http://127.0.0.1:8010/api/v1` :

- sans authentification pour les endpoints DG / métier publics
- avec authentification `ROLE_SYS_ADMIN` pour les endpoints QA / RBAC protégés
- avec authentification `ROLE_CONSULTANT` pour valider les refus attendus

Les comptes de test ont été créés temporairement pour la validation puis supprimés.

## Résultats

| Endpoint | Écran concerné | Profil | Statut HTTP | Payload reçu | Résultat frontend |
| --- | --- | --- | --- | --- | --- |
| `GET /dashboard/home` | Accueil DG | public | `200` | `status=success`, sections `hero/map/basin_status/alerts/recommended_actions/trends/secondary_kpis` | route `/` monte correctement |
| `GET /quality/regulatory-status` | Qualité réglementaire | public | `200` | `status=OK`, version réglementaire, résumé, issues, rules | route `/dashboard-qualite-reglementaire` monte correctement |
| `GET /quality/thresholds?type_eau=surface_generale&active_only=true` | Qualité réglementaire | public | `200` | `count=177` | données visibles côté écran qualité |
| `GET /quality/stations` | Qualité réglementaire | public | `200` | liste `56` stations | sélecteur station alimentable |
| `GET /quality/parameters?station_id=<uuid>` | Qualité réglementaire | public | `200` | liste `46` paramètres | sélecteur paramètre alimentable |
| `GET /quality/timeseries?station_id=<uuid>` | Qualité réglementaire | public | `200` | `31` lignes date/no3/ph/dbo5/dco/o2/mes | historique exploitable |
| `POST /quality/classify` | Qualité réglementaire | public | `200` | `status=CLASSIFIED` sur `NO3` | classification runtime confirmée |
| `GET /pollution/sites.geojson?limit=100` | Pollution | public | `200` | `FeatureCollection`, `100` features | route `/dashboard-pollution` monte correctement |
| `GET /pollution/latest-results?limit=100` | Pollution | public | `200` | `count=100` | résultats pollution visibles |
| `GET /recommendations?limit=10` | Pollution | public | `200` | liste `3` recommandations | recommandations assistées disponibles |
| `GET /propagation/source-to-garde?site_id=<id>` | Pollution | public | `200` | `status=success`, `source/snap/propagation/path_geojson/metadata` | moteur topologique joignable |
| `GET /propagation/source-to-stations?site_id=<id>&limit=10` | Pollution | public | `200` | `targets=10` | impacts stations disponibles |
| `GET /propagation/source-to-barrages?site_id=<id>&limit=10` | Pollution | public | `200` | `targets=2` | impacts barrages disponibles |
| `GET /map/catalog` | Carte métier / sous-vues Stations-Barrages | public | `200` | `status=success`, groupes/supports | catalogue carto SAD disponible |
| `GET /map/entities?group_code=stations&support_code=barrage&limit=100` | Carte métier / sous-vues Stations-Barrages | public | `200` | `FeatureCollection`, `11` entités | sous-vue barrage alimentable |
| `GET /data-admin/classes` | Données / QA | `ROLE_SYS_ADMIN` | `200` | `count=8` | API QA officielle connectée |
| `GET /admin/data-availability` | Données / QA | public | `200` | gros payload `stations/station_entities/basins_full/barrages_full/summary` | scan QA utilisable après correction |
| `GET /data-admin/change-requests` | Données / QA / RBAC | `ROLE_SYS_ADMIN` | `200` | `count=28` | workflow data-admin connecté |
| `GET /users` | Administration / RBAC | `ROLE_SYS_ADMIN` | `200` | liste `24` utilisateurs | vue utilisateurs administrable |
| `GET /security/logs/activity?limit=20` | Administration / RBAC | `ROLE_SYS_ADMIN` | `200` | `rows=20`, `total=87851` | logs sécurité exploitables |
| `GET /admin/password-reset-requests` | Administration / RBAC | `ROLE_SYS_ADMIN` | `200` | liste `2` demandes | resets visibles |
| `GET /users` | Administration / RBAC | `ROLE_CONSULTANT` | `403` | `detail` | refus attendu validé |
| `GET /security/logs/activity?limit=20` | Administration / RBAC | `ROLE_CONSULTANT` | `403` | `detail` | refus attendu validé |
| `GET /data-admin/classes` | Données / QA | `ROLE_CONSULTANT` | `200` | `count=8` | lecture audit autorisée pour consultant |

## Vérification frontend visible

### Routes publiques vérifiées dans le navigateur local

| Route | Résultat |
| --- | --- |
| `/` | shell DG chargé, navigation visible |
| `/dashboard-qualite-reglementaire` | écran qualité chargé avec badges, source API, contrôles et tables |
| `/dashboard-pollution` | écran pollution chargé avec badges DEV/TOPOLOGIQUE/NON HYDRAULIQUE SCIENTIFIQUE |
| `/administration` | écran administration chargé en mode accès restreint sans session |

### Routes protégées / dépendantes auth

| Route | Résultat |
| --- | --- |
| `/dashboard-data-qa` | redirection vers `/login?expired=true` sans session active |
| `/administration` | pas de crash sans session ; le panneau affiche proprement les accès restreints |

## Endpoints KO ou non totalement validés visuellement

| Endpoint / écran | Statut | Commentaire |
| --- | --- | --- |
| rendu authentifié de `/dashboard-data-qa` dans le navigateur | non validé visuellement | l’outil navigateur disponible ne permettait pas une saisie de formulaire / injection de session |
| rendu authentifié complet de `/administration` dans le navigateur | non validé visuellement | API validée avec `ROLE_SYS_ADMIN`, mais session UI admin non injectée dans le navigateur |
