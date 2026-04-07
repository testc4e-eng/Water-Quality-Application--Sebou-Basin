// import React, { useEffect, useState } from "react";
// import { fetchQualityTable } from "@/api/quality";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import autoTable from "jspdf-autotable";

// export default function QualityTable(props: any) {
//   const [rows, setRows] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
// useEffect(() => {

//   // 🚫 Si aucune station sélectionnée → on ne charge rien
//   if (!props.station_code) {
//     setRows([]);
//     setLoading(false);
//     return;
//   }

//   setLoading(true);

//   fetchQualityTable(props)
//     .then((data) => {
//       setRows(Array.isArray(data) ? data : []);
//     })
//     .finally(() => setLoading(false));

// }, [
//   props.station_code,
//   props.date_start,
//   props.date_end,
//   props.aggregation
// ]);


//   // ============================
//   // EXPORT EXCEL
//   // ============================
//   function exportExcel() {
//     if (!rows.length || !props.station_code) return;


//     const filteredRows = rows.map((r) => {
//       const obj: any = { Date: r.date };
//       props.parametres.forEach((p: string) => {
//         obj[p] = r[p.toLowerCase()];
//       });
//       return obj;
//     });

//     const worksheet = XLSX.utils.json_to_sheet(filteredRows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Qualite");
//     XLSX.writeFile(workbook, `qualite_${props.station_code}_${props.date_start}_${props.date_end}.xlsx`);
//   }

//   // ============================
//   // EXPORT PDF
//   // ============================
//   function exportPDF() {
//     if (!rows.length) return;
//     const pdf = new jsPDF("l", "mm", "a4");
//     const columns = ["Date", ...props.parametres];
//     const body = rows.map((r) => {
//       const row: any[] = [r.date];
//       props.parametres.forEach((p: string) => {
//         row.push(r[p.toLowerCase()]);
//       });
//       return row;
//     });

//     autoTable(pdf, {
//       head: [columns],
//       body: body,
//       styles: { fontSize: 8, halign: "center" },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
//       alternateRowStyles: { fillColor: [245, 247, 250] },
//       margin: { top: 20 },
//     });

//     pdf.save(`qualite_${props.station_code}_${props.date_start}_${props.date_end}.pdf`);
//   }

//   // Couleurs par paramètre
//   const paramColors: any = {
//     N: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", header: "bg-gradient-to-r from-blue-500 to-blue-600" },
//     O: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", header: "bg-gradient-to-r from-red-500 to-red-600" },
//     P: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", header: "bg-gradient-to-r from-green-500 to-green-600" }
//   };

// if (!props.station_code) {
//   return (
//     <div className="flex flex-col items-center justify-center h-[360px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
//       <div className="text-5xl mb-3 opacity-30">📋</div>
//       <p className="text-gray-400 font-medium">Aucune donnée à afficher</p>
//       <p className="text-gray-300 text-xs mt-1">Sélectionnez une station</p>
//     </div>
//   );
// }

// if (!rows.length && !loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[360px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
//         <div className="text-5xl mb-3 opacity-30">📊</div>
//         <p className="text-gray-400 font-medium">Aucune donnée disponible</p>
//         <p className="text-gray-300 text-xs mt-1">Modifiez vos filtres</p>
//       </div>
//     );




//   }

//   return (
//     <div className="flex flex-col h-[420px] overflow-hidden">
//       {/* En-tête avec boutons d'export */}
//       <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-semibold text-gray-700">
//             {rows.length} enregistrements
//           </span>
//           <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
//             {props.aggregation === 'D' ? 'Journalier' : 'Mensuel'}
//           </span>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={exportExcel}
//             className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1"
//           >
//             <span>📊</span> Excel
//           </button>
//           <button
//             onClick={exportPDF}
//             className="text-xs px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1"
//           >
//             <span>📄</span> PDF
//           </button>
//         </div>
//       </div>

