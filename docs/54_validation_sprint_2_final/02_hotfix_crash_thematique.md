# BUG 5 — Crash Mode Thématique

## Symptôme
Le basculement en mode Thématique provoquait un crash écran blanc via l'erreur React `selectedThematic is not defined`.

## Fichier modifié
`frontend/src/components/DashboardMetier/V1/BusinessSidebarV1.tsx`

## Correctif Appliqué
- Importation adéquate des variables depuis `useWorkspaceStore` :
```tsx
    selectedThematic, setSelectedThematic,
    selectedSubThematic, setSelectedSubThematic,
    selectedPeriod, setSelectedPeriod
```
- Remontée de l'appel à `useWorkspaceStore` avant l'utilisation de `mode` dans l'affectation `activeFilters` qui posait un problème de `ReferenceError`.

## Résultat
**Bug corrigé (OUI)** : Le panneau de gauche s'affiche correctement sans crash, et les sélecteurs "Thème" et "Horizon temporel" sont exploitables.
