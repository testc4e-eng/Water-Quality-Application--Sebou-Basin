import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EntitySource = {
  source_id: string | number | null;
  source_name: string | null;
  record_count: number;
  first_record: string | null;
  last_record: string | null;
};

type EntityVariable = {
  variable_id: string | number | null;
  variable_name: string | null;
  record_count: number;
  first_record: string | null;
  last_record: string | null;
  sources: EntitySource[];
};

type Entity = {
  station_id?: string | number;
  station_name?: string;
  station_type?: string | null;
  basin_id?: string | number;
  basin_name?: string;
  basin_group?: string | null;
  total_records: number;
  variable_count: number;
  source_count: number;
  first_record: string | null;
  last_record: string | null;
  variables: EntityVariable[];
};

type Props = {
  title: string;
  entities: Entity[];
  entityLabel: "station" | "bassin";
  typeLabel: string;
  typeKey?: "station_type" | "basin_group";
};

const defaultTypeKey = "station_type";

const EntityAccordion = ({
  title,
  entities,
  entityLabel,
  typeLabel,
  typeKey = defaultTypeKey,
}: Props) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const typeOptions = useMemo(() => {
    const unique = new Set<string>();
    entities.forEach((entity) => {
      const value = String((entity as any)[typeKey] ?? "Inconnu");
      unique.add(value);
    });
    return Array.from(unique).sort();
  }, [entities, typeKey]);

  const filtered = useMemo(() => {
    return entities.filter((entity) => {
      const name = entityLabel === "station" ? entity.station_name : entity.basin_name;
      const entityType = String((entity as any)[typeKey] ?? "Inconnu");

      if (typeFilter !== "all" && entityType !== typeFilter) return false;
      if (statusFilter === "with" && entity.total_records <= 0) return false;
      if (statusFilter === "without" && entity.total_records > 0) return false;
      if (search && !String(name ?? "").toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [entities, entityLabel, search, statusFilter, typeFilter, typeKey]);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-700">
          {title}
        </CardTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            placeholder={`Rechercher une ${entityLabel}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder={typeLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {typeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="with">Avec données</SelectItem>
              <SelectItem value="without">Sans données</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length ? (
          <Accordion type="multiple" className="space-y-2">
            {filtered.map((entity) => {
              const name = entityLabel === "station" ? entity.station_name : entity.basin_name;
              const typeValue = String((entity as any)[typeKey] ?? "Inconnu");
              const entityId = entityLabel === "station" ? entity.station_id : entity.basin_id;
              return (
                <AccordionItem
                  key={`${entityLabel}-${entityId}`}
                  value={`${entityLabel}-${entityId}`}
                  className="rounded-lg border border-slate-200 px-4"
                >
                  <AccordionTrigger className="py-4 text-left">
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {name ?? "Sans nom"}
                        </p>
                        <p className="text-xs text-slate-500">{typeLabel}: {typeValue}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">
                          {entity.total_records.toLocaleString()} enregistrements
                        </Badge>
                        <Badge variant="outline">
                          {entity.variable_count} variables
                        </Badge>
                        <Badge variant="outline">
                          {entity.source_count} sources
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="text-sm text-slate-600">
                      Période: {entity.first_record ?? "-"} → {entity.last_record ?? "-"}
                    </div>
                    <div className="space-y-4">
                      {entity.variables.length ? (
                        entity.variables.map((variable) => (
                          <div key={`${entityId}-${variable.variable_id}`} className="rounded-lg border border-slate-100 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-800">
                                {variable.variable_name ?? variable.variable_id ?? "Variable"}
                              </p>
                              <Badge variant="outline">
                                {variable.record_count.toLocaleString()} enregistrements
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500">
                              Période: {variable.first_record ?? "-"} → {variable.last_record ?? "-"}
                            </p>
                            <div className="mt-3 space-y-2">
                              {variable.sources.length ? (
                                variable.sources.map((source) => (
                                  <div
                                    key={`${entityId}-${variable.variable_id}-${source.source_id}`}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-2"
                                  >
                                    <div className="text-sm text-slate-700">
                                      {source.source_name ?? source.source_id ?? "Source"}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                      <span>{source.record_count.toLocaleString()} enregistrements</span>
                                      <span>{source.first_record ?? "-"} → {source.last_record ?? "-"}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-500">Aucune source disponible.</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Aucune donnée disponible.</p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" disabled>
                        Supprimer des données
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-sm text-slate-500">Aucune entité disponible.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityAccordion;
