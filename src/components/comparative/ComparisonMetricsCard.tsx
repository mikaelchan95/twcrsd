import React from 'react';
import { formatCurrency } from '../../utils/currencyUtils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  currentValue: number;
  previousValue: number;
  formatValue?: (value: number) => string;
  subtitle?: string;
}

export default function ComparisonMetricsCard({
  title,
  currentValue,
  previousValue,
  formatValue = formatCurrency,
  subtitle
}: MetricCardProps) {
  const percentageChange = previousValue !== 0 
    ? ((currentValue - previousValue) / previousValue) * 100
    : 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex flex-col">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-gray-900">
            {formatValue(currentValue)}
          </p>
          {percentageChange !== 0 && (
            <div className={`flex items-center ${
              percentageChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentageChange > 0 
                ? <ArrowUpIcon className="h-4 w-4" />
                : <ArrowDownIcon className="h-4 w-4" />
              }
              <span className="text-sm font-medium ml-1">
                {Math.abs(percentageChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          vs {formatValue(previousValue)}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}