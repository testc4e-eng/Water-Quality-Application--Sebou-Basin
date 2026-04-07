/* frontend/src/types/external-components.d.ts */
declare module "@/components/Charts/TimeSeriesLinked.jsx" {
  import React from "react";
  export interface TimeSeriesLinkedProps {
    stationId: number | null;
    sousBassinId?: string | null;
    barrageId?: number | null;
    range: { dateFrom: string; dateTo: string };
  }
  const C: React.FC<TimeSeriesLinkedProps>;
  export default C;
}

declare module "@/components/Tables/LatestMeasuresTable.jsx" {
  import React from "react";
  export interface LatestMeasuresTableProps {
    stationId: number | null;
    sousBassinId?: string | null;
    barrageId?: number | null;
    range: { dateFrom: string; dateTo: string };
  }
  const C: React.FC<LatestMeasuresTableProps>;
  export default C;
}

declare module "@/components/Charts/ExtraCharts.jsx" {
  import React from "react";
  export interface ExtraChartsProps {
    stationId: number | null;
    sousBassinId?: string | null;
    barrageId?: number | null;
    range: { dateFrom: string; dateTo: string };
  }
  const C: React.FC<ExtraChartsProps>;
  export default C;
}
