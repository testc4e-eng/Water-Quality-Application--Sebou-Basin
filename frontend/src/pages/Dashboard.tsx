/* frontend/src/pages/Dashboard.tsx */
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AlertCircle, Activity, Droplets, MapPin } from "lucide-react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import TimeSeriesChart from "@/components/Charts/TimeSeriesChart";
import { getStations, getAlerts, getTimeseries } from "@/api/client";

// ---- TYPES ----
interface TimeseriesItem {
  date: string;
  discharge_m3s?: number;
  temperature_c?: number;
  precipitation_mm?: number;
  nitrates_mgL?: number;
  phosphore_mgL?: number;
}

interface TimeseriesApiResponse {
  dates: string[];
  discharge_m3s?: number[];
  temperature_c?: number[];
  precipitation_mm?: number[];
  nitrates_mgL?: number[];
  phosphore_mgL?: number[];
}

interface Station {
  id: string;
  name: string;
  region: string;
  river?: string;
  coords: { lat: number; lon: number };
}

interface Alert {
  id: string;
  type: string;
  station: string;
  date: string;
  message: string;
}

interface Kpis {
  quality: number;
  activeAlerts: number;
  compliance: number;
  activeSensors: number;
}

interface Loading {
  stations: boolean;
  alerts: boolean;
  timeseries: boolean;
}

