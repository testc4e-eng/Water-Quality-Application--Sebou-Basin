// // /* frontend/src/components/Dashboard/StationTable.jsx */
// // import React, { useMemo } from "react";
// // import { useStations } from "../../services/api.js";
// // import { useSelection } from "../../context/SelectionContext.jsx";

// // export default function StationTable() {
// //   const { data: stations, isLoading, error } = useStations();
// //   const { selectedStation, setSelectedStation } = useSelection();

// //   const rows = useMemo(() => stations || [], [stations]);

// //   return (
// //     <div
// //       className="card"
// //       style={{ padding: 12, height: 100 + 420 + 16, overflow: "auto" }}
// //     >
// //       <div style={{ fontWeight: 700, marginBottom: 6 }}>
// //         Stations ({rows.length})
// //       </div>
// //       {isLoading && <div>Chargement…</div>}
// //       {error && <div style={{ color: "crimson" }}>Erreur: {String(error)}</div>}
// //       {!isLoading && !error && rows.length === 0 && (
// //         <div style={{ color: "#667085" }}>Aucune station.</div>
// //       )}

// //       <table
// //         style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
// //       >
// //         <thead>
// //           <tr style={{ textAlign: "left", color: "#667085" }}>
// //             <th style={{ padding: "6px 4px" }}>#</th>
// //             <th style={{ padding: "6px 4px" }}>Nom</th>
// //             <th style={{ padding: "6px 4px" }}>Rivière</th>
// //             <th style={{ padding: "6px 4px" }}>Coord.</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.map((s) => {
// //             const isSel = s.id === selectedStation?.id;
// //             return (
// //               <tr
// //                 key={s.id}
// //                 onClick={() => setSelectedStation(s)}
// //                 style={{
// //                   cursor: "pointer",
// //                   background: isSel ? "#eef2ff" : "transparent",
// //                 }}
// //               >
// //                 <td style={{ padding: "6px 4px" }}>{s.id}</td>
// //                 <td style={{ padding: "6px 4px", fontWeight: 600 }}>
// //                   {s.name}
// //                 </td>
// //                 <td style={{ padding: "6px 4px" }}>{s.river || "—"}</td>
// //                 <td style={{ padding: "6px 4px", color: "#667085" }}>
// //                   {s.coords
// //                     ? `${s.coords.lat.toFixed(3)}, ${s.coords.lon.toFixed(3)}`
// //                     : "—"}
// //                 </td>
// //               </tr>
// //             );
// //           })}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }


// /* frontend/src/components/Dashboard/StationTable.jsx */
// import React, { useMemo, useState } from "react";
// import { useStations } from "../../services/api.js";
// import { useSelection } from "../../context/SelectionContext.jsx";
// import {
//   MapPin,
//   Droplets,
//   Search,
//   Filter,
//   ArrowUpDown,
//   ChevronDown,
//   ChevronUp,
//   Activity,
//   AlertCircle,
//   CheckCircle2,
//   Eye,
//   EyeOff,
//   Download,
//   RefreshCw,
//   Gauge,
//   Thermometer,
//   Wind,
//   Waves,
//   MoreVertical
// } from "lucide-react";

// export default function StationTable() {
//   const { data: stations, isLoading, error } = useStations();
//   const { selectedStation, setSelectedStation } = useSelection();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);

//   const rows = useMemo(() => stations || [], [stations]);

//   // Fonction de recherche et filtrage
//   const filteredAndSortedRows = useMemo(() => {
//     let filtered = [...rows];

