# Impacts frontend / workspace

## Fichiers modifiés

- `frontend/src/api/businessMapV1.ts`
  - Types `BusinessMapAvailabilityItem`, `BusinessMapFeatureProperties`, `AnalyticalSeries` enrichis.
  - Filtres `data_temporality`, `data_family`, `measurement_context` sur `getBusinessMapAvailability` et `getBusinessMapFeatures`.

- `frontend/src/api/analysis.ts`
  - `AnalyticalSeries` : ajout de `series_type` optionnel.

- `frontend/src/store/workspaceStore.ts`
  - `BatchSeriesItem` : ajout de `data_temporality`, `data_family`, `measurement_context`.
  - `addSeriesRequest()` : création d'un widget `table` si `data_temporality === 'POINT_MEASURE'`, sinon `chart`.

- `frontend/src/components/DashboardMetier/V1/MapV1.tsx`
  - Affichage dans le popup : Nature, Famille, Contexte.
  - Libellé du bouton d'ajout adapté (`Analyser en graphique` vs `Voir les valeurs`).
  - Transmission de `data_temporality`, `data_family`, `measurement_context` à `addSeriesRequest`.

- `frontend/src/components/analysis-workspace/WidgetTable.tsx`
  - Badge "Données ponctuelles" affiché quand `series_type === 'POINT_MEASURE'`.

## Comportement utilisateur

| Action | Résultat |
|---|---|
| Cliquer sur une station hydro | Widget graphique |
| Cliquer sur une station qualité avec série | Widget graphique |
| Cliquer sur un point pollution IDP | Widget tableau |
| Voir popup pollution | `Nature: Donnée ponctuelle`, `Famille: POLLUTION_IDP` |
| Voir popup hydro | `Nature: Série temporelle`, `Famille: HYDROLOGIE` |
