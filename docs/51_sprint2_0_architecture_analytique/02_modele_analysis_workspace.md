# 2. Modèle AnalysisWorkspace

Le gestionnaire de contexte local `AnalysisWorkspace` structure toutes les interactions entre la carte, la sidebar, et les panneaux flottants.

```typescript
type AnalysisWorkspace = {
  // Les séries analytiques extraites du backend (la donnée réelle)
  selectedSeries: AnalyticalSeries[];
  
  // Fenêtre temporelle d'analyse
  globalTimeRange: { from: string; to: string };
  
  // Agrégation temporelle cible de l'espace de travail
  aggregation: "raw" | "daily" | "monthly" | "annual";
  
  // Panneaux d'analyse (graphiques, tableaux, KPIs)
  panels: AnalysisPanel[];
  
  // ID du panneau actuellement en surbrillance/focus
  activePanelId?: string;
  
  // Détermine si un clic sur la carte ajoute automatiquement à la sélection
  mapLinkedSelection: boolean;
  
  // Alertes métier non-bloquantes (ex: Unités différentes, manque de data)
  warnings: AnalysisWarning[];
};

type AnalysisWarning = {
  id: string;
  type: "unit_mismatch" | "low_data" | "frequency_mismatch" | "no_overlap";
  message: string;
};

type AnalysisPanel = {
  id: string;
  title: string;
  type: "chart" | "table" | "stats";
  // Liste des IDs des AnalyticalSeries rattachées à ce panneau
  seriesIds: string[]; 
  
  // Spatialisation UI (pour de futurs panneaux déplaçables)
  position: { x: number; y: number };
  size: { width: number; height: number };
  
  // Réduit / Agrandit
  isCollapsed: boolean;
};
```
