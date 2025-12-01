import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = 'blue'
}) => {
  const colorStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  };

  const currentStyle = colorStyles[color];
  const changeColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-bold text-gray-900">
                {value}
              </p>
              {change !== undefined && (
                <span className={`ml-2 flex items-baseline text-xs font-medium ${changeColor}`}>
                  {changeType === 'increase' ? '↑' : '↓'}
                  {Math.abs(change)}%
                </span>
              )}
            </div>
          </div>
          <div className={`flex-shrink-0 rounded-lg p-3 ${currentStyle.bg}`}>
            <Icon className={`h-6 w-6 ${currentStyle.text}`} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
