import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function HydroTableFDC({ data = [] }: any) {
  const handleExportExcel = () => {
    if (!data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row: any) => ({
        "Exceedance (%)": 
  typeof row.exceedance === "number"
    ? row.exceedance.toFixed(2)
    : "",

"Débit (m³/s)": 
  typeof row.value === "number"
    ? row.value.toFixed(3)
    : ""

      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FDC");
    XLSX.writeFile(workbook, `fdc_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[360px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
        <div className="text-5xl mb-3 opacity-30">📊</div>
        <p className="text-gray-400 font-medium">Aucune donnée FDC</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez une station et une période</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[420px] overflow-hidden">
      {/* En-tête avec bouton d'export */}
      <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">
            {data.length} points FDC
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Exceedance %
          </span>
        </div>

        <button
          onClick={handleExportExcel}
          className="text-xs px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1"
        >
          <Download className="h-3 w-3" />
          Export Excel
        </button>
      </div>

      {/* Zone scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Exceedance (%)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Débit (m³/s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row: any, i: number) => {
              // Coloration conditionnelle selon le débit
              let bgColor = "";
              if (row.exceedance <= 10) bgColor = "bg-red-50/30";
              else if (row.exceedance <= 30) bgColor = "bg-orange-50/30";
              else if (row.exceedance <= 70) bgColor = "bg-amber-50/30";
              else bgColor = "bg-green-50/30";

              return (
                <tr 
                  key={i} 
                  className={`hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-colors ${bgColor}`}
                >
                  <td className="px-4 py-2.5 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
                      {typeof row.exceedance === "number"
                      ? row.exceedance.toFixed(2)
                      : "—"}%
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-gray-700">
                    {typeof row.value === "number"
                    ? row.value.toFixed(3)
                    : "—"}
                    <span className="text-gray-400 text-xs ml-1">m³/s</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau - légende */}
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex justify-between">
        <span>📊 Courbe de débit classé (FDC)</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span> Q10
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span> Q50
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Q90
          </span>
        </div>
      </div>
    </div>
  );
}