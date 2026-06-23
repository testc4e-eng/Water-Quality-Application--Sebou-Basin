# 8. Plan d'Implémentation du Sprint 2

Ce Sprint est découpé en 5 étapes progressives (2A à 2E) :

## SPRINT_2A : Backend /analysis/series/batch
- Création du modèle Pydantic de la requête (`BatchSeriesRequest`).
- Implémentation du endpoint `POST /api/v1/business-map/analysis/series/batch`.
- Écriture de la requête SQL/ORM pour consolider les séries depuis les vues matérialisées existantes.
- Retour au format strict défini dans `04_contrat_api_batch_series.md`.

## SPRINT_2B : Zustand workspace frontend
- Création du store Zustand (`useAnalysisWorkspaceStore.ts`).
- Modèles TypeScript Frontend (`AnalysisWorkspace`, `AnalyticalSeries`, `AnalysisPanel`, `AnalysisWarning`).
- Câblage de l'interaction (MapLibre -> Zustand -> Panneaux).

## SPRINT_2C : Multi-series chart
- Création du composant Recharts `MultiSeriesChartPanel`.
- Implémentation de la logique des multi-axes (cf `05_regles_unites_axes.md`).

## SPRINT_2D : Table synchronisée
- Création du `SeriesTablePanel`.
- Alignement temporel des colonnes (si possible) ou concaténation brute.
- Export basique CSV.

## SPRINT_2E : Tests et documentation
- Validation bout-en-bout.
- Traitement des `AnalysisWarnings` sur l'UI.
