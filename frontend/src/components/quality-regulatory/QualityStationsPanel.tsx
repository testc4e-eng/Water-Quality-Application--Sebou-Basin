import type { ClassificationResponse, QualityStation } from "@/api/qualityRegulatory";
import { QualityStatusBadge } from "@/components/quality-regulatory/QualityStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface QualityStationsPanelProps {
  stations: QualityStation[];
  selectedStationId?: string;
  onSelectStation: (stationId: string) => void;
  dateStart: string;
  dateEnd: string;
  onDateStartChange: (value: string) => void;
  onDateEndChange: (value: string) => void;
  selectedParameter: string;
  onParameterChange: (value: string) => void;
  classification?: ClassificationResponse;
  latestValue?: number | null;
  latestDate?: string;
}

const PARAMETERS = [
  ["DBO5", "DBO5"],
  ["DCO", "DCO"],
  ["NO3", "NO3 → NO3-"],
  ["pH", "pH"],
  ["O2_DISSOUS", "O2 dissous → O2_DISS"],
  ["MES", "MES"],
];

export function QualityStationsPanel(props: QualityStationsPanelProps) {
  return (
    <Card className="rounded-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Stations et mesures</CardTitle>
        <p className="text-sm text-slate-500">Sélectionnez une station pour charger son historique. Sous-bassin et support seront exposés dans une évolution API P1.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-4">
        <label className="text-xs font-medium text-slate-600">Station
          <select className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm" value={props.selectedStationId ?? ""} onChange={(event) => props.onSelectStation(event.target.value)}>
            <option value="">Sélectionner une station</option>
            {props.stations.map((station) => <option key={station.station_id} value={station.station_id}>{station.station_name}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-600">Paramètre
          <select className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm" value={props.selectedParameter} onChange={(event) => props.onParameterChange(event.target.value)}>
            {PARAMETERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-600">Date début<Input className="mt-1" type="date" value={props.dateStart} onChange={(event) => props.onDateStartChange(event.target.value)} /></label>
        <label className="text-xs font-medium text-slate-600">Date fin<Input className="mt-1" type="date" value={props.dateEnd} onChange={(event) => props.onDateEndChange(event.target.value)} /></label>
        <div className="rounded-md border bg-slate-50 p-3 lg:col-span-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-slate-800">Dernière valeur : {props.latestValue ?? "N/D"}</span>
            <span className="text-slate-500">Date : {props.latestDate ?? "N/D"}</span>
            <QualityStatusBadge status={props.classification?.status} />
            {props.classification?.class_label && <span className="font-medium" style={{ color: props.classification.color }}>{props.classification.class_label}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
