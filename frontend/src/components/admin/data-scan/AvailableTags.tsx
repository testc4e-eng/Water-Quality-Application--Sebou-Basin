import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataScanTag } from "@/services/dataScanService";
import ColumnSelector, { ColumnOption } from "./ColumnSelector";
import { useEffect, useMemo, useState } from "react";

type Props = {
  title: string;
  description?: string;
  items: DataScanTag[];
  accent?: "blue" | "emerald" | "slate";
  displayLimit?: number;
};

const accentMap = {
  blue: "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]",
  emerald: "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]",
  slate: "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]",
};

const formatTag = (tag: DataScanTag) => {
  if (typeof tag === "string") return tag;
  if (tag?.name) return tag.name;
  if (tag?.label) return tag.label;
  if (tag?.code) return tag.code;
  if (tag?.id !== undefined && tag?.id !== null) return String(tag.id);
  return "Inconnu";
};

const formatTagWithFields = (tag: DataScanTag, fields: string[]) => {
  if (typeof tag === "string") return tag;
  const parts: string[] = [];
  fields.forEach((field) => {
    if (field === "name" && tag?.name) parts.push(tag.name);
    if (field === "label" && tag?.label) parts.push(tag.label);
    if (field === "code" && tag?.code) parts.push(tag.code);
    if (field === "id" && tag?.id !== undefined && tag?.id !== null)
      parts.push(String(tag.id));
  });
  if (parts.length) return parts.join(" · ");
  return formatTag(tag);
};

const AvailableTags = ({
  title,
  description,
  items,
  accent = "slate",
  displayLimit,
}: Props) => {
  const classes = accentMap[accent] ?? accentMap.slate;
  const normalizedTitle = title.toLowerCase();
  const countLabel = normalizedTitle.includes("source") ? "sources" : "variables";
  const columnOptions: ColumnOption[] = useMemo(
    () => [
      { key: "name", label: "Nom" },
      { key: "label", label: "Label" },
      { key: "code", label: "Code" },
      { key: "id", label: "ID" },
    ],
    []
  );
  const [visibleFields, setVisibleFields] = useState<string[]>(["name", "label"]);

  useEffect(() => {
    if (!visibleFields.length) {
      setVisibleFields(["name"]);
    }
  }, [visibleFields]);

  const visibleItems =
    displayLimit && items?.length ? items.slice(0, displayLimit) : items;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base font-semibold text-slate-700">
            {title}
          </CardTitle>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {items?.length ?? 0} {countLabel}
          </span>
          <ColumnSelector
            options={columnOptions}
            selectedKeys={visibleFields}
            onChange={setVisibleFields}
          />
        </div>
      </CardHeader>
      <CardContent>
        {visibleItems?.length ? (
          <div className="flex flex-wrap gap-2">
            {visibleItems.map((item, idx) => (
              <Badge
                key={`${formatTag(item)}-${idx}`}
                variant="outline"
                className={`${classes} border-[0.5px] rounded-full px-3 py-1 text-[12px] font-medium transition-colors duration-150 hover:bg-[#534AB7] hover:text-white`}
              >
                {formatTagWithFields(item, visibleFields)}
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
