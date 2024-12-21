import React from 'react';
import { YearlyStats } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { BarChart3, Users, CreditCard, Calendar } from 'lucide-react';

interface Props {
  stats: YearlyStats;
  previousYearStats: YearlyStats | null;
  year: string;
}

export default function YearlyOverview({ stats, previousYearStats, year }: Props) {
  const calculateChange = (current: number, previous: number | undefined) => {
    if (!previous) return null;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: stats.totalSales,
      previousValue: previousYearStats?.totalSales,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: formatCurrency
    },
    {
      title: 'Average Monthly',
      value: stats.averageMonthlySales,
      previousValue: previousYearStats?.averageMonthlySales,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      format: formatCurrency
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      previousValue: previousYearStats?.totalCustomers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: (val: number) => val.toLocaleString()
    },
    {
      title: 'Average per Customer',
      value: stats.averagePerCustomer,
      previousValue: previousYearStats?.averagePerCustomer,
      icon: CreditCard,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      format: formatCurrency
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yearly Overview</h2>
          <p className="text-gray-500 mt-1">Performance analysis for {year}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(({ title, value, previousValue, icon: Icon, color, bgColor, format }) => {
          const change = calculateChange(value, previousValue);
          
          return (
            <div key={title} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                {change !== null && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    change >= 0 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                  </span>
                )}
              </div>
              
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">
                  {format(value)}
                </div>
                {previousValue !== undefined && (
                  <p className="mt-1 text-sm text-gray-500">
                    vs {format(previousValue)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}