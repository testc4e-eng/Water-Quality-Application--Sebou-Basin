import React, { useState } from "react";

type Props = {
  station: string[];
  parametres: string[];
  aggregation: string;
  dateStart: string;
  dateEnd: string;
  onStationChange: (v: string[]) => void;
  onParametresChange: (v: string[]) => void;
  onAggregationChange: (v: string) => void;
  onDateStartChange: (v: string) => void;
  onDateEndChange: (v: string) => void;
};





const PARAMS = [
  { id: "N", label: "Azote (N)", color: "blue", icon: "🧪" },
  { id: "O", label: "Oxygène (O)", color: "red", icon: "💨" },
  { id: "P", label: "Phosphore (P)", color: "green", icon: "⚗️" }
];

const STATIONS = [
  { id: "AIT_TAMLIL", name: "AIT TAMLIL", color: "emerald" },
  { id: "SEBOU_01", name: "SEBOU 01", color: "blue" },
  { id: "SEBOU_02", name: "SEBOU 02", color: "purple" }
];


export default function QualityFilters(props: Props) {

  const [openStations, setOpenStations] = useState<boolean>(false);

  const toggleParam = (p: string) => {
    props.onParametresChange(
      props.parametres.includes(p)
        ? props.parametres.filter(x => x !== p)
        : [...props.parametres, p]
    );
  };


  return (
    <div className="space-y-5">
      
      {/* STATIONS - MULTI-SELECT */}
      <div className="space-y-2">
  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
    <span className="text-emerald-600">📍</span> Stations
  </label>

  <div className="relative">
    <button
      onClick={() => setOpenStations(!openStations)}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white text-left text-sm flex justify-between items-center"
    >
      {props.station.length > 0
        ? `${props.station.length} station(s) sélectionnée(s)`
        : "Sélectionner une station"}
      <span>{openStations ? "▲" : "▼"}</span>
    </button>

    {openStations && (
      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
        {STATIONS.map((s) => {
          const isSelected = props.station.includes(s.id);
          return (
            <label
              key={s.id}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                const newSelection = isSelected
                  ? props.station.filter(x => x !== s.id)
                  : [...props.station, s.id];
                props.onStationChange(newSelection);
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
              />
              <span className="text-sm">{s.name}</span>
            </label>
          );
        })}
      </div>
    )}
  </div>
</div>


      {/* PARAMÈTRES - CARTES COLORÉES */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-purple-600">🧪</span> Paramètres
          <span className="ml-auto text-xs font-normal text-gray-500">
            {props.parametres.length}/3
          </span>
        </label>
        
        <div className="grid grid-cols-1 gap-2">
          {PARAMS.map((p) => {
            const isSelected = props.parametres.includes(p.id);
            return (
              <label
                key={p.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? `border-${p.color}-500 bg-${p.color}-50`
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleParam(p.id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className={`w-4 h-4 rounded border-gray-300 text-${p.color}-600 focus:ring-${p.color}-500`}
                />
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1">
                  <div className={`font-semibold ${isSelected ? `text-${p.color}-700` : 'text-gray-700'}`}>
                    {p.label}
                  </div>
                  <div className={`text-xs ${isSelected ? `text-${p.color}-600` : 'text-gray-500'}`}>
                    Paramètre de qualité
                  </div>
                </div>
                {isSelected && (
                  <span className={`text-xs bg-${p.color}-500 text-white px-2 py-1 rounded-full`}>
                    Actif
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* AGRÉGATION */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-amber-600">⏱️</span> Agrégation
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              props.aggregation === 'D'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => props.onAggregationChange('D')}
          >
            <span>📅</span> Journalier
          </button>
          <button
            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              props.aggregation === 'M'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => props.onAggregationChange('M')}
          >
            <span>📆</span> Mensuel
          </button>
        </div>
      </div>

      {/* DATES */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-indigo-600">📆</span> Période
        </label>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Début</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                value={props.dateStart}
                onChange={(e) => props.onDateStartChange(e.target.value)}
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Fin</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                value={props.dateEnd}
                onChange={(e) => props.onDateEndChange(e.target.value)}
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOUTON RÉINITIALISER */}
      {(props.parametres.length > 0 || props.station.length > 0) && (
        <button
          onClick={() => {
            props.onStationChange([]);
            props.onParametresChange(["N", "O", "P"]);
            props.onAggregationChange("M");
            props.onDateStartChange("1992-01-01");
            props.onDateEndChange("2020-12-31");
          }}
          className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <span>🔄</span> Réinitialiser
        </button>
      )}
    </div>
  );
}