//     // Filtre par recherche
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(station => 
//         station.name?.toLowerCase().includes(term) ||
//         station.river?.toLowerCase().includes(term) ||
//         station.id?.toString().includes(term)
//       );
//     }

//     // Filtre par statut
//     if (filterStatus !== "all") {
//       filtered = filtered.filter(station => {
//         if (filterStatus === "active") return station.status === "active" || station.active;
//         if (filterStatus === "alert") return station.alert || station.status === "alert";
//         if (filterStatus === "offline") return station.status === "offline" || !station.active;
//         return true;
//       });
//     }

//     // Tri
//     filtered.sort((a, b) => {
//       let aVal = a[sortConfig.key];
//       let bVal = b[sortConfig.key];

//       if (sortConfig.key === "name") {
//         aVal = a.name || "";
//         bVal = b.name || "";
//       } else if (sortConfig.key === "river") {
//         aVal = a.river || "";
//         bVal = b.river || "";
//       } else if (sortConfig.key === "id") {
//         aVal = a.id || 0;
//         bVal = b.id || 0;
//       } else if (sortConfig.key === "status") {
//         aVal = getStationStatus(a);
//         bVal = getStationStatus(b);
//       }

//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return filtered;
//   }, [rows, searchTerm, sortConfig, filterStatus]);

//   // Statistiques
//   const stats = {
//     total: rows.length,
//     active: rows.filter(s => s.status === "active" || s.active).length,
//     alert: rows.filter(s => s.alert || s.status === "alert").length,
//     offline: rows.filter(s => s.status === "offline" || !s.active).length
//   };

//   const getStationStatus = (station) => {
//     if (station.alert || station.status === "alert") return "alert";
//     if (station.status === "active" || station.active) return "active";
//     return "offline";
//   };

//   const getStatusColor = (station) => {
//     if (station.alert || station.status === "alert") return "red";
//     if (station.status === "active" || station.active) return "emerald";
//     return "gray";
//   };

//   const getStatusIcon = (station) => {
//     if (station.alert || station.status === "alert") return AlertCircle;
//     if (station.status === "active" || station.active) return CheckCircle2;
//     return EyeOff;
//   };

//   const getStationTypeIcon = (station) => {
//     const name = (station.name || "").toLowerCase();
//     const river = (station.river || "").toLowerCase();
    
//     if (name.includes("eau") || name.includes("débit") || river.includes("rivière")) {
//       return Droplets;
//     }
//     if (name.includes("temp") || name.includes("thermo")) {
//       return Thermometer;
//     }
//     if (name.includes("vent") || name.includes("wind")) {
//       return Wind;
//     }
//     if (name.includes("marée") || name.includes("vague")) {
//       return Waves;
//     }
//     return Gauge;
//   };

//   const handleSort = (key) => {
//     setSortConfig({
//       key,
//       direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
//     });
//   };

//   const SortIcon = ({ column }) => {
//     if (sortConfig.key !== column) return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
//     return sortConfig.direction === "asc" 
//       ? <ChevronUp className="h-3 w-3 text-blue-600" />
//       : <ChevronDown className="h-3 w-3 text-blue-600" />;
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/20 rounded-lg">
//               <MapPin className="h-5 w-5 text-white" />
//             </div>
//             <h2 className="text-lg font-semibold text-white">Stations de mesure</h2>
//           </div>
//         </div>
//         <div className="p-8 flex flex-col items-center justify-center">
//           <div className="relative">
//             <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <MapPin className="h-5 w-5 text-blue-600 animate-pulse" />
//             </div>
//           </div>
//           <p className="mt-3 text-gray-600 font-medium">Chargement des stations...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/20 rounded-lg">
//               <AlertCircle className="h-5 w-5 text-white" />
//             </div>
//             <h2 className="text-lg font-semibold text-white">Erreur</h2>
//           </div>
//         </div>
//         <div className="p-4">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
//             <AlertCircle className="h-4 w-4 text-red-500" />
//             <span className="text-sm text-red-700">Erreur: {String(error)}</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
//       {/* En-tête */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/20 rounded-lg">
//               <MapPin className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-white">Stations de mesure</h2>
//               <p className="text-xs text-white/80">{filteredAndSortedRows.length} station{filteredAndSortedRows.length > 1 ? 's' : ''} affichée{filteredAndSortedRows.length > 1 ? 's' : ''}</p>
//             </div>
//           </div>
          
//           {/* Badges de statistiques */}
//           <div className="flex items-center gap-2">
//             <div className="px-2 py-1 bg-white/20 rounded-lg text-white text-xs flex items-center gap-1">
//               <CheckCircle2 className="h-3 w-3" />
//               <span>{stats.active}</span>
//             </div>
//             {stats.alert > 0 && (
//               <div className="px-2 py-1 bg-red-500/30 rounded-lg text-white text-xs flex items-center gap-1">
//                 <AlertCircle className="h-3 w-3" />
//                 <span>{stats.alert}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Barre de recherche */}
//         <div className="mt-3 flex gap-2">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
//             <input
//               type="text"
//               placeholder="Rechercher une station..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
//             />
//           </div>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`px-3 py-2 rounded-lg transition-colors ${
//               showFilters || filterStatus !== "all"
//                 ? 'bg-white text-blue-600'
//                 : 'bg-white/20 text-white hover:bg-white/30'
//             }`}
//           >
//             <Filter className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Filtres */}
//         {showFilters && (
//           <div className="mt-2 flex gap-2">
//             <button
//               onClick={() => setFilterStatus("all")}
//               className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
//                 filterStatus === "all"
//                   ? 'bg-white text-blue-600'
//                   : 'bg-white/20 text-white hover:bg-white/30'
//               }`}
//             >
//               Toutes
//             </button>
//             <button
//               onClick={() => setFilterStatus("active")}
//               className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
//                 filterStatus === "active"
//                   ? 'bg-emerald-500 text-white'
//                   : 'bg-emerald-500/20 text-white hover:bg-emerald-500/30'
//               }`}
//             >
//               <CheckCircle2 className="h-3 w-3" />
//               Actives
//             </button>
//             <button
//               onClick={() => setFilterStatus("alert")}
//               className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
//                 filterStatus === "alert"
//                   ? 'bg-red-500 text-white'
//                   : 'bg-red-500/20 text-white hover:bg-red-500/30'
//               }`}
//             >
//               <AlertCircle className="h-3 w-3" />
//               Alertes
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Tableau */}
//       <div className="overflow-auto max-h-[420px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 sticky top-0 z-10">
//             <tr>
//               <th 
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort("id")}
//               >
//                 <div className="flex items-center gap-1">
//                   <span>#</span>
//                   <SortIcon column="id" />
//                 </div>
//               </th>
//               <th 
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort("name")}
//               >
//                 <div className="flex items-center gap-1">
//                   <span>Station</span>
//                   <SortIcon column="name" />
//                 </div>
//               </th>
//               <th 
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort("river")}
//               >
//                 <div className="flex items-center gap-1">
//                   <span>Cours d'eau</span>
//                   <SortIcon column="river" />
//                 </div>
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Coordonnées
//               </th>
//               <th 
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort("status")}
//               >
//                 <div className="flex items-center gap-1">
//                   <span>Statut</span>
//                   <SortIcon column="status" />
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredAndSortedRows.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
//                   <div className="flex flex-col items-center">
//                     <Search className="h-8 w-8 text-gray-300 mb-2" />
//                     <p>Aucune station trouvée</p>
//                     <button 
//                       onClick={() => setSearchTerm("")}
//                       className="mt-2 text-sm text-blue-600 hover:text-blue-700"
//                     >
//                       Réinitialiser la recherche
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               filteredAndSortedRows.map((s) => {
//                 const isSelected = s.id === selectedStation?.id;
//                 const StatusIcon = getStatusIcon(s);
//                 const TypeIcon = getStationTypeIcon(s);
//                 const statusColor = getStatusColor(s);
                
//                 return (
//                   <tr
//                     key={s.id}
//                     onClick={() => setSelectedStation(s)}
//                     className={`
//                       cursor-pointer transition-all duration-200
//                       ${isSelected 
//                         ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100' 
//                         : 'hover:bg-gray-50'
//                       }
//                     `}
//                   >
//                     <td className="px-4 py-3 text-sm text-gray-600 font-mono">
//                       #{s.id}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2">
//                         <div className={`p-1.5 rounded-lg bg-${statusColor}-100`}>
//                           <TypeIcon className={`h-4 w-4 text-${statusColor}-600`} />
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-800">{s.name}</div>
//                           {s.code && (
//                             <div className="text-xs text-gray-400">Code: {s.code}</div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1">
//                         <Droplets className="h-3.5 w-3.5 text-blue-400" />
//                         <span className="text-gray-600">{s.river || "—"}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       {s.coords ? (
//                         <div className="text-xs text-gray-500 font-mono">
//                           <div>{s.coords.lat.toFixed(4)}°N</div>
//                           <div>{s.coords.lon.toFixed(4)}°E</div>
//                         </div>
//                       ) : (
//                         <span className="text-gray-400">—</span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
//                         ${statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' : ''}
//                         ${statusColor === 'red' ? 'bg-red-100 text-red-700' : ''}
//                         ${statusColor === 'gray' ? 'bg-gray-100 text-gray-700' : ''}
//                       `}>
//                         <StatusIcon className={`h-3 w-3 ${
//                           statusColor === 'emerald' ? 'text-emerald-600' : ''
//                         } ${statusColor === 'red' ? 'text-red-600 animate-pulse' : ''}`} />
//                         <span>
//                           {statusColor === 'emerald' ? 'Active' : ''}
//                           {statusColor === 'red' ? 'Alerte' : ''}
//                           {statusColor === 'gray' ? 'Inactive' : ''}
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pied de tableau */}
//       <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
//         <div className="flex items-center gap-4">
//           <span>{filteredAndSortedRows.length} station{filteredAndSortedRows.length > 1 ? 's' : ''}</span>
//           <span className="flex items-center gap-1">
//             <RefreshCw className="h-3 w-3" />
//             Temps réel
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="p-1 hover:bg-gray-200 rounded transition-colors">
//             <Download className="h-3 w-3" />
//           </button>
//           <button className="p-1 hover:bg-gray-200 rounded transition-colors">
//             <MoreVertical className="h-3 w-3" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



/* frontend/src/components/Dashboard/StationTable.jsx */
import React, { useMemo, useState } from "react";
import { useStations } from "../../services/api.js";
import { useSelection } from "../../context/SelectionContext.jsx";
import {
  MapPin,
  Droplets,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Activity,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Gauge,
  Thermometer,
  Wind,
  Waves,
  MoreVertical
} from "lucide-react";

export default function StationTable() {
  const { data: stations, isLoading, error } = useStations();
  const { selectedStation, setSelectedStation } = useSelection();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const rows = useMemo(() => stations || [], [stations]);

  // Fonction de recherche et filtrage
  const filteredAndSortedRows = useMemo(() => {
    let filtered = [...rows];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(station => 
        station.name?.toLowerCase().includes(term) ||
        station.river?.toLowerCase().includes(term) ||
        station.id?.toString().includes(term)
      );
    }

    // Filtre par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter(station => {
        if (filterStatus === "active") return station.status === "active" || station.active;
        if (filterStatus === "alert") return station.alert || station.status === "alert";
        if (filterStatus === "offline") return station.status === "offline" || !station.active;
        return true;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "name") {
        aVal = a.name || "";
        bVal = b.name || "";
      } else if (sortConfig.key === "river") {
        aVal = a.river || "";
        bVal = b.river || "";
      } else if (sortConfig.key === "id") {
        aVal = a.id || 0;
        bVal = b.id || 0;
      } else if (sortConfig.key === "status") {
        aVal = getStationStatus(a);
        bVal = getStationStatus(b);
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rows, searchTerm, sortConfig, filterStatus]);

  // Statistiques
  const stats = {
    total: rows.length,
    active: rows.filter(s => s.status === "active" || s.active).length,
    alert: rows.filter(s => s.alert || s.status === "alert").length,
    offline: rows.filter(s => s.status === "offline" || !s.active).length
  };

  const getStationStatus = (station) => {
    if (station.alert || station.status === "alert") return "alert";
    if (station.status === "active" || station.active) return "active";
    return "offline";
  };

  const getStatusColor = (station) => {
    if (station.alert || station.status === "alert") return "red";
    if (station.status === "active" || station.active) return "emerald";
    return "gray";
  };

  const getStatusIcon = (station) => {
    if (station.alert || station.status === "alert") return AlertCircle;
    if (station.status === "active" || station.active) return CheckCircle2;
    return EyeOff;
  };

  const getStationTypeIcon = (station) => {
    const name = (station.name || "").toLowerCase();
    const river = (station.river || "").toLowerCase();
    
    if (name.includes("eau") || name.includes("débit") || river.includes("rivière")) {
      return Droplets;
    }
    if (name.includes("temp") || name.includes("thermo")) {
      return Thermometer;
    }
    if (name.includes("vent") || name.includes("wind")) {
      return Wind;
    }
    if (name.includes("marée") || name.includes("vague")) {
      return Waves;
    }
    return Gauge;
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="h-3 w-3 text-blue-600" />
      : <ChevronDown className="h-3 w-3 text-blue-600" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Stations de mesure</h2>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-3 text-gray-600 font-medium">Chargement des stations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Erreur</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">Erreur: {String(error)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Stations de mesure</h2>
              <p className="text-xs text-white/80">{filteredAndSortedRows.length} station{filteredAndSortedRows.length > 1 ? 's' : ''} affichée{filteredAndSortedRows.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          
          {/* Badges de statistiques */}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-white/20 rounded-lg text-white text-xs flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{stats.active}</span>
            </div>
            {stats.alert > 0 && (
              <div className="px-2 py-1 bg-red-500/30 rounded-lg text-white text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{stats.alert}</span>
              </div>
            )}
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mt-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Rechercher une station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              showFilters || filterStatus !== "all"
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterStatus === "all"
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                filterStatus === "active"
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-500/20 text-white hover:bg-emerald-500/30'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              Actives
            </button>
            <button
              onClick={() => setFilterStatus("alert")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                filterStatus === "alert"
                  ? 'bg-red-500 text-white'
                  : 'bg-red-500/20 text-white hover:bg-red-500/30'
              }`}
            >
              <AlertCircle className="h-3 w-3" />
              Alertes
            </button>
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="overflow-auto max-h-[420px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1">
                  <span>#</span>
                  <SortIcon column="id" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  <span>Station</span>
                  <SortIcon column="name" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("river")}
              >
                <div className="flex items-center gap-1">
                  <span>Cours d'eau</span>
                  <SortIcon column="river" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coordonnées
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  <span>Statut</span>
                  <SortIcon column="status" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedRows.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Search className="h-8 w-8 text-gray-300 mb-2" />
                    <p>Aucune station trouvée</p>
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Réinitialiser la recherche
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedRows.map((s) => {
                const isSelected = s.id === selectedStation?.id;
                const StatusIcon = getStatusIcon(s);
                const TypeIcon = getStationTypeIcon(s);
                const statusColor = getStatusColor(s);
                
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStation(s)}
                    className={`
                      cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      #{s.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-${statusColor}-100`}>
                          <TypeIcon className={`h-4 w-4 text-${statusColor}-600`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{s.name}</div>
                          {s.code && (
                            <div className="text-xs text-gray-400">Code: {s.code}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-gray-600">{s.river || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {s.coords ? (
                        <div className="text-xs text-gray-500 font-mono">
                          <div>{s.coords.lat.toFixed(4)}°N</div>
                          <div>{s.coords.lon.toFixed(4)}°E</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${statusColor === 'red' ? 'bg-red-100 text-red-700' : ''}
                        ${statusColor === 'gray' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        <StatusIcon className={`h-3 w-3 ${
                          statusColor === 'emerald' ? 'text-emerald-600' : ''
                        } ${statusColor === 'red' ? 'text-red-600 animate-pulse' : ''}`} />
                        <span>
                          {statusColor === 'emerald' ? 'Active' : ''}
                          {statusColor === 'red' ? 'Alerte' : ''}
                          {statusColor === 'gray' ? 'Inactive' : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{filteredAndSortedRows.length} station{filteredAndSortedRows.length > 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Temps réel
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <Download className="h-3 w-3" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <MoreVertical className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}