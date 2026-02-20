import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: string;
  };
  status?: 'good' | 'warning' | 'danger';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  status = 'good',
  className = ''
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'good':
        return 'border-secondary bg-secondary/5';
      case 'warning':
        return 'border-accent bg-accent/5';
      case 'danger':
        return 'border-destructive bg-destructive/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'stable':
        return '→';
      default:
        return '';
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-secondary';
      case 'down':
        return 'text-destructive';
      case 'stable':
        return 'text-muted-foreground';
      default:
        return '';
    }
  };

  return (
    <Card className={`metric-card ${getStatusStyles()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
          </div>
          
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>

          {trend && (
            <div className={`flex items-center space-x-1 mt-2 ${getTrendColor()}`}>
              <span className="text-lg">{getTrendIcon()}</span>
              <span className="text-sm font-medium">{trend.value}</span>
            </div>
          )}
        </div>

        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
          status === 'good' ? 'bg-secondary animate-pulse-glow' :
          status === 'warning' ? 'bg-accent' :
          'bg-destructive'
        }`} />
      </div>
    </Card>
  );
};

export default MetricCard;