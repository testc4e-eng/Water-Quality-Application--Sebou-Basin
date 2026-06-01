# P0.1 - Correctif UX dashboard cartographique metier

## Statut

`P0_1_FRONTEND_UX_FIX_READY_DEV`

## Correctifs appliques

| Sujet | Correction |
|---|---|
| Etat initial vide | preselection automatique du support `stations.barrage` si disponible |
| Test immediat | chargement initial controle de `stations.barrage` apres reception du catalogue |
| Navigation metier | groupes conserves : Stations, Inventaire sources pollution, Inventaire mesures pollution |
| Filtre parametre | optionnel ; affichage spatial autorise sans parametre analytique |
| Message parametre absent | message metier explicite : affichage spatial uniquement |
| Appel API entites | page metier utilise uniquement `group_code` + `support_code` + `limit` |
| Erreur API | affichage endpoint, parametres, status HTTP et message backend |
| Carte | fit bounds automatique si features > 0 |
| Etat sans donnees | message `Aucune entite pour ce support` si GeoJSON vide |

## Fichiers modifies

- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/components/DashboardMetier/BusinessSidebar.tsx`
- `frontend/src/components/DashboardMetier/BusinessMap.tsx`
- `frontend/src/components/DashboardMetier/ParameterSelector.tsx`
- `frontend/src/api/mapBusiness.ts`

## Endpoints testes

| Endpoint | Resultat |
|---|---|
| `/api/v1/map/entities?group_code=stations&support_code=barrage&limit=5` | 200, 5 features |
| `/api/v1/map/entities?group_code=inventaire_source_pollution&support_code=point_mesures&limit=5` | 200, 5 features |
| `/api/v1/map/entities?group_code=inventaire_mesures_pollution&support_code=point_prelevement&limit=5` | 200, 5 features |

## Build

`npm run build` : OK.

Warning non bloquant : bundle principal Vite > 500 kB. Optimisation recommandee en P1 via lazy-loading/code splitting.

## Limites restantes

- Validation visuelle complete a refaire avec le backend FastAPI lance en HTTP DEV.
- Les supports sans latest values restent en affichage spatial/metadata uniquement.
- Les series temporelles restent hors P0.1.

## Decision

`GO_DEV_DEMO_P0_1`.
