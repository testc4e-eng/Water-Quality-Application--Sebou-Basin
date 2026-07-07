# Correction des régressions — Dashboard Accueil DG

## Contexte

Après le commit `96f8575` "perf(home): optimise Dashboard Accueil DG loading experience", deux régressions sont apparues :

1. **Carte métier intégrée à l’accueil** : les entités s’affichaient mais un bandeau rouge affichait `"Erreur de chargement : Network Error"`.
2. **Bloc Tendances** : les séries Pluie, Débit et Qualité affichaient `"Série ... indisponible"`.

## Cause racine

### 1. Carte — `Network Error` affiché comme erreur métier

Dans `OperationalMap.tsx`, toute erreur remontée par une seule couche (ou par `getQualityStations`) était propagée telle quelle à `BusinessMap`, qui affichait :

```tsx
Erreur de chargement : {error.message}
```

Si une seule couche secondaire échouait (par exemple timeout / connexion / backend occupé), le bandeau rouge s’affichait alors que les entités des autres couches étaient bien rendues.

De plus, le message brut `"Network Error"` ne distinguait pas :
- timeout
- backend indisponible
- données absentes
- annulation

### 2. Tendances — disparition des séries

Dans `dashboardRuntime.ts`, les appels à `/dashboard/trends` et `/quality/stations-with-timeseries` avaient reçu :

```ts
timeout: 10_000,
retry: false,
refetchOnWindowFocus: false,
```

Sur un backend déjà lent, le endpoint `/dashboard/trends` dépassait souvent 10 s. Avec `retry: false`, React Query basculait immédiatement en état d’erreur et le `TrendPanel` recevait un fallback `"indisponible"`.

## Corrections appliquées

### Backend / instrumentation

Aucune modification backend n’a été nécessaire pour ces régressions. Le backend compile toujours.

### Frontend

#### a) Logging API dev-only — `frontend/src/api/client.ts`

Ajout d’intercepteurs de requête/réponse en mode `DEV` pour tracer :
- endpoint, méthode, params
- durée (ms)
- status HTTP
- code d’erreur (`ERR_CANCELED`, `ECONNABORTED`, etc.)
- message

Cela permet d’identifier rapidement l’appel fautif dans les consoles navigateur.

#### b) Distinction des types d’erreur carte — `frontend/src/api/mapBusiness.ts`

Ajout de `getMapErrorLabel(error)` :

| Situation | Message affiché |
| --- | --- |
| Timeout Axios (`ECONNABORTED`) | "Service temporairement lent" |
| Requête annulée (`ERR_CANCELED`) | "Chargement annulé" |
| Erreur 5xx | "Service indisponible" |
| Erreur 404 | "Données non disponibles" |
| Erreur 401/403 | "Accès refusé" |
| Pas de réponse (network) | "Service indisponible" |

#### c) Affichage carte — `frontend/src/components/DashboardMetier/BusinessMap.tsx`

Remplacement de :

```tsx
Erreur de chargement : {error.message}
```

par :

```tsx
{getMapErrorLabel(error)}
```

#### d) Gestion des erreurs par couche — `frontend/src/components/home-v2/OperationalMap.tsx`

- Calcul d’un objet `layerErrors` par couche.
- Définition d’une `criticalMapError` :
  - soit `qualityStationsQuery.error`
  - soit une erreur couche **uniquement si toutes les couches ont échoué et qu’aucune donnée n’est affichable**
- Ainsi, une panne d’une seule couche ne produit plus de bandeau rouge bloquant.

#### e) Indicateur discret par couche — `frontend/src/components/home-v2/LayerSummary.tsx`

Pour les couches en échec, le badge passe de `"Actif"` (vert) à `"Indisponible"` (amber) avec une icône `AlertCircle`.

#### f) Timeout et contrôle des appels qualité — `frontend/src/api/qualityRegulatory.ts`

`getQualityStations`, `getQualityParameters` et `getQualityTimeseries` acceptent désormais un `AbortSignal` et un timeout de 20 s.

`OperationalMap` passe le `signal` React Query à `getQualityStations` et désactive retry/refetch au focus.

#### g) Restauration des tendances — `frontend/src/api/dashboardRuntime.ts`

- Timeout porté de **10 s à 30 s** pour `/dashboard/trends` et `/quality/stations-with-timeseries`.
- Conservation de `retry: false` et `refetchOnWindowFocus: false` pour éviter les appels répétés.

## Fichiers modifiés

- `frontend/src/api/client.ts`
- `frontend/src/api/mapBusiness.ts`
- `frontend/src/components/DashboardMetier/BusinessMap.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`
- `frontend/src/components/home-v2/LayerSummary.tsx`
- `frontend/src/api/qualityRegulatory.ts`
- `frontend/src/api/dashboardRuntime.ts`

## Validation

### Build frontend

```bash
cd frontend
npm run build
```

✅ build réussi (~43 s)

### Compilation backend

```bash
python -m compileall -q backend/app
```

✅ aucune erreur de syntaxe

## Statut attendu par bloc

| Bloc | Statut attendu |
| --- | --- |
| Carte métier | Les entités s’affichent. Si une couche secondaire échoue, message discret `Indisponible` au lieu du bandeau rouge `Network Error`. |
| Pluie | Affichée si le backend retourne des points dans `/dashboard/trends.rainfall`. |
| Débit | Affiché si le backend retourne des points dans `/dashboard/trends.flow`. |
| Qualité | Affichée si le backend retourne des points dans `/dashboard/trends.quality`. |
| Température | Peut rester `"Température non disponible en base"` si les données ne sont pas injectées. |

## Limites restantes

- Le backend local reste instable (`numpy/blas_fpe_check`). Les tests navigateur n’ont pas pu être exécutés dans cet environnement.
- Si `/dashboard/trends` dépasse 30 s, le timeout se déclenchera et la tendance affichera le message d’indisponibilité. Ce cas nécessitera une optimisation backend plus poussée (voir `01_audit_performance_accueil.md`).

---

*Documentation produite le 2026-06-15.*
