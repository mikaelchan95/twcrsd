import React from 'react';
import { ComparisonPeriodData } from '../../types/comparison';
import { formatCurrency } from '../../utils/currencyUtils';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Calendar, Users, DollarSign } from 'lucide-react';

interface Props {
  period1: ComparisonPeriodData;
  period2: ComparisonPeriodData;
}

export default function ComparisonMetrics({ period1, period2 }: Props) {
  const metrics = [
    {
      label: 'Total Sales',
      value1: period1.totalSales,
      value2: period2.totalSales,
      format: formatCurrency,
      icon: DollarSign,
      description: period2.isPartialPeriod ? 
        `Projected from ${period2.completedDays} of ${period2.daysInPeriod} days` :
        'Overall revenue for the period'
    },
    {
      label: 'Average Daily Sales',
      value1: period1.averageDailySales,
      value2: period2.averageDailySales,
      format: formatCurrency,
      icon: TrendingUp,
      description: period2.isPartialPeriod ?
        `Based on ${period2.completedDays} days of data` :
        'Average sales per day'
    },
    {
      label: 'Best Day Sales',
      value1: period1.bestDaySales,
      value2: period2.bestDaySales,
      format: formatCurrency,
      icon: Calendar,
      description: 'Highest single-day revenue'
    },
    {
      label: 'Total Customers',
      value1: period1.customerMetrics.totalCustomers,
      value2: period2.customerMetrics.totalCustomers,
      format: (val: number) => val.toLocaleString(),
      icon: Users,
      description: period2.isPartialPeriod ?
        `Projected from ${period2.completedDays} days` :
        'Total number of customers served'
    }
  ];

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map(({ label, value1, value2, format, icon: Icon, description }) => {
        const change = calculateChange(value2, value1);
        const isPositive = change > 0;
        const isNeutral = change === 0;

        return (
          <div key={label} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{label}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold text-gray-900">
                  {format(value2)}
                </p>
                <div className={`flex items-center px-2 py-0.5 rounded-full text-sm ${
                  isPositive ? 'bg-green-50 text-green-600' : 
                  isNeutral ? 'bg-gray-50 text-gray-600' : 
                  'bg-red-50 text-red-600'
                }`}>
                  {!isNeutral && (
                    isPositive ? 
                      <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="font-medium">
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">Previous:</span>
                <span className="font-medium text-gray-900">{format(value1)}</span>
              </div>

              {period2.isPartialPeriod && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${(period2.completedDays / period2.daysInPeriod) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}