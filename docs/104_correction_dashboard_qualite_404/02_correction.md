# Correction — Dashboard Qualité 404

Date : 2026-07-08

## Endpoint en 404

```
GET /api/v1/quality/unified/parameters
```

Méthode : **GET**  
Query params typiques : `support_type` (optionnel, via filtres globaux)  
Déclencheur : `QualityOverviewTab` → hook `useQuery(['unified-parameters'])` → `getQualityParameters()`

## Fichiers modifiés

### 1. `backend/mock_main.py` — route mock ajoutée

Ajout de `GET /api/v1/quality/unified/parameters` avec 13 paramètres mock cohérents avec les stations sentinelles (`parameter_count: 13`).

Filtrage :
- `support_type` ≠ `SENTINELLE` → liste vide (aligné sur le comportement stations mock).
- `ire_station` / `station_id` → `station_count` réduit à 1.

### 2. `frontend/src/api/qualityRegulatory.ts` — logs dev + helper erreur

- Ajout de `formatQualityApiError(error, context)` :
  - message utilisateur : **« Service Qualité indisponible ou route API non exposée »**
  - détail technique (`method`, `url`, `params`, `status`) en `console.error` en mode DEV.
- Logs `console.debug` sur `getQualityStations` et `getQualityParameters` (requête + longueur réponse).

### 3. `frontend/src/components/quality-dashboard/QualityOverviewTab.tsx` — message d'erreur

- Remplacement du message axios brut par `formatQualityApiError`.
- Contexte explicite en DEV : endpoint stations vs parameters.

## Fichiers backend complets — aucune modification

Les routes unifiées existaient déjà dans `backend/app/routers/quality.py`.  
Aucun changement de logique métier du dashboard.

## Limites connues (hors périmètre)

Les autres onglets du dashboard qualité appellent des routes mock **non encore implémentées** sur 8011 :

- `GET /quality/unified/timeseries`
- `GET /quality/regulatory-status`
- `GET /quality/thresholds`

Ces onglets peuvent encore échouer en mode mock ; seul **Vue d'ensemble** est corrigé ici.
