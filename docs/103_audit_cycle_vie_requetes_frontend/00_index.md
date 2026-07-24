# 103 — Audit cycle de vie des requêtes frontend

## 1. Contexte

Depuis la refonte de l’**Accueil DG** (`DashboardHomeV2`), certains widgets restent bloqués en erreur ou affichent des données vides après un simple changement d’onglet ou un retour de focus. Cet audit, **entièrement en lecture seule**, analyse le cycle de vie des requêtes frontend (React Query, Axios, AbortController, timeout, retry, refetch, cache) afin d’identifier les causes racines et proposer un plan de correction priorisé.

## 2. Périmètre

| Domaine | Fichiers / modules analysés |
|---|---|
| Client HTTP | `frontend/src/api/client.ts` |
| API métiers Accueil DG | `frontend/src/api/dashboardHome.ts`, `dashboardRuntime.ts`, `mapBusiness.ts`, `businessMapV1.ts`, `qualityRegulatory.ts` |
| Hooks React Query Accueil DG | `frontend/src/hooks/useDashboardHome.ts`, `useDashboardRuntime.ts`, `useBusinessMapV1.ts`, `useMapBusiness.ts`, `useQualityRegulatory.ts` |
| Composants Accueil DG | `frontend/src/pages/DashboardHomeV2.tsx`, `frontend/src/components/home-v2/OperationalMap.tsx`, `BasinStatus.tsx`, `TrendPanel.tsx` |
| Hooks transversaux | Tous les hooks `frontend/src/hooks/*.ts` |
| Initialisation RQ | `frontend/src/App.tsx` |

## 3. Synthèse des constats clés

1. **`QueryClient` créé sans `defaultOptions`** : React Query v5 applique ses valeurs par défaut globales : `retry: 3`, `staleTime: 0`, `refetchOnWindowFocus: true`, `gcTime: 5 min`. Seuls les hooks/composants qui surchargent explicitement ces options échappent au comportement agressif.
2. **Configuration hétérogène** : certains hooks désactivent `retry` et `refetchOnWindowFocus`, d’autres non. Les `useQueries` des couches cartographiques dans `OperationalMap` n’ont **aucune** surcharge → refetch + retry par défaut au retour focus.
3. **`TrendPanel` ne reçoit pas l’état d’erreur** : une erreur sur `/dashboard/trends` est affichée comme “Série indisponible”, sans possibilité de retry.
4. **Timeouts disparates** : 10 s, 20 s, 30 s, 90 s, ou aucun timeout, sans stratégie globale.
5. **`AbortSignal` peu répandu** : seuls `dashboardHome`, `dashboardRuntime` et `qualityRegulatory` propagent le signal de React Query. La plupart des appels ne peuvent pas être annulés proprement.
6. **Pas de gestion centralisée des erreurs transversales** : chaque composant réinvente son message d’erreur, parfois statique, parfois sans action de retry.

## 4. Livrables

| Fichier | Objectif |
|---|---|
| `01_cartographie_requetes.md` | Tableau exhaustif des requêtes RQ, options, timeouts, signaux |
| `02_etat_react_query.md` | Impact des options par défaut du `QueryClient` |
| `03_flux_accueil_dg.md` | Séquence des requêtes et rendu conditionnel sur l’Accueil DG |
| `04_scenarios_erreur.md` | Scénarios reproduisant le blocage après changement d’onglet / retour focus |
| `05_racines_probables.md` | Causes racines classées par criticité |
| `06_recommandations.md` | Recommandations techniques et UX |
| `07_plan_correction_priorise.md` | Plan d’action priorisé avec fichiers impactés |

## 5. Références

- Branche analysée : `Dev_refonte`, commit `c31268c`
- React Query : `@tanstack/react-query@5.83.0`
- React Query defaults v5 : [docs.tanstack.com/query/latest/docs/framework/react/guides/important-defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
