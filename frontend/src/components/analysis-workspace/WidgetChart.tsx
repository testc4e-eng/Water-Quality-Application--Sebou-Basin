import React, { useMemo, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AnalyticalSeries } from '@/api/analysis';
import html2canvas from 'html2canvas';
import { Camera } from 'lucide-react';

export interface WidgetChartProps {
  series: AnalyticalSeries[];
  width: number;
  height: number;
  title: string;
}

export const WidgetChart: React.FC<WidgetChartProps> = ({ series, width, height, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Regrouper les séries par unité pour gérer les axes Y multiples
  const yAxes = useMemo(() => {
    const axesMap = new Map<string, string>(); // unit -> axisId
    series.forEach(s => {
      const unit = s.unit || 'n/a';
      if (!axesMap.has(unit)) {
        axesMap.set(unit, `axis-${axesMap.size}`);
      }
    });
    return Array.from(axesMap.entries()).map(([unit, id], index) => ({
      id,
      unit,
      orientation: index % 2 === 0 ? 'left' as const : 'right' as const,
    })).slice(0, 3); // Max 3 axes
  }, [series]);

  // Préparer les données pour Recharts (fusion par date)
  const chartData = useMemo(() => {
    const dataMap = new Map<string, any>();
    series.forEach(s => {
      s.values.forEach(v => {
        if (!dataMap.has(v.date)) {
          dataMap.set(v.date, { date: v.date });
        }
        dataMap.get(v.date)[s.id] = v.value;
      });
    });
    return Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [series]);

  // Couleurs automatiques
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

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

  if (yAxes.length > 3) {
    console.warn("WidgetChart: Too many Y axes. Limit is 3.");
  }

  if (!series || series.length === 0 || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white rounded p-4">
        <div className="text-slate-400 text-sm text-center">
          Aucune donnée disponible pour cette période ou entité.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white rounded">
      <div className="flex justify-end p-1 shrink-0">
        <button 
          onClick={exportPNG} 
          className="text-slate-400 hover:text-indigo-600 transition-colors"
          title="Exporter en PNG"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 w-full overflow-hidden flex items-center justify-center" ref={chartRef}>
          <LineChart width={Math.max(300, width - 40)} height={Math.max(150, height - 80)} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => new Date(val).toLocaleDateString()}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            {yAxes.map((axis, i) => (
              <YAxis 
                key={axis.id} 
                yAxisId={axis.id} 
                orientation={axis.orientation} 
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: axis.unit, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11, fill: '#64748b' } }}
              />
            ))}
            <Tooltip 
              labelFormatter={(val) => new Date(val).toLocaleDateString()}
              contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {series.map((s, idx) => {
              const unit = s.unit || 'n/a';
              // Trouver l'axe correspondant (limité à 3, fallback sur le premier)
              let yAxisId = yAxes.find(a => a.unit === unit)?.id;
              if (!yAxisId && yAxes.length > 0) yAxisId = yAxes[0].id;
              
              return (
                <Line
                  key={s.id}
                  yAxisId={yAxisId}
                  type="monotone"
                  dataKey={s.id}
                  name={`${s.object_name} - ${s.parameter_code}`}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              );
            })}
          </LineChart>
      </div>
    </div>
  );
};
