import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ColumnSelector, { ColumnOption } from "./ColumnSelector";
import { useEffect, useMemo, useState } from "react";

type Props = {
  title: string;
  description?: string;
  rows: Record<string, unknown>[];
  maxHeight?: string;
  displayLimit?: number;
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString();
  return JSON.stringify(value);
};

const pickDefaultColumns = (columns: string[]) => {
  const preferred = [
    "name",
    "nom",
    "label",
    "type",
    "code",
    "id",
  ];
  const lower = columns.map((c) => c.toLowerCase());
  const selected: string[] = [];
  preferred.forEach((p) => {
    const idx = lower.findIndex((c) => c === p || c.endsWith(`_${p}`) || c.startsWith(`${p}_`));
    if (idx >= 0) selected.push(columns[idx]);
  });
  if (selected.length >= 4) return Array.from(new Set(selected)).slice(0, 6);
  return Array.from(new Set([...selected, ...columns.slice(0, 6)])).slice(0, 6);
};

const EntityTable = ({
  title,
  description,
  rows,
  maxHeight = "360px",
  displayLimit,
}: Props) => {
  const visibleRows =
    displayLimit && rows?.length ? rows.slice(0, displayLimit) : rows;
  const columns = useMemo(
    () => (visibleRows.length ? Object.keys(visibleRows[0]) : []),
    [visibleRows]
  );

  const options: ColumnOption[] = useMemo(
    () => columns.map((col) => ({ key: col, label: col })),
    [columns]
  );

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    if (!columns.length) return;
    setVisibleColumns((prev) => {
      const next = prev.filter((k) => columns.includes(k));
      if (next.length) return next;
      return pickDefaultColumns(columns);
    });
  }, [columns]);

  const requiredColumns = useMemo(() => {
    const lower = columns.map((c) => c.toLowerCase());
    const nameIdx = lower.findIndex((c) => c === "name" || c === "nom" || c.endsWith("_name"));
    if (nameIdx >= 0) return [columns[nameIdx]];
    const idIdx = lower.findIndex((c) => c === "id" || c.endsWith("_id"));
    if (idIdx >= 0) return [columns[idIdx]];
    return columns.length ? [columns[0]] : [];
  }, [columns]);

  const finalVisibleColumns = useMemo(() => {
    if (!columns.length) return [];
    const merged = Array.from(new Set([...requiredColumns, ...visibleColumns]));
    return merged.filter((c) => columns.includes(c));
  }, [columns, requiredColumns, visibleColumns]);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold text-slate-700">
            {title}
          </CardTitle>
          <ColumnSelector
            options={options.map((o) => ({
              ...o,
              required: requiredColumns.includes(o.key),
            }))}
            selectedKeys={finalVisibleColumns}
            onChange={setVisibleColumns}
          />
        </div>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </CardHeader>
      <CardContent>
        {visibleRows.length ? (
          <div className="overflow-auto rounded-md border border-slate-200" style={{ maxHeight }}>
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {finalVisibleColumns.map((col) => (
                    <th key={col} className="whitespace-nowrap px-3 py-2 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {finalVisibleColumns.map((col) => (
                      <td key={`${idx}-${col}`} className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {formatValue(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aucune donn?e trouv?e.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityTable;
