import { useMemo, useState } from "react";

export type ColumnOption = {
  key: string;
  label: string;
  required?: boolean;
};

type Props = {
  options: ColumnOption[];
  selectedKeys: string[];
  onChange: (next: string[]) => void;
  label?: string;
};

const ColumnSelector = ({ options, selectedKeys, onChange, label }: Props) => {
  const [open, setOpen] = useState(false);

  const requiredKeys = useMemo(
    () => options.filter((o) => o.required).map((o) => o.key),
    [options]
  );

  const toggle = (key: string) => {
    if (requiredKeys.includes(key)) return;
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter((k) => k !== key));
      return;
    }
    onChange([...selectedKeys, key]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
      >
        {label ?? "Colonnes visibles"}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Colonnes
          </div>
          <div className="max-h-64 overflow-auto space-y-1">
            {options.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(opt.key)}
                  disabled={opt.required}
                  onChange={() => toggle(opt.key)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span>
                  {opt.label}
                  {opt.required && (
                    <span className="ml-1 text-[10px] text-slate-400">(obligatoire)</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;
