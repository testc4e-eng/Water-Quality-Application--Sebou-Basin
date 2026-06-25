import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DataClassCardProps = {
  title: string;
  value: string;
  subtitle: string;
  accent?: "blue" | "emerald" | "amber" | "slate";
};

const accentClassByTone = {
  blue: "from-blue-600/10 to-cyan-500/10 border-blue-200",
  emerald: "from-emerald-600/10 to-lime-500/10 border-emerald-200",
  amber: "from-amber-500/10 to-orange-500/10 border-amber-200",
  slate: "from-slate-700/10 to-slate-500/10 border-slate-200",
};

export function DataClassCard({
  title,
  value,
  subtitle,
  accent = "blue",
}: DataClassCardProps) {
  return (
    <Card className={cn("border bg-gradient-to-br", accentClassByTone[accent])}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight text-slate-950">{value}</div>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
