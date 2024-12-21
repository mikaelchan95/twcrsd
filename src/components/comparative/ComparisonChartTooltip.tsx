import React from 'react';
import { formatCurrency } from '../../utils/currencyUtils';

interface Props {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export default function ComparisonChartTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border p-3">
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.name}:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}