# Architecture menu V2

## Fichiers

| Fichier | Rôle |
|---|---|
| `frontend/src/components/observatory/ObservatoryMenuV2.tsx` | Menu cascade domaine -> famille -> paramètre -> filtres -> affichage. |
| `frontend/src/hooks/useObservatoryData.ts` | Hook React Query générique avec `enabled` conditionnel. |
| `frontend/src/components/observatory/ObservatoryDataPanel.tsx` | Affichage léger des résultats filtrés. |
| `frontend/src/components/observatory/ObservatoryParameterSummary.tsx` | Min/moy/max sur page chargée. |
| `frontend/src/components/observatory/ObservatoryStatusBar.tsx` | Statut source, count, famille et paramètre. |
| `frontend/src/components/observatory/ObservatoryThematicLayer.tsx` | Placeholder contrôlé pour future couche MapLibre thématique. |

## Règle de chargement

```ts
enabled: Boolean(selectedFamily && selectedParameter)
```

En pratique, le menu utilise une `submittedSelection` séparée de la sélection UI. Un changement de domaine, famille ou paramètre remet les données soumises à vide. L'appel API ne part qu'après clic sur `Afficher`.

## Intégration

Le bouton `Observatoire V2` est ajouté à `Dashboard2`, séparément du bouton legacy `Couches d'observatoire`. Le menu legacy reste disponible.
