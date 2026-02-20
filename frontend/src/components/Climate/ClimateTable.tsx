import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getClimateTimeseries } from "@/api/climate";

export default function ClimateTable({
  tsId,
  unit,
  varLabel,
  dateStart,
  dateEnd,
  aggregation,   // ✅ AJOUTER
  loading = false,
}: any) {
  const [rows, setRows] = useState<any[]>([]);

useEffect(() => {
  if (!tsId || !aggregation) {
    setRows([]);
    return;
  }

  getClimateTimeseries({
    ts_id: tsId,
    time_step: aggregation,   // ✅ OBLIGATOIRE
    ...(dateStart && { date_start: dateStart }),
    ...(dateEnd && { date_end: dateEnd }),
  }).then((data) => {

    if (!Array.isArray(data)) {
      console.error("Invalid timeseries (table):", data);
      setRows([]);
      return;
    }

    const sorted = [...data].sort(
      (a, b) =>
        new Date(b.datetime).getTime() -
        new Date(a.datetime).getTime()
    );

    setRows(sorted);
  });
}, [tsId, dateStart, dateEnd, aggregation]);







  if (!tsId) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
        <div className="text-5xl mb-3 opacity-30">📋</div>
        <p className="text-gray-400 font-medium">Aucune donnée à afficher</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez une variable</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 text-sm">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[320px] overflow-hidden">
      {/* En-tête du tableau */}
      <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-600">
          {rows.length} enregistrements
        </span>
        <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
          {unit}
        </span>
      </div>

      {/* Zone scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gradient-to-r from-gray-100 to-gray-50 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {varLabel || "Valeur"} ({unit})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-gray-500 text-sm">
                  Aucune donnée pour cette période
                </td>
              </tr>
            ) : (
              rows.map((r, i) => {
                const value = Number(r.value);
                let valueColor = "text-gray-700";
                
                if (varLabel?.includes("Température")) {
                  if (value > 25) valueColor = "text-orange-600 font-semibold";
                  else if (value < 10) valueColor = "text-cyan-600 font-semibold";
                } else if (varLabel?.includes("Précipitation")) {
                  if (value > 20) valueColor = "text-blue-600 font-semibold";
                }

                return (
                  <tr key={i} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-indigo-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-700 font-medium">
                      {new Date(r.datetime).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-mono ${valueColor}`}>
                      {value.toFixed(3)}
                      <span className="text-gray-400 text-xs ml-1">{unit}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau */}
      {rows.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex justify-between">
          <span>📊 {varLabel || "Données"}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
            Série temporelle
          </span>
        </div>
      )}
    </div>
  );
}