# BUG — Graphique Blanc / ResponsiveContainer : Diagnostic et Correction (Hotfix 5)

## Diagnostic
Après avoir garanti le bon formatage des requêtes (Hotfix 4) et constaté que les données transitaient correctement (`200 OK` et array `values` bien rempli), le graphique restait paradoxalement invisible (totalement blanc, sans affichage de la balise textuelle "Aucune donnée"). 
Ce comportement est symptomatique de la librairie **Recharts** : le composant `ResponsiveContainer` s'effondre à une hauteur ou largeur de `0px` lorsqu'il est imbriqué dans des conteneurs Flexbox dynamiques (`react-rnd`) dont les dimensions ne lui sont pas explicitement relayées.

De plus, l'égalité d'identifiants entre `object_id` (store) et `object_id` (réponse) pouvait échouer pour des raisons de casse invisible sur les UUID.

## Fichiers modifiés
- `frontend/src/components/analysis-workspace/WidgetChart.tsx`
- `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx`

## Corrections Appliquées
1. **Abandon de ResponsiveContainer (Option B) :**
   J'ai supprimé `ResponsiveContainer` pour forcer le passage direct de `width` et `height` (fournis par le widget parent `react-rnd`) au composant `LineChart`.
   ```tsx
   <LineChart width={Math.max(300, width - 40)} height={Math.max(150, height - 80)} data={chartData}>
   ```
2. **Matching Case-Insensitive (Option A hybride) :**
   Dans le `AnalysisWorkspace.tsx`, le croisement des IDs s'effectue maintenant avec une insensibilité à la casse pour ignorer les différences d'UUID :
   ```tsx
   String(r.object_id || '').toLowerCase() === String(s.object_id || '').toLowerCase()
   ```

## Résultat
**Bug corrigé (OUI) :** Les données s'affichent physiquement dans le Canvas Recharts qui possède désormais des proportions solides dictées par sa fenêtre flottante.
