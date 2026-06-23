# Tests Frontend & API

### Performance API

- L'optimisation `MATERIALIZED` sur les CTE a validé des temps de réponse proches de 1.5s - 2s au lieu de 50s.
- `npm run build` a passé toutes les étapes sans erreur de compilation en environ 50s.

### Mécanismes de résilience Frontend

1. `retry: false` configuré sur `useQuery` pour empêcher une boucle de requête (DoS involontaire) si le backend souffre.
2. `staleTime: 30000` (30 secondes) ajouté pour éviter de recharger systématiquement la même vue au re-focus.
3. Un timer UI manuel de `8000ms` a été configuré sur les onglets complexes (Temps réel, Rivières, Barrages, Garde) pour avertir l'utilisateur d'un long temps de traitement si jamais l'API met plus de 8 secondes à retourner `isLoadingStations: false`.
