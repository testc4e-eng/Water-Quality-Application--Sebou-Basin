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
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { api } from "@/api/client";
import { 
  getScenarios, 
  uploadFiles, 
  getAnomalies, 
  IngestedScenario, 
  Anomaly 
} from "@/services/ingestionService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const IngestionPage = () => {
  const [swatScenarios, setSwatScenarios] = useState<IngestedScenario[]>([]);
  const [waspScenarios, setWaspScenarios] = useState<IngestedScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<{ id: number; model: "swat" | "wasp" } | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      await uploadFiles(Array.from(files));
      toast.success(`${files.length} fichiers envoyés pour ingestion.`);
      void fetchScenarios();
    } catch (error) {
      toast.error("Erreur lors de l'envoi des fichiers.");
    } finally {
      setUploading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await api.post("/observatory/cache/clear");
      toast.success("Cache de l'observatoire vidé avec succès.");
    } catch (error) {
      toast.error("Erreur lors du vidage du cache.");
    }
  };

  const handleInspect = async (id: number, model: "swat" | "wasp") => {
    setSelectedScenario({ id, model });
    setLoading(true);
    try {
      const data = await getAnomalies(id, model);
      setAnomalies(data.alerts);
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
                             <AlertTriangle className="h-3 w-3" /> {anomalies.length} ERREURS
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
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
                                <td className="px-6 py-4 font-mono text-xs">{a.subbasin || a.segment_id}</td>
                                <td className="px-6 py-4 text-slate-600">{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4">
                                   <Badge variant="secondary" className="bg-slate-100">{a.variable || "QA Trigger"}</Badge>
                                </td>
                                <td className="px-6 py-4 font-bold text-rose-600">
                                   {a.value || a.orgn || a.solp}
                                </td>
                                <td className="px-6 py-4 text-rose-500 text-[10px] font-bold">CRITIQUE</td>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngestionPage;
