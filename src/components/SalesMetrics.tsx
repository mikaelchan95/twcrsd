import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';
import { cn } from '../lib/utils';

interface Props {
  title: string;
  value: number;
  previousValue?: number;
  subtitle?: string;
  perCustomer?: number;
  type: 'currency' | 'number' | 'percentage';
  className?: string;
}

export default function SalesMetrics({ 
  title, 
  value, 
  previousValue, 
  subtitle,
  perCustomer,
  type,
  className
}: Props) {
  const formatValue = (val: number) => {
    switch (type) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getPercentageChange = () => {
    if (!previousValue) return null;
    return ((value - previousValue) / previousValue) * 100;
  };

  const percentageChange = getPercentageChange();

  return (
    <div className={cn(
      "rounded-xl p-6 transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {percentageChange !== null && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            percentageChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {percentageChange >= 0 ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : 
                                   <ArrowDownIcon className="w-3 h-3 mr-1" />}
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        )}
      </div>
      
      <div className="mt-2">
        <div className="text-3xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
        {previousValue !== undefined && (
          <p className="mt-1 text-sm text-gray-500">
            vs {formatValue(previousValue)}
          </p>
        )}
      </div>
      
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      )}
      
      {perCustomer !== undefined && (
        <div className="mt-2 px-3 py-1 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {formatCurrency(perCustomer)} per customer
          </p>
        </div>
      )}
    </div>
  );
}