// ---- COMPONENT ----
const Dashboard = () => {
  // ---- STATES ----
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [timeseries, setTimeseries] = useState<TimeseriesItem[]>([]);
  const [isLoading, setIsLoading] = useState<Loading>({
    stations: false,
    alerts: false,
    timeseries: false,
  });
  const [kpis, setKpis] = useState<Kpis>({
    quality: 0,
    activeAlerts: 0,
    compliance: 0,
    activeSensors: 0,
  });

  // ---- Load Stations ----
  useEffect(() => {
    const loadStations = async () => {
      setIsLoading((p) => ({ ...p, stations: true }));
      try {
        const data = (await getStations()) as Station[];
        setStations(data);
        setSelectedStation(data[0] ?? null);
        setKpis((prev) => ({ ...prev, activeSensors: data.length }));
      } catch {
        setStations([]);
        setSelectedStation(null);
        setKpis((prev) => ({ ...prev, activeSensors: 0 }));
      } finally {
        setIsLoading((p) => ({ ...p, stations: false }));
      }
    };
    loadStations();
  }, []);

  // ---- Load Alerts ----
  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading((p) => ({ ...p, alerts: true }));
      try {
        const data = (await getAlerts()) as Alert[];
        setAlerts(data);
        setKpis((prev) => ({ ...prev, activeAlerts: data.length }));
      } catch {
        setAlerts([]);
        setKpis((prev) => ({ ...prev, activeAlerts: 0 }));
      } finally {
        setIsLoading((p) => ({ ...p, alerts: false }));
      }
    };
    loadAlerts();
  }, []);

  // ---- Load Timeseries ----
  useEffect(() => {
    if (!selectedStation) {
      setTimeseries([]);
      return;
    }

    const loadTimeseries = async () => {
      setIsLoading((p) => ({ ...p, timeseries: true }));
      try {
        const data: TimeseriesApiResponse = await getTimeseries(selectedStation.id);

        if (data?.dates) {
          const formatted: TimeseriesItem[] = data.dates.map((date: string, i: number) => ({
            date,
            discharge_m3s: data.discharge_m3s?.[i],
            temperature_c: data.temperature_c?.[i],
            precipitation_mm: data.precipitation_mm?.[i],
            nitrates_mgL: data.nitrates_mgL?.[i],
            phosphore_mgL: data.phosphore_mgL?.[i],
          }));

          setTimeseries(formatted);
        } else {
          setTimeseries([]);
        }
      } catch {
        setTimeseries([]);
      } finally {
        setIsLoading((p) => ({ ...p, timeseries: false }));
      }
    };

    loadTimeseries();
  }, [selectedStation]);

  // ---- KPI CARDS ----
  const KpiCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <Card className="flex items-center gap-3 p-4 shadow-md">
        <Activity className="text-blue-500" />
        <div>
          <p className="text-sm text-muted-foreground">Qualité globale</p>
          <p className="text-lg font-bold">{kpis.quality}/10</p>
        </div>
      </Card>
      <Card className="flex items-center gap-3 p-4 shadow-md">
        <AlertCircle className="text-red-500" />
        <div>
          <p className="text-sm text-muted-foreground">Alertes actives</p>
          <p className="text-lg font-bold">{kpis.activeAlerts}</p>
        </div>
      </Card>
      <Card className="flex items-center gap-3 p-4 shadow-md">
        <Droplets className="text-green-500" />
        <div>
          <p className="text-sm text-muted-foreground">Conformité DCE</p>
          <p className="text-lg font-bold">{kpis.compliance}%</p>
        </div>
      </Card>
      <Card className="flex items-center gap-3 p-4 shadow-md">
        <MapPin className="text-purple-500" />
        <div>
          <p className="text-sm text-muted-foreground">Capteurs actifs</p>
          <p className="text-lg font-bold">{kpis.activeSensors}</p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-blue-800">
        🌊 WaterQual SEBOU — Démonstrateur local
      </h1>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="map">Carte</TabsTrigger>
          <TabsTrigger value="timeseries">Évolution</TabsTrigger>
        </TabsList>

        {/* ---- CARTE ---- */}
        <TabsContent value="map">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 shadow-lg">
              <h2 className="mb-4 font-semibold">Carte des stations</h2>
              <div className="h-[500px] rounded-md overflow-hidden">
                <Map
                  initialViewState={{ latitude: 33.5, longitude: -6.5, zoom: 6 }}
                  style={{ width: "100%", height: "100%" }}
                  mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                  mapLib={maplibregl}
                >
                  <NavigationControl position="top-left" />
                  {stations
  .filter((s) => s.coords && !isNaN(s.coords.lat) && !isNaN(s.coords.lon))
  .map((s) => (
    <Marker
      key={s.id}
      longitude={s.coords.lon}
      latitude={s.coords.lat}
      onClick={() => setSelectedStation(s)}
    >
      <MapPin
        className={`cursor-pointer ${
          selectedStation?.id === s.id ? "text-blue-600" : "text-red-500"
        }`}
        size={28}
      />
    </Marker>
  ))}

                  
                  {selectedStation &&
  selectedStation.coords &&
  !isNaN(selectedStation.coords.lat) &&
  !isNaN(selectedStation.coords.lon) && (
    <Popup
      longitude={selectedStation.coords.lon}
      latitude={selectedStation.coords.lat}
      anchor="top"
      onClose={() => setSelectedStation(null)}
      closeOnClick={false}
    >
      <div className="text-sm space-y-1">
        <h3 className="font-bold">{selectedStation.name}</h3>
        <p>🌍 {selectedStation.region}</p>
        <p>🏞️ {selectedStation.river || "-"}</p>
        <p>
          📍 {selectedStation.coords.lat.toFixed(3)} ,{" "}
          {selectedStation.coords.lon.toFixed(3)}
        </p>
      </div>
    </Popup>
  )}

                
                </Map>
              </div>
            </Card>

            {/* ---- GRAPHE ---- */}
            <Card className="p-4 shadow-lg">
              <h2 className="mb-4 font-semibold">
                Graphique de la station — {selectedStation?.name || "Aucune station sélectionnée"}
              </h2>
              {selectedStation ? (
                isLoading.timeseries ? (
                  <div className="text-center text-muted-foreground py-6">
                    Chargement des données...
                  </div>
                ) : timeseries.length > 0 ? (
                  <TimeSeriesChart
                    data={timeseries}
                    showPrecipitation
                    showDischarge
                    showTemperature
                    showGrid
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    Aucune donnée disponible
                  </div>
                )
              ) : (
                <p className="text-muted-foreground">
                  Sélectionnez une station pour voir le graphique
                </p>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* ---- EVOLUTION ---- */}
        <TabsContent value="timeseries">
          <Card className="p-4 shadow-lg">
            <h2 className="mb-4 font-semibold">
              Série temporelle — {selectedStation?.name ?? "—"}
            </h2>
            <select
              className="w-full p-2 mb-4 border rounded-md"
              value={selectedStation?.id || ""}
              onChange={(e) =>
                setSelectedStation(stations.find((s) => s.id === e.target.value) || null)
              }
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {isLoading.timeseries ? (
              <div className="text-center text-muted-foreground py-6">Chargement des données...</div>
            ) : timeseries.length > 0 ? (
              <TimeSeriesChart
                data={timeseries}
                showPrecipitation
                showDischarge
                showTemperature
                showGrid
              />
            ) : (
              <div className="text-center text-muted-foreground py-6">Aucune donnée disponible</div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* ---- STATIONS + ALERTES ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card className="p-4 shadow-md">
          <h3 className="mb-3 font-semibold">Stations</h3>
          {isLoading.stations ? (
            <div className="text-center text-muted-foreground py-6">Chargement...</div>
          ) : stations.length ? (
            <ul className="space-y-2 max-h-60 overflow-auto">
              {stations.map((s) => (
                <li
                  key={s.id}
                  onClick={() => setSelectedStation(s)}
                  className="p-2 border rounded-md flex justify-between hover:bg-gray-50 cursor-pointer"
                >
                  <div>
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground text-sm"> - {s.river || s.region}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Aucune station trouvée</p>
          )}
        </Card>

        <Card className="p-4 shadow-md">
          <h3 className="mb-3 font-semibold">Alertes</h3>
          {isLoading.alerts ? (
            <div className="text-center text-muted-foreground py-6">Chargement...</div>
          ) : alerts.length ? (
            <ul className="space-y-2 max-h-60 overflow-auto">
              {alerts.map((a) => (
                <li key={a.id} className="p-2 border rounded-md hover:bg-gray-50">
                  <p className="text-sm font-medium">{a.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.station} - {a.date}
                  </p>
                  <p className="text-xs">{a.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Aucune alerte</p>
          )}
        </Card>
      </div>

      {/* ---- KPI CARDS ---- */}
      <KpiCards />
    </div>
  );
};

export default Dashboard;
