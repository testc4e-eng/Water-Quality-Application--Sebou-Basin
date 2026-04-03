import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
  rows: Record<string, unknown>[];
  maxHeight?: string;
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString();
  return JSON.stringify(value);
};

const EntityTable = ({ title, description, rows, maxHeight = "360px" }: Props) => {
  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-700">
          {title}
        </CardTitle>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </CardHeader>
      <CardContent>
        {rows.length ? (
          <div className="overflow-auto rounded-md border border-slate-200" style={{ maxHeight }}>
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="whitespace-nowrap px-3 py-2 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {columns.map((col) => (
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
          <p className="text-sm text-slate-500">Aucune donnée trouvée.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityTable;
