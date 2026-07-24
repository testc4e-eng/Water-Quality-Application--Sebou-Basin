# Diagnostic — Dashboard Qualité 404 (Vue d'ensemble)

Date : 2026-07-08

## Symptôme

Sur `/dashboard-qualite-reglementaire`, onglet **Vue d'ensemble** :

```
Erreur API : Request failed with status code 404
```

## Chaîne d'appel frontend

| Composant | Hook | Fonction API | Endpoint |
|---|---|---|---|
| `QualityOverviewTab.tsx` | `useQuery` `['unified-stations']` | `getQualityStations()` | `GET /api/v1/quality/unified/stations` |
| `QualityOverviewTab.tsx` | `useQuery` `['unified-parameters']` | `getQualityParameters()` | `GET /api/v1/quality/unified/parameters` |

Les deux requêtes sont lancées **en parallèle** au montage de l'onglet.  
Si **l'une seule** échoue, le composant affiche une erreur globale.

## Vérification backend complet (`app/main.py` → `app/routers/quality.py`)

Le backend complet expose bien les deux routes unifiées :

- `GET /api/v1/quality/unified/stations` — `@router.get("/unified/stations")` (ligne ~987)
- `GET /api/v1/quality/unified/parameters` — `@router.get("/unified/parameters")` (ligne ~1033)

Enregistrement : `api_v1.py` → `api_router.include_router(quality.router, prefix="/quality")`.

**Conclusion backend complet** : les routes existent ; pas de problème de préfixe `/api/v1` ni de contrat API côté FastAPI principal.

## Vérification mock backend (port 8011)

Configuration frontend : `frontend/.env` → `VITE_API_BASE_URL=http://localhost:8010/api/v1`  
Fallback automatique dans `frontend/src/api/client.ts` : si 8010 injoignable → bascule vers `8011`.

| Endpoint | Mock avant correction | Backend complet |
|---|---|---|
| `GET /api/v1/quality/unified/stations` | **200** ✅ | **200** ✅ |
| `GET /api/v1/quality/unified/parameters` | **404** ❌ | **200** ✅ |

Test reproductible :

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8011/api/v1/quality/unified/stations
# → 200

curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8011/api/v1/quality/unified/parameters
# → 404 (avant correction)
```

## Cause racine

**Route mock manquante** : `backend/mock_main.py` n'exposait que `/quality/unified/stations`, pas `/quality/unified/parameters`.

Scénario typique :

1. Backend complet indisponible sur 8010 (`numpy/blas_fpe_check` ou service arrêté).
2. Frontend bascule sur le mock 8011 (ou `.env.local` pointe directement sur 8011).
3. `getQualityStations` réussit (200).
4. `getQualityParameters` échoue (404).
5. `QualityOverviewTab` affiche l'erreur axios brute.

## Ce qui n'est PAS en cause

- URL frontend incorrecte (chemins `/quality/unified/*` corrects).
- Préfixe `/api/v1` manquant (géré par `API_BASE_URL`).
- Hook React Query obsolète (utilise bien l'API unifiée).
- Suppression d'onglets ou régression métier du dashboard.
