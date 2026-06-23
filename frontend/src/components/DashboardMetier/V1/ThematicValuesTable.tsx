import React, { useMemo, useState } from 'react';
import { FileDown, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import type { BusinessMapFeature } from '@/api/businessMapV1';
import type { ThematiqueParameter } from '@/config/thematiques.config';
import { getThresholdStatus, getThresholdLabel, getThresholdColorClasses, formatThresholdRange } from '@/config/thematiques.config';
import { useWorkspaceStore } from '@/store/workspaceStore';

export interface ThematicValuesTableProps {
  features: BusinessMapFeature[];
  parameterCode: string;
  parameterLabel?: string;
  parameterConfig?: ThematiqueParameter | null;
}

type SortKey = 'name' | 'value' | 'status';
type SortDir = 'asc' | 'desc';

export const ThematicValuesTable: React.FC<ThematicValuesTableProps> = ({
  features,
  parameterCode,
  parameterLabel,
  parameterConfig,
}) => {
  const addSeriesRequest = useWorkspaceStore((s) => s.addSeriesRequest);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'value', dir: 'desc' });
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const rows = useMemo(() => {
    return features
      .map((f, idx) => {
        const props = f.properties;
        const attrs = props.latest_values || props.attributes || {};
        const rawValue = attrs[parameterCode] ?? attrs[parameterCode.toLowerCase()] ?? attrs[parameterCode.toUpperCase()];
        const value = rawValue != null ? Number(rawValue) : null;
        const status = getThresholdStatus(parameterConfig?.thresholds, value);
        return {
          key: `${props.object_id}-${idx}`,
          id: props.object_id,
          name: props.object_name || props.object_code || 'Inconnu',
          code: props.object_code || props.object_id,
          supportType: props.support_type,
          domain: parameterConfig?.domain || props.attributes?.data_family || '',
          dataTemporality: String(props.attributes?.data_temporality || props.data_temporality || 'TIME_SERIES'),
          dataFamily: String(props.attributes?.data_family || props.data_family || ''),
          measurementContext: String(props.attributes?.measurement_context || props.measurement_context || ''),
          value,
          status,
        };
      })
      .filter((r) => r.value !== null && !Number.isNaN(r.value));
  }, [features, parameterCode, parameterConfig]);

  const sortedRows = useMemo(() => {
    const list = [...rows];
    list.sort((a, b) => {
      let cmp = 0;
      if (sort.key === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sort.key === 'value') {
        cmp = (a.value ?? 0) - (b.value ?? 0);
      } else if (sort.key === 'status') {
        const rank = { bad: 0, medium: 1, good: 2, null: 3 };
        cmp = (rank[a.status ?? 'null'] ?? 3) - (rank[b.status ?? 'null'] ?? 3);
      }
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [rows, sort]);

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const currentRows = sortedRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleSort = (key: SortKey) => {
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc' }));
    setPage(0);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sort.key !== column) return <ArrowUpDown className="h-3 w-3 text-slate-400" />;
    return sort.dir === 'desc' ? <ArrowDown className="h-3 w-3 text-indigo-600" /> : <ArrowUp className="h-3 w-3 text-indigo-600" />;
  };

  const exportCSV = () => {
    const header = ['Entité', 'Code', 'Support', 'Valeur', 'Paramètre', 'Seuil', 'Statut'];
    const csvContent = [
      header.join(','),
      ...sortedRows.map((r) => [
        `"${r.name}"`,
        `"${r.code}"`,
        r.supportType,
        r.value,
        parameterCode,
        `"${formatThresholdRange(parameterConfig?.thresholds)}"`,
        getThresholdLabel(r.status),
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `valeurs_${parameterCode}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (rows.length === 0) {
    return (
      <div className="text-[11px] text-slate-500 italic py-2">
        Aucune valeur numérique disponible pour {parameterLabel || parameterCode}.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] text-slate-500">
          {sortedRows.length} valeur{sortedRows.length > 1 ? 's' : ''}
          {parameterConfig?.thresholds && (
            <span className="ml-2 text-slate-400">
              (Seuil bon : {formatThresholdRange(parameterConfig.thresholds)})
            </span>
          )}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors font-medium"
        >
          <FileDown className="h-3 w-3" />
          CSV
        </button>
      </div>

      <div className="max-h-[220px] overflow-y-auto border border-slate-200 rounded">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th
                className="px-2 py-1.5 font-semibold cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">Entité <SortIcon column="name" /></div>
              </th>
              <th
                className="px-2 py-1.5 font-semibold cursor-pointer hover:bg-slate-100 text-right"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center justify-end gap-1">Valeur <SortIcon column="value" /></div>
              </th>
              <th
                className="px-2 py-1.5 font-semibold cursor-pointer hover:bg-slate-100 text-center"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-center gap-1">Seuil <SortIcon column="status" /></div>
              </th>
              <th className="px-2 py-1.5 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((r) => {
              const classes = getThresholdColorClasses(r.status);
              return (
                <tr key={r.key} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-2 py-1 truncate max-w-[120px]" title={r.name}>
                    <div className="font-medium text-slate-700 truncate">{r.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{r.code}</div>
                  </td>
                  <td className="px-2 py-1 text-right font-mono text-slate-700">
                    {r.value?.toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center">
                    <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border ${classes.bg} ${classes.text} ${classes.border}`}>
                      {getThresholdLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() => addSeriesRequest({
                        support_type: r.supportType,
                        object_id: r.id,
                        domain: (r.domain as any) || 'QUALITE',
                        parameter_code: parameterCode,
                        object_name: r.name,
                        data_temporality: r.dataTemporality,
                        data_family: r.dataFamily,
                        measurement_context: r.measurementContext
                      })}
                      className="p-1 rounded text-indigo-600 hover:bg-indigo-100"
                      title="Ajouter au workspace"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] text-slate-500 font-medium">Page {page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-50"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
