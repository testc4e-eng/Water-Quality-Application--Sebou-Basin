import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataScanTag } from "@/services/dataScanService";

type Props = {
  title: string;
  description?: string;
  items: DataScanTag[];
  accent?: "blue" | "emerald" | "slate";
};

const accentMap = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

const formatTag = (tag: DataScanTag) => {
  if (typeof tag === "string") return tag;
  if (tag?.name) return tag.name;
  if (tag?.label) return tag.label;
  if (tag?.code) return tag.code;
  if (tag?.id !== undefined && tag?.id !== null) return String(tag.id);
  return "Inconnu";
};

const AvailableTags = ({ title, description, items, accent = "slate" }: Props) => {
  const classes = accentMap[accent] ?? accentMap.slate;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-700">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {items?.length ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <Badge key={`${formatTag(item)}-${idx}`} variant="outline" className={classes}>
                {formatTag(item)}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aucune donnée détectée.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableTags;
