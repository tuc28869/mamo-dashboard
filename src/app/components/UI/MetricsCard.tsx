import React from 'react';
import { formatCurrency, formatPercentage } from '../../utils/analytics';

interface MetricsCardProps {
  title: string;
  value: number | string;
  change?: number;
  format?: 'currency' | 'percentage' | 'number' | 'text';
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  change, 
  format = 'number',
  icon
}) => {
  const formattedValue = React.useMemo(() => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return value.toLocaleString();
    }
  }, [value, format]);
  
  const changeColor = React.useMemo(() => {
    if (!change) return 'text-gray-500';
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  }, [change]);
  
  const changeIcon = React.useMemo(() => {
    if (!change) return null;
    return change >= 0 
      ? <span>↑</span> 
      : <span>↓</span>;
  }, [change]);

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      <div className="flex items-end">
        <p className="text-2xl font-semibold text-gray-900">{formattedValue}</p>
        {change !== undefined && (
          <p className={`ml-2 flex items-center ${changeColor}`}>
            {changeIcon}
            {Math.abs(change).toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;