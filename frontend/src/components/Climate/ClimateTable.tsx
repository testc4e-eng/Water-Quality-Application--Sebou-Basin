export default function ClimateTable({
  unit,
  varLabel,
  loading = false,
  series = [],
}: any) {
  const rows = [...(series || [])].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  const formatPeriod = (value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 text-sm">Chargement des données...</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
        <div className="text-5xl mb-3 opacity-30">📋</div>
        <p className="text-gray-400 font-medium">Aucune donnée à afficher</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez une station et un paramètre</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[320px] overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-600">
          {rows.length} enregistrements
        </span>
        <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
          {unit}
        </span>
      </div>

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
            {rows.map((r, i) => {
              const value = Number(r.value);
              const valueColor = "text-gray-700";
              return (
                <tr key={i} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-indigo-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-700 font-medium">{formatPeriod(r.datetime)}</td>
                  <td className={`px-4 py-2.5 text-right font-mono ${valueColor}`}>
                    {value.toFixed(3)}
                    <span className="text-gray-400 text-xs ml-1">{unit}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
