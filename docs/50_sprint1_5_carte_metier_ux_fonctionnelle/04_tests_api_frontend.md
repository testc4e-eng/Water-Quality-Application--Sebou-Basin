# 4. Tests API & Frontend

## Validation API

Les appels cURL sur les nouveaux endpoints ont été testés et validés en runtime après le redémarrage du conteneur `sad-backend` :

1. `/features` avec paramètres complets :
   ```bash
   curl "http://localhost:8010/api/v1/business-map/features?support_type=STATION_QUALITE&domain=QUALITE&parameter_code=AG&limit=10"
   ```
   **Succès** : Filtre GeoJSON uniquement les stations qui ont des mesures d'Azote Global (via la jointure backend avec `mv_business_map_last_values`).

2. `/series` avec paramètres par défaut modifiés :
   **Succès** : La série s'affiche sans plantage et agrège bien les données jusqu'à aujourd'hui depuis 2015-01-01.

## Validation Build Frontend
L'application frontend a été recompilée avec `npm run build`. Le build s'est conclu **sans aucune erreur TypeScript**, confirmant la cohérence des contrats React Query et des props MapLibre.

## Cache React Query
Les options du hook Query ont été réglées pour maximiser l'UX de la cartographie (pas de rafraîchissements intempestifs) :
```typescript
staleTime: 30000,
retry: false,
refetchOnWindowFocus: false
```
