import { Link2 } from "lucide-react";

import { usePrelevementLiens } from "@/hooks/usePollutionCampagnes";

interface PrelevementEntityLinkProps {
  prelevementId: string;
}

export default function PrelevementEntityLink({ prelevementId }: PrelevementEntityLinkProps) {
  const liensQuery = usePrelevementLiens(prelevementId);

  if (liensQuery.isLoading) {
    return <p className="text-xs text-slate-400">Chargement des liens...</p>;
  }

  const entites = liensQuery.data?.entites ?? [];

  if (entites.length === 0) {
    return <p className="text-xs text-slate-400">Aucune entité d&apos;inventaire liée.</p>;
  }

  return (
    <div className="space-y-2">
      {entites.map((entite) => (
        <div
          key={`${entite.entite_type}-${entite.entite_id}`}
          className="flex items-start gap-2 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs"
        >
          <Link2 className="mt-0.5 h-3 w-3 text-slate-400" />
          <div>
            <div className="font-medium text-slate-700">{entite.entite_type}</div>
            <div className="mt-0.5 font-mono text-[10px] text-slate-500">{entite.entite_id}</div>
            {entite.mapping_method && (
              <div className="mt-0.5 text-[10px] text-slate-400">Méthode : {entite.mapping_method}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
