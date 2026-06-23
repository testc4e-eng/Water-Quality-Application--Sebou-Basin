import { create } from "zustand";
import { toast } from "@/components/ui/sonner";
import type { CorrelationResponse } from "@/api/analysis";

export type SupportType = 'STATION_QUALITE' | 'POINT_PRELEVEMENT_POLLUTION' | 'SOURCE_POLLUTION' | 'STATION_HYDRO' | 'BARRAGE' | 'STATION_METEO' | 'STATION_SENTINELLE';

export interface BatchSeriesItem {
  support_type: SupportType;
  object_id: string;
  domain: string;
  parameter_code: string;
  object_name?: string;
  data_temporality?: string;
  data_family?: string;
  measurement_context?: string;
}

export type AggregationLevel = "raw" | "daily" | "monthly" | "annual";

export interface AnalysisWidgetState {
  id: string;
  title: string;
  type: 'chart' | 'kpi' | 'table' | 'correlation';
  seriesRequests: BatchSeriesItem[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  correlationData?: CorrelationResponse;
}


interface WorkspaceState {
  // Filtres globaux temporels
  globalDateFrom: string;
  globalDateTo: string;
  globalAggregation: AggregationLevel;
  
  // Séries sélectionnées pour le batch
  selectedSeriesRequests: BatchSeriesItem[];
  
  // UX des panneaux
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  isLeftPanelCompact: boolean;
  isRightPanelCompact: boolean;
  activeLeftAccordion: string;
  activeRightAccordion: string;

  // Modes d'analyse
  mode: 'support' | 'domain' | 'thematic';
  setMode: (mode: 'support' | 'domain' | 'thematic') => void;
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
  selectedParameter: string | null;
  setSelectedParameter: (param: string | null) => void;
  selectedThematic: string | null;
  setSelectedThematic: (thematic: string | null) => void;
  selectedSubThematic: string | null;
  setSelectedSubThematic: (sub: string | null) => void;
  selectedPeriod: string | null;
  setSelectedPeriod: (period: string | null) => void;

  // Actions métier
  addSeriesRequest: (item: BatchSeriesItem) => void;
  removeSeriesRequest: (support_type: string, object_id: string, parameter_code: string) => void;
  clearSeriesRequests: () => void;
  
  // Widgets
  widgets: AnalysisWidgetState[];
  addWidget: (widget: Omit<AnalysisWidgetState, 'id'>) => string;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, pos: { x: number; y: number }) => void;
  updateWidgetSize: (id: string, size: { width: number; height: number }) => void;
  minimizeWidget: (id: string) => void;
  closeAllWidgets: () => void;
  minimizeAllWidgets: () => void;

  setGlobalDateRange: (from: string, to: string) => void;
  setGlobalAggregation: (agg: AggregationLevel) => void;

  // Corrélations
  isCorrelationPanelOpen: boolean;
  correlationSeriesX: BatchSeriesItem | null;
  correlationSeriesY: BatchSeriesItem | null;
  correlationResult: CorrelationResponse | null;
  openCorrelationPanel: () => void;
  closeCorrelationPanel: () => void;
  setCorrelationSeriesX: (series: BatchSeriesItem | null) => void;
  setCorrelationSeriesY: (series: BatchSeriesItem | null) => void;
  setCorrelationResult: (result: CorrelationResponse | null) => void;
  resetCorrelation: () => void;
  addCorrelationWidget: (data: CorrelationResponse) => void;
  
  // Actions UI
  setLeftPanelOpen: (isOpen: boolean) => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setLeftPanelCompact: (isCompact: boolean) => void;
  setRightPanelCompact: (isCompact: boolean) => void;
  setActiveLeftAccordion: (id: string) => void;
  setActiveRightAccordion: (id: string) => void;
}

