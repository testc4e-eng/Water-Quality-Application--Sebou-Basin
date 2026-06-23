import React, { useMemo, useState } from 'react';
import { AnalyticalSeries } from '@/api/analysis';
import { FileDown, ChevronLeft, ChevronRight, Database } from 'lucide-react';

export interface WidgetTableProps {
  series: AnalyticalSeries[];
  title: string;
}

interface TableRow {
  date: string;
  value: number;
  unit: string;
  param: string;
  station: string;
  source: string;
  dataFamily?: string | null;
}

export const WidgetTable: React.FC<WidgetTableProps> = ({ series, title }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const allRows = useMemo<TableRow[]>(() => {
    const rows: TableRow[] = [];
    series.forEach(s => {
      s.values.forEach(v => {
        if (v.value !== null && v.value !== undefined) {
          rows.push({
            date: v.date,
            value: v.value,
            unit: s.unit || '',
            param: s.parameter_code,
            station: s.object_name || s.support_id || 'Inconnu',
            source: s.support_type,
            dataFamily: s.data_family,
          });
        }
      });
    });
    // Tri décroissant par date, puis par station
    return rows.sort((a, b) => {
      const dtDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dtDiff !== 0) return dtDiff;
      return a.station.localeCompare(b.station);
    });
  }, [series]);

  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const currentRows = allRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Groupe visuel par station sur la page courante
  const groupedRows = useMemo(() => {
    const groups: { station: string; rows: TableRow[] }[] = [];
    let current: { station: string; rows: TableRow[] } | null = null;
    for (const r of currentRows) {
      if (!current || current.station !== r.station) {
        current = { station: r.station, rows: [] };
        groups.push(current);
      }
      current.rows.push(r);
    }
    return groups;
  }, [currentRows]);

  const exportCSV = () => {
    const header = ['Date', 'Valeur', 'Unité', 'Paramètre', 'Entité', 'Source', 'Famille'];
    const csvContent = [
      header.join(','),
      ...allRows.map(r => `${r.date},${r.value},"${r.unit}","${r.param}","${r.station}","${r.source}","${r.dataFamily || ''}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPointMeasure = series.some(s => s.series_type === 'POINT_MEASURE');

  return (
    <div className="flex flex-col h-full w-full bg-white rounded text-[12px] text-slate-700">
      <div className="flex justify-between items-center p-2 shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-slate-500">
            {allRows.length} mesure{allRows.length > 1 ? 's' : ''}
          </div>
          {isPointMeasure && (
            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 font-medium">
              Données ponctuelles
            </span>
          )}
        </div>
        <button
          onClick={exportCSV}
          disabled={allRows.length === 0}
          className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <FileDown className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {allRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
            <Database className="h-10 w-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">Aucune donnée disponible</p>
            <p className="text-[11px] mt-1 text-center max-w-[280px]">
              Aucune mesure ponctuelle n'a été retournée pour cette sélection. Vérifiez la période ou le paramètre choisi.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Entité</th>
                <th className="px-3 py-2 font-semibold">Paramètre</th>
                <th className="px-3 py-2 font-semibold text-right">Valeur</th>
                <th className="px-3 py-2 font-semibold">Unité</th>
              </tr>
            </thead>
            <tbody>
              {groupedRows.map((group, gIdx) => (
                <React.Fragment key={`group-${gIdx}`}>
                  <tr className="bg-slate-50/80">
                    <td colSpan={5} className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide sticky top-[33px]">
                      {group.station}
                    </td>
                  </tr>
                  {group.rows.map((r, i) => (
                    <tr key={`${gIdx}-${i}`} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-3 py-1.5 whitespace-nowrap text-slate-500">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-3 py-1.5 truncate max-w-[120px] text-slate-600">{r.station}</td>
                      <td className="px-3 py-1.5 font-medium">{r.param}</td>
                      <td className="px-3 py-1.5 text-right font-mono text-indigo-700">{r.value.toLocaleString()}</td>
                      <td className="px-3 py-1.5 text-slate-500">{r.unit}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center p-2 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] text-slate-500 font-medium">Page {page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
