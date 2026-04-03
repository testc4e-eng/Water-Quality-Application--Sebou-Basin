// import React, { useState } from "react";

// type Props = {
//   station: string[];
//   parametres: string[];
//   aggregation: string;
//   dateStart: string;
//   dateEnd: string;
//   onStationChange: (v: string[]) => void;
//   onParametresChange: (v: string[]) => void;
//   onAggregationChange: (v: string) => void;
//   onDateStartChange: (v: string) => void;
//   onDateEndChange: (v: string) => void;
// };





// const PARAMS = [
//   { id: "N", label: "Azote (N)", color: "blue", icon: "🧪" },
//   { id: "O", label: "Oxygène (O)", color: "red", icon: "💨" },
//   { id: "P", label: "Phosphore (P)", color: "green", icon: "⚗️" }
// ];

// const STATIONS = [
//   { id: "AIT_TAMLIL", name: "AIT TAMLIL", color: "emerald" },
//   { id: "SEBOU_01", name: "SEBOU 01", color: "blue" },
//   { id: "SEBOU_02", name: "SEBOU 02", color: "purple" }
// ];


// export default function QualityFilters(props: Props) {

//   const [openStations, setOpenStations] = useState<boolean>(false);

//   const toggleParam = (p: string) => {
//     props.onParametresChange(
//       props.parametres.includes(p)
//         ? props.parametres.filter(x => x !== p)
//         : [...props.parametres, p]
//     );
//   };


//   return (
//     <div className="space-y-5">
      
//       {/* STATIONS - MULTI-SELECT */}
//       <div className="space-y-2">
//   <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
//     <span className="text-emerald-600">📍</span> Stations
//   </label>

//   <div className="relative">
//     <button
//       onClick={() => setOpenStations(!openStations)}
//       className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white text-left text-sm flex justify-between items-center"
//     >
//       {props.station.length > 0
//         ? `${props.station.length} station(s) sélectionnée(s)`
//         : "Sélectionner une station"}
//       <span>{openStations ? "▲" : "▼"}</span>
//     </button>

//     {openStations && (
//       <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
//         {STATIONS.map((s) => {
//           const isSelected = props.station.includes(s.id);
//           return (
//             <label
//               key={s.id}
//               className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() => {
//                 const newSelection = isSelected
//                   ? props.station.filter(x => x !== s.id)
//                   : [...props.station, s.id];
//                 props.onStationChange(newSelection);
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => {}}
//               />
//               <span className="text-sm">{s.name}</span>
//             </label>
//           );
//         })}
//       </div>
//     )}
//   </div>
// </div>


//       {/* PARAMÈTRES - CARTES COLORÉES */}
//       <div className="space-y-2">
//         <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
//           <span className="text-purple-600">🧪</span> Paramètres
//           <span className="ml-auto text-xs font-normal text-gray-500">
//             {props.parametres.length}/3
//           </span>
//         </label>
        
//         <div className="grid grid-cols-1 gap-2">
//           {PARAMS.map((p) => {
//             const isSelected = props.parametres.includes(p.id);
//             return (
//               <label
//                 key={p.id}
//                 className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                   isSelected
//                     ? `border-${p.color}-500 bg-${p.color}-50`
//                     : 'border-gray-200 bg-white hover:bg-gray-50'
//                 }`}
//                 onClick={() => toggleParam(p.id)}
//               >
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => {}}
//                   className={`w-4 h-4 rounded border-gray-300 text-${p.color}-600 focus:ring-${p.color}-500`}
//                 />
//                 <span className="text-xl">{p.icon}</span>
//                 <div className="flex-1">
//                   <div className={`font-semibold ${isSelected ? `text-${p.color}-700` : 'text-gray-700'}`}>
//                     {p.label}
//                   </div>
//                   <div className={`text-xs ${isSelected ? `text-${p.color}-600` : 'text-gray-500'}`}>
//                     Paramètre de qualité
//                   </div>
//                 </div>
//                 {isSelected && (
//                   <span className={`text-xs bg-${p.color}-500 text-white px-2 py-1 rounded-full`}>
//                     Actif
//                   </span>
//                 )}
//               </label>
//             );
//           })}
//         </div>
//       </div>

//       {/* AGRÉGATION */}
//       <div className="space-y-2">
//         <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
//           <span className="text-amber-600">⏱️</span> Agrégation
//         </label>
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
//               props.aggregation === 'D'
//                 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//             onClick={() => props.onAggregationChange('D')}
//           >
//             <span>📅</span> Journalier
//           </button>
//           <button
//             className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
//               props.aggregation === 'M'
//                 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//             onClick={() => props.onAggregationChange('M')}
//           >
//             <span>📆</span> Mensuel
//           </button>
//         </div>
//       </div>

