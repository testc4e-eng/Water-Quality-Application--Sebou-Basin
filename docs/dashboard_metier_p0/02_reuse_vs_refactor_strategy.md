# Strategie reuse vs refactor

## Principe

Le dashboard cartographique metier P0 doit etre construit par composition autour de briques existantes. Aucun refactor massif ne doit etre fait tant que la page P0 n'est pas demontrable.

## Reutiliser tel quel

| Brique | Decision |
|---|---|
| `regulatory_quality.py` | reutiliser comme moteur de classification |
| `api.v_pollution_sites` / `api.v_pollution_latest_results` | reutiliser pour IDP pollution |
| `/api/v1/qualite/*` | reutiliser pour familles qualite historiques |
| `api` axios client | reutiliser |
| React Query | reutiliser |
| shadcn/ui existant | reutiliser |

## Adapter legerement

| Brique | Adaptation |
|---|---|
| `PollutionIdpMap.tsx` | extraire patterns MapLibre vers composants `DashboardMetier` |
| `PollutionIdpDevPage.tsx` | reprendre filtres, badges DEV, compteur |
| `DecisionDashboardTest.tsx` | reprendre sidebar et logique affichage volontaire |
| `observatoryCatalog.ts` | enrichir plus tard, ne pas fusionner maintenant |
| `ApiViewsRepository` | envelopper dans service map au lieu d'exposer partout |

## Ne pas refactorer en P0

| Brique | Raison |
|---|---|
| `Dashboard2.tsx` | risque regression élevé |
| `InteractiveMap.jsx` | legacy utile mais non cible |
| `routers/observatory.py` | trop large, beaucoup de logique historique |
| `layers/layerManager.ts` | dependant d'un contrat layers ancien |
| `quality.ts` frontend legacy | conserver pour compat uniquement |

## Architecture d'integration progressive

1. Ajouter une API cartographique metier isolee sous `/api/v1/map/*`.
2. Ajouter une page frontend isolee `/dashboard-carto-metier`.
3. Brancher P0 sur IDP pollution et quelques supports simples.
4. Ajouter qualite historique via endpoints specialises.
5. Ajouter series temporelles dans une phase separee.

## Tests minimum a chaque incrementation

Backend :

- import FastAPI OK ;
- `/health` OK ;
- `/api/v1/map/catalog` OK ;
- `/api/v1/map/entities?support=...` OK ;
- payload GeoJSON valide.

Frontend :

- `npm run build` ;
- route `/dashboard-carto-metier` charge ;
- pas de regression `/pollution-idp-dev` ;
- pas de regression `/decision-dashboard-test`.

## Risques et garde-fous

| Risque | Garde-fou |
|---|---|
| Confusion MO/Mo | ne jamais appliquer upper/lower global sur codes parametres |
| Surcharge API carte | pagination, `limit`, bbox, champs minimaux |
| Regression legacy | route P0 isolee |
| Duplication catalogue | creer un catalogue P0 local minimal, fusion ulterieure |
| Donnees IDP non arbitrees | badge DEV / validation en cours |
