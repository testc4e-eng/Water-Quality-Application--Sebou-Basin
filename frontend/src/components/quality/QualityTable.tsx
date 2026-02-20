import React, { useEffect, useState } from "react";
import { fetchQualityTable } from "@/api/quality";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";

export default function QualityTable(props: any) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {

  // 🚫 Si aucune station sélectionnée → on ne charge rien
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

}, [
  props.station_code,
  props.date_start,
  props.date_end,
  props.aggregation
]);


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

  // Couleurs par paramètre
  const paramColors: any = {
    N: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", header: "bg-gradient-to-r from-blue-500 to-blue-600" },
    O: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", header: "bg-gradient-to-r from-red-500 to-red-600" },
    P: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", header: "bg-gradient-to-r from-green-500 to-green-600" }
  };

if (!props.station_code) {
  return (
    <div className="flex flex-col items-center justify-center h-[360px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
      <div className="text-5xl mb-3 opacity-30">📋</div>
      <p className="text-gray-400 font-medium">Aucune donnée à afficher</p>
      <p className="text-gray-300 text-xs mt-1">Sélectionnez une station</p>
    </div>
  );
}

if (!rows.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[360px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
        <div className="text-5xl mb-3 opacity-30">📊</div>
        <p className="text-gray-400 font-medium">Aucune donnée disponible</p>
        <p className="text-gray-300 text-xs mt-1">Modifiez vos filtres</p>
      </div>
    );




  }

  return (
    <div className="flex flex-col h-[420px] overflow-hidden">
      {/* En-tête avec boutons d'export */}
      <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {rows.length} enregistrements
          </span>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {props.aggregation === 'D' ? 'Journalier' : 'Mensuel'}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportExcel}
            className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1"
          >
            <span>📊</span> Excel
          </button>
          <button
            onClick={exportPDF}
            className="text-xs px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1"
          >
            <span>📄</span> PDF
          </button>
        </div>
      </div>

      {/* Zone scrollable du tableau */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-100 border-b">
                Date
              </th>
              {props.parametres.map((p: string) => (
                <th 
                  key={p} 
                  className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${paramColors[p]?.bg} ${paramColors[p]?.text} border-b`}
                >
                  <div className="flex items-center justify-end gap-1">
                    {p}
                    <span>{p === 'N' ? '🧪' : p === 'O' ? '💨' : '⚗️'}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={props.parametres.length + 1} className="p-6 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-sm">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-700 font-medium">
                    {new Date(r.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>

                  {props.parametres.map((p: string) => {
                    const value = r[p.toLowerCase()];
                    return (
                      <td key={p} className={`px-4 py-2.5 text-right font-mono font-semibold ${paramColors[p]?.text}`}>
                        {Number(value).toFixed(2)}
                        <span className="text-gray-400 text-xs ml-1">mg/L</span>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau */}
      {rows.length > 0 && !loading && (
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex justify-between">
          <span>📊 {props.station_code.replace(/,/g, ', ')}</span>
          <span>Période: {new Date(props.date_start).toLocaleDateString()} - {new Date(props.date_end).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}