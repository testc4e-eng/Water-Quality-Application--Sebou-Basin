# Inventaire composants existants reutilisables

## Backend

| Composant | Role actuel | Reutilisation |
|---|---|---|
| `backend/app/api/v1/pollution.py` | GeoJSON IDP et derniers resultats | reprendre les requetes et l'enrichissement reglementaire |
| `backend/app/services/regulatory_quality.py` | moteur de classification reglementaire partage | reutilisation obligatoire |
| `backend/app/routers/quality.py` | endpoints seuils/classification + legacy qualite | reutiliser uniquement la logique reglementaire stable |
| `backend/app/api/v1/qualite_specialized.py` | exposition vues `api.v_qualite_*` | reutiliser filtres et contrat response |
| `backend/app/repositories/api_views_repository.py` | repository whiteliste views qualite | etendre ou encapsuler, pas contourner |
| `backend/app/routers/layers.py` | couche generique GeoJSON des supports | source pour barrages, stations, STEP, rejets |
| `backend/app/routers/observatory.py` | hierarchy/timeseries/cache | reutiliser concepts, eviter dependance directe lourde |

## Frontend

| Composant | Role actuel | Reutilisation |
|---|---|---|
| `frontend/src/components/Pollution/PollutionIdpMap.tsx` | MapLibre declaratif avec popup et legende | base technique carte P0 |
| `frontend/src/pages/PollutionIdpDevPage.tsx` | page DEV isolee avec filtres | modele d'integration route isolee |
| `frontend/src/api/pollutionIdp.ts` | client typé pollution IDP | source pour types GeoJSON et filtres |
| `frontend/src/hooks/usePollutionIdp.ts` | React Query pollution | modele hook P0 |
| `frontend/src/components/decision/*` | filtres, legendes, panneaux metier | reutiliser la structure UX |
| `frontend/src/components/observatory/*` | menu hierarchique et chargement differe | reutiliser le pattern |
| `frontend/src/api/qualite.ts` | client vues qualite specialisées | source pour P0 qualite |
| `frontend/src/types/qualite.ts` | DTO exposition qualite | reutiliser pour tableaux/series |

## Briques a ne pas reutiliser comme base principale

| Composant | Raison |
|---|---|
| `Dashboard2.tsx` | fichier trop volumineux, risque regression |
| `DashboardCartographique.tsx` | simple alias vers `Dashboard2` |
| `InteractiveMap.jsx` | imperatif, markers DOM, moins adapte aux couches data-driven |
| `frontend/src/api/quality.ts` | legacy, contrat qualite ancien |
| `backend/app/api/v1/geojson.py` | resolution table legacy par motifs |

## Doublons et catalogues concurrents

| Sujet | Fichiers | Risque |
|---|---|---|
| Catalogue metier qualite | `observatoryCatalog.ts`, `decisionDashboardCatalog.ts` | duplication paramètres/familles |
| Cartographie supports | `layers/config.ts`, `layers/layerManager.ts`, `routers/layers.py` | contrat pas totalement stabilise |
| Qualite API | `/quality`, `/qualite` | confusion legacy vs specialise |
| Pollution | `/pollution`, `/quality/inventory/rows`, layers infra | plusieurs chemins pour objets similaires |

## Composants cibles P0

Créer sans casser l'existant :

- `backend/app/api/v1/map.py`
- `backend/app/services/map_business_service.py`
- `frontend/src/api/mapBusiness.ts`
- `frontend/src/hooks/useMapBusiness.ts`
- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/components/DashboardMetier/*`

## Contrat UX minimal

- Pas d'appel API lourd au chargement initial.
- L'utilisateur choisit support/categorie/parametre puis clique `Afficher`.
- Carte et tableau lateraux se synchronisent.
- La classification reglementaire est visible mais tracee comme DEV si source IDP non arbitree.
