import React from 'react';
import { MonthlyStats } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface PeriodData {
  label: string;
  stats: MonthlyStats;
}

interface Props {
  period1: PeriodData;
  period2: PeriodData;
}

export default function ComparisonMetrics({ period1, period2 }: Props) {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      label: 'Total Sales',
      value1: period1.stats.totalSales,
      value2: period2.stats.totalSales,
      format: formatCurrency
    },
    {
      label: 'Total Customers',
      value1: period1.stats.totalCustomers,
      value2: period2.stats.totalCustomers,
      format: (val: number) => val.toLocaleString()
    },
    {
      label: 'Average per Customer',
      value1: period1.stats.averagePerCustomer,
      value2: period2.stats.averagePerCustomer,
      format: formatCurrency
    },
    {
      label: 'Reservation Rate',
      value1: period1.stats.reservationRate,
      value2: period2.stats.reservationRate,
      format: (val: number) => `${val.toFixed(1)}%`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map(metric => {
        const change = calculateChange(metric.value2, metric.value1);
        return (
          <div key={metric.label} className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{metric.label}</h3>
            <div className="mt-2 flex flex-col">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold text-gray-900">
                  {metric.format(metric.value2)}
                </p>
                <div className={`flex items-center ${
                  change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {change !== 0 && (
                    change > 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium ml-1">
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                vs {metric.format(metric.value1)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}