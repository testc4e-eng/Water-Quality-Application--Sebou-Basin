import React, { useRef } from 'react';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import html2canvas from 'html2canvas';
import { Camera } from 'lucide-react';
import type { CorrelationResponse } from '@/api/analysis';

export interface WidgetCorrelationProps {
  data: CorrelationResponse;
  width: number;
  height: number;
  title: string;
}

export const WidgetCorrelation: React.FC<WidgetCorrelationProps> = ({ data, width, height, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const alignedData = data.aligned_data || [];
  const regressionLine = data.regression_line || [];
  const stats = data.correlation;
  const xLabel = data.series_x?.parameter_code || 'Série X';
  const yLabel = data.series_y?.parameter_code || 'Série Y';

  const exportPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_export.png`;
      a.click();
    }
  };

  if (data.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white border border-purple-200 rounded p-4 text-center">
        <div className="text-sm font-semibold text-purple-700 mb-1">{data.error}</div>
        <div className="text-xs text-slate-500">{data.message}</div>
      </div>
    );
  }

  if (!stats || alignedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white border border-purple-200 rounded p-4">
        <div className="text-slate-400 text-sm text-center">
          Aucune donnée alignée pour cette corrélation.
        </div>
      </div>
    );
  }

  if (stats.r_squared == null || stats.pearson_r == null) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white border border-purple-200 rounded p-4 text-center">
        <div className="text-sm font-semibold text-purple-700 mb-1">Corrélation non définie</div>
        <div className="text-xs text-slate-500">Variance nulle ou données insuffisantes.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white border border-purple-200 rounded">
      <div className="flex items-center justify-between px-2 py-1 bg-purple-50 border-b border-purple-100 shrink-0">
        <div className="flex gap-3 text-[11px] font-medium text-purple-900">
          <span>R² = {stats.r_squared.toFixed(2)}</span>
          <span>r = {stats.pearson_r.toFixed(2)}</span>
          <span>n = {stats.n_points} points</span>
        </div>
        <button
          onClick={exportPNG}
          className="text-slate-400 hover:text-purple-700 transition-colors"
          title="Exporter en PNG"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 w-full overflow-hidden flex items-center justify-center" ref={chartRef}>
        <ComposedChart
          width={Math.max(300, width - 40)}
          height={Math.max(180, height - 80)}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="x"
              name={xLabel}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: xLabel, position: 'insideBottom', offset: -2, style: { fontSize: 11, fill: '#64748b' } }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11, fill: '#64748b' } }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number, name: string) => [Number(value).toFixed(3), name]}
              contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            />
            <Scatter
              name={`${xLabel} vs ${yLabel}`}
              data={alignedData}
              fill="#8884d8"
              shape="circle"
            />
            <Line
              data={regressionLine}
              type="linear"
              dataKey="y"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              name="Régression"
            />
          </ComposedChart>
      </div>
    </div>
  );
};