//       {/* DATES */}
//       <div className="space-y-3">
//         <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
//           <span className="text-indigo-600">📆</span> Période
//         </label>
        
//         <div className="grid grid-cols-2 gap-2">
//           <div className="space-y-1">
//             <label className="text-xs text-gray-500">Début</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
//                 value={props.dateStart}
//                 onChange={(e) => props.onDateStartChange(e.target.value)}
//               />
//               <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
//             </div>
//           </div>

//           <div className="space-y-1">
//             <label className="text-xs text-gray-500">Fin</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
//                 value={props.dateEnd}
//                 onChange={(e) => props.onDateEndChange(e.target.value)}
//               />
//               <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* BOUTON RÉINITIALISER */}
//       {(props.parametres.length > 0 || props.station.length > 0) && (
//         <button
//           onClick={() => {
//             props.onStationChange([]);
//             props.onParametresChange(["N", "O", "P"]);
//             props.onAggregationChange("M");
//             props.onDateStartChange("1992-01-01");
//             props.onDateEndChange("2020-12-31");
//           }}
//           className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
//         >
//           <span>🔄</span> Réinitialiser
//         </button>
//       )}
//     </div>
//   );
// }



import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check, Calendar, RefreshCw, Filter, MapPin, Beaker, Clock } from "lucide-react";

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
  { id: "N", label: "Azote (N)", color: "blue", icon: "🧪", description: "Nutriments azotés" },
  { id: "O", label: "Oxygène (O)", color: "red", icon: "💨", description: "Oxygène dissous" },
  { id: "P", label: "Phosphore (P)", color: "green", icon: "⚗️", description: "Phosphore total" }
];

const STATIONS = [
  { id: "AIT_TAMLIL", name: "AIT TAMLIL", color: "emerald", region: "Amont Sebou", active: true },
  { id: "SEBOU_01", name: "SEBOU 01", color: "blue", region: "Moyen Sebou", active: true },
  { id: "SEBOU_02", name: "SEBOU 02", color: "purple", region: "Aval Sebou", active: true }
];

