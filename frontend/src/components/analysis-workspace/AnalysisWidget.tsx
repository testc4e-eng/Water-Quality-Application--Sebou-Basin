import React, { useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { Minus, Square, X, BarChart2, Hash, Table, Activity } from 'lucide-react';
import { AnalyticalSeries } from '@/api/analysis';
import { WidgetChart } from './WidgetChart';
import { WidgetKPI } from './WidgetKPI';
import { WidgetTable } from './WidgetTable';
import { WidgetCorrelation } from './WidgetCorrelation';

export interface AnalysisWidgetProps {
  id: string;
  title: string;
  type: 'chart' | 'kpi' | 'table' | 'correlation';
  series: AnalyticalSeries[];
  correlationData?: import('@/api/analysis').CorrelationResponse;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onUpdatePosition: (pos: {x: number, y: number}) => void;
  onUpdateSize: (size: {width: number, height: number}) => void;
}

export const AnalysisWidget: React.FC<AnalysisWidgetProps> = ({
  title, type, series, correlationData, position, size, isMinimized,
  onClose, onMinimize, onUpdatePosition, onUpdateSize
}) => {

  const content = useMemo(() => {
    switch (type) {
      case 'chart':
        return <WidgetChart series={series} width={size.width} height={size.height} title={title} />;
      case 'kpi':
        return <WidgetKPI series={series} />;
      case 'table':
        return <WidgetTable series={series} title={title} />;
      case 'correlation':
        return correlationData ? (
          <WidgetCorrelation data={correlationData} width={size.width} height={size.height} title={title} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Données de corrélation manquantes.
          </div>
        );
      default:
        return <div>Type inconnu</div>;
    }
  }, [type, series, size.width, size.height, title, correlationData]);

  const TypeIcon = type === 'chart' ? BarChart2 : type === 'kpi' ? Hash : type === 'correlation' ? Activity : Table;

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: size.width,
        height: isMinimized ? 40 : size.height,
      }}
      position={position}
      size={{ width: size.width, height: isMinimized ? 40 : size.height }}
      minWidth={320}
      minHeight={isMinimized ? 40 : 200}
      bounds="parent"
      dragHandleClassName="widget-drag-handle"
      onDragStop={(e, d) => onUpdatePosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdateSize({
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10)
        });
        onUpdatePosition(position);
      }}
      disableDragging={false}
      enableResizing={!isMinimized}
      className={`bg-white shadow-xl rounded-lg border border-slate-200 overflow-hidden flex flex-col z-20 pointer-events-auto ${isMinimized ? 'opacity-90' : ''}`}
      style={{ position: 'absolute', pointerEvents: 'auto' }}
    >
      <div className="widget-drag-handle bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between cursor-move shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <TypeIcon className="h-4 w-4 text-indigo-600 shrink-0" />
          <span className="text-[13px] font-semibold text-slate-700 truncate select-none" title={title}>{title}</span>
          <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0">
            {series.length}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors">
            <Minus className="h-3.5 w-3.5" />
          </button>
          {/* Maximize placeholder for Sprint 2.5 */}
          <button disabled className="p-1 text-slate-300 rounded cursor-not-allowed">
            <Square className="h-3.5 w-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex-1 w-full min-h-0 bg-slate-50/30 p-1">
           {content}
        </div>
      )}
    </Rnd>
  );
};
