import { ArrowRightCircle } from "lucide-react";

interface Recommendation {
  action: string;
  why: string;
  priority: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <div className="space-y-3">
      {recommendations.map((recommendation) => (
        <div key={`${recommendation.action}-${recommendation.priority}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ArrowRightCircle className="mt-0.5 h-4 w-4 text-blue-700" />
              <div>
                <div className="font-semibold text-slate-950">{recommendation.action}</div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.why}</p>
              </div>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {recommendation.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