//       {/* Zone scrollable du tableau */}
//       <div className="flex-1 overflow-y-auto overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="sticky top-0 z-10">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-100 border-b">
//                 Date
//               </th>
//               {props.parametres.map((p: string) => (
//                 <th 
//                   key={p} 
//                   className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${paramColors[p]?.bg} ${paramColors[p]?.text} border-b`}
//                 >
//                   <div className="flex items-center justify-end gap-1">
//                     {p}
//                     <span>{p === 'N' ? '🧪' : p === 'O' ? '💨' : '⚗️'}</span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {loading ? (
//               <tr>
//                 <td colSpan={props.parametres.length + 1} className="p-6 text-center">
//                   <div className="flex justify-center items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
//                     <span className="text-gray-500 text-sm">Chargement...</span>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               rows.map((r, i) => (
//                 <tr key={i} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-colors">
//                   <td className="px-4 py-2.5 text-gray-700 font-medium">
//                     {new Date(r.date).toLocaleDateString('fr-FR', {
//                       day: '2-digit',
//                       month: '2-digit',
//                       year: 'numeric'
//                     })}
//                   </td>

//                   {props.parametres.map((p: string) => {
//                     const value = r[p.toLowerCase()];
//                     return (
//                       <td key={p} className={`px-4 py-2.5 text-right font-mono font-semibold ${paramColors[p]?.text}`}>
//                         {Number(value).toFixed(2)}
//                         <span className="text-gray-400 text-xs ml-1">mg/L</span>
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pied de tableau */}
//       {rows.length > 0 && !loading && (
//         <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex justify-between">
//           <span>📊 {props.station_code.replace(/,/g, ', ')}</span>
//           <span>Période: {new Date(props.date_start).toLocaleDateString()} - {new Date(props.date_end).toLocaleDateString()}</span>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { fetchQualityTable } from "@/api/quality";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import { Download, FileSpreadsheet, FileText, Database, Calendar, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function QualityTable(props: any) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  useEffect(() => {
    if (!props.station_code) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetchQualityTable(props)
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [props.station_code, props.date_start, props.date_end, props.aggregation]);

  // Calculer la tendance pour chaque paramètre
  const getTrend = (values: number[]) => {
    if (values.length < 2) return null;
    const first = values[0];
    const last = values[values.length - 1];
    if (last > first) return "up";
    if (last < first) return "down";
    return "stable";
  };

  // Obtenir la couleur de tendance
  const getTrendColor = (trend: string | null) => {
    if (trend === "up") return "text-red-500";
    if (trend === "down") return "text-green-500";
    return "text-gray-400";
  };

  const getTrendIcon = (trend: string | null) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3" />;
    if (trend === "down") return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  // ============================
  // EXPORT EXCEL
  // ============================
  function exportExcel() {
    if (!rows.length || !props.station_code) return;

    const filteredRows = rows.map((r) => {
      const obj: any = { Date: r.date };
      props.parametres.forEach((p: string) => {
        obj[p] = r[p.toLowerCase()];
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Qualite");
    XLSX.writeFile(workbook, `qualite_${props.station_code}_${props.date_start}_${props.date_end}.xlsx`);
  }

  // ============================
  // EXPORT PDF
  // ============================
  function exportPDF() {
    if (!rows.length) return;
    const pdf = new jsPDF("l", "mm", "a4");
    const columns = ["Date", ...props.parametres];
    const body = rows.map((r) => {
      const row: any[] = [r.date];
      props.parametres.forEach((p: string) => {
        row.push(r[p.toLowerCase()]);
      });
      return row;
    });

    autoTable(pdf, {
      head: [columns],
      body: body,
      styles: { fontSize: 8, halign: "center" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 20 },
    });

    pdf.save(`qualite_${props.station_code}_${props.date_start}_${props.date_end}.pdf`);
  }

  // Couleurs par paramètre (style moderne)
  const paramColors: any = {
    N: { 
      bg: "bg-gradient-to-r from-blue-50 to-blue-100/50", 
      text: "text-blue-700", 
      border: "border-blue-200", 
      header: "bg-gradient-to-r from-blue-500 to-blue-600",
      badge: "bg-blue-100",
      icon: "🧪",
      gradient: "from-blue-600 to-blue-700"
    },
    O: { 
      bg: "bg-gradient-to-r from-red-50 to-red-100/50", 
      text: "text-red-700", 
      border: "border-red-200", 
      header: "bg-gradient-to-r from-red-500 to-red-600",
      badge: "bg-red-100",
      icon: "💨",
      gradient: "from-red-600 to-red-700"
    },
    P: { 
      bg: "bg-gradient-to-r from-green-50 to-green-100/50", 
      text: "text-green-700", 
      border: "border-green-200", 
      header: "bg-gradient-to-r from-green-500 to-green-600",
      badge: "bg-green-100",
      icon: "⚗️",
      gradient: "from-green-600 to-green-700"
    }
  };

  // Calculer les statistiques pour chaque paramètre
  const getParamStats = (param: string) => {
    const values = rows.map(r => r[param.toLowerCase()]).filter(v => v !== null && v !== undefined);
    if (values.length === 0) return { avg: 0, min: 0, max: 0, trend: null };
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const trend = getTrend(values);
    return { avg: avg.toFixed(2), min: min.toFixed(2), max: max.toFixed(2), trend };
  };

  if (!props.station_code) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative p-5 bg-white rounded-full shadow-lg">
            <Database className="h-12 w-12 text-gray-300" />
          </div>
        </div>
        <p className="mt-4 text-gray-400 font-medium">Aucune donnée à afficher</p>
        <p className="text-gray-300 text-sm mt-1">Sélectionnez une station dans les filtres</p>
      </div>
    );
  }

  if (!rows.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="relative">
          <div className="p-5 bg-white rounded-full shadow-lg">
            <Activity className="h-12 w-12 text-gray-300" />
          </div>
        </div>
        <p className="mt-4 text-gray-400 font-medium">Aucune donnée disponible</p>
        <p className="text-gray-300 text-sm mt-1">Modifiez vos filtres pour afficher les données</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[460px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* En-tête moderne avec gradient */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Database className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">
              {rows.length} enregistrement{rows.length > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs bg-white/20 text-white/90 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {props.aggregation === 'D' ? 'Journalier' : 'Mensuel'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportExcel}
            className="group relative overflow-hidden px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 text-xs font-medium"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={exportPDF}
            className="group relative overflow-hidden px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 text-xs font-medium"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <FileText className="h-3.5 w-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Zone scrollable du tableau */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Date
                </div>
              </th>
              {props.parametres.map((p: string) => {
                const stats = getParamStats(p);
                return (
                  <th 
                    key={p} 
                    className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${paramColors[p]?.bg} border-b-2 ${paramColors[p]?.border}`}
                  >
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{paramColors[p]?.icon}</span>
                        <span className={paramColors[p]?.text}>{p}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-normal text-gray-500">
                        <span>Ø {stats.avg}</span>
                        <span className="flex items-center gap-0.5">
                          {getTrendIcon(stats.trend)}
                          <span className={getTrendColor(stats.trend)}>
                            {stats.trend === "up" ? "+" : stats.trend === "down" ? "-" : ""}
                          </span>
                        </span>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={props.parametres.length + 1} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm font-medium">Chargement des données...</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, i) => {
                const isHovered = hoveredRow === i;
                return (
                  <tr 
                    key={i} 
                    className={`transition-all duration-200 ${isHovered ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 shadow-inner' : 'hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50'}`}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-5 py-3 text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-mono text-gray-500">
                          {i + 1}
                        </div>
                        <span>
                          {new Date(r.date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>

                    {props.parametres.map((p: string) => {
                      const value = r[p.toLowerCase()];
                      const isAboveThreshold = p === 'N' ? value > 30 : p === 'P' ? value > 4 : value < 4;
                      return (
                        <td key={p} className={`px-4 py-3 text-right font-mono font-semibold ${paramColors[p]?.text}`}>
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-base">{Number(value).toFixed(2)}</span>
                            <span className="text-gray-400 text-xs">mg/L</span>
                            {isAboveThreshold && (
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          {/* Mini barre de progression */}
                          <div className="mt-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${paramColors[p]?.gradient} rounded-full transition-all duration-500`}
                              style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
                            ></div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau moderne */}
      {rows.length > 0 && !loading && (
        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-emerald-100 rounded-md">
                  <Database className="h-3 w-3 text-emerald-600" />
                </div>
                <span className="text-gray-600 font-mono text-xs">
                  {props.station_code.replace(/,/g, ', ')}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500">
                  {new Date(props.date_start).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })} - {new Date(props.date_end).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Indicateurs de qualité */}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-gray-500">Seuil dépassé</span>
              </div>
              <div className="w-px h-3 bg-gray-300"></div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Download className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}