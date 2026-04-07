// frontend/src/pages/admin/IngestionPage.tsx
import { useEffect, useState } from "react";
import { 
  Database, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  RefreshCcw, 
  Filter,
  FileCode,
  FileSpreadsheet,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/api/client";
import { 
  getScenarios, 
  uploadFiles, 
  getAnomalies, 
  getIngestionAuditHistory,
  IngestedScenario, 
  Anomaly,
  UploadValidationItem,
  QaSummary,
  IngestionAuditRow,
  UploadMappingItem,
  UploadDuplicateItem,
  SimulationDryRunReport,
  simulateIngestionDryRun,
  exportQaCriticalCsv
} from "@/services/ingestionService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const IngestionPage = () => {
  const [swatScenarios, setSwatScenarios] = useState<IngestedScenario[]>([]);
  const [waspScenarios, setWaspScenarios] = useState<IngestedScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<{ id: number; model: "swat" | "wasp" } | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [qaSummary, setQaSummary] = useState<QaSummary | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lastStructuralReports, setLastStructuralReports] = useState<UploadValidationItem[]>([]);
  const [lastMappingReports, setLastMappingReports] = useState<UploadMappingItem[]>([]);
  const [lastDuplicateReports, setLastDuplicateReports] = useState<UploadDuplicateItem[]>([]);
  const [blockingDuplicate, setBlockingDuplicate] = useState<UploadDuplicateItem | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationReport, setSimulationReport] = useState<SimulationDryRunReport | null>(null);
  const [auditRows, setAuditRows] = useState<IngestionAuditRow[]>([]);
  const [qaVariableFilter, setQaVariableFilter] = useState("");
  const [qaEntityFilter, setQaEntityFilter] = useState("");
  const [qaDateFromFilter, setQaDateFromFilter] = useState("");
  const [qaDateToFilter, setQaDateToFilter] = useState("");
  const [qaStatutFilter, setQaStatutFilter] = useState<"" | "CRITIQUE" | "AVERTISSEMENT" | "INFO">("");

  const fetchScenarios = async () => {
    setLoading(true);
    try {
      const data = await getScenarios();
      setSwatScenarios(data.swat);
      setWaspScenarios(data.wasp);
    } catch (error) {
      toast.error("Échec du chargement des scénarios.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditHistory = async () => {
    try {
      const data = await getIngestionAuditHistory(200);
      setAuditRows(data.rows ?? []);
    } catch {
      // silent failure in UI
    }
  };

  useEffect(() => {
    fetchScenarios();
    fetchAuditHistory();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadResult = await uploadFiles(Array.from(files));
      const reports = uploadResult.validation_structurelle ?? [];
      setLastStructuralReports(reports);
      setLastMappingReports(uploadResult.rapport_mapping ?? []);
      const duplicateReports = uploadResult.controle_doublon ?? [];
      setLastDuplicateReports(duplicateReports);

      const invalidCount = reports.filter((r) => r.rapport_structurel.statut_format === "INVALIDE").length;
      const warningCount = reports.filter((r) => r.rapport_structurel.statut_format === "AVERTISSEMENT").length;
      const exactDuplicate = duplicateReports.find((d) => d.controle_doublon.statut === "DOUBLON_EXACT");
      const partialDuplicate = duplicateReports.find((d) => d.controle_doublon.statut === "DOUBLON_PARTIEL");

      if (invalidCount > 0) {
        toast.error(`${invalidCount} fichier(s) invalide(s) detecte(s) au controle structurel.`);
      } else if (warningCount > 0) {
        toast.warning(`${warningCount} fichier(s) avec avertissement structurel.`);
      } else {
        toast.success(`${files.length} fichiers envoyes. Structure valide.`);
      }

      if (exactDuplicate) {
        setBlockingDuplicate(exactDuplicate);
      } else if (partialDuplicate) {
        setBlockingDuplicate(partialDuplicate);
      }

      void fetchScenarios();
      void fetchAuditHistory();
    } catch (error) {
      toast.error("Erreur lors de l'envoi des fichiers.");
    } finally {
      setUploading(false);
    }
  };

  const handleSimulationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSimulating(true);
    try {
      const report = await simulateIngestionDryRun(file);
      setSimulationReport(report);
      const reco = report.etape_5_bilan_dry_run.recommandation;
      if (reco === "PUBLIER") {
        toast.success("Simulation terminee: publication recommandee.");
      } else if (reco === "CORRIGER_ET_RETESTER") {
        toast.warning("Simulation terminee: correction/retest recommande.");
      } else {
        toast.error("Simulation terminee: fichier a rejeter.");
      }
    } catch {
      toast.error("Erreur pendant la simulation d'ingestion.");
    } finally {
      setSimulating(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await api.post("/observatory/cache/clear");
      toast.success("Cache de l'observatoire vide avec succes.");
      void fetchAuditHistory();
    } catch (error) {
      toast.error("Erreur lors du vidage du cache.");
    }
  };

  const handleInspect = async (id: number, model: "swat" | "wasp") => {
    setSelectedScenario({ id, model });
    setLoading(true);
    try {
      const data = await getAnomalies(id, model, {
        variable: qaVariableFilter || undefined,
        entity_id: qaEntityFilter ? Number(qaEntityFilter) : undefined,
        date_from: qaDateFromFilter || undefined,
        date_to: qaDateToFilter || undefined,
        statut: qaStatutFilter || undefined,
        limit: 5000,
      });
      setAnomalies(data.alerts);
      setQaSummary(data.qa_summary ?? null);
      if (data.anomalies_count === 0) {
        toast.success("Aucune anomalie détectée pour ce scénario.");
      } else {
        toast.warning(`${data.anomalies_count} anomalies détectées.`);
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération des anomalies.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCriticalCsv = async () => {
    if (!selectedScenario) {
      toast.error("Selectionnez un scenario d'abord.");
      return;
    }
    try {
      const { blob, filename } = await exportQaCriticalCsv(selectedScenario.id, selectedScenario.model);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export CSV des erreurs critiques termine.");
    } catch {
      toast.error("Erreur lors de l'export CSV des erreurs critiques.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER SECTION */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Database className="h-4 w-4" /> Administration des Scénarios
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Centre d'Ingestion des Modèles
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Gérez l'ingestion multi-scénarios pour SWAT et WASP. Téléchargez les résultats 
                et validez l'intégrité des données avant la publication.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCache}
                className="h-10 px-4 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Vider le Cache
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchScenarios} 
                disabled={loading}
                className="h-10 px-4"
              >
                <RefreshCcw className={`mr-2 h-4 w-4 ${loading && 'animate-spin'}`} />
                Actualiser
              </Button>
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                <Upload className="h-4 w-4" />
                {uploading ? "Envoi..." : "Importer fichiers"}
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
              </label>
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-slate-800 px-5 text-sm font-semibold text-white hover:bg-slate-900 transition-all">
                <PlayCircle className="h-4 w-4" />
                {simulating ? "Simulation..." : "Simuler ingestion"}
                <input type="file" className="hidden" onChange={handleSimulationUpload} />
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* SCENARIO LIST */}
          <div className="col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" /> 
                  Scénarios Ingestérés
                </CardTitle>
                <CardDescription>Liste des modèles disponibles en base</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="swat" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 rounded-none bg-transparent h-12 border-b">
                    <TabsTrigger value="swat" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                      SWAT ({swatScenarios.length})
                    </TabsTrigger>
                    <TabsTrigger value="wasp" className="data-[state=active]:border-b-2 data-[state=active]:border-cyan-600 rounded-none">
                      WASP ({waspScenarios.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="swat" className="m-0 focus-visible:ring-0">
                    <div className="divide-y border-t-0">
                      {swatScenarios.map((s) => (
                        <div 
                          key={s.id} 
                          className={`flex items-center justify-between p-4 transition-colors hover:bg-slate-50 cursor-pointer ${selectedScenario?.id === s.id && selectedScenario.model === 'swat' && 'bg-blue-50/50'}`}
                          onClick={() => handleInspect(s.id, "swat")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-xs">S</div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{s.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">SWAT Output</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-white">Ref: {s.id}</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wasp" className="m-0 focus-visible:ring-0">
                    <div className="divide-y border-t-0">
                      {waspScenarios.map((s) => (
                        <div 
                          key={s.id} 
                          className={`flex items-center justify-between p-4 transition-colors hover:bg-slate-50 cursor-pointer ${selectedScenario?.id === s.id && selectedScenario.model === 'wasp' && 'bg-cyan-50/50'}`}
                          onClick={() => handleInspect(s.id, "wasp")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 font-bold text-xs">W</div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{s.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">WASP Toxi</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-white">Ref: {s.id}</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* INSPECTION VIEW */}
          <div className="col-span-1 lg:col-span-2">
            {!selectedScenario ? (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-400 shadow-sm">
                <Search className="mb-4 h-12 w-12 opacity-20" />
                <h3 className="text-xl font-bold text-slate-600">Aucun scénario sélectionné</h3>
                <p className="mt-2 max-w-sm text-sm">
                  Sélectionnez un modèle dans la liste de gauche pour analyser ses données et détecter d'éventuelles anomalies.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="border-slate-200 shadow-md">
                  <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-black italic tracking-tighter">
                          ANALYSE QA : {selectedScenario.model.toUpperCase()}
                        </CardTitle>
                        <CardDescription className="text-slate-400">ID Scénario: #{selectedScenario.id}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {anomalies.length === 0 ? (
                          <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                             <CheckCircle2 className="h-3 w-3" /> VALIDE
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 animate-pulse">
                             <AlertTriangle className="h-3 w-3" /> {qaSummary?.total_erreurs ?? anomalies.length} ERREURS
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-slate-50/60">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input
                          value={qaVariableFilter}
                          onChange={(e) => setQaVariableFilter(e.target.value)}
                          placeholder="Filtre variable"
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs"
                        />
                        <input
                          value={qaEntityFilter}
                          onChange={(e) => setQaEntityFilter(e.target.value)}
                          placeholder="Segment/Subbasin"
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs"
                        />
                        <input
                          type="date"
                          value={qaDateFromFilter}
                          onChange={(e) => setQaDateFromFilter(e.target.value)}
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs"
                        />
                        <input
                          type="date"
                          value={qaDateToFilter}
                          onChange={(e) => setQaDateToFilter(e.target.value)}
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs"
                        />
                        <select
                          value={qaStatutFilter}
                          onChange={(e) => setQaStatutFilter(e.target.value as "" | "CRITIQUE" | "AVERTISSEMENT" | "INFO")}
                          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs"
                        >
                          <option value="">Tous statuts</option>
                          <option value="CRITIQUE">CRITIQUE</option>
                          <option value="AVERTISSEMENT">AVERTISSEMENT</option>
                          <option value="INFO">INFO</option>
                        </select>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            if (selectedScenario) {
                              void handleInspect(selectedScenario.id, selectedScenario.model);
                            }
                          }}
                        >
                          Appliquer filtres
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() => {
                            setQaVariableFilter("");
                            setQaEntityFilter("");
                            setQaDateFromFilter("");
                            setQaDateToFilter("");
                            setQaStatutFilter("");
                          }}
                        >
                          Reinitialiser
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={handleExportCriticalCsv}
                        >
                          Exporter CRITIQUES CSV
                        </Button>
                      </div>
                    </div>
                    {anomalies.length === 0 ? (
                      <div className="py-20 text-center">
                        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500 opacity-20" />
                        <h3 className="text-lg font-bold text-slate-800">Données conformes</h3>
                        <p className="text-sm text-slate-500">Aucun dépassement de seuil critique détecté sur ce jeu de données.</p>
                      </div>
                    ) : (
                      <div className="max-h-[600px] overflow-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="sticky top-0 bg-slate-50 border-b text-[10px] font-black uppercase text-slate-500">
                            <tr>
                              <th className="px-6 py-4">Entité / Bassin</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Variable</th>
                              <th className="px-6 py-4">Valeur</th>
                              <th className="px-6 py-4">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {anomalies.map((a, i) => (
                              <tr key={i} className="hover:bg-rose-50/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">{a.entite ?? "-"}</td>
                                <td className="px-6 py-4 text-slate-600">{a.date ? new Date(a.date).toLocaleDateString('fr-FR') : "-"}</td>
                                <td className="px-6 py-4">
                                   <Badge variant="secondary" className="bg-slate-100">{a.variable || "QA Trigger"}</Badge>
                                </td>
                                <td className="px-6 py-4 font-bold text-rose-600">
                                   {a.valeur}
                                </td>
                                <td className={`px-6 py-4 text-[10px] font-bold ${a.statut === "CRITIQUE" ? "text-rose-500" : a.statut === "AVERTISSEMENT" ? "text-amber-600" : "text-sky-600"}`}>{a.statut}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* LOGS / INFO MOCK */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                   <Card className="bg-blue-50/50 border-blue-100">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <FileCode className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-900 text-sm">Méta-données Ingestérées</p>
                          <p className="text-xs text-blue-700 opacity-70">Source: MDB Access / CSV</p>
                        </div>
                      </CardContent>
                   </Card>
                   <Card className="bg-indigo-50/50 border-indigo-100">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                          <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-indigo-900 text-sm">Rapport Statistique</p>
                          <p className="text-xs text-indigo-700 opacity-70">Mode de temps: Journalier / Mensuel</p>
                        </div>
                      </CardContent>
                   </Card>
                </div>

                {qaSummary && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3 border-b bg-slate-50/50">
                      <CardTitle className="text-sm">Bilan QA du scenario</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                      <div><span className="text-slate-500">Lignes</span><p className="font-semibold text-slate-800">{qaSummary.total_lignes}</p></div>
                      <div><span className="text-slate-500">Erreurs</span><p className="font-semibold text-slate-800">{qaSummary.total_erreurs}</p></div>
                      <div><span className="text-slate-500">Critiques</span><p className="font-semibold text-rose-600">{qaSummary.total_critiques}</p></div>
                      <div><span className="text-slate-500">Avertissements</span><p className="font-semibold text-amber-600">{qaSummary.total_avertissements}</p></div>
                      <div><span className="text-slate-500">Statut</span><p className="font-semibold text-slate-800">{qaSummary.statut_global}</p></div>
                    </CardContent>
                  </Card>
                )}

                {lastStructuralReports.length > 0 && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3 border-b bg-slate-50/50">
                      <CardTitle className="text-sm">Validation Structurelle (dernier import)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {lastStructuralReports.map((item) => (
                          <div key={item.filename} className="p-4 flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{item.filename}</p>
                              <p className="text-xs text-slate-500">
                                Modele: {item.rapport_structurel.modele_detecte} | Encodage: {item.rapport_structurel.encodage}
                              </p>
                              {item.rapport_structurel.format_detecte && (
                                <p className="text-xs text-slate-500">
                                  Format detecte: {item.rapport_structurel.format_detecte}
                                </p>
                              )}
                              {item.rapport_structurel.colonnes_manquantes.length > 0 && (
                                <p className="text-xs text-rose-600 mt-1">
                                  Colonnes manquantes: {item.rapport_structurel.colonnes_manquantes.join(", ")}
                                </p>
                              )}
                              {item.rapport_structurel.message && (
                                <p className="text-xs text-amber-700 mt-1">
                                  Cause: {item.rapport_structurel.message}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                item.rapport_structurel.statut_format === "VALIDE"
                                  ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                                  : item.rapport_structurel.statut_format === "AVERTISSEMENT"
                                  ? "border-amber-300 text-amber-700 bg-amber-50"
                                  : "border-rose-300 text-rose-700 bg-rose-50"
                              }
                            >
                              {item.rapport_structurel.statut_format}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {lastMappingReports.length > 0 && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3 border-b bg-slate-50/50">
                      <CardTitle className="text-sm">Rapport Mapping Champ Source → Cible</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {lastMappingReports.map((item) => (
                          <div key={item.filename} className="p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{item.filename}</p>
                                <p className="text-xs text-slate-500">
                                  Modele: {item.rapport_mapping.modele_detecte} | Format: {item.rapport_mapping.format_detecte || "-"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Score completude: {item.rapport_mapping.score_completude_pct}%
                                </p>
                                <p className="text-xs text-slate-500">
                                  Score pret migration: {item.rapport_mapping.score_pret_migration_pct ?? item.rapport_mapping.score_completude_pct}%
                                </p>
                              </div>
                              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                                {item.rapport_mapping.tableau_mapping.length} champs analyses
                              </Badge>
                            </div>

                            {item.rapport_mapping.colonnes_orphelines.length > 0 && (
                              <p className="text-xs text-amber-700">
                                Colonnes orphelines: {item.rapport_mapping.colonnes_orphelines.join(", ")}
                              </p>
                            )}
                            {item.rapport_mapping.champs_cibles_non_couverts.length > 0 && (
                              <p className="text-xs text-rose-700">
                                Champs cibles non couverts: {item.rapport_mapping.champs_cibles_non_couverts.join(", ")}
                              </p>
                            )}
                            {(item.rapport_mapping.champs_cibles_non_prets_migration?.length ?? 0) > 0 && (
                              <p className="text-xs text-amber-700">
                                Champs cibles non prets migration: {item.rapport_mapping.champs_cibles_non_prets_migration?.join(", ")}
                              </p>
                            )}
                            {item.rapport_mapping.message && (
                              <p className="text-xs text-rose-700">
                                Cause: {item.rapport_mapping.message}
                              </p>
                            )}

                            <div className="max-h-[280px] overflow-auto rounded border">
                              <table className="w-full text-left text-xs">
                                <thead className="sticky top-0 bg-slate-50 border-b">
                                  <tr>
                                    <th className="px-3 py-2">Statut</th>
                                    <th className="px-3 py-2">Champ source</th>
                                    <th className="px-3 py-2">Champ cible</th>
                                    <th className="px-3 py-2">Type source</th>
                                    <th className="px-3 py-2">Type cible</th>
                                    <th className="px-3 py-2">Compatible</th>
                                    <th className="px-3 py-2">Remplissage %</th>
                                    <th className="px-3 py-2">Nulls</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {item.rapport_mapping.tableau_mapping.map((r, idx) => (
                                    <tr key={`${item.filename}-${idx}`}>
                                      <td className={`px-3 py-2 font-semibold ${r.statut === "INCOMPATIBLE" ? "text-rose-700" : r.statut === "TRANSFORMABLE" ? "text-amber-700" : r.statut === "ORPHELIN" ? "text-slate-600" : "text-emerald-700"}`}>{r.statut}</td>
                                      <td className="px-3 py-2">{r.champ_source ?? "-"}</td>
                                      <td className="px-3 py-2">{r.champ_cible ?? "-"}</td>
                                      <td className="px-3 py-2">{r.type_source}</td>
                                      <td className="px-3 py-2">{r.type_cible}</td>
                                      <td className="px-3 py-2">{String(r.compatible)}</td>
                                      <td className="px-3 py-2">{r.taux_remplissage_pct}</td>
                                      <td className="px-3 py-2">{r.valeurs_nulles ?? "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {lastDuplicateReports.length > 0 && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3 border-b bg-slate-50/50">
                      <CardTitle className="text-sm">Controle Anti-doublon (dernier import)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {lastDuplicateReports.map((item) => (
                          <div key={item.filename} className="p-4 flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{item.filename}</p>
                              <p className="text-xs text-slate-500">
                                Action requise: {item.controle_doublon.action_requise}
                              </p>
                              {item.controle_doublon.scenario_existant_id && (
                                <p className="text-xs text-slate-500">
                                  Scenario existant: #{item.controle_doublon.scenario_existant_id}
                                </p>
                              )}
                              {item.controle_doublon.date_ingestion_originale && (
                                <p className="text-xs text-slate-500">
                                  Premiere ingestion: {new Date(item.controle_doublon.date_ingestion_originale).toLocaleString("fr-FR")}
                                </p>
                              )}
                              {(item.controle_doublon.zones_chevauchement?.length ?? 0) > 0 && (
                                <p className="text-xs text-amber-700 mt-1">
                                  Chevauchements detectes: {item.controle_doublon.zones_chevauchement?.length}
                                </p>
                              )}
                              {item.controle_doublon.message && (
                                <p className="text-xs text-rose-700 mt-1">
                                  Cause: {item.controle_doublon.message}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                item.controle_doublon.statut === "DOUBLON_EXACT"
                                  ? "border-rose-300 text-rose-700 bg-rose-50"
                                  : item.controle_doublon.statut === "DOUBLON_PARTIEL"
                                  ? "border-amber-300 text-amber-700 bg-amber-50"
                                  : "border-emerald-300 text-emerald-700 bg-emerald-50"
                              }
                            >
                              {item.controle_doublon.statut}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {simulationReport && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3 border-b bg-slate-50/50">
                      <CardTitle className="text-sm">Simulation d'ingestion (dry-run)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div><span className="text-slate-500">Lignes traitees</span><p className="font-semibold text-slate-800">{simulationReport.etape_5_bilan_dry_run.nb_lignes_traitees}</p></div>
                        <div><span className="text-slate-500">Erreurs format</span><p className="font-semibold text-slate-800">{simulationReport.etape_5_bilan_dry_run.nb_erreurs_format}</p></div>
                        <div><span className="text-slate-500">Doublons</span><p className="font-semibold text-slate-800">{simulationReport.etape_5_bilan_dry_run.nb_doublons}</p></div>
                        <div><span className="text-slate-500">Critiques QA</span><p className="font-semibold text-rose-700">{simulationReport.etape_5_bilan_dry_run.nb_critiques_qa}</p></div>
                        <div><span className="text-slate-500">Score qualite</span><p className="font-semibold text-slate-800">{simulationReport.etape_5_bilan_dry_run.score_qualite_pct}%</p></div>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="font-semibold text-slate-800">
                            Recommandation: {simulationReport.etape_5_bilan_dry_run.recommandation}
                          </p>
                          <p className="text-slate-500">
                            Etape 1: {simulationReport.etape_1_analyse_format.statut_format} | Etape 3: {simulationReport.etape_3_detection_doublons.statut} | Etape 4 critiques: {simulationReport.etape_4_validation_qa.total_critiques}
                          </p>
                        </div>
                        <Button
                          disabled={simulationReport.etape_5_bilan_dry_run.recommandation !== "PUBLIER"}
                          onClick={() => {
                            toast.success("Publication confirmee (workflow final a brancher).");
                          }}
                        >
                          Publier maintenant
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <CardTitle className="text-sm">Historique</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="historique" className="w-full">
                      <TabsList className="w-full grid grid-cols-1 rounded-none bg-transparent h-10 border-b">
                        <TabsTrigger value="historique" className="data-[state=active]:border-b-2 data-[state=active]:border-slate-700 rounded-none">
                          Historique
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="historique" className="m-0">
                        {auditRows.length === 0 ? (
                          <div className="p-4 text-xs text-slate-500">Aucune entree d'audit pour le moment.</div>
                        ) : (
                          <div className="max-h-[320px] overflow-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="sticky top-0 bg-slate-50 border-b text-[10px] font-semibold uppercase text-slate-500">
                                <tr>
                                  <th className="px-4 py-3">Action</th>
                                  <th className="px-4 py-3">Utilisateur</th>
                                  <th className="px-4 py-3">Horodatage</th>
                                  <th className="px-4 py-3">Fichier</th>
                                  <th className="px-4 py-3">Resultat</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {auditRows.map((row) => (
                                  <tr key={row.id}>
                                    <td className="px-4 py-3 font-semibold">{row.action}</td>
                                    <td className="px-4 py-3">{row.utilisateur || "-"}</td>
                                    <td className="px-4 py-3">{row.horodatage ? new Date(row.horodatage).toLocaleString("fr-FR") : "-"}</td>
                                    <td className="px-4 py-3">{row.fichier?.nom || "-"}</td>
                                    <td className="px-4 py-3">
                                      {row.resultat?.statut || "-"} | err: {row.resultat?.nb_erreurs ?? 0} | lignes: {row.resultat?.nb_lignes ?? 0}
                                      {(row.duplicate_count ?? 1) > 1 ? ` | x${row.duplicate_count}` : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={!!blockingDuplicate} onOpenChange={(open) => { if (!open) setBlockingDuplicate(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={blockingDuplicate?.controle_doublon.statut === "DOUBLON_EXACT" ? "text-rose-700" : "text-amber-700"}>
              {blockingDuplicate?.controle_doublon.statut === "DOUBLON_EXACT" ? "Doublon exact detecte" : "Doublon partiel detecte"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Fichier: <span className="font-semibold">{blockingDuplicate?.filename}</span>
              </p>
              <p>
                Statut: <span className="font-semibold">{blockingDuplicate?.controle_doublon.statut}</span> | Action requise:{" "}
                <span className="font-semibold">{blockingDuplicate?.controle_doublon.action_requise}</span>
              </p>
              {blockingDuplicate?.controle_doublon.scenario_existant_id && (
                <p>Scenario existant: #{blockingDuplicate.controle_doublon.scenario_existant_id}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                toast.info("Import annule par l'utilisateur.");
                setBlockingDuplicate(null);
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-600 hover:bg-amber-700"
              onClick={() => {
                toast.warning("Import conserve avec avertissement (Ignorer).");
                setBlockingDuplicate(null);
              }}
            >
              Ignorer
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                toast.success("Option Ecraser selectionnee. Pret pour ecrasement controle.");
                setBlockingDuplicate(null);
              }}
            >
              Ecraser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IngestionPage;




