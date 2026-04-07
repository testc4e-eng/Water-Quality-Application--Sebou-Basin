import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Shield, Search, RefreshCw, Clock } from "lucide-react";
import { listActivityLogs, listAuthLogs, type ActivityLogItem, type AuthLogItem } from "@/services/auditService";

export default function AuditLogsPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [authLogs, setAuthLogs] = useState<AuthLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(100);
  const [usernameFilter, setUsernameFilter] = useState("");

  const refreshLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const [act, aut] = await Promise.all([
        listActivityLogs(limit, usernameFilter),
        listAuthLogs(limit)
      ]);
      setActivityLogs(act);
      setAuthLogs(aut);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erreur lors du chargement des journaux");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) return <Badge className="bg-emerald-500 text-white">{status}</Badge>;
    if (status >= 400 && status < 500) return <Badge variant="outline" className="text-amber-600 border-amber-600">{status}</Badge>;
    return <Badge variant="destructive">{status}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const colors: any = {
      GET: "bg-blue-500",
      POST: "bg-emerald-500",
      PUT: "bg-amber-500",
      DELETE: "bg-rose-500",
      PATCH: "bg-purple-500"
    };
    return <Badge className={`${colors[method] || "bg-slate-500"} text-white font-mono`}>{method}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <Shield className="h-4 w-4" /> Sécurité & Audit
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Journal d'Audit</h1>
              <p className="mt-1 text-sm text-slate-500">
                Traçabilité complète des actions utilisateurs et tentatives de connexion.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Filtrer par utilisateur..." 
                  className="pl-9 w-64" 
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && refreshLogs()}
                />
              </div>
              <Button variant="outline" onClick={refreshLogs} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-100">
              <Activity className="mr-2 h-4 w-4" /> Activités API
            </TabsTrigger>
            <TabsTrigger value="auth" className="data-[state=active]:bg-slate-100">
              <Shield className="mr-2 h-4 w-4" /> Authentification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 text-slate-500">
                    <TableRow>
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead>Chemin (Path)</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Durée</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-slate-50">
                        <TableCell className="text-xs text-slate-500">
                           <div className="flex items-center gap-1">
                             <Clock className="h-3 w-3" />
                             {new Date(log.created_at).toLocaleString()}
                           </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-700">
                          {log.username || "Système/Public"}
                        </TableCell>
                        <TableCell>{getMethodBadge(log.method)}</TableCell>
                        <TableCell className="max-w-md truncate text-xs font-mono text-slate-600" title={log.path}>
                          {log.path}
                        </TableCell>
                        <TableCell>{getStatusBadge(log.status_code)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {log.duration_ms}ms
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{log.ip_address}</TableCell>
                      </TableRow>
                    ))}
                    {activityLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                          Aucun journal d'activité trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 text-slate-500">
                    <TableRow>
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead>Tentative (User)</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Résultat</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-slate-50">
                        <TableCell className="text-xs text-slate-500">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700">
                          {log.username_attempted || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{log.action}</Badge>
                        </TableCell>
                        <TableCell>
                          {log.status === "SUCCESS" ? (
                            <Badge className="bg-emerald-500 text-white">Succès</Badge>
                          ) : (
                            <Badge variant="destructive">Échec</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-slate-500" title={log.details || ""}>
                          {log.details || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{log.ip_address}</TableCell>
                      </TableRow>
                    ))}
                    {authLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                          Aucun journal d'authentification trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
