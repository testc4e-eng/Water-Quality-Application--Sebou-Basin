# BUG A — Widgets Vides (React Query Parsing) : Diagnostic et Correction

## Diagnostic
Bien que la requête `POST /analysis/series/batch` parte correctement et que le backend renvoie un statut `200 OK` avec des données au format attendu, le hook `useAnalysisBatch` retournait l'objet complet `UseQueryResult` et le composant `AnalysisWorkspace` n'assurait pas l'égalité de type sur l'identifiant. 
En particulier, si le `object_id` de la requête initiale (`BatchSeriesItem`) provenait d'un entier GeoJSON (ex: `8002`) et que la réponse API le formattait en chaîne de caractères (`"8002"`), la comparaison stricte `r.object_id === s.object_id` (Number === String) échouait, laissant le filtre vide.

## Fichiers modifiés
- `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx`
- `frontend/src/hooks/useAnalysisBatch.ts`

## Corrections Appliquées
1. **Extraction de .data confirmée :** Nous avons validé que `const { data: batchData } = useAnalysisBatch();` extrait déjà le corps de réponse.
2. **Comparaison string-safe (`AnalysisWorkspace.tsx`) :** Remplacement de l'égalité stricte par une conversion sécurisée : `String(r.object_id) === String(s.object_id)`. Le widget trouve désormais sa série associée.
3. **Log de vérification (`useAnalysisBatch.ts`) :** Ajout de `console.log("Batch response structure", ...)` pour le traçage.

## Résultat
**Bug A corrigé (OUI) :** Les widgets identifient leur flux de données correctement et la mention "Aucune donnée" a disparu pour les stations documentées.
