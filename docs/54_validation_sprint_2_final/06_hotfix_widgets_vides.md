# BUG A — Widgets Vides : Diagnostic et Correction

## Diagnostic
Lors de l'ajout d'une série au workspace analytique depuis le popup de la carte, le payload envoyé au backend était invalide pour deux raisons principales :
1. `object_id` utilisait le nom d'affichage de la station (ou un ID inexistant) plutôt que le code technique robuste (`entity_id` / `object_code`).
2. `domain` et `parameter_code` souffraient de problèmes de casse (majuscules/minuscules), ce qui provoquait une incohérence avec la base de données qui attend des codes techniques stricts (ex: "PH" au lieu de "pH", "QUALITE" au lieu de "Qualité").
De plus, `AnalysisWorkspace.tsx` écrasait l'appel du hook `useAnalysisBatch` avec de faux paramètres ignorés.

## Fichiers modifiés
- `frontend/src/components/DashboardMetier/V1/MapV1.tsx`
- `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx`
- `frontend/src/components/analysis-workspace/WidgetChart.tsx`
- `frontend/src/components/analysis-workspace/WidgetKPI.tsx`

## Corrections Appliquées
1. **Formatage strict du Payload (`MapV1.tsx`) :**
   - Remplacement de `object_id: ...` par une recherche stricte priorisant l'ID technique fourni par MapLibre : `object_id: selectedFeature.properties.object_id || selectedFeature.id || selectedFeature.properties.object_code`
   - Forçage en majuscule : `domain: activeFilters.domain?.toUpperCase()!` et `parameter_code: activeFilters.parameter_code?.toUpperCase()!`
2. **Hook React Query (`AnalysisWorkspace.tsx`) :** Suppression des paramètres faussement injectés à `useAnalysisBatch()` qui fonctionne de manière autonome en lisant le store Zustand.
3. **Empty States (`WidgetChart.tsx`, `WidgetKPI.tsx`) :** Ajout de rendus fallback "Aucune donnée disponible" pour éviter un bloc vide si le backend retourne une liste de valeurs vierge pour la période demandée.

## Résultat
**Bug A corrigé (OUI) :** Les widgets reçoivent désormais le code exact et requêtent correctement la base de données.
