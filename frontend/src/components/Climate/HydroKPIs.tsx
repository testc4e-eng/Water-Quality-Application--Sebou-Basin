import { useEffect, useState } from "react";
import { fetchHydroKPIs } from "@/api/hydro";
import { Card } from "@/components/ui/card";

export default function HydroKPIs({ ts_id, aggregation, date_start, date_end, step }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchHydroKPIs({ ts_id, aggregation, date_start, date_end }).then(setData);
  }, [ts_id, aggregation, date_start, date_end]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>MIN {data.min?.toFixed(3)}</Card>
      <Card>MAX {data.max?.toFixed(3)}</Card>
      <Card>MOY {data.mean?.toFixed(3)}</Card>
      <Card>PAS {step}</Card>
    </div>
  );
}
