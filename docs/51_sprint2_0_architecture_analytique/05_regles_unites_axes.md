# 5. Règles Unités et Multi-Axes Y (Frontend)

L'un des plus grands défis de l'analyse multi-support est la superposition de grandeurs physiques hétérogènes.

## Règle fondamentale

- Ne **jamais** sommer ou normaliser automatiquement deux unités différentes sur un même axe.
- Chaque unité détectée dans le store `selectedSeries` engendre la création d'un axe distinct.

## Comportement des Axes Y (Recharts)

1. **Même unité détectée = Même Axe Y**.
   - Exemple : Série A (mg/L) et Série B (mg/L). Le composant crée un seul `<YAxis yAxisId="axis-1" />` et y attache les deux courbes.

2. **Unités différentes = Axe Y séparé**.
   - Exemple : Série A (mg/L) et Série B (m³/s). Le composant génère `<YAxis yAxisId="axis-mgl" orientation="left" />` et `<YAxis yAxisId="axis-m3s" orientation="right" />`.

3. **Plus de 3 unités = Avertissement**.
   - Le composant `Recharts` peut techniquement afficher 3 ou 4 axes, mais l'UX devient illisible. Le `AnalysisWorkspace` doit injecter un `AnalysisWarning` dans le store ("Trop d'unités superposées").

4. **Unité inconnue ou vide**.
   - La série est isolée sur son propre axe Y avec un badge/avertissement *"Unité à confirmer"*.
