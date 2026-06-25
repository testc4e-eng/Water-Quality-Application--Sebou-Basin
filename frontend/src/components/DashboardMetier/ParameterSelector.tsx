import type { MapBusinessSupport } from "@/api/mapBusiness";

interface ParameterSelectorProps {
  support?: MapBusinessSupport | null;
  value?: string;
  onChange: (value: string) => void;
}

export function ParameterSelector({ support, value = "", onChange }: ParameterSelectorProps) {
  const parameters = support?.available_parameters ?? [];
  const disabled = parameters.length === 0;

  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-slate-700">Parametre</span>
      <select
        className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">Tous les parametres disponibles</option>
        {parameters.map((parameter) => (
          <option key={parameter} value={parameter}>
            {parameter}
          </option>
        ))}
      </select>
      {disabled && (
        <span className="block text-xs leading-5 text-slate-500">
          Aucun parametre analytique P0 disponible pour ce support, affichage spatial uniquement.
        </span>
      )}
    </label>
  );
}
