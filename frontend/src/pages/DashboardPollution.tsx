import { useState, useEffect } from 'react';
import PageHeader from '../components/Layout/PageHeader';
import PollutionMap from '../components/Pollution/PollutionMap';
import PollutionSidebar from '../components/Pollution/PollutionSidebar';
import { StationInfo } from '../mocks/pollutionSimulationData';
import { api } from '../api/client';

export default function DashboardPollution() {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [simulationResults, setSimulationResults] = useState<any | null>(null);
  const [simulating, setSimulating] = useState(false);
  
  const [hydroNetwork, setHydroNetwork] = useState<any>(null);
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [topologyQaData, setTopologyQaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRealData() {
      try {
        setLoading(true);
        const [netRes, stRes, damRes] = await Promise.all([
          api.get('/geojson/reseau'),
          api.get('/geojson/stations'),
          api.get('/geojson/barrages')
        ]);

        setHydroNetwork(netRes.data);

        const mappedStations: StationInfo[] = [];
        const stData = stRes.data as any;
        const damData = damRes.data as any;
        
        if (stData && stData.features) {
          stData.features.forEach((f: any) => {
            if (f.geometry && f.geometry.coordinates) {
              const typeStation = f.properties?.type_station?.toLowerCase();
              if (typeStation === 'hydrologique') {
                const id = f.properties?.station_id || f.id || Math.random();
                const name = f.properties?.station_nom || f.properties?.name || `Station ${id}`;
                mappedStations.push({
                  id: `st-${id}`,
                  name: name,
                  type: 'hydro',
                  coordinates: f.geometry.coordinates,
                  rawId: id // keep original id for matching
                });
              }
            }
          });
        }
        
        if (damData && damData.features) {
          damData.features.forEach((f: any) => {
            if (f.geometry && f.geometry.coordinates) {
              const id = f.properties?.barrage_id || f.id || Math.random();
              const name = (f.properties?.barrage_nom || f.properties?.nom_barrage || f.properties?.name || `Barrage ${id}`);
              const type = name.toLowerCase().includes('garde') ? 'guard_dam' : 'dam';
              mappedStations.push({
                id: `dam-${id}`,
                name: name,
                type,
                coordinates: f.geometry.coordinates,
                rawId: id // keep original id for matching
              });
            }
          });
        }

        setStations(mappedStations);
      } catch (error) {
        console.error("Erreur lors du chargement des données géographiques réelles:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRealData();
  }, []);

  const handleLocationSelect = (lon: number, lat: number) => {
    setSelectedLocation([lon, lat]);
    setSimulationResults(null);
  };

  const [qaMode, setQaMode] = useState(false);

  useEffect(() => {
    if (qaMode && !topologyQaData) {
      async function loadQaData() {
        try {
          const res = await api.get('/routing/topology-qa');
          setTopologyQaData(res.data);
        } catch (error) {
          console.error("Erreur lors du chargement des données QA:", error);
        }
      }
      loadQaData();
    }
  }, [qaMode, topologyQaData]);

  const handleSimulate = async (categoryId: string, declarationTime: Date) => {
    if (selectedLocation) {
      setSimulating(true);
      try {
        const response = await api.get('/routing/downstream-to-garde', {
          params: { lng: selectedLocation[0], lat: selectedLocation[1] }
        });
        const data = response.data as any;
        
        const enrichedStations = stations.filter(s => 
          data.impacted_stations?.includes(s.rawId) || 
          data.impacted_barrages?.includes(s.rawId)
        );

        setSimulationResults({
          ...data,
          enrichedStations
        });
      } catch (error) {
        console.error("Erreur lors de la simulation de routage", error);
      } finally {
        setSimulating(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setSimulationResults(null);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <PageHeader 
        title="Gestion des Pollutions Déclarées" 
        subtitle="Simulation de propagation et recommandations d'actions (Données réelles API)"
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 relative">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <PollutionMap 
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              simulationResults={simulationResults}
              hydroNetwork={hydroNetwork}
              stations={stations}
              qaMode={qaMode}
              topologyQaData={topologyQaData}
            />
          )}
        </div>
        
        <div className="w-[450px] shadow-2xl z-10">
          <PollutionSidebar 
            selectedLocation={selectedLocation}
            onSimulate={handleSimulate}
            simulationResults={simulationResults}
            onReset={handleReset}
            qaMode={qaMode}
            setQaMode={setQaMode}
          />
        </div>
      </div>
    </div>
  );
}
