import { useEffect, useState } from "react";
import { fetchHydroTimeseries } from "@/api/hydro";
import { Card } from "@/components/ui/card";

type Props = {
  ts_id: number;
  aggregation: string;
  date_start: string;
  date_end: string;
};

export default function HydroTable({
  ts_id,
  aggregation,
  date_start,
  date_end,
}: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ts_id) return;

    setLoading(true);
    fetchHydroTimeseries({
      ts_id,
      aggregation,
      date_start,
      date_end,
    })
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        setRows(sorted);
      })
      .finally(() => setLoading(false));
  }, [ts_id, aggregation, date_start, date_end]);

  if (!ts_id) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
        <div className="text-5xl mb-3 opacity-30">📋</div>
        <p className="text-gray-400 font-medium">Aucune donnée à afficher</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez un scénario</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[360px] overflow-hidden">
      {/* En-tête du tableau */}
      <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-600">
          {rows.length} enregistrements
        </span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {aggregation === 'daily' ? 'Journalier' : 
           aggregation === 'monthly' ? 'Mensuel' : 'Annuel'}
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
                Débit (m³/s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={2} className="p-6 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-sm">Chargement...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-gray-500 text-sm">
                  Aucune donnée pour cette période
                </td>
              </tr>
            )}

            {rows.map((r, i) => {
              const value = Number(r.value);
              const isHigh = value > rows.reduce((max, row) => Math.max(max, Number(row.value)), 0) * 0.8;
              
              return (
                <tr
                  key={i}
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-colors"
                >
                  <td className="px-4 py-2.5 text-gray-700 font-medium">
                    {new Date(r.datetime).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <span className={`font-semibold ${isHigh ? 'text-blue-600' : 'text-gray-700'}`}>
                      {value.toFixed(3)}
                    </span>
                    <span className="text-gray-400 text-xs ml-1">m³/s</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau - indicateur */}
      {rows.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
          <span>📊 {aggregation === 'daily' ? 'Données journalières' : 
                       aggregation === 'monthly' ? 'Moyennes mensuelles' : 'Moyennes annuelles'}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Débit instantané
          </span>
        </div>
      )}
    </div>
  );
}