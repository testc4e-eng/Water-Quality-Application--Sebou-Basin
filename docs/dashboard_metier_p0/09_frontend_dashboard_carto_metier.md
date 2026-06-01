# Frontend dashboard cartographique metier P0

## Statut

`FRONTEND_DASHBOARD_CARTO_METIER_P0_READY_DEV`

## Objectif

Créer une route isolée `/dashboard-carto-metier` pour consommer le backend cartographique métier P0 sans modifier les dashboards existants.

## Route

| Route | Page | Statut |
|---|---|---|
| `/dashboard-carto-metier` | `frontend/src/pages/DashboardCartoMetier.tsx` | DEV OK |

Dashboards non modifiés :

- `Dashboard2`
- `DashboardCartographique`
- `Observatoire V2`
- `/pollution-idp-dev`

## Endpoints consommés

| Endpoint | Usage frontend |
|---|---|
| `GET /api/v1/map/catalog` | menu métier groupes/supports |
| `GET /api/v1/map/entities` | GeoJSON affiché dans MapLibre |
| `GET /api/v1/map/latest-values` | client disponible pour P0/P1 |
| `GET /api/v1/map/classification` | client disponible pour classification unitaire |

## Organisation métier affichée

| Groupe | Supports |
|---|---|
| Stations | forage, puits, point_prelevement, barrage, pluvio, source, hydro |
| Inventaire sources pollution | point_mesures |
| Campagne de mesures pollution | point_prelevement |

Les supports legacy restent disponibles côté backend mais ne sont pas affichés comme navigation principale.

## Fonctionnement P0

1. Chargement du catalogue au démarrage.
2. Sélection manuelle d’un groupe et support.
3. Sélection optionnelle d’un paramètre disponible.
4. Clic `Afficher`.
5. Chargement des entités GeoJSON.
6. Affichage MapLibre, popup et panneau détail.

## Limites P0

- Pas de chargement massif automatique au démarrage.
- Séries temporelles réservées au P1.
- Couches contexte bassin/réseau hydro réservées au P1 côté frontend.
- `latest_values` complet dépend du périmètre backend P0.
- Symbologie réglementaire disponible quand les entités exposent des classifications dans `latest_values`.

## Tests

| Test | Résultat |
|---|---|
| `npm run build` | OK |
| `/api/v1/map/catalog` | 200 |
| `/api/v1/map/entities?group_code=stations&support_code=barrage&limit=5` | 200, 5 features |
| `/api/v1/map/entities?group_code=inventaire_source_pollution&support_code=point_mesures&limit=5` | 200, 5 features |
| `/api/v1/map/entities?group_code=inventaire_mesures_pollution&support_code=point_prelevement&limit=5` | 200, 5 features |

## Risques

- Le bundle frontend principal reste volumineux ; un découpage dynamique des pages lourdes est recommandé en P1.
- Les supports non IDP peuvent exposer peu ou pas de valeurs qualité en P0.
- La classification dépend de la complétude du référentiel réglementaire DEV.
