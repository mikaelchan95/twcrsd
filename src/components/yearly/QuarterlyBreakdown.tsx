import React from 'react';
import { SalesData } from '../../types/sales';
import { getQuarterlyStats } from '../../utils/dataUtils';
import { formatCurrency } from '../../utils/currencyUtils';

interface Props {
  data: SalesData[];
}

export default function QuarterlyBreakdown({ data }: Props) {
  const quarterlyStats = getQuarterlyStats(data);
  const totalSales = Object.values(quarterlyStats).reduce((sum, q) => sum + q.totalSales, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Performance</h2>
      
      <div className="space-y-4">
        {Object.entries(quarterlyStats).map(([quarter, stats]) => (
          <div key={quarter}>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Q{quarter}</span>
              <div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(stats.totalSales)}
                </span>
                <span className="text-gray-500 ml-2">
                  ({((stats.totalSales / totalSales) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${(stats.totalSales / totalSales) * 100}%` }}
              />
            </div>
            <div className="mt-1 grid grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <span className="block">Customers</span>
                <span className="font-medium text-gray-900">{stats.totalCustomers}</span>
              </div>
              <div>
                <span className="block">Avg. per Customer</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(stats.averagePerCustomer)}
                </span>
              </div>
              <div>
                <span className="block">Reservation Rate</span>
                <span className="font-medium text-gray-900">
                  {stats.reservationRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}