import { useEffect, useState } from "react";
import { fetchHydroStations } from "@/api/hydro";
import { Calendar, MapPin, Clock, Filter } from "lucide-react";

export default function HydroFiltersFDC({
  rowsStats = [],
  selectedRow,
  dateStart,
  dateEnd,
  onStationChange,
  onRowChange,
  onDateStartChange,
  onDateEndChange,
}: any) {
  const [stations, setStations] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchHydroStations().then(setStations);
  }, []);

  // Obtenir les agrégations disponibles uniques
  const aggregations = Array.from(
    new Set(rowsStats.map((r: any) => r.time_step))
  ).map(agg => ({
    value: agg,
    label: agg === 'daily' ? 'Journalier' : agg === 'monthly' ? 'Mensuel' : 'Annuel'
  }));

  return (
    <div className="space-y-4">
      {/* BOUTON EXPAND/REDUCE */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span className="flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Options de filtrage
        </span>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <>
          {/* STATION */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3 text-amber-600" />
              Station
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-sm"
              onChange={(e) => {
                const id = Number(e.target.value);
                onStationChange(id);
              }}
              value={selectedRow?.station_id || ""}
            >
              <option value="">Sélectionner une station...</option>
              {stations.map((s) => (
                <option key={s.station_id} value={s.station_id}>
                  {s.station_name}
                </option>
              ))}
            </select>
          </div>

          {/* AGRÉGATION */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-600" />
              Agrégation
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-sm"
              onChange={(e) => {
                const agg = e.target.value;
                const row = rowsStats.find((r: any) => r.time_step === agg);
                if (row) onRowChange(row);
              }}
              value={selectedRow?.time_step || ""}
            >
              <option value="">Sélectionner une agrégation...</option>
              {aggregations.map((agg) => (
                <option key={agg.value} value={agg.value}>
                  {agg.label}
                </option>
              ))}
            </select>
          </div>

          {/* DATES */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3 text-amber-600" />
              Période
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Début</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => onDateStartChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-sm"
                  />
                  <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500">Fin</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => onDateEndChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-sm"
                  />
                  <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* RÉCAPITULATIF */}
          {selectedRow && dateStart && dateEnd && (
            <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xs text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Analyse FDC sur {selectedRow.time_step === 'daily' ? 'données journalières' : 
                                 selectedRow.time_step === 'monthly' ? 'données mensuelles' : 'données annuelles'}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}