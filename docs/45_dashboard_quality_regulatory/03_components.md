# Composants dashboard qualité réglementaire

| Fichier | Rôle |
|---|---|
| `frontend/src/pages/DashboardQualiteReglementaire.tsx` | composition de la page |
| `frontend/src/api/qualityRegulatory.ts` | client API typé |
| `frontend/src/hooks/useQualityRegulatory.ts` | chargement React Query |
| `RegulatoryHeader.tsx` | version, périmètre et volumes réglementaires |
| `KPIQualiteCards.tsx` | KPI lecture seule |
| `QualityStationsPanel.tsx` | sélection station, paramètre et période |
| `QualityTimeSeries.tsx` | graphique historique |
| `QualityParametersTable.tsx` | seuils actifs agrégés par paramètre |
| `ObservationalParametersPanel.tsx` | paramètres visibles mais non classifiables |
| `QualityStatusBadge.tsx` | badges statuts réglementaires |
