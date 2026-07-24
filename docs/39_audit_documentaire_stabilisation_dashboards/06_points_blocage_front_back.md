# Points de blocage front/back

## 1. Focus spécial — erreur Home

Message frontend observé :

- `Le Home opérationnel n'a pas pu être chargé.`

Endpoint concerné :

- `GET /api/v1/dashboard/home`

## Fichiers frontend probables concernés

- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/api/dashboardHome.ts`
- `frontend/src/api/dashboardRuntime.ts`
- `frontend/src/components/home-v2/OperationalMap.tsx`
- `frontend/src/components/home-v2/LayerSummary.tsx`
- `frontend/src/api/mapBusiness.ts`
- `frontend/src/api/qualityRegulatory.ts`

## Fichiers backend probables concernés

- `backend/app/api/v1/dashboard.py`
- `backend/app/services/dashboard/home_service.py`
- `backend/app/api/v1/map.py`
- `backend/app/routers/quality.py`
- `backend/app/api/api_v1.py`

## Route API attendue

- `GET /api/v1/dashboard/home`

## Contrat JSON attendu

Champs racine attendus :

- `status`
- `generated_at`
- `data_freshness`
- `hero`
- `map`
- `basin_status`
- `alerts`
- `recommended_actions`
- `trends`
- `secondary_kpis`
- `metadata`

## Causes probables documentées

1. temps de réponse cold-start trop long côté backend ;
2. agrégation séquentielle du `home_service` ;
3. réutilisation de dépendances transverses coûteuses `alerts`, `recommendations`, `quality`, `map` ;
4. erreurs latérales de couches secondaires dans `OperationalMap` pouvant être perçues comme erreur globale ;
5. timeout ou contrôle d'erreurs frontend autour des appels `dashboard/home`, `mapBusiness`, `qualityRegulatory` ;
6. divergence éventuelle entre cache chaud acceptable et cold start encore lent ;
7. documentation encore partiellement orientée implémentation, pas diagnostic d'incident.

## Tests recommandés

1. tester `/health`
2. tester `/api/v1/dashboard/home` brut et mesurer `200`, temps et taille payload
3. vérifier si la réponse est `success` ou `partial`
4. vérifier si l'erreur vient du payload principal ou d'une couche carte secondaire
5. vérifier les appels `mapBusiness` et `qualityRegulatory` lancés depuis `OperationalMap`
6. vérifier le comportement avec cache chaud puis cold start
7. vérifier la cohérence de `VITE_API_BASE_URL`

## Ordre de diagnostic recommandé

1. backend `dashboard/home`
2. temps d'agrégation `home_service`
3. contrat JSON renvoyé
4. timeouts frontend `dashboardHome.ts`
5. erreurs secondaires `OperationalMap`
6. consommation qualité/carte
7. fallback UI `DashboardHomeV2.tsx`

## 2. Blocages front/back transverses

### Legacy qualité

- coexistence `/quality` et `/qualite`
- risque de confusion documentaire et front

### Carte métier

- plusieurs catalogues frontend concurrents historiques
- risque d'incohérence entre documents anciens et contrat `/api/v1/map/*`

### Pollution

- séparation insuffisamment claire entre :
  - pollution IDP déclarée ;
  - propagation topologique ;
  - campagnes de prélèvements / déclaration pollution

### Documentation vs code

- le code montre déjà `DashboardPollutionCampagnes.tsx` et `pollution_campagnes.py`
- plusieurs documents `70_dashboard_pollution` parlent encore de création à venir

## 3. Bugs / erreurs prioritaires à surveiller

1. Home V2 lent ou en erreur globale
2. erreurs carte secondaires affichées comme erreur métier principale
3. fragilité des dépendances qualité/carte dans le Home
4. ambiguïté legacy `/quality` vs `/qualite`
5. décalage documentation/code sur la pollution campagnes