export default function QualityFilters(props: Props) {
  const [openStations, setOpenStations] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleParam = (p: string) => {
    props.onParametresChange(
      props.parametres.includes(p)
        ? props.parametres.filter(x => x !== p)
        : [...props.parametres, p]
    );
  };

  const getParamColor = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      red: "from-red-500 to-red-600",
      green: "from-green-500 to-green-600",
    };
    return colors[color as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getStationColor = (color: string) => {
    const colors = {
      emerald: "from-emerald-500 to-teal-500",
      blue: "from-blue-500 to-cyan-500",
      purple: "from-purple-500 to-violet-500",
    };
    return colors[color as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getSelectedCount = () => {
    const stationCount = props.station.length;
    const paramCount = props.parametres.length;
    return stationCount + paramCount;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec compteur */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Filter className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Filtres avancés
          </span>
        </div>
        {getSelectedCount() > 0 && (
          <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-xs font-medium text-white">
            {getSelectedCount()} actif{getSelectedCount() > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* STATIONS - MULTI-SELECT MODERN */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <div className="p-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          Stations de mesure
          <span className="ml-auto text-xs font-normal text-gray-400">
            {props.station.length} sélectionnée{props.station.length > 1 ? 's' : ''}
          </span>
        </label>

        <div className="relative">
          <button
            onClick={() => setOpenStations(!openStations)}
            className={`
              w-full rounded-xl border-2 px-4 py-3 bg-white text-left text-sm 
              transition-all duration-200 flex items-center justify-between
              ${openStations 
                ? 'border-emerald-400 ring-2 ring-emerald-100 shadow-lg' 
                : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${props.station.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className={props.station.length > 0 ? 'font-medium text-gray-800' : 'text-gray-500'}>
                {props.station.length > 0
                  ? `${props.station.length} station(s) sélectionnée(s)`
                  : "Sélectionner une ou plusieurs stations"}
              </span>
            </div>
            {openStations ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {openStations && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-600">Sélectionnez les stations</span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {STATIONS.map((s) => {
                  const isSelected = props.station.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`
                        flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150
                        ${isSelected 
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                      onClick={() => {
                        const newSelection = isSelected
                          ? props.station.filter(x => x !== s.id)
                          : [...props.station, s.id];
                        props.onStationChange(newSelection);
                      }}
                    >
                      <div className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                        ${isSelected 
                          ? `bg-gradient-to-r ${getStationColor(s.color)} border-transparent` 
                          : 'border-gray-300 bg-white'
                        }
                      `}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.region}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full bg-${s.color}-500 ${s.active ? 'animate-pulse' : ''}`}></div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PARAMÈTRES - CARTES MODERNES */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
            <Beaker className="h-3 w-3 text-white" />
          </div>
          Paramètres de qualité
          <span className="ml-auto text-xs font-normal text-gray-400">
            {props.parametres.length}/3 sélectionnés
          </span>
        </label>
        
        <div className="grid grid-cols-1 gap-3">
          {PARAMS.map((p) => {
            const isSelected = props.parametres.includes(p.id);
            return (
              <div
                key={p.id}
                className={`
                  group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${isSelected
                    ? `border-${p.color}-400 bg-gradient-to-r from-${p.color}-50 to-${p.color}-100/50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }
                `}
                onClick={() => toggleParam(p.id)}
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="relative p-3 flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all
                    ${isSelected ? `bg-gradient-to-r ${getParamColor(p.color)} shadow-lg scale-110` : 'bg-gray-100'}
                  `}>
                    <span className={isSelected ? 'text-white' : 'text-gray-600'}>{p.icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-semibold ${isSelected ? `text-${p.color}-700` : 'text-gray-800'}`}>
                      {p.label}
                    </div>
                    <div className={`text-xs ${isSelected ? `text-${p.color}-600` : 'text-gray-500'}`}>
                      {p.description}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className={`
                        w-5 h-5 rounded-md border-2 transition-all cursor-pointer
                        ${isSelected 
                          ? `bg-gradient-to-r ${getParamColor(p.color)} border-transparent` 
                          : 'border-gray-300 bg-white'
                        }
                      `}
                    />
                    {isSelected && (
                      <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* Barre d'indicateur */}
                {isSelected && (
                  <div className={`h-1 bg-gradient-to-r ${getParamColor(p.color)}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AGRÉGATION - BOUTONS MODERNES */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <div className="p-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md">
            <Clock className="h-3 w-3 text-white" />
          </div>
          Fréquence d'agrégation
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            className={`
              group relative overflow-hidden px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300
              flex items-center justify-center gap-2
              ${props.aggregation === 'D'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-[1.01]'
              }
            `}
            onClick={() => props.onAggregationChange('D')}
          >
            <span className="text-lg">📅</span>
            <span>Journalier</span>
            {props.aggregation === 'D' && (
              <div className="absolute top-1 right-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
          
          <button
            className={`
              group relative overflow-hidden px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300
              flex items-center justify-center gap-2
              ${props.aggregation === 'M'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 transform scale-[1.02]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-[1.01]'
              }
            `}
            onClick={() => props.onAggregationChange('M')}
          >
            <span className="text-lg">📆</span>
            <span>Mensuel</span>
            {props.aggregation === 'M' && (
              <div className="absolute top-1 right-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* DATES - SÉLECTEURS MODERNES */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md">
            <Calendar className="h-3 w-3 text-white" />
          </div>
          Période d'analyse
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">Date de début</label>
            <div className="relative group">
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm hover:border-indigo-300"
                value={props.dateStart}
                onChange={(e) => props.onDateStartChange(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">Date de fin</label>
            <div className="relative group">
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm hover:border-indigo-300"
                value={props.dateEnd}
                onChange={(e) => props.onDateEndChange(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RÉINITIALISATION */}
      {(props.parametres.length > 0 || props.station.length > 0 || 
        props.aggregation !== "M" || props.dateStart !== "1992-01-01" || props.dateEnd !== "2020-12-31") && (
        <button
          onClick={() => {
            props.onStationChange([]);
            props.onParametresChange(["N", "O", "P"]);
            props.onAggregationChange("M");
            props.onDateStartChange("1992-01-01");
            props.onDateEndChange("2020-12-31");
          }}
          className="group relative w-full mt-4 px-4 py-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 hover:from-gray-200 hover:via-gray-300 hover:to-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Réinitialiser tous les filtres</span>
        </button>
      )}

      {/* Résumé des filtres actifs */}
      {getSelectedCount() > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Filtres actifs :</div>
          <div className="flex flex-wrap gap-1.5">
            {props.station.map(s => {
              const station = STATIONS.find(st => st.id === s);
              return station && (
                <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
                  <MapPin className="h-2.5 w-2.5" />
                  {station.name}
                </span>
              );
            })}
            {props.parametres.map(p => {
              const param = PARAMS.find(pa => pa.id === p);
              return param && (
                <span key={p} className={`inline-flex items-center gap-1 px-2 py-1 bg-${param.color}-50 text-${param.color}-700 rounded-lg text-xs`}>
                  <span>{param.icon}</span>
                  {param.label}
                </span>
              );
            })}
            <span className={`inline-flex items-center gap-1 px-2 py-1 ${props.aggregation === 'D' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'} rounded-lg text-xs`}>
              <Clock className="h-2.5 w-2.5" />
              {props.aggregation === 'D' ? 'Journalier' : 'Mensuel'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}