const DEFAULT_DATE_FROM = "2020-01-01";
const DEFAULT_DATE_TO = new Date().toISOString().split('T')[0];

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  globalDateFrom: DEFAULT_DATE_FROM,
  globalDateTo: DEFAULT_DATE_TO,
  globalAggregation: "monthly",
  
  selectedSeriesRequests: [],

  isCorrelationPanelOpen: false,
  correlationSeriesX: null,
  correlationSeriesY: null,
  correlationResult: null,
  
  isLeftPanelOpen: true,
  isRightPanelOpen: false,
  isLeftPanelCompact: false,
  isRightPanelCompact: false,
  activeLeftAccordion: "supports",
  activeRightAccordion: "informations",

  mode: 'support',
  setMode: (mode) => set({ mode, selectedDomain: '', selectedParameter: '' }),
  selectedDomain: 'QUALITE',
  setSelectedDomain: (domain) => set({ selectedDomain: domain, selectedParameter: '' }),
  selectedParameter: '',
  setSelectedParameter: (param) => set({ selectedParameter: param }),
  selectedThematic: '',
  setSelectedThematic: (thematic) => set({ selectedThematic: thematic, selectedSubThematic: '' }),
  selectedSubThematic: '',
  setSelectedSubThematic: (sub) => set({ selectedSubThematic: sub }),
  selectedPeriod: '30j',
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  addSeriesRequest: (item) => set((state) => {
    // Éviter les doublons exacts
    const exists = state.selectedSeriesRequests.some(
      s => s.support_type === item.support_type 
        && s.object_id === item.object_id 
        && s.parameter_code === item.parameter_code
    );
    if (exists) return state;
    
    // On force l'ouverture du panneau droit (maintenant workspace) si on ajoute une série
    // Et on ajoute un widget par défaut !
    // Données ponctuelles (IDP pollution) -> tableau, séries temporelles -> graphique
    const isPointMeasure = item.data_temporality === 'POINT_MEASURE';
    const newWidget: AnalysisWidgetState = {
      id: crypto.randomUUID(),
      title: state.mode === 'domain' 
        ? `${item.parameter_code} — ${item.object_name || item.object_id}`
        : `${item.object_name || item.object_id} — ${item.parameter_code}`,
      type: isPointMeasure ? 'table' : 'chart', // Default
      seriesRequests: [item],
      position: { x: 50 + (state.widgets.length * 30), y: 50 + (state.widgets.length * 30) },
      size: { width: 500, height: 350 },
      isMinimized: false
    };

    toast.success("Ajouté au workspace", {
      description: `${item.object_name || item.object_id} — ${item.parameter_code}`,
      duration: 2000,
    });

    return { 
      selectedSeriesRequests: [...state.selectedSeriesRequests, item],
      widgets: [...state.widgets, newWidget],
      isRightPanelOpen: true
    };
  }),

  removeSeriesRequest: (support_type, object_id, parameter_code) => set((state) => {
    const newSeries = state.selectedSeriesRequests.filter(
      s => !(s.support_type === support_type && s.object_id === object_id && s.parameter_code === parameter_code)
    );
    // Supprimer aussi le widget correspondant s'il ne contient que cette requête
    const newWidgets = state.widgets.filter(w => 
      !(w.seriesRequests.length === 1 && 
        w.seriesRequests[0].support_type === support_type &&
        w.seriesRequests[0].object_id === object_id &&
        w.seriesRequests[0].parameter_code === parameter_code)
    );
    return { 
      selectedSeriesRequests: newSeries,
      widgets: newWidgets,
      isRightPanelOpen: newSeries.length > 0 ? state.isRightPanelOpen : false
    };
  }),

  clearSeriesRequests: () => set({ selectedSeriesRequests: [], widgets: [], isRightPanelOpen: false }),

  // Implémentations widget
  widgets: [],
  addWidget: (widget) => {
    const id = crypto.randomUUID();
    set((state) => ({ widgets: [...state.widgets, { ...widget, id }] }));
    return id;
  },
  removeWidget: (id) => set((state) => {
    const newWidgets = state.widgets.filter(w => w.id !== id);
    // On supprime également les requêtes du batch si elles ne sont plus référencées
    // Pour l'instant on garde simple : on supprime le widget
    return { widgets: newWidgets };
  }),
  updateWidgetPosition: (id, pos) => set((state) => ({
    widgets: state.widgets.map(w => w.id === id ? { ...w, position: pos } : w)
  })),
  updateWidgetSize: (id, size) => set((state) => ({
    widgets: state.widgets.map(w => w.id === id ? { ...w, size } : w)
  })),
  minimizeWidget: (id) => set((state) => ({
    widgets: state.widgets.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)
  })),
  closeAllWidgets: () => set({ widgets: [] }),
  minimizeAllWidgets: () => set((state) => ({
    widgets: state.widgets.map(w => ({ ...w, isMinimized: true }))
  })),

  setGlobalDateRange: (from, to) => set({ globalDateFrom: from, globalDateTo: to }),
  
  setGlobalAggregation: (agg) => set({ globalAggregation: agg }),

  openCorrelationPanel: () => set({ isCorrelationPanelOpen: true }),
  closeCorrelationPanel: () => set({ isCorrelationPanelOpen: false }),
  setCorrelationSeriesX: (series) => set({ correlationSeriesX: series }),
  setCorrelationSeriesY: (series) => set({ correlationSeriesY: series }),
  setCorrelationResult: (result) => set({ correlationResult: result }),
  resetCorrelation: () => set({ correlationSeriesX: null, correlationSeriesY: null, correlationResult: null }),
  addCorrelationWidget: (data) => set((state) => {
    const x = data.series_x;
    const y = data.series_y;
    if (!x || !y) return state;
    const title = `${x.parameter_code} × ${y.parameter_code} — Corrélation`;
    const widget: AnalysisWidgetState = {
      id: crypto.randomUUID(),
      title,
      type: 'correlation',
      seriesRequests: [
        { support_type: x.support_type as SupportType, object_id: x.object_id, domain: x.domain, parameter_code: x.parameter_code },
        { support_type: y.support_type as SupportType, object_id: y.object_id, domain: y.domain, parameter_code: y.parameter_code },
      ],
      position: { x: 50 + (state.widgets.length * 30), y: 50 + (state.widgets.length * 30) },
      size: { width: 550, height: 400 },
      isMinimized: false,
      correlationData: data,
    };
    toast.success("Corrélation ajoutée au workspace", { description: title, duration: 2000 });
    return { widgets: [...state.widgets, widget], isCorrelationPanelOpen: false };
  }),

  setLeftPanelOpen: (isOpen) => set({ isLeftPanelOpen: isOpen }),
  setRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
  setLeftPanelCompact: (isCompact) => set({ isLeftPanelCompact: isCompact }),
  setRightPanelCompact: (isCompact) => set({ isRightPanelCompact: isCompact }),
  setActiveLeftAccordion: (id) => set({ activeLeftAccordion: id }),
  setActiveRightAccordion: (id) => set({ activeRightAccordion: id }),
}));

