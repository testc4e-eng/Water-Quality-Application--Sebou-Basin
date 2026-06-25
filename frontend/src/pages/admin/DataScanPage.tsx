import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { BASE_URL } from "@/api/client";
import DataScanDashboard from "@/components/admin/data-scan/DataScanDashboard";
import {
  DataScanResponse,
  exportJson,
  runDataScan,
} from "@/services/dataScanService";
import { Database, Download, PlayCircle } from "lucide-react";

const DataScanPage = () => {
  const [data, setData] = useState<DataScanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeTimeStats, setIncludeTimeStats] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [toastIntent, setToastIntent] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!toastIntent) return;
    if (toastIntent.type === "success") {
      toast.success(toastIntent.message);
    } else {
      toast.error(toastIntent.message);
    }
    setToastIntent(null);
  }, [toastIntent]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${BASE_URL}/admin/data-availability?include_time_stats=false`;
      console.log("[DataScan] GET", url);
      const response = await runDataScan(false);
      console.log("[DataScan] response", response);
      setData(response);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Erreur lors du chargement initial.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${BASE_URL}/admin/data-availability?include_time_stats=${includeTimeStats}`;
      console.log("[DataScan] GET", url);
      const response = await runDataScan(includeTimeStats);
      console.log("[DataScan] response", response);
      setData(response);
      setLastScan(new Date().toLocaleString());
      setToastIntent({
        type: "success",
        message: `Scan terminé – ${response.summary.total_records.toLocaleString()} enregistrements analysés.`,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Erreur lors du scan.";
      setError(message);
      setToastIntent({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Database className="h-4 w-4" /> Module Administration
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Scanner de disponibilité des données
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Lancer un audit rapide pour vérifier la couverture des stations,
                des bassins et des variables disponibles dans la base.
              </p>
              <div className="mt-3 text-xs text-slate-400">
                Endpoint: {BASE_URL}/admin/data-availability
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleScan} disabled={loading}>
                <PlayCircle className="mr-2 h-4 w-4" />
                {loading ? "Scan en cours..." : "Lancer le scan"}
              </Button>
              <Button
                variant="outline"
                onClick={() => data && exportJson(data)}
                disabled={!data}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter (JSON)
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardContent className="space-y-2 py-4">
                <p className="text-sm font-medium text-slate-700">
                  Options du scan
                </p>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={includeTimeStats}
                    onChange={(event) => setIncludeTimeStats(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Inclure les statistiques temporelles (plus lent)
                </label>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="py-4 text-sm text-slate-600">
                {lastScan ? (
                  <span>Dernier scan: {lastScan}</span>
                ) : (
                  <span>Aucun scan lancé pour le moment.</span>
                )}
              </CardContent>
            </Card>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6 py-10">
        {loading && !data ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Chargement...
          </div>
        ) : data ? (
          <DataScanDashboard data={data} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Lancez un scan pour afficher le rapport d'audit.
          </div>
        )}
      </div>
    </div>
  );
};

export default DataScanPage;
