import React, { useMemo } from "react";
import { useBusinessMapAvailability, useBusinessMapFeatures } from "@/hooks/useBusinessMapV1";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { AlertCircle, Filter, Map as MapIcon, Loader2, ChevronLeft, ChevronRight, Search, Folder, Thermometer, Settings2 } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { THEMATIQUES, getSubThematiques, getParameters, findParameter, findParameterByCode, getAllParameters, filterThematiqueTree, type ThematiqueParameter } from "@/config/thematiques.config";
import { ThematicValuesTable } from "./ThematicValuesTable";

export interface BusinessSidebarV1Props {
  filters: {
    support_type?: string;
    domain?: string;
    subdomain?: string;
    parameter_code?: string;
    bassin_nom?: string;
  };
  onFiltersChange: (filters: BusinessSidebarV1Props["filters"]) => void;
}

export function BusinessSidebarV1({ filters, onFiltersChange }: BusinessSidebarV1Props) {
  const { data, isLoading, isError } = useBusinessMapAvailability({});
  
  const { 
    isLeftPanelCompact, setLeftPanelCompact, 
    activeLeftAccordion, setActiveLeftAccordion,
    mode, setMode,
    selectedDomain, setSelectedDomain,
    selectedParameter, setSelectedParameter,
    selectedThematic, setSelectedThematic,
    selectedSubThematic, setSelectedSubThematic,
    selectedPeriod, setSelectedPeriod,
    addSeriesRequest
  } = useWorkspaceStore();

  const activeThematicParam: ThematiqueParameter | null = useMemo(() => {
    if (mode !== 'thematic' || !selectedThematic || !selectedSubThematic || !selectedParameter) return null;
    return findParameter(selectedThematic, selectedSubThematic, selectedParameter);
  }, [mode, selectedThematic, selectedSubThematic, selectedParameter]);

  const activeFilters = mode === 'thematic'
    ? activeThematicParam
      ? { ...filters, domain: activeThematicParam.domain, parameter_code: activeThematicParam.code }
      : { ...filters, domain: undefined, parameter_code: undefined }
    : mode === 'domain'
      ? selectedParameter
        ? { domain: selectedDomain || undefined, parameter_code: selectedParameter }
        : { ...filters, domain: undefined, parameter_code: undefined }
      : filters;

  const { data: featuresData } = useBusinessMapFeatures({
    support_type: activeFilters.support_type,
    domain: activeFilters.domain,
    parameter_code: activeFilters.parameter_code,
    bassin_nom: activeFilters.bassin_nom
  }, true);

  const availableOptions = data?.available_options;

  const supportTypes = useMemo(() => {
    return availableOptions?.supports || [];
  }, [availableOptions]);

  const domains = useMemo(() => {
    if (!data) return [];
    let items = data.items.filter((i) => i.measure_count > 0);
    if (mode === 'support' && filters.support_type) {
      items = items.filter((i) => i.support_type === filters.support_type);
    }
    const set = new Set(items.map((i) => i.domain));
    return Array.from(set).sort();
  }, [data, filters.support_type, mode]);

  const parameters = useMemo(() => {
    if (!data) return [];
    let items = data.items.filter((i) => i.measure_count > 0);
    if (mode === 'support') {
      if (filters.support_type) items = items.filter((i) => i.support_type === filters.support_type);
      if (filters.domain) items = items.filter((i) => i.domain === filters.domain);
    } else {
      if (selectedDomain) items = items.filter((i) => i.domain === selectedDomain);
    }
    
    // Group by parameter code and enrich with config labels
    const allParams = getAllParameters();
    const codes = Array.from(new Set(items.map((i) => i.parameter_code)));
    return codes
      .map((code) => {
        const configParam = allParams.find((p) => p.code === code);
        return { code, label: configParam?.label || items.find((i) => i.parameter_code === code)?.parameter_label || code };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data, filters.support_type, filters.domain, mode, selectedDomain]);

  const filteredThematiques = useMemo(() => {
    return filterThematiqueTree(availableOptions?.parameters || []);
  }, [availableOptions]);

  const hasAnyOption = supportTypes.length > 0 || domains.length > 0 || (availableOptions?.parameters?.length || 0) > 0;

  const resetFilters = () => {
    onFiltersChange({});
    setSelectedDomain(null);
    setSelectedParameter(null);
    setSelectedThematic(null);
    setSelectedSubThematic(null);
  };

  const handleSupportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFiltersChange({ ...filters, support_type: val || undefined, domain: undefined, parameter_code: undefined });
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (mode === 'support') {
      onFiltersChange({ ...filters, domain: val || undefined, parameter_code: undefined });
    } else {
      setSelectedDomain(val || null);
    }
  };

  const handleParameterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (mode === 'support') {
      onFiltersChange({ ...filters, parameter_code: val || undefined });
    } else {
      setSelectedParameter(val || null);
    }
  };

  if (isLeftPanelCompact) {
    return (
      <div className="flex h-full w-12 flex-col items-center py-4 bg-white/80 backdrop-blur-md">
        <button onClick={() => setLeftPanelCompact(false)} className="mb-4 text-slate-500 hover:text-indigo-600 transition-colors" title="Agrandir">
           <ChevronRight className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-6 mt-4 text-slate-400">
           <button onClick={() => { setLeftPanelCompact(false); setActiveLeftAccordion("recherche"); }} title="Recherche" className="hover:text-indigo-600 transition-colors"><Search className="h-5 w-5" /></button>
           <button onClick={() => { setLeftPanelCompact(false); setActiveLeftAccordion("supports"); }} title="Supports" className="hover:text-indigo-600 transition-colors"><Folder className="h-5 w-5" /></button>
           <button onClick={() => { setLeftPanelCompact(false); setActiveLeftAccordion("domaines"); }} title="Domaines" className="hover:text-indigo-600 transition-colors"><Thermometer className="h-5 w-5" /></button>
           <button onClick={() => { setLeftPanelCompact(false); setActiveLeftAccordion("parametres"); }} title="Paramètres" className="hover:text-indigo-600 transition-colors"><Settings2 className="h-5 w-5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-3 py-2">
        <div className="flex items-center gap-2">
           <MapIcon className="h-4 w-4 text-indigo-600" />
           <h2 className="text-[14px] font-semibold text-slate-800 uppercase tracking-wide">Filtres Carte</h2>
        </div>
        <button onClick={() => setLeftPanelCompact(true)} className="text-slate-400 hover:text-slate-600 transition-colors" title="Réduire">
           <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
        {isLoading && (
          <div className="flex h-32 items-center justify-center text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-2 text-xs">Chargement...</span>
          </div>
        )}

        {isError && (
          <div className="rounded-md bg-red-50 p-2 flex gap-2 items-start text-red-700 m-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-[11px] font-medium">Erreur catalogue.</p>
          </div>
        )}

        {data && (
          <>
            <div className="flex gap-1 mb-3 px-1">
              <button 
                className={`flex-1 text-[10px] py-1.5 font-medium rounded border transition-colors ${mode === 'support' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                onClick={() => setMode('support')}
              >
                Par Support
              </button>
              <button 
                className={`flex-1 text-[10px] py-1.5 font-medium rounded border transition-colors ${mode === 'domain' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                onClick={() => setMode('domain')}
              >
                Par Domaine
              </button>
              <button 
                className={`flex-1 text-[10px] py-1.5 font-medium rounded border transition-colors ${mode === 'thematic' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                onClick={() => setMode('thematic')}
              >
                Par Thématique
              </button>
            </div>

            <Accordion 
               type="single" 
             value={activeLeftAccordion} 
             onValueChange={(val) => val && setActiveLeftAccordion(val)} 
             className="w-full"
          >
             {mode !== 'thematic' && (
               <AccordionItem value="recherche" className="border-b-slate-100">
                  <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Recherche</AccordionTrigger>
                  <AccordionContent className="pb-2">
                     <div className="text-[11px] text-slate-500 italic">Outil de recherche à venir...</div>
                  </AccordionContent>
               </AccordionItem>
             )}

             {!hasAnyOption && (
               <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mt-2">
                 <p className="text-[11px] font-medium text-slate-600">Aucune donnée disponible</p>
                 <p className="text-[10px] text-slate-400 mt-1">
                   Aucune station ou point de mesure ne correspond aux critères sélectionnés pour la période actuelle.
                 </p>
                 <button
                   className="mt-2 text-[10px] text-indigo-600 hover:underline font-medium"
                   onClick={resetFilters}
                 >
                   Réinitialiser les filtres
                 </button>
               </div>
             )}

             {mode === 'support' && (
               <AccordionItem value="supports" className="border-b-slate-100">
                <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Supports</AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      Support Métier
                    </label>
                    {supportTypes.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic">Aucun support avec données.</div>
                    ) : (
                      <select
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] h-[28px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={filters.support_type || ""}
                        onChange={handleSupportChange}
                      >
                        <option value="">Tous les supports</option>
                        {supportTypes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </AccordionContent>
             </AccordionItem>
             )}

             {mode !== 'thematic' && (
               <>
                 <AccordionItem value="domaines" className="border-b-slate-100">
                    <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Domaines</AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          Domaine
                        </label>
                        {domains.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">Aucun domaine avec données.</div>
                        ) : (
                          <select
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] h-[28px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                            value={mode === 'domain' ? (selectedDomain || "") : (filters.domain || "")}
                            onChange={handleDomainChange}
                            disabled={mode === 'support' && !filters.support_type}
                          >
                            <option value="">Tous les domaines</option>
                            {domains.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </AccordionContent>
                 </AccordionItem>

                 <AccordionItem value="parametres" className="border-b-slate-100">
                    <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Paramètres</AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          Paramètre ({parameters.length})
                        </label>
                        {parameters.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">Aucun paramètre avec données.</div>
                        ) : (
                          <select
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] h-[28px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                            value={mode === 'domain' ? (selectedParameter || "") : (filters.parameter_code || "")}
                            onChange={handleParameterChange}
                            disabled={mode === 'support' ? (!filters.domain && !filters.support_type) : !selectedDomain}
                          >
                            <option value="">Tous les paramètres</option>
                            {parameters.map((p) => (
                              <option key={p.code} value={p.code}>{p.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </AccordionContent>
                 </AccordionItem>
               </>
             )}

             {mode === 'thematic' && (
               <>
                 <AccordionItem value="thematique_values" className="border-b-slate-100">
                    <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Valeurs &amp; Seuils</AccordionTrigger>
                    <AccordionContent className="pb-2">
                      {activeFilters.parameter_code && activeThematicParam ? (
                        <ThematicValuesTable
                          features={featuresData?.features || []}
                          parameterCode={activeFilters.parameter_code}
                          parameterLabel={activeThematicParam.label}
                          parameterConfig={activeThematicParam}
                        />
                      ) : (
                        <div className="text-[11px] text-slate-500 italic py-1">Sélectionnez un paramètre pour afficher les valeurs et les seuils.</div>
                      )}
                    </AccordionContent>
                 </AccordionItem>

                 <AccordionItem value="thematique_theme" className="border-b-slate-100">
                    <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Thématique</AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">Thème principal</label>
                        {filteredThematiques.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">Aucune thématique avec données.</div>
                        ) : (
                          <select
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] h-[28px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            value={selectedThematic || ""}
                            onChange={(e) => setSelectedThematic(e.target.value || null)}
                          >
                            <option value="">Sélectionnez un thème</option>
                            {filteredThematiques.map((t) => (
                              <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </AccordionContent>
                 </AccordionItem>

                 <AccordionItem value="thematique_sub" className="border-b-slate-100">
                    <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Sous-thématique</AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">Sous-thème</label>
                        {selectedThematic && filteredThematiques.find(t => t.id === selectedThematic)?.subThematiques.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">Aucune sous-thématique avec données.</div>
                        ) : (
                          <select
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] h-[28px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                            value={selectedSubThematic || ""}
                            onChange={(e) => setSelectedSubThematic(e.target.value || null)}
                            disabled={!selectedThematic}
                          >
                            <option value="">Sélectionnez</option>
                            {(filteredThematiques.find(t => t.id === selectedThematic)?.subThematiques || []).map((s) => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </AccordionContent>
                 </AccordionItem>

                 <AccordionItem value="thematique_param" className="border-b-slate-100">
                    <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Paramètre</AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">Métrique</label>
                        {selectedSubThematic && (filteredThematiques.find(t => t.id === selectedThematic)?.subThematiques.find(s => s.id === selectedSubThematic)?.parameters.length || 0) === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">Aucun paramètre avec données.</div>
                        ) : (
                          <select
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] h-[28px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                            value={selectedParameter || ""}
                            onChange={(e) => setSelectedParameter(e.target.value || null)}
                            disabled={!selectedThematic || !selectedSubThematic}
                          >
                            <option value="">Sélectionnez</option>
                            {(filteredThematiques.find(t => t.id === selectedThematic)?.subThematiques.find(s => s.id === selectedSubThematic)?.parameters || []).map((p) => (
                              <option key={p.code} value={p.code}>{p.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </AccordionContent>
                 </AccordionItem>

                 <AccordionItem value="thematique_period" className="border-b-slate-100">
                    <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Période</AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">Horizon temporel</label>
                        <select
                          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] h-[28px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          value={selectedPeriod || "30j"}
                          onChange={(e) => setSelectedPeriod(e.target.value || "30j")}
                        >
                          <option value="24h">Dernières 24h</option>
                          <option value="7j">7 derniers jours</option>
                          <option value="30j">30 derniers jours</option>
                          <option value="12m">12 derniers mois</option>
                        </select>
                      </div>
                    </AccordionContent>
                 </AccordionItem>
               </>
             )}

             {mode === 'domain' && activeFilters.parameter_code && (
               <AccordionItem value="domain_values" className="border-b-slate-100">
                  <AccordionTrigger className="py-2 text-[13px] hover:no-underline font-semibold text-slate-700">Valeurs &amp; Seuils</AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <ThematicValuesTable
                      features={featuresData?.features || []}
                      parameterCode={activeFilters.parameter_code}
                      parameterLabel={activeFilters.parameter_code}
                      parameterConfig={findParameterByCode(activeFilters.parameter_code, activeFilters.domain) || findParameterByCode(activeFilters.parameter_code)}
                    />
                  </AccordionContent>
               </AccordionItem>
             )}
          </Accordion>

          {/* Simple stats block compact */}
          <div className="mt-4 rounded bg-slate-50/80 p-2 border border-slate-200">
             <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Résumé</div>
             <div className="grid grid-cols-2 gap-1 text-center">
               <div className="bg-white p-1 rounded border border-slate-100">
                 <div className="text-[10px] text-slate-400">Entités</div>
                 <div className="text-xs font-bold text-slate-800">
                   {data.items
                      .filter(i => (!filters.support_type || i.support_type === filters.support_type) 
                                && (!filters.domain || i.domain === filters.domain)
                                && (!filters.parameter_code || i.parameter_code === filters.parameter_code))
                      .reduce((acc, curr) => acc + curr.object_count, 0)
                      .toLocaleString()}
                 </div>
               </div>
               <div className="bg-white p-1 rounded border border-slate-100">
                 <div className="text-[10px] text-slate-400">Mesures</div>
                 <div className="text-xs font-bold text-slate-800">
                   {data.items
                      .filter(i => (!filters.support_type || i.support_type === filters.support_type) 
                                && (!filters.domain || i.domain === filters.domain)
                                && (!filters.parameter_code || i.parameter_code === filters.parameter_code))
                      .reduce((acc, curr) => acc + curr.measure_count, 0)
                      .toLocaleString()}
                 </div>
               </div>
             </div>
          </div>

          {/* Stations affichées */}
          {featuresData && featuresData.features && (
            <Accordion type="single" collapsible className="w-full mt-4 border border-slate-200 rounded overflow-hidden">
              <AccordionItem value="stations" className="border-none">
                <AccordionTrigger className="py-2 px-3 text-[11px] hover:no-underline font-bold text-slate-700 bg-slate-100 uppercase">
                  Stations affichées ({featuresData.features.length})
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="max-h-[250px] overflow-y-auto bg-white divide-y divide-slate-100">
                    {featuresData.features.map((f: any, idx: number) => {
                       const props = f.properties;
                       const name = props.object_name || "Inconnu";
                       const code = props.object_code || props.object_id;
                       
                       // Determine value to show based on active parameter
                       let valDisplay = null;
                       const activeParam = mode === 'thematic' ? activeThematicParam : mode === 'domain' ? { code: activeFilters.parameter_code, label: activeFilters.parameter_code } : null;
                       if (activeParam?.code && (props.attributes || props.latest_values)) {
                         const attrs = props.latest_values || props.attributes;
                         const val = attrs[activeParam.code] ?? attrs[activeParam.code.toLowerCase()] ?? attrs[activeParam.code.toUpperCase()];
                         if (val !== undefined && val !== null) {
                            valDisplay = `${activeParam.label || activeParam.code}: ${val}`;
                         }
                       }

                       return (
                         <div
                           key={`${code}-${idx}`}
                           className="p-2 hover:bg-slate-50 cursor-pointer transition-colors group"
                           onClick={() => {
                             const activeParam = mode === 'thematic' ? activeThematicParam : mode === 'domain' ? { code: activeFilters.parameter_code, label: activeFilters.parameter_code } : null;
                             if (!activeParam?.code) return;
                             addSeriesRequest({
                               support_type: props.support_type,
                               object_id: props.object_id || code,
                               domain: activeParam.domain || activeFilters.domain || 'QUALITE',
                               parameter_code: activeParam.code,
                               object_name: name,
                               data_temporality: String(props.attributes?.data_temporality || props.data_temporality || 'TIME_SERIES'),
                               data_family: String(props.attributes?.data_family || props.data_family || ''),
                               measurement_context: String(props.attributes?.measurement_context || props.measurement_context || '')
                             });
                           }}
                         >
                           <div className="flex items-start gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></div>
                             <div className="flex-1 min-w-0">
                               <div className="text-[11px] font-semibold text-slate-800 truncate" title={name}>{name}</div>
                               <div className="flex items-center justify-between mt-0.5">
                                 <span className="text-[10px] text-slate-500 font-mono">{code}</span>
                                 {valDisplay && (
                                   <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                                     {valDisplay}
                                   </span>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>
                       );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          </>
        )}
      </div>
    </div>
  );
}
