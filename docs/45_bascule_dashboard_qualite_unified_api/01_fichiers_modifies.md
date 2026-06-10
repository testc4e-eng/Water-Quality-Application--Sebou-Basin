# Fichiers modifiés

Pour la bascule vers les endpoints unifiés, les fichiers frontend suivants ont été modifiés :

1. **`frontend/src/api/qualityRegulatory.ts`**
   - Mise à jour des interfaces TypeScript : ajout de `support_type` et `source_table`.
   - Modification de `getQualityStations`, `getQualityParameters` et `getQualityTimeseries` pour pointer sur `/api/v1/quality/unified/*` avec l'argument optionnel `supportType`.

2. **`frontend/src/hooks/useQualityRegulatory.ts`**
   - Mise à jour des hooks React Query pour inclure `supportType` dans la `queryKey` et passer la variable aux fonctions API.

3. **`frontend/src/pages/DashboardQualiteReglementaire.tsx`**
   - Ajout de l'état local `supportType` (défaut : `SENTINELLE`).
   - Ajout d'une section UI de type "Tabs" / "Boutons" en haut de la page pour filtrer dynamiquement le Dashboard par "Temps réel", "Historique Rivières", "Barrages" ou "Barrage de Garde".
   - Passage explicite de `supportType` aux hooks `useQualityStations` et `useQualityTimeseries`.

**Règle respectée :**
Le composant `DashboardHomeV2.tsx` et les services associés (`home_service.py`, `runtime_service.py`) sont restés strictement intacts pour garantir la stabilité de l'Accueil DG.
