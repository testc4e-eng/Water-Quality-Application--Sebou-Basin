import { Loader2, X, AlertCircle, ChevronRight, ChevronLeft, Info, BarChart2, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useAnalysisBatch } from "@/hooks/useAnalysisBatch";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export interface BusinessRightPanelV1Props {
  onClose: () => void;
}

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

export function BusinessRightPanelV1({ onClose }: BusinessRightPanelV1Props) {
  const { 
    selectedSeriesRequests, 
    removeSeriesRequest,
    isRightPanelCompact, 
    setRightPanelCompact,
    activeRightAccordion,
    setActiveRightAccordion
  } = useWorkspaceStore();
  
  const { data, isLoading, isError, error } = useAnalysisBatch();

  const formattedData = useMemo(() => {
    if (!data || !data.series) return [];
    
    // Convert to a flat array by date for Recharts
    const dateMap = new Map<string, any>();
    
    data.series.forEach((s) => {
      s.values.forEach((v) => {
        if (!dateMap.has(v.date)) {
           dateMap.set(v.date, { date: v.date });
        }
        dateMap.get(v.date)![s.id] = v.value;
      });
    });
    
    return Array.from(dateMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const yAxesUnits = useMemo(() => {
    if (!data || !data.series) return [];
    const units = new Set<string>();
    data.series.forEach(s => {
       units.add(s.unit || "valeur");
    });
    return Array.from(units);
  }, [data]);

  const kpis = useMemo(() => {
    if (!data || !data.series || data.series.length === 0) return null;
    
    // KPI summary for the first active series (or overall)
    // For simplicity, we just take the first series returned.
    const firstSeries = data.series.find(s => s.values.length > 0);
    if (!firstSeries) return null;

    const vals = firstSeries.values.map(v => v.value).filter(v => typeof v === 'number');
    if (vals.length === 0) return null;

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    
    const sorted = [...firstSeries.values].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last = sorted[sorted.length - 1];

    return {
      title: firstSeries.parameter_code,
      count: vals.length,
      min,
      max,
      avg,
      lastValue: last.value,
      lastDate: last.date
    };
  }, [data]);

  if (selectedSeriesRequests.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-500 bg-white/80 backdrop-blur-md">
         <BarChart2 className="h-10 w-10 text-slate-300 mb-3" />
         <p className="text-sm">Aucune série dans le workspace.</p>
         <button onClick={onClose} className="mt-4 text-xs text-indigo-600 underline">Fermer</button>
      </div>
    );
  }

  if (isRightPanelCompact) {
    return (
      <div className="flex h-full w-12 flex-col items-center py-4 bg-white/80 backdrop-blur-md">
        <button onClick={() => setRightPanelCompact(false)} className="mb-4 text-slate-500 hover:text-indigo-600 transition-colors" title="Agrandir">
           <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-6 mt-4 text-slate-400">
           <button onClick={() => { setRightPanelCompact(false); setActiveRightAccordion("informations"); }} title="Informations" className="hover:text-indigo-600 transition-colors"><Info className="h-5 w-5" /></button>
           <button onClick={() => { setRightPanelCompact(false); setActiveRightAccordion("kpi"); }} title="KPI" className="hover:text-indigo-600 transition-colors"><BarChart2 className="h-5 w-5" /></button>
           <button onClick={() => { setRightPanelCompact(false); setActiveRightAccordion("graphiques"); }} title="Graphiques" className="hover:text-indigo-600 transition-colors"><TrendingUp className="h-5 w-5" /></button>
           <button onClick={() => { setRightPanelCompact(false); setActiveRightAccordion("warnings"); }} title="Warnings" className="hover:text-amber-600 transition-colors relative">
             <AlertTriangle className="h-5 w-5" />
             {data?.warnings && data.warnings.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col w-[300px]">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-3 py-2">
        <button onClick={() => setRightPanelCompact(true)} className="text-slate-400 hover:text-slate-600 transition-colors" title="Réduire">
           <ChevronRight className="h-4 w-4" />
        </button>
        <h2 className="text-[14px] font-semibold text-slate-800 uppercase tracking-wide truncate pr-2">
          Workspace ({selectedSeriesRequests.length})
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
        <Accordion 
          type="single" 
          value={activeRightAccordion} 
          onValueChange={(val) => val && setActiveRightAccordion(val)} 
          className="w-full"
        >
          
          <AccordionItem value="informations" className="border-b-slate-100">
            <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">
              Informations
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <div className="space-y-2">
                {selectedSeriesRequests.map((req, idx) => (
                   <div key={idx} className="flex justify-between items-start bg-slate-50 p-1.5 rounded border border-slate-100">
                     <div className="truncate pr-2">
                        <div className="text-[11px] font-bold text-slate-800 truncate">{req.object_name || req.object_id}</div>
                        <div className="text-[10px] text-slate-500">{req.parameter_code}</div>
                     </div>
                     <button onClick={() => removeSeriesRequest(req.support_type, req.object_id, req.parameter_code)} className="text-slate-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                     </button>
                   </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="kpi" className="border-b-slate-100">
            <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">
              KPI
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              {kpis ? (
                <div className="grid grid-cols-2 gap-1 text-center">
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Dernière</div>
                    <div className="text-[12px] font-bold text-indigo-600">{kpis.lastValue.toFixed(1)}</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Min</div>
                    <div className="text-[12px] font-bold text-slate-700">{kpis.min.toFixed(1)}</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Max</div>
                    <div className="text-[12px] font-bold text-slate-700">{kpis.max.toFixed(1)}</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Moy</div>
                    <div className="text-[12px] font-bold text-slate-700">{kpis.avg.toFixed(1)}</div>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-1 rounded border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">n</div>
                    <div className="text-[12px] font-bold text-slate-700">{kpis.count}</div>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 text-center py-2">Aucun KPI disponible</div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="graphiques" className="border-b-slate-100">
            <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">
              Graphiques
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              {isLoading && (
                 <div className="flex items-center justify-center py-6 text-slate-500">
                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   <span className="text-[11px]">Chargement batch...</span>
                 </div>
              )}
              
              {isError && (
                 <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded flex items-start gap-2">
                   <AlertCircle className="w-3 h-3 shrink-0" />
                   <span>Erreur: {error instanceof Error ? error.message : "Erreur réseau."}</span>
                 </div>
              )}

              {data && data.series && data.series.length > 0 && (
                <div className="h-[220px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        tickMargin={4}
                        tickFormatter={(val) => new Date(val).toLocaleDateString('fr-MA', { month: 'short', year: '2-digit' })}
                        axisLine={false}
                        tickLine={false}
                      />
                      
                      {yAxesUnits.map((unit, i) => (
                        <YAxis 
                          key={unit}
                          yAxisId={unit}
                          orientation={i === 0 ? "left" : "right"}
                          tick={{ fontSize: 10, fill: '#64748b' }} 
                          tickMargin={4}
                          axisLine={false}
                          tickLine={false}
                          hide={i > 1} // max 2 axes visualised for simplicity
                        />
                      ))}

                      <RechartsTooltip 
                        contentStyle={{ fontSize: '11px', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '6px' }}
                        labelFormatter={(l) => new Date(l).toLocaleDateString('fr-MA')}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={8} />
                      
                      {data.series.map((s, i) => (
                        <Line 
                          key={s.id}
                          yAxisId={s.unit || "valeur"}
                          type="monotone" 
                          dataKey={s.id} 
                          name={s.parameter_code}
                          stroke={COLORS[i % COLORS.length]} 
                          strokeWidth={1.5}
                          dot={false}
                          activeDot={{ r: 3 }} 
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="warnings" className="border-b-slate-100">
            <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">
              Warnings
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              {data && data.warnings && data.warnings.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {data.warnings.map((w, idx) => (
                     <div key={idx} className="bg-amber-50/50 border border-amber-100 rounded p-1.5 text-[10px]">
                        <span className="font-bold text-amber-700">{w.type}</span>: <span className="text-slate-600">{w.message}</span>
                     </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">Aucun warning.</div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="historique" className="border-b-slate-100">
            <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">
              Historique
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <div className="text-[11px] text-slate-500 italic">Tableau de données non disponible en mode compact.</div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}
