import { Card } from "@/components/ui/card";

export default function HydroTableMulti({ series, className = "" }: any) {
  const hasData = series && series.length > 0 && series[0]?.data?.length > 0;

  if (!hasData) {
    return (
      <div className={`flex flex-col items-center justify-center h-[380px] bg-gradient-to-b from-gray-50 to-white ${className}`}>
        <div className="text-6xl mb-3 opacity-30">📊</div>
        <p className="text-gray-400 font-medium">Aucune donnée à afficher</p>
        <p className="text-gray-300 text-sm mt-1">Sélectionnez une station et au moins un scénario</p>
      </div>
    );
  }

  const merged = series[0]?.data.map((_: any, i: number) => {
    const row: any = { datetime: series[0].data[i].datetime };
    series.forEach((s: any) => {
      row[s.scenario] = s.data[i]?.value;
    });
    return row;
  });

  const colors = ['blue', 'red', 'green', 'purple'];
  const bgColors = ['bg-blue-50', 'bg-red-50', 'bg-green-50', 'bg-purple-50'];
  const textColors = ['text-blue-700', 'text-red-700', 'text-green-700', 'text-purple-700'];

  return (
    <div className={`flex flex-col h-[380px] overflow-hidden ${className}`}>
      {/* En-tête avec légendes */}
      <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap gap-3">
        {series.map((s: any, idx: number) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${bgColors[idx % bgColors.length]}`}></div>
            <span className="text-xs font-medium text-gray-600">{s.scenario}</span>
          </div>
        ))}
      </div>

      {/* Zone scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gradient-to-r from-gray-100 to-gray-50 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              {series.map((s: any, idx: number) => (
                <th 
                  key={idx} 
                  className={`px-4 py-3 text-right text-xs font-semibold ${textColors[idx % textColors.length]} uppercase tracking-wider`}
                >
                  {s.scenario}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {merged.map((row: any, i: number) => (
              <tr 
                key={i} 
                className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-colors"
              >
                <td className="px-4 py-2.5 text-gray-700 font-medium">
                  {new Date(row.datetime).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>

                {series.map((s: any, idx: number) => {
                  const value = row[s.scenario];
                  const colorIndex = idx % colors.length;
                  
                  return (
                    <td 
                      key={idx} 
                      className={`px-4 py-2.5 text-right font-mono ${
                        value != null 
                          ? `font-semibold ${textColors[colorIndex]}` 
                          : 'text-gray-400'
                      }`}
                    >
                      {value == null
                        ? "—"
                        : Number(value).toFixed(3)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau */}
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex justify-between">
        <span>{merged.length} enregistrements</span>
        <span>Débit en m³/s</span>
      </div>
    </div>
  